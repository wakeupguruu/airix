// @ts-nocheck
/* eslint-disable */
import React from 'react'
import useStore from '../../../store/editorStore'
import { Keyboard, X } from 'lucide-react'

const shortcuts = [
  { key: 'W', action: 'Translate Mode' },
  { key: 'E', action: 'Rotate Mode' },
  { key: 'R', action: 'Scale Mode' },
  { key: 'Delete', action: 'Delete Selected' },
  { key: 'Ctrl+C', action: 'Copy' },
  { key: 'Ctrl+V', action: 'Paste' },
  { key: 'Ctrl+Z', action: 'Undo' },
  { key: 'Ctrl+Y', action: 'Redo' },
  { key: '?', action: 'Show Shortcuts' },
  { key: 'Click', action: 'Select Object' },
  { key: 'Shift+Click', action: 'Multi-select' },
  { key: 'Click Empty', action: 'Deselect All' },
]

export default function ShortcutsModal() {
  const show = useStore((s) => s.showShortcuts)
  const setShow = useStore((s) => s.setShowShortcuts)

  if (!show) return null

  return (
    <div 
      onClick={() => setShow(false)} 
      className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-center justify-center font-sans animate-in fade-in duration-200"
    >
      <div 
        onClick={(e) => e.stopPropagation()} 
        className="w-[380px] bg-light-surface dark:bg-dark-surface border border-light-border dark:border-dark-border rounded-xl p-6 shadow-2xl animate-in zoom-in-95 duration-200"
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-sm font-bold tracking-widest text-light-text dark:text-dark-text uppercase flex items-center gap-2">
            <Keyboard size={16} className="text-light-primary" />
            Keyboard Shortcuts
          </h2>
          <button 
            onClick={() => setShow(false)} 
            className="text-light-muted dark:text-dark-muted hover:text-light-text dark:hover:text-dark-text transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        <div className="flex flex-col gap-1">
          {shortcuts.map(({ key, action }) => (
            <div 
              key={key} 
              className="flex justify-between items-center py-2 border-b border-light-border/50 dark:border-dark-border/50 last:border-0"
            >
              <span className="text-[11px] text-light-muted dark:text-dark-muted">{action}</span>
              <kbd className="px-2 py-1 text-[10px] font-mono bg-light-bg dark:bg-dark-bg border border-light-border dark:border-dark-border rounded text-light-text dark:text-dark-text shadow-sm">
                {key}
              </kbd>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
