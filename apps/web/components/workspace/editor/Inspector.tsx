// @ts-nocheck
/* eslint-disable */
import React, { useState, useEffect } from 'react'
import useStore from '../../../store/editorStore'
import { Trash2 } from 'lucide-react'

export default function Inspector() {
  const sceneObjects = useStore((s) => s.sceneObjects)
  const selectedIds = useStore((s) => s.selectedIds)
  const updateObject = useStore((s) => s.updateObject)
  const removePrimitive = useStore((s) => s.removePrimitive)
  const saveHistory = useStore((s) => s.saveHistory)

  const selectedObj = selectedIds.length === 1
    ? sceneObjects.find((o) => o.id === selectedIds[0])
    : null

  if (!selectedObj) {
    return (
      <div className="absolute top-3 right-3 px-3 py-2 bg-light-bg/80 dark:bg-dark-bg/80 backdrop-blur-sm border border-light-border dark:border-dark-border rounded-xl z-15 pointer-events-auto font-sans">
        <p className="text-[10px] text-light-muted dark:text-dark-muted">
          {sceneObjects.length} {sceneObjects.length === 1 ? 'object' : 'objects'} in scene
        </p>
      </div>
    )
  }

  return <InspectorPanel key={selectedObj.id} obj={selectedObj} updateObject={updateObject} removePrimitive={removePrimitive} saveHistory={saveHistory} />
}

function InspectorPanel({ obj, updateObject, removePrimitive, saveHistory }) {
  const [name, setName] = useState(obj.name)
  const [pos,  setPos]  = useState(obj.position)
  const [rot,  setRot]  = useState(obj.rotation.map((r) => r * 180 / Math.PI))
  const [scl,  setScl]  = useState(obj.scale)
  const [color, setColor] = useState(obj.color || '#aaaaaa')

  useEffect(() => {
    setName(obj.name)
    setPos([...obj.position])
    setRot(obj.rotation.map((r) => r * 180 / Math.PI))
    setScl([...obj.scale])
    setColor(obj.color || '#aaaaaa')
  }, [obj.position, obj.rotation, obj.scale, obj.color, obj.name])

  const commit = (field, val) => updateObject(obj.id, { [field]: val })
  const posChange = (i, v) => { const p=[...pos]; p[i]=parseFloat(v)||0; setPos(p); commit('position',p) }
  const rotChange = (i, v) => { const r=[...rot]; r[i]=parseFloat(v)||0; setRot(r); commit('rotation',r.map(d=>d*Math.PI/180)) }
  const sclChange = (i, v) => { const s=[...scl]; s[i]=parseFloat(v)||0.01; setScl(s); commit('scale',s) }

  const axisC = ['text-red-500', 'text-green-500', 'text-blue-500']
  const axisL = ['X','Y','Z']

  const vec3 = (vals, onChange) => (
    <div className="flex gap-1.5 w-full">
      {[0,1,2].map((i) => (
        <div key={i} className="flex-1 flex flex-col gap-0.5">
          <span className={`text-[8px] font-bold ${axisC[i]}`}>{axisL[i]}</span>
          <input 
            type="number" step="0.1" 
            value={parseFloat(vals[i]).toFixed(2)} 
            onChange={e => onChange(i,e.target.value)}
            className="w-full p-1 bg-light-bg dark:bg-dark-bg border border-light-border dark:border-dark-border rounded text-[10px] text-light-text dark:text-dark-text outline-none font-mono focus:border-light-primary transition-colors focus:ring-0"
          />
        </div>
      ))}
    </div>
  )

  return (
    <div className="absolute top-3 right-3 w-[216px] bg-light-bg/90 dark:bg-dark-bg/90 backdrop-blur-md border border-light-border dark:border-dark-border rounded-xl p-3 z-15 flex flex-col gap-3 pointer-events-auto font-sans animate-in fade-in zoom-in duration-200">
      <input
        type="text"
        value={name}
        onChange={e => { setName(e.target.value); commit('name', e.target.value) }}
        className="w-full px-2 py-1.5 bg-transparent border border-light-border dark:border-dark-border rounded-lg text-xs font-semibold text-light-text dark:text-dark-text outline-none focus:border-light-primary transition-colors"
      />

      <div className="flex flex-col gap-1">
        <div className="text-[9px] text-light-muted dark:text-dark-muted font-medium tracking-widest uppercase">Position</div>
        {vec3(pos, posChange)}
      </div>

      <div className="flex flex-col gap-1">
        <div className="text-[9px] text-light-muted dark:text-dark-muted font-medium tracking-widest uppercase">Rotation °</div>
        {vec3(rot, rotChange)}
      </div>

      <div className="flex flex-col gap-1">
        <div className="text-[9px] text-light-muted dark:text-dark-muted font-medium tracking-widest uppercase">Scale</div>
        {vec3(scl, sclChange)}
      </div>

      <div className="flex items-center gap-2">
        <input
          type="color"
          value={color}
          onChange={e => { setColor(e.target.value); commit('color', e.target.value) }}
          className="w-7 h-7 p-0 border border-light-border dark:border-dark-border rounded-lg cursor-pointer bg-transparent"
        />
        <span className="text-[10px] text-light-muted dark:text-dark-muted font-mono">{color}</span>
      </div>

      <button
        onClick={() => { saveHistory(); removePrimitive(obj.id) }}
        className="w-full flex items-center justify-center gap-1.5 py-1.5 border border-red-300/40 dark:border-red-900/40 text-red-500 rounded-lg text-[10px] font-medium hover:bg-red-50 dark:hover:bg-red-950/20 transition-colors"
      >
        <Trash2 size={12} />
        Delete
      </button>
    </div>
  )
}
