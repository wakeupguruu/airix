// @ts-nocheck
/* eslint-disable */
'use client'
import React from 'react'
import useStore from '../../../../store/editorStore'
import { Combine, Minus, Plus, GitMerge, AlertCircle } from 'lucide-react'

const OPS = [
  {
    id: 'union',
    label: 'Union',
    icon: <GitMerge size={18} strokeWidth={1.5} />,
    description: 'Merge selected objects into one',
    shortcut: 'A + B',
  },
  {
    id: 'subtract',
    label: 'Subtract',
    icon: <Minus size={18} strokeWidth={1.5} />,
    description: 'Cut B from A (selection order matters)',
    shortcut: 'A – B',
  },
  {
    id: 'intersect',
    label: 'Intersect',
    icon: <Plus size={18} strokeWidth={1.5} />,
    description: 'Keep only the overlapping volume',
    shortcut: 'A ∩ B',
  },
]

export default function CSGPanel() {
  const selectedIds  = useStore(s => s.selectedIds)
  const sceneObjects = useStore(s => s.sceneObjects)
  const performCSG   = useStore(s => s.performCSG)

  const selected = selectedIds
    .map(id => sceneObjects.find(o => o.id === id))
    .filter(Boolean)

  const canDoCSG = selected.length >= 2

  return (
    <div className="p-3 flex flex-col gap-4 font-sans">
      {/* Status */}
      <div className={`flex items-center gap-2 px-3 py-2 rounded-xl text-[11px] ${
        canDoCSG
          ? 'bg-light-primary/8 border border-light-primary/20 text-light-primary'
          : 'bg-light-surface dark:bg-dark-surface border border-light-border dark:border-dark-border text-light-muted dark:text-dark-muted'
      }`}>
        {canDoCSG ? (
          <>
            <Combine size={13} />
            <span>{selected.length} objects selected — ready</span>
          </>
        ) : (
          <>
            <AlertCircle size={13} />
            <span>Select 2+ objects to use CSG</span>
          </>
        )}
      </div>

      {/* Operation buttons */}
      <div className="flex flex-col gap-2">
        {OPS.map(op => (
          <button
            key={op.id}
            onClick={() => canDoCSG && performCSG(op.id)}
            disabled={!canDoCSG}
            className={`flex items-center gap-3 px-3 py-3 rounded-xl border text-left transition-all duration-150 ${
              canDoCSG
                ? 'border-light-border dark:border-dark-border hover:border-light-primary/40 hover:bg-light-surface dark:hover:bg-dark-surface cursor-pointer'
                : 'border-light-border/40 dark:border-dark-border/40 opacity-40 cursor-not-allowed'
            }`}
          >
            <div className={`w-9 h-9 flex items-center justify-center rounded-lg border ${
              canDoCSG
                ? 'border-light-border dark:border-dark-border text-light-primary bg-light-primary/5'
                : 'border-light-border/40 dark:border-dark-border/40 text-light-muted dark:text-dark-muted'
            }`}>
              {op.icon}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[12px] font-semibold text-light-text dark:text-dark-text">{op.label}</span>
                <span className="text-[10px] font-mono text-light-muted dark:text-dark-muted bg-light-surface dark:bg-dark-surface border border-light-border dark:border-dark-border rounded px-1">{op.shortcut}</span>
              </div>
              <p className="text-[10px] text-light-muted dark:text-dark-muted mt-0.5">{op.description}</p>
            </div>
          </button>
        ))}
      </div>

      {/* Selected objects preview */}
      {selected.length > 0 && (
        <div className="border-t border-light-border dark:border-dark-border pt-3">
          <span className="text-[9px] font-bold uppercase tracking-widest text-light-muted dark:text-dark-muted block mb-2">
            Selection ({selected.length})
          </span>
          <div className="flex flex-col gap-1">
            {selected.map((obj, i) => (
              <div key={obj.id} className="flex items-center gap-2 px-2 py-1.5 rounded-lg bg-light-surface dark:bg-dark-surface">
                <span className="text-[10px] font-mono text-light-muted dark:text-dark-muted w-4 text-center">{String.fromCharCode(65 + i)}</span>
                <div
                  className="w-3 h-3 rounded-full border border-light-border dark:border-dark-border shrink-0"
                  style={{ background: obj.color || '#aaaaaa' }}
                />
                <span className="text-[11px] text-light-text dark:text-dark-text truncate">{obj.name || obj.type}</span>
              </div>
            ))}
          </div>
          {selected.length >= 2 && (
            <p className="text-[9px] text-light-muted dark:text-dark-muted mt-2 leading-relaxed">
              For Subtract: <strong>A</strong> is the base, <strong>B</strong> is cut from it. Select A first.
            </p>
          )}
        </div>
      )}
    </div>
  )
}
