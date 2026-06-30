import { useState } from 'react'

interface Props {
  value: number
  onSet: (val: number) => void
  readOnly?: boolean
}

export function WeightCard({ value, onSet, readOnly = false }: Props) {
  const [inputVal, setInputVal] = useState('')

  function handleSet() {
    const n = parseFloat(inputVal)
    if (!isNaN(n) && n > 0) {
      onSet(n)
      setInputVal('')
    }
  }

  return (
    <div className="weight-row">
      <span className="weight-label">Weight</span>
      <span className="weight-display">
        {value > 0 ? `${value} kg` : '—'}
      </span>
      {!readOnly && (
        <div className="weight-controls">
          <input
            type="number"
            min="0"
            step="0.1"
            placeholder="kg"
            value={inputVal}
            onChange={e => setInputVal(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSet()}
          />
          <button className="btn-weight-set" onClick={handleSet}>Set</button>
        </div>
      )}
    </div>
  )
}
