// @ts-nocheck
/* eslint-disable */
import React, { useState } from 'react'
import useStore from '../../../store/editorStore'
import { Move, RotateCw, Maximize } from 'lucide-react'

const materialModes = [
  { id: 'solid',     label: 'Solid',     bg: 'radial-gradient(circle at 35% 35%, #c8c3b8, #a09888)' },
  { id: 'diffuse',   label: 'Diffuse',   bg: 'conic-gradient(from 0deg, #e07050, #5090d0, #50b868, #d0a040, #e07050)' },
  { id: 'wireframe', label: 'Wireframe', bg: 'transparent', border: '1.5px solid #5b8cb8' },
  { id: 'clay',      label: 'Clay',      bg: 'radial-gradient(circle at 35% 35%, #d4cfc5, #b8b0a4)' },
  { id: 'normals',   label: 'Normals',   bg: 'linear-gradient(135deg, #e87070, #70c878, #7090e0)' },
  { id: 'scifi',     label: 'Sci-Fi',    bg: 'radial-gradient(circle at 35% 35%, #a8ccee, #6699cc)', shadow: '0 0 6px rgba(102,153,204,.3)' },
  { id: 'xray',      label: 'X-Ray',     bg: 'radial-gradient(circle at 35% 35%, rgba(74,144,204,.6), rgba(74,144,204,.2))' },
]

export default function Toolbar() {
  const transformMode = useStore((s) => s.transformMode)
  const setTransformMode = useStore((s) => s.setTransformMode)
  const sceneObjects = useStore((s) => s.sceneObjects)
  const selectedIds = useStore((s) => s.selectedIds)
  
  const materialMode = useStore((s) => s.materialMode)
  const setMaterialMode = useStore((s) => s.setMaterialMode)
  
  const [hoveredMaterial, setHoveredMaterial] = useState(null)

  const transformModes = [
    { id: 'translate', label: 'Move', key: 'W', icon: <Move size={14} /> },
    { id: 'rotate', label: 'Rotate', key: 'E', icon: <RotateCw size={14} /> },
    { id: 'scale', label: 'Scale', key: 'R', icon: <Maximize size={14} /> },
  ]

  return (
    <>
      {/* Combined Toolbar (Transform + Materials) */}
      <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex items-center gap-1.5 bg-light-surface/90 dark:bg-dark-surface/90 backdrop-blur-md border border-light-border dark:border-dark-border rounded-full px-2 py-1.5 shadow-xl z-15 font-sans pointer-events-auto">
        
        {/* Transform Modes */}
        <div className="flex items-center gap-1">
          {transformModes.map((m) => {
            const on = transformMode === m.id
            return (
              <button
                key={m.id}
                onClick={() => setTransformMode(m.id)}
                title={`${m.label} (${m.key})`}
                className={`flex items-center justify-center w-8 h-8 rounded-full transition-all duration-150
                  ${on 
                    ? 'bg-light-primary text-white shadow-sm' 
                    : 'bg-transparent text-light-muted dark:text-dark-muted hover:bg-light-bg dark:hover:bg-dark-bg hover:text-light-text dark:hover:text-dark-text'
                  }
                `}
              >
                {m.icon}
              </button>
            )
          })}
        </div>

        {/* Separator */}
        <div className="w-[1px] h-5 bg-light-border dark:bg-dark-border mx-1" />

        {/* Material Modes */}
        <div className="flex items-center gap-1">
          {materialModes.map((m) => {
            const on = materialMode === m.id
            const hov = hoveredMaterial === m.id
            return (
              <div 
                key={m.id} 
                className="relative flex flex-col items-center"
                onMouseEnter={() => setHoveredMaterial(m.id)} 
                onMouseLeave={() => setHoveredMaterial(null)}
              >
                {hov && (
                  <div className="absolute bottom-11 left-1/2 -translate-x-1/2 bg-light-surface dark:bg-dark-surface border border-light-border dark:border-dark-border rounded px-2 py-1 text-[9px] font-medium text-light-text dark:text-dark-text whitespace-nowrap z-20 shadow-md pointer-events-none animate-in fade-in slide-in-from-bottom-1 duration-150">
                    {m.label}
                  </div>
                )}
                <button 
                  onClick={() => setMaterialMode(m.id)} 
                  title={m.label} 
                  className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-150 outline-none
                    ${on ? 'border-2 border-light-primary shadow-[0_0_8px_rgba(201,100,66,0.2)] bg-light-bg dark:bg-dark-bg' : 'border-2 border-transparent hover:bg-light-bg/50 dark:hover:bg-dark-bg/50'}
                  `}
                >
                  <div 
                    className="w-5 h-5 rounded-full transition-transform duration-150 hover:scale-110"
                    style={{
                      background: m.bg || 'transparent',
                      border: m.border || 'none',
                      boxShadow: m.shadow || 'none',
                    }}
                  />
                </button>
              </div>
            )
          })}
        </div>
      </div>

      {/* Status text (No background) */}
      <div className="absolute bottom-2 left-4 z-15 select-none font-sans pointer-events-none">
        <span className={`text-[10px] tracking-wide font-mono drop-shadow-sm ${selectedIds.length > 0 ? 'text-light-primary' : 'text-light-muted dark:text-dark-muted'}`}>
          {selectedIds.length > 1
            ? `${selectedIds.length} objects selected`
            : selectedIds.length === 1
              ? `❖ ${sceneObjects.find(o => o.id === selectedIds[0])?.name || 'Object'}`
              : `${sceneObjects.length} objects in scene`}
        </span>
      </div>
    </>
  )
}
