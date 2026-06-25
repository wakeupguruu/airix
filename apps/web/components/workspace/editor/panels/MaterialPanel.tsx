// @ts-nocheck
/* eslint-disable */
'use client'
import React, { useState } from 'react'
import useStore from '../../../../store/editorStore'

const MATERIALS = [
  {
    id: 'solid',
    label: 'Standard',
    description: 'Physically-based rendering',
    preview: 'radial-gradient(circle at 35% 35%, #d8d3c8, #a09888)',
  },
  {
    id: 'diffuse',
    label: 'Diffuse',
    description: 'Lambert — no specular',
    preview: 'radial-gradient(circle at 35% 35%, #e8c898, #c8a870)',
  },
  {
    id: 'wireframe',
    label: 'Wireframe',
    description: 'Edge-only mesh',
    preview: 'transparent',
    previewBorder: '2px solid #5b8cb8',
  },
  {
    id: 'clay',
    label: 'Clay',
    description: 'Smooth matte surface',
    preview: 'radial-gradient(circle at 35% 35%, #d4cfc5, #b8b0a4)',
  },
  {
    id: 'normals',
    label: 'Normals',
    description: 'Surface normal map',
    preview: 'linear-gradient(135deg, #e87070 0%, #70c878 50%, #7090e0 100%)',
  },
  {
    id: 'scifi',
    label: 'Holographic',
    description: 'Transparent emission',
    preview: 'radial-gradient(circle at 35% 35%, rgba(100,180,255,0.9), rgba(50,100,200,0.5))',
    previewShadow: '0 0 8px rgba(100,180,255,0.5)',
  },
  {
    id: 'xray',
    label: 'X-Ray',
    description: 'Transparent depth',
    preview: 'radial-gradient(circle at 35% 35%, rgba(74,144,204,.7), rgba(74,144,204,.2))',
  },
]

export default function MaterialPanel() {
  const materialMode    = useStore(s => s.materialMode)
  const setMaterialMode = useStore(s => s.setMaterialMode)
  const selectedIds     = useStore(s => s.selectedIds)
  const sceneObjects    = useStore(s => s.sceneObjects)
  const updateObject    = useStore(s => s.updateObject)
  const saveHistory     = useStore(s => s.saveHistory)

  const obj = sceneObjects.find(o => o.id === selectedIds[0])

  const active = MATERIALS.find(m => m.id === materialMode)

  return (
    <div className="p-3 flex flex-col gap-4 font-sans">

      {/* Material grid */}
      <div className="grid grid-cols-2 gap-1.5">
        {MATERIALS.map(m => {
          const on = materialMode === m.id
          return (
            <button
              key={m.id}
              onClick={() => setMaterialMode(m.id)}
              className={`flex items-center gap-2 px-2 py-2 rounded-xl border text-left transition-all duration-150 ${
                on
                  ? 'border-light-primary/50 bg-light-primary/5 dark:bg-light-primary/5'
                  : 'border-light-border dark:border-dark-border hover:border-light-primary/30 hover:bg-light-surface dark:hover:bg-dark-surface'
              }`}
            >
              <div
                className="w-8 h-8 rounded-full shrink-0 border border-light-border dark:border-dark-border"
                style={{
                  background: m.preview,
                  border: m.previewBorder || undefined,
                  boxShadow: m.previewShadow || undefined,
                }}
              />
              <div className="min-w-0">
                <div className={`text-[11px] font-semibold truncate ${on ? 'text-light-primary' : 'text-light-text dark:text-dark-text'}`}>
                  {m.label}
                </div>
                <div className="text-[9px] text-light-muted dark:text-dark-muted truncate">{m.description}</div>
              </div>
            </button>
          )
        })}
      </div>

      {/* Object color */}
      {obj && (
        <div className="flex flex-col gap-2 pt-1 border-t border-light-border dark:border-dark-border">
          <span className="text-[9px] font-bold uppercase tracking-widest text-light-muted dark:text-dark-muted">Object Color</span>
          <div className="flex items-center gap-2">
            <input
              type="color"
              value={obj.color || '#c8c3b8'}
              onChange={e => { saveHistory(); updateObject(obj.id, { color: e.target.value }) }}
              className="w-9 h-9 rounded-lg border border-light-border dark:border-dark-border cursor-pointer bg-transparent p-0.5"
            />
            <div className="flex-1">
              <span className="text-[11px] font-mono text-light-text dark:text-dark-text">{obj.color || '#c8c3b8'}</span>
              <p className="text-[9px] text-light-muted dark:text-dark-muted mt-0.5">{obj.name || obj.type}</p>
            </div>
          </div>
        </div>
      )}

      {/* Surface properties */}
      {obj && (materialMode === 'solid' || materialMode === 'diffuse') && (
        <div className="flex flex-col gap-3 pt-1 border-t border-light-border dark:border-dark-border">
          <span className="text-[9px] font-bold uppercase tracking-widest text-light-muted dark:text-dark-muted">Surface</span>

          <SliderRow 
            label="Roughness" 
            value={obj.roughness ?? 0.7} 
            onChange={val => { saveHistory(); updateObject(obj.id, { roughness: val }) }} 
            min={0} max={1} step={0.01} 
          />
          <SliderRow 
            label="Metalness" 
            value={obj.metalness ?? 0.05} 
            onChange={val => { saveHistory(); updateObject(obj.id, { metalness: val }) }} 
            min={0} max={1} step={0.01} 
          />
          <SliderRow 
            label="Opacity"   
            value={obj.opacity ?? 1.0}   
            onChange={val => { saveHistory(); updateObject(obj.id, { opacity: val }) }} 
            min={0} max={1} step={0.01} 
          />
        </div>
      )}

      {!obj && (
        <p className="text-[11px] text-light-muted dark:text-dark-muted text-center py-2">
          Select an object to change its color and surface properties.
        </p>
      )}
    </div>
  )
}

function SliderRow({ label, value, onChange, min, max, step }) {
  return (
    <div className="flex flex-col gap-1">
      <div className="flex justify-between">
        <span className="text-[10px] text-light-muted dark:text-dark-muted">{label}</span>
        <span className="text-[10px] font-mono text-light-text dark:text-dark-text">{value.toFixed(2)}</span>
      </div>
      <input
        type="range"
        min={min} max={max} step={step}
        value={value}
        onChange={e => onChange(parseFloat(e.target.value))}
        className="w-full h-1 bg-light-border dark:bg-dark-border rounded-full appearance-none cursor-pointer accent-light-primary"
      />
    </div>
  )
}
