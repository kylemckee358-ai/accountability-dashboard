interface Props {
  label: string
  value: boolean   // false = not done (red), true = done (green)
  onChange: (val: boolean) => void
  readOnly?: boolean
}

export function HabitToggle({ label, value, onChange, readOnly = false }: Props) {
  return (
    <div className={`metric-card habit-card ${value ? 'habit-done' : 'habit-incomplete'}`}>
      <div className="metric-header">
        <span className="metric-label">{label}</span>
        <span className={`habit-status ${value ? 'habit-status--done' : 'habit-status--incomplete'}`}>
          {value ? 'Done' : 'Not done'}
        </span>
      </div>
      {!readOnly && (
        <button
          className={`btn-habit ${value ? 'btn-habit--done' : 'btn-habit--incomplete'}`}
          onClick={() => onChange(!value)}
        >
          {value ? 'Mark as not done' : 'Mark as done'}
        </button>
      )}
    </div>
  )
}
