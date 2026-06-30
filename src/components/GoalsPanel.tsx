import { useState } from 'react'
import type { GoalsConfig } from '@/types'

interface Props {
  goals: GoalsConfig
  onSave: (g: GoalsConfig) => void
}

export function GoalsPanel({ goals, onSave }: Props) {
  const [draft, setDraft] = useState<GoalsConfig>(goals)
  const [saved, setSaved] = useState(false)

  function numField(key: 'water' | 'steps' | 'reading', label: string, unit: string) {
    return (
      <label className="goal-row" key={key}>
        <span className="goal-label">{label}</span>
        <div className="goal-input-wrap">
          <input
            type="number"
            min="0"
            value={draft[key]}
            onChange={e => setDraft(d => ({ ...d, [key]: parseFloat(e.target.value) || 0 }))}
          />
          <span className="goal-unit">{unit}</span>
        </div>
      </label>
    )
  }

  function toggleField(key: 'workoutIndoorRequired' | 'workoutOutdoorRequired', label: string) {
    return (
      <label className="goal-row goal-row--toggle" key={key}>
        <span className="goal-label">{label}</span>
        <input
          type="checkbox"
          checked={draft[key]}
          onChange={e => setDraft(d => ({ ...d, [key]: e.target.checked }))}
        />
      </label>
    )
  }

  function handleSave() {
    onSave(draft)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <section className="panel goals-panel">
      <div className="panel-header">
        <h2>Daily Goals</h2>
      </div>

      <div className="goals-form">
        {numField('water',   'Water target',   'ml')}
        {numField('steps',   'Steps target',   'steps')}
        {numField('reading', 'Reading target', 'pages')}
        {toggleField('workoutIndoorRequired',  'Indoor workout required')}
        {toggleField('workoutOutdoorRequired', 'Outdoor workout required')}
      </div>

      <button className="btn-save-goals" onClick={handleSave}>
        {saved ? 'Saved!' : 'Save Goals'}
      </button>
    </section>
  )
}
