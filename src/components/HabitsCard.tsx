interface Habit {
  key: 'noSmoking' | 'noDrinking' | 'noTikTok'
  label: string
  value: boolean
}

interface Props {
  habits: Habit[]
  onChange: (key: Habit['key'], val: boolean) => void
  readOnly?: boolean
}

export function HabitsCard({ habits, onChange, readOnly = false }: Props) {
  return (
    <div className="habits-card">
      <span className="habits-label">Habits</span>
      <div className="habits-pills">
        {habits.map(h => (
          <button
            key={h.key}
            className={`habit-pill ${h.value ? 'is-done' : ''}`}
            onClick={() => !readOnly && onChange(h.key, !h.value)}
            style={readOnly ? { cursor: 'default' } : undefined}
          >
            {h.label}
          </button>
        ))}
      </div>
    </div>
  )
}
