import { useState, useEffect, useCallback, useRef } from 'react'
import {
  getGoals, saveGoals, getTodayLog, upsertTodayLog,
  getAllLogs, DEFAULT_METRICS, todayDate, DEFAULT_GOALS, DEFAULT_WORKOUT,
} from '@/data/db'
import type { DailyLog, GoalsConfig, WorkoutEntry } from '@/types'
import { calcStreak } from '@/utils/progress'

type SimpleMetricKey = 'water' | 'steps' | 'reading'
type SetMetricKey = 'weight'
type HabitKey = 'noSmoking' | 'noDrinking' | 'noTikTok'
type WorkoutKey = 'workoutIndoor' | 'workoutOutdoor'

export function useDaily() {
  const [log, setLog] = useState<DailyLog | null>(null)
  const [goals, setGoals] = useState<GoalsConfig>(DEFAULT_GOALS)
  const [streak, setStreak] = useState(0)
  const [loading, setLoading] = useState(true)

  // ref always holds the latest log so update callbacks never capture stale state
  const logRef = useRef<DailyLog | null>(null)
  function commitLog(updated: DailyLog) {
    logRef.current = updated
    setLog(updated)
    upsertTodayLog(updated)
  }

  const load = useCallback(async () => {
    const [g, existing, allLogs] = await Promise.all([getGoals(), getTodayLog(), getAllLogs()])
    setGoals(g)
    setStreak(calcStreak(allLogs))

    if (existing) {
      const metrics = {
        ...DEFAULT_METRICS(),
        ...existing.metrics,
        workoutIndoor:  { ...DEFAULT_WORKOUT(), ...(existing.metrics as any).workoutIndoor },
        workoutOutdoor: { ...DEFAULT_WORKOUT(), ...(existing.metrics as any).workoutOutdoor },
      }
      const hydrated = { ...existing, metrics }
      logRef.current = hydrated
      setLog(hydrated)
    } else {
      const newLog: DailyLog = {
        date: todayDate(),
        metrics: DEFAULT_METRICS(),
        goalsSnapshot: g,
        streak: calcStreak(allLogs),
      }
      await upsertTodayLog(newLog)
      const saved = await getTodayLog()
      const final = saved ?? newLog
      logRef.current = final
      setLog(final)
    }
    setLoading(false)
  }, [])

  useEffect(() => { load() }, [load])

  useEffect(() => {
    const now = new Date()
    const msUntilMidnight =
      new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1).getTime() - now.getTime()
    const timer = setTimeout(() => load(), msUntilMidnight + 1000)
    return () => clearTimeout(timer)
  }, [load])

  // All updates read from logRef (always current) — no stale closures possible
  const addToMetric = useCallback((key: SimpleMetricKey, delta: number) => {
    const prev = logRef.current
    if (!prev) return
    commitLog({ ...prev, metrics: { ...prev.metrics, [key]: Math.max(0, (prev.metrics[key] as number) + delta) } })
  }, [])

  const setMetric = useCallback((key: SetMetricKey, value: number) => {
    const prev = logRef.current
    if (!prev) return
    commitLog({ ...prev, metrics: { ...prev.metrics, [key]: value } })
  }, [])

  const toggleHabit = useCallback((key: HabitKey, value: boolean) => {
    const prev = logRef.current
    if (!prev) return
    commitLog({ ...prev, metrics: { ...prev.metrics, [key]: value } })
  }, [])

  const updateWorkout = useCallback((key: WorkoutKey, patch: Partial<WorkoutEntry>) => {
    const prev = logRef.current
    if (!prev) return
    commitLog({ ...prev, metrics: { ...prev.metrics, [key]: { ...prev.metrics[key], ...patch } } })
  }, [])

  const updateGoals = useCallback(async (updated: GoalsConfig) => {
    setGoals(updated)
    await saveGoals(updated)
  }, [])

  return { log, goals, streak, loading, addToMetric, setMetric, toggleHabit, updateWorkout, updateGoals }
}
