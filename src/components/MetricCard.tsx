import { useState } from 'react'
import type { MetricProgress } from '@/types'

interface Props {
  label: string
  unit: string
  progress: MetricProgress
  onAdd: (delta: number) => void
  readOnly?: boolean
}

export function MetricCard({ label, unit, progress, onAdd, readOnly = false }: Props) {
  const [inputVal, setInputVal] = useState('')

  function handleAdd() {
    const n = parseFloat(inputVal)
    if (!isNaN(n) && n > 0) {
      onAdd(n)
      setInputVal('')
    }
  }

  const pct = Math.round(progress.pct * 100)

  return (
    <div className="metric-card">
      <div className="metric-top">
        <span className="metric-label">{label}</span>
        <span className="metric-pct">{pct}%</span>
      </div>
      <div className="metric-numbers">
        <span className="metric-current">{progress.value.toLocaleString()}</span>
        <span className="metric-goal">/ {progress.goal.toLocaleString()} {unit}</span>
      </div>
      <div className="metric-bar-track">
        <div className="metric-bar-fill" style={{ width: `${progress.pct * 100}%` }} />
      </div>
      {!readOnly && (
        <div className="metric-controls">
          <input
            className="metric-add-input"
            type="number"
            min="0"
            placeholder={`Add ${unit}...`}
            value={inputVal}
            onChange={e => setInputVal(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleAdd()}
          />
          <button className="btn-add" onClick={handleAdd}>Add</button>
        </div>
      )}
    </div>
  )
}
