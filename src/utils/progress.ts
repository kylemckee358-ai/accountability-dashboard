import type { WarningLevel, MetricProgress, DailyLog } from '@/types'

function dayFraction(): number {
  const now = new Date()
  const minutesSinceMidnight = now.getHours() * 60 + now.getMinutes()
  const wakingStart = 6 * 60
  const wakingEnd = 23 * 60
  const elapsed = Math.max(0, minutesSinceMidnight - wakingStart)
  return Math.min(1, elapsed / (wakingEnd - wakingStart))
}

function warningLevel(actual: number, goal: number, fraction: number): WarningLevel {
  if (goal === 0) return 'none'
  const expected = goal * fraction
  if (actual >= expected) return 'none'
  const deficit = (expected - actual) / goal
  if (deficit < 0.1) return 'low'
  if (deficit < 0.25) return 'medium'
  return 'high'
}

export function calcProgress(value: number, goal: number): MetricProgress {
  const fraction = dayFraction()
  const pct = goal > 0 ? Math.min(1, value / goal) : 1
  return { value, goal, pct, warning: warningLevel(value, goal, fraction) }
}

export function calcStreak(logs: DailyLog[]): number {
  let streak = 0
  const today = new Date()
  const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`

  for (const log of logs) {
    if (log.date === todayStr) continue
    const { metrics, goalsSnapshot } = log
    const allMet =
      metrics.water >= goalsSnapshot.water &&
      metrics.steps >= goalsSnapshot.steps &&
      metrics.reading >= goalsSnapshot.reading &&
      (!goalsSnapshot.workoutIndoorRequired || metrics.workoutIndoor?.done) &&
      (!goalsSnapshot.workoutOutdoorRequired || metrics.workoutOutdoor?.done) &&
      metrics.noSmoking !== false &&
      metrics.noDrinking !== false &&
      metrics.noTikTok !== false
    if (!allMet) break
    streak++
  }
  return streak
}
