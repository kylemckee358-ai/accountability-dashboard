import type { WorkoutEntry } from '@/types'

interface Props {
  label: string
  entry: WorkoutEntry
  options: string[]
  onChange: (patch: Partial<WorkoutEntry>) => void
  readOnly?: boolean
}

export function WorkoutCard({ label, entry, options, onChange, readOnly = false }: Props) {
  return (
    <div className="workout-card">
      <div className="workout-head">
        <span className="metric-label">{label}</span>
        {readOnly ? (
          <span className={`workout-status ${entry.done ? 'is-done' : ''}`}>
            {entry.done ? 'Done' : 'Not done'}
          </span>
        ) : (
          <button
            className={`btn-workout-toggle ${entry.done ? 'is-done' : ''}`}
            onClick={() => onChange({ done: !entry.done })}
          >
            {entry.done ? 'Mark incomplete' : 'Mark complete'}
          </button>
        )}
      </div>

      {readOnly ? (
        entry.done && (
          <div className="workout-readonly">
            {entry.name && <span>{entry.name}</span>}
            {entry.duration > 0 && <span>{entry.duration} min</span>}
            {entry.caloriesBurnt > 0 && <span>{entry.caloriesBurnt} kcal</span>}
          </div>
        )
      ) : (
        <div className="workout-fields">
          <select
            className="workout-select"
            value={entry.name}
            onChange={e => onChange({ name: e.target.value })}
          >
            <option value="">Select activity...</option>
            {options.map(o => <option key={o} value={o}>{o}</option>)}
          </select>
          <div className="workout-detail-row">
            <div className="workout-field">
              <span className="workout-field-label">Duration</span>
              <div className="workout-field-inner">
                <input
                  type="number" min="0" placeholder="0"
                  value={entry.duration || ''}
                  onChange={e => onChange({ duration: parseFloat(e.target.value) || 0 })}
                />
                <span className="workout-field-unit">min</span>
              </div>
            </div>
            <div className="workout-field">
              <span className="workout-field-label">Calories</span>
              <div className="workout-field-inner">
                <input
                  type="number" min="0" placeholder="0"
                  value={entry.caloriesBurnt || ''}
                  onChange={e => onChange({ caloriesBurnt: parseFloat(e.target.value) || 0 })}
                />
                <span className="workout-field-unit">kcal</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
