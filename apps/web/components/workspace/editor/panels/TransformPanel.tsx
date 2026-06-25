// @ts-nocheck
/* eslint-disable */
'use client'
import React from 'react'
import useStore from '../../../../store/editorStore'
import { Move, RotateCw, Maximize, RefreshCw } from 'lucide-react'

function NumInput({ value, onChange, step = 0.1 }) {
  return (
    <input
      type="number"
      value={parseFloat(value).toFixed(3)}
      step={step}
      onChange={e => onChange(parseFloat(e.target.value) || 0)}
      className="w-full bg-light-surface dark:bg-dark-surface border border-light-border dark:border-dark-border rounded px-1.5 py-1 text-[11px] font-mono text-light-text dark:text-dark-text outline-none focus:border-light-primary transition-colors text-center"
    />
  )
}

function Vec3Row({ label, values, onChange, step = 0.01 }) {
  return (
    <div className="flex flex-col gap-1">
      <span className="text-[9px] font-bold uppercase tracking-widest text-light-muted dark:text-dark-muted">{label}</span>
      <div className="grid grid-cols-3 gap-1">
        {['X', 'Y', 'Z'].map((axis, i) => (
          <div key={axis} className="flex flex-col gap-0.5">
            <span className="text-[9px] text-light-muted dark:text-dark-muted text-center font-medium">{axis}</span>
            <NumInput
              value={values[i] ?? 0}
              step={step}
              onChange={v => {
                const next = [...values]
                next[i] = v
                onChange(next)
              }}
            />
          </div>
        ))}
      </div>
    </div>
  )
}

export default function TransformPanel() {
  const selectedIds   = useStore(s => s.selectedIds)
  const sceneObjects  = useStore(s => s.sceneObjects)
  const updateObject  = useStore(s => s.updateObject)
  const saveHistory   = useStore(s => s.saveHistory)
  const transformMode = useStore(s => s.transformMode)
  const setTransformMode = useStore(s => s.setTransformMode)

  const obj = sceneObjects.find(o => o.id === selectedIds[0])

  const commit = (field, val) => {
    if (!obj) return
    saveHistory()
    updateObject(obj.id, { [field]: val })
  }

  const resetTransform = () => {
    if (!obj) return
    saveHistory()
    updateObject(obj.id, { position: [0, 0, 0], rotation: [0, 0, 0], scale: [1, 1, 1] })
  }

  const MODES = [
    { id: 'translate', icon: <Move size={13} strokeWidth={1.5} />, label: 'Move' },
    { id: 'rotate',    icon: <RotateCw size={13} strokeWidth={1.5} />, label: 'Rotate' },
    { id: 'scale',     icon: <Maximize size={13} strokeWidth={1.5} />, label: 'Scale' },
  ]

  if (!obj) {
    return (
      <div className="p-4 text-center">
        <p className="text-[11px] text-light-muted dark:text-dark-muted">Select an object to transform</p>
      </div>
    )
  }

  const rotDeg = obj.rotation.map(r => parseFloat((r * 180 / Math.PI).toFixed(3)))

  return (
    <div className="p-3 flex flex-col gap-4 font-sans bg-transparent">
      {/* Object name */}
      <div>
        <span className="text-[9px] font-bold uppercase tracking-widest text-light-muted dark:text-dark-muted block mb-1">Name</span>
        <input
          type="text"
          value={obj.name || obj.type}
          onChange={e => commit('name', e.target.value)}
          className="w-full bg-light-surface dark:bg-dark-surface border border-light-border dark:border-dark-border rounded-lg px-2 py-1.5 text-[12px] text-light-text dark:text-dark-text outline-none focus:border-light-primary transition-colors"
        />
      </div>

      <Vec3Row
        label="Position"
        values={obj.position}
        step={0.1}
        onChange={v => commit('position', v)}
      />

      <Vec3Row
        label="Rotation °"
        values={rotDeg}
        step={1}
        onChange={v => commit('rotation', v.map(d => d * Math.PI / 180))}
      />

      <Vec3Row
        label="Scale"
        values={obj.scale}
        step={0.01}
        onChange={v => commit('scale', v)}
      />

      <button
        onClick={resetTransform}
        className="flex items-center justify-center gap-1.5 w-full py-1.5 border border-light-border dark:border-dark-border rounded-lg text-[11px] text-light-muted dark:text-dark-muted hover:text-light-text dark:hover:text-dark-text hover:border-light-primary/40 transition-colors"
      >
        <RefreshCw size={11} />
        Reset Transform
      </button>

    </div>
  )
}
