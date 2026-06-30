import type { DailyLog, GoalsConfig, WorkoutEntry } from '@/types'
import { calcProgress } from '@/utils/progress'
import { MetricCard } from './MetricCard'
import { WorkoutCard } from './WorkoutCard'
import { WeightCard } from './WeightCard'
import { HabitsCard } from './HabitsCard'
import { DEFAULT_WORKOUT } from '@/data/db'

const INDOOR_OPTIONS  = ['Gym', 'Calisthenics', 'Squash', 'Badminton', 'Running', 'Walking']
const OUTDOOR_OPTIONS = ['Walking', 'Running', 'Skipping']

interface Props {
  log: DailyLog | null
  goals: GoalsConfig
  streak: number
  isToday: boolean
  viewDate: string
  onPrevDay: () => void
  onNextDay: () => void
  onAdd: (key: 'water' | 'steps' | 'reading', delta: number) => void
  onSetWeight: (val: number) => void
  onHabit: (key: 'noSmoking' | 'noDrinking' | 'noTikTok', val: boolean) => void
  onWorkout: (key: 'workoutIndoor' | 'workoutOutdoor', patch: Partial<WorkoutEntry>) => void
}

function formatViewDate(date: string, isToday: boolean): string {
  if (isToday) return 'Today'
  const d = new Date(date + 'T00:00:00')
  return d.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' })
}

export function TodayPanel({ log, goals, streak, isToday, viewDate, onPrevDay, onNextDay, onAdd, onSetWeight, onHabit, onWorkout }: Props) {
  const m = log?.metrics
  const water   = calcProgress(m?.water   ?? 0, goals.water)
  const steps   = calcProgress(m?.steps   ?? 0, goals.steps)
  const reading = calcProgress(m?.reading ?? 0, goals.reading)

  const indoorEntry  = m?.workoutIndoor  ?? DEFAULT_WORKOUT()
  const outdoorEntry = m?.workoutOutdoor ?? DEFAULT_WORKOUT()

  return (
    <div className="panel today-panel">
      <div className="panel-nav">
        <div className="day-nav">
          <button className="day-nav-btn" onClick={onPrevDay} aria-label="Previous day">&#8249;</button>
          <span className="day-nav-label">{formatViewDate(viewDate, isToday)}</span>
          <button className="day-nav-btn" onClick={onNextDay} disabled={isToday} aria-label="Next day">&#8250;</button>
        </div>
        {isToday && <span className="streak-badge">🔥 {streak} day streak</span>}
      </div>

      {!log && !isToday ? (
        <p className="no-log">No data logged for this day.</p>
      ) : (
        <>
          <WeightCard value={m?.weight ?? 0} onSet={onSetWeight} readOnly={!isToday} />
          <MetricCard label="Water"   unit="ml"    progress={water}   onAdd={d => onAdd('water', d)}   readOnly={!isToday} />
          <MetricCard label="Steps"   unit="steps" progress={steps}   onAdd={d => onAdd('steps', d)}   readOnly={!isToday} />
          <MetricCard label="Reading" unit="pages" progress={reading} onAdd={d => onAdd('reading', d)} readOnly={!isToday} />
          <WorkoutCard label="Workout — Indoor"  entry={indoorEntry}  options={INDOOR_OPTIONS}  onChange={p => onWorkout('workoutIndoor', p)}  readOnly={!isToday} />
          <WorkoutCard label="Workout — Outdoor" entry={outdoorEntry} options={OUTDOOR_OPTIONS} onChange={p => onWorkout('workoutOutdoor', p)} readOnly={!isToday} />
          <HabitsCard
            habits={[
              { key: 'noSmoking',  label: 'No Smoking',  value: m?.noSmoking  ?? false },
              { key: 'noDrinking', label: 'No Drinking', value: m?.noDrinking ?? false },
              { key: 'noTikTok',   label: 'No TikTok',   value: m?.noTikTok   ?? false },
            ]}
            onChange={onHabit}
            readOnly={!isToday}
          />
        </>
      )}
    </div>
  )
}
