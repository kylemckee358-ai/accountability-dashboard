export interface GoalsConfig {
  water: number
  steps: number
  workoutIndoorRequired: boolean
  workoutOutdoorRequired: boolean
  reading: number
  calories: number
}

export interface WorkoutEntry {
  done: boolean
  name: string
  duration: number      // minutes
  caloriesBurnt: number
}

export interface MetricValues {
  water: number
  steps: number
  workoutIndoor: WorkoutEntry
  workoutOutdoor: WorkoutEntry
  reading: number
  weight: number
  noSmoking: boolean
  noDrinking: boolean
  noTikTok: boolean
}

export interface DailyLog {
  id?: number
  date: string
  metrics: MetricValues
  goalsSnapshot: GoalsConfig
  streak: number
}

export type WarningLevel = 'none' | 'low' | 'medium' | 'high'

export interface MetricProgress {
  value: number
  goal: number
  pct: number
  warning: WarningLevel
}
