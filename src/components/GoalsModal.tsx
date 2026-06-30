import { useEffect } from 'react'
import { GoalsPanel } from './GoalsPanel'
import type { GoalsConfig } from '@/types'

interface Props {
  goals: GoalsConfig
  onSave: (g: GoalsConfig) => void
  onClose: () => void
}

export function GoalsModal({ goals, onSave, onClose }: Props) {
  useEffect(() => {
    function onKey(e: KeyboardEvent) { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  function handleSave(g: GoalsConfig) {
    onSave(g)
    onClose()
  }

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-box" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <span>Edit Goals</span>
          <button className="modal-close" onClick={onClose} aria-label="Close">&#10005;</button>
        </div>
        <GoalsPanel goals={goals} onSave={handleSave} />
      </div>
    </div>
  )
}
