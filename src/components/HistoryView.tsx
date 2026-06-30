import { useState, useEffect } from 'react'
import { getAllLogs, getGoals, DEFAULT_GOALS } from '@/data/db'
import type { DailyLog, GoalsConfig } from '@/types'

function pad(n: number) { return String(n).padStart(2, '0') }

function localDate(year: number, month: number, day: number): string {
  return `${year}-${pad(month + 1)}-${pad(day)}`
}

function todayStr(): string {
  const d = new Date()
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`
}

const ROWS: { label: string; check: (l: DailyLog, g: GoalsConfig) => boolean }[] = [
  { label: 'Weight',          check: l      => (l.metrics.weight  ?? 0) > 0 },
  { label: 'Water',           check: (l, g) => l.metrics.water   >= (l.goalsSnapshot?.water   ?? g.water) },
  { label: 'Steps',           check: (l, g) => l.metrics.steps   >= (l.goalsSnapshot?.steps   ?? g.steps) },
  { label: 'Reading',         check: (l, g) => l.metrics.reading >= (l.goalsSnapshot?.reading ?? g.reading) },
  { label: 'Workout Indoor',  check: l      => l.metrics.workoutIndoor?.done  === true },
  { label: 'Workout Outdoor', check: l      => l.metrics.workoutOutdoor?.done === true },
  { label: 'No Smoking',      check: l      => l.metrics.noSmoking  === true },
  { label: 'No Drinking',     check: l      => l.metrics.noDrinking === true },
  { label: 'No TikTok',       check: l      => l.metrics.noTikTok   === true },
]

export function HistoryView() {
  const today = todayStr()
  const now   = new Date()
  const [year,   setYear]   = useState(now.getFullYear())
  const [month,  setMonth]  = useState(now.getMonth())
  const [logMap, setLogMap] = useState<Map<string, DailyLog>>(new Map())
  const [goals,  setGoals]  = useState<GoalsConfig>(DEFAULT_GOALS)

  // Fetch ALL logs then filter in JS — avoids any IndexedDB range query issues
  useEffect(() => {
    const start = localDate(year, month, 1)
    const end   = localDate(year, month, new Date(year, month + 1, 0).getDate())

    Promise.all([getAllLogs(), getGoals()]).then(([all, g]) => {
      const filtered = all.filter(l => l.date >= start && l.date <= end)
      setLogMap(new Map(filtered.map(l => [l.date, l])))
      setGoals(g)
    })
  }, [year, month])

  function prevMonth() {
    if (month === 0) { setYear(y => y - 1); setMonth(11) }
    else setMonth(m => m - 1)
  }
  function nextMonth() {
    if (year === now.getFullYear() && month === now.getMonth()) return
    if (month === 11) { setYear(y => y + 1); setMonth(0) }
    else setMonth(m => m + 1)
  }

  const daysInMonth    = new Date(year, month + 1, 0).getDate()
  const days           = Array.from({ length: daysInMonth }, (_, i) => i + 1)
  const monthLabel     = new Date(year, month).toLocaleDateString('en-GB', { month: 'long', year: 'numeric' })
  const isCurrentMonth = year === now.getFullYear() && month === now.getMonth()

  return (
    <div className="history-panel">
      <div className="history-header">
        <button className="day-nav-btn" onClick={prevMonth}>&#8249;</button>
        <span className="history-month-label">{monthLabel}</span>
        <button className="day-nav-btn" onClick={nextMonth} disabled={isCurrentMonth}>&#8250;</button>
      </div>

      <div className="history-scroll">
        <table className="history-grid">
          <thead>
            <tr>
              <th className="hg-label-head" />
              {days.map(d => {
                const ds      = localDate(year, month, d)
                const isToday = ds === today
                return (
                  <th key={d} className={`hg-day-head${isToday ? ' col-today' : ''}`}>{d}</th>
                )
              })}
            </tr>
          </thead>
          <tbody>
            {ROWS.map(row => (
              <tr key={row.label}>
                <td className="hg-row-label">{row.label}</td>
                {days.map(d => {
                  const ds       = localDate(year, month, d)
                  const log      = logMap.get(ds)
                  const isFuture = ds > today
                  const isToday  = ds === today
                  const done     = !isFuture && !!log && row.check(log, goals)
                  return (
                    <td
                      key={d}
                      className={`hg-cell${done ? ' is-done' : ''}${isFuture ? ' is-future' : ''}${isToday ? ' col-today' : ''}`}
                    >
                      {done && <span className="hg-tick">✓</span>}
                    </td>
                  )
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
