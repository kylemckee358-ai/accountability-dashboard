import { useState, useEffect } from 'react'
import { useDaily } from '@/hooks/useDaily'
import { TodayPanel } from '@/components/TodayPanel'
import { HistoryView } from '@/components/HistoryView'
import { GoalsModal } from '@/components/GoalsModal'
import { todayDate, getLogByDate } from '@/data/db'
import type { DailyLog, WorkoutEntry } from '@/types'

function offsetDate(base: string, days: number): string {
  const d = new Date(base + 'T00:00:00')
  d.setDate(d.getDate() + days)
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

type View = 'dashboard' | 'history'

export default function App() {
  const { log, goals, streak, loading, addToMetric, setMetric, toggleHabit, updateWorkout, updateGoals } = useDaily()
  const [viewDate, setViewDate] = useState(todayDate)
  const [viewedLog, setViewedLog] = useState<DailyLog | null>(null)
  const [goalsOpen, setGoalsOpen] = useState(false)
  const [view, setView] = useState<View>('dashboard')
  const [historyKey, setHistoryKey] = useState(0)

  const isToday = viewDate === todayDate()

  useEffect(() => {
    if (isToday) { setViewedLog(null); return }
    getLogByDate(viewDate).then(r => setViewedLog(r ?? null))
  }, [viewDate, isToday])

  function prevDay() { setViewDate(d => offsetDate(d, -1)) }
  function nextDay() { if (!isToday) setViewDate(d => offsetDate(d, +1)) }

  if (loading) return <div className="loading-screen">Loading...</div>
  if (!log) return null

  const activeLog = isToday ? log : viewedLog

  return (
    <div className="app">
      <header className="app-header">
        <h1>Accountability</h1>
        <div className="header-right">
          <div className="view-tabs">
            <button
              className={`view-tab ${view === 'dashboard' ? 'active' : ''}`}
              onClick={() => setView('dashboard')}
            >Dashboard</button>
            <button
              className={`view-tab ${view === 'history' ? 'active' : ''}`}
              onClick={() => { setView('history'); setHistoryKey(k => k + 1) }}
            >History</button>
          </div>
          <button className="btn-edit-goals" onClick={() => setGoalsOpen(true)}>Edit Goals</button>
        </div>
      </header>

      <main className="dashboard">
        {view === 'dashboard' ? (
          <TodayPanel
            log={activeLog ?? null}
            goals={goals}
            streak={streak}
            isToday={isToday}
            viewDate={viewDate}
            onPrevDay={prevDay}
            onNextDay={nextDay}
            onAdd={(key: 'water' | 'steps' | 'reading', delta: number) => addToMetric(key, delta)}
            onSetWeight={(val: number) => setMetric('weight', val)}
            onHabit={(key, val) => toggleHabit(key, val)}
            onWorkout={(key: 'workoutIndoor' | 'workoutOutdoor', patch: Partial<WorkoutEntry>) => updateWorkout(key, patch)}
          />
        ) : (
          <HistoryView key={historyKey} />
        )}
      </main>

      {goalsOpen && (
        <GoalsModal goals={goals} onSave={updateGoals} onClose={() => setGoalsOpen(false)} />
      )}
    </div>
  )
}
