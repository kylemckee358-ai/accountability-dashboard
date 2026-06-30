import { supabase } from './supabase'
import type { DailyLog, GoalsConfig } from '@/types'

export const DEFAULT_GOALS: GoalsConfig = {
  water: 4000,
  steps: 10000,
  workoutIndoorRequired: true,
  workoutOutdoorRequired: false,
  reading: 30,
  calories: 2500,
}

export const DEFAULT_WORKOUT = () => ({ done: false, name: '', duration: 0, caloriesBurnt: 0 })

export const DEFAULT_METRICS = (): import('@/types').MetricValues => ({
  water: 0,
  steps: 0,
  workoutIndoor: DEFAULT_WORKOUT(),
  workoutOutdoor: DEFAULT_WORKOUT(),
  reading: 0,
  weight: 0,
  noSmoking: false,
  noDrinking: false,
  noTikTok: false,
  progressPhoto: false,
})

export function todayDate(): string {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

function rowToLog(row: Record<string, unknown>): DailyLog {
  return {
    id: row.id as number,
    date: row.date as string,
    metrics: row.metrics as DailyLog['metrics'],
    goalsSnapshot: row.goals_snapshot as GoalsConfig,
    streak: (row.streak as number) ?? 0,
  }
}

export async function getGoals(): Promise<GoalsConfig> {
  const { data } = await supabase.from('goals_config').select('config').eq('id', 1).maybeSingle()
  return (data?.config as GoalsConfig) ?? DEFAULT_GOALS
}

export async function saveGoals(goals: GoalsConfig): Promise<void> {
  await supabase.from('goals_config').upsert({ id: 1, config: goals })
}

export async function getTodayLog(): Promise<DailyLog | undefined> {
  const { data } = await supabase
    .from('daily_logs').select('*').eq('date', todayDate()).maybeSingle()
  return data ? rowToLog(data) : undefined
}

export async function getLogByDate(date: string): Promise<DailyLog | undefined> {
  const { data } = await supabase
    .from('daily_logs').select('*').eq('date', date).maybeSingle()
  return data ? rowToLog(data) : undefined
}

export async function upsertTodayLog(log: DailyLog): Promise<void> {
  await supabase.from('daily_logs').upsert(
    {
      date: log.date,
      metrics: log.metrics,
      goals_snapshot: log.goalsSnapshot,
      streak: log.streak,
    },
    { onConflict: 'date' }
  )
}

export async function getAllLogs(): Promise<DailyLog[]> {
  const { data } = await supabase
    .from('daily_logs').select('*').order('date', { ascending: false })
  return (data ?? []).map(rowToLog)
}
