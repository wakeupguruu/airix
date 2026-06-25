// @ts-nocheck
/* eslint-disable */
import React, { useState } from 'react'
import useStore from '../../../store/editorStore'

const modes = [
  { id: 'solid',     label: 'Solid',     bg: 'radial-gradient(circle at 35% 35%, #c8c3b8, #a09888)' },
  { id: 'diffuse',   label: 'Diffuse',   bg: 'conic-gradient(from 0deg, #e07050, #5090d0, #50b868, #d0a040, #e07050)' },
  { id: 'wireframe', label: 'Wireframe', bg: 'transparent', border: '1.5px solid #5b8cb8' },
  { id: 'clay',      label: 'Clay',      bg: 'radial-gradient(circle at 35% 35%, #d4cfc5, #b8b0a4)' },
  { id: 'normals',   label: 'Normals',   bg: 'linear-gradient(135deg, #e87070, #70c878, #7090e0)' },
  { id: 'scifi',     label: 'Sci-Fi',    bg: 'radial-gradient(circle at 35% 35%, #a8ccee, #6699cc)', shadow: '0 0 6px rgba(102,153,204,.3)' },
  { id: 'xray',      label: 'X-Ray',     bg: 'radial-gradient(circle at 35% 35%, rgba(74,144,204,.6), rgba(74,144,204,.2))' },
]

export default function MaterialBar() {
  const materialMode = useStore((s) => s.materialMode)
  const setMaterialMode = useStore((s) => s.setMaterialMode)
  const [hovered, setHovered] = useState(null)

  return (
    <div className="absolute bottom-28 left-1/2 -translate-x-1/2 flex items-center gap-1.5 bg-light-surface/90 dark:bg-dark-surface/90 backdrop-blur-md border border-light-border dark:border-dark-border rounded-full px-3 py-1.5 z-15 shadow-xl pointer-events-auto font-sans">
      {modes.map((m) => {
        const on = materialMode === m.id
        const hov = hovered === m.id
        return (
          <div 
            key={m.id} 
            className="relative flex flex-col items-center"
            onMouseEnter={() => setHovered(m.id)} 
            onMouseLeave={() => setHovered(null)}
          >
            {hov && (
              <div className="absolute bottom-11 left-1/2 -translate-x-1/2 bg-light-surface dark:bg-dark-surface border border-light-border dark:border-dark-border rounded px-2 py-1 text-[9px] font-medium text-light-text dark:text-dark-text whitespace-nowrap z-20 shadow-md pointer-events-none animate-in fade-in slide-in-from-bottom-1 duration-150">
                {m.label}
              </div>
            )}
            <button 
              onClick={() => setMaterialMode(m.id)} 
              title={m.label} 
              className={`w-9 h-9 rounded-full flex items-center justify-center transition-all duration-150 outline-none
                ${on ? 'border-2 border-light-primary shadow-[0_0_8px_rgba(201,100,66,0.2)]' : 'border-2 border-transparent'}
              `}
            >
              <div 
                className="w-6 h-6 rounded-full transition-transform duration-150 hover:scale-110"
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
  )
}
