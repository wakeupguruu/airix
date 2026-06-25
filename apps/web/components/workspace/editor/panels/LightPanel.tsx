// @ts-nocheck
/* eslint-disable */
'use client'
import React from 'react'
import useStore from '../../../../store/editorStore'
import { Lightbulb, Sun, Flashlight, Zap, Circle, Plus, Trash2 } from 'lucide-react'

const LIGHT_TYPES = [
  { type: 'pointlight',       label: 'Point',       icon: <Lightbulb size={13} strokeWidth={1.5} />, desc: 'Omnidirectional' },
  { type: 'directionallight', label: 'Directional', icon: <Sun size={13} strokeWidth={1.5} />,       desc: 'Sunlight style'  },
  { type: 'spotlight',        label: 'Spot',        icon: <Flashlight size={13} strokeWidth={1.5} />, desc: 'Cone beam'      },
  { type: 'ambientlight',     label: 'Ambient',     icon: <Circle size={13} strokeWidth={1.5} />,    desc: 'Global fill'    },
  { type: 'hemispherelight',  label: 'Hemisphere',  icon: <Zap size={13} strokeWidth={1.5} />,       desc: 'Sky / ground'   },
]

export default function LightPanel() {
  const sceneObjects    = useStore(s => s.sceneObjects)
  const addPrimitive    = useStore(s => s.addPrimitive)
  const removePrimitive = useStore(s => s.removePrimitive)
  const updateObject    = useStore(s => s.updateObject)
  const saveHistory     = useStore(s => s.saveHistory)
  const selectedIds     = useStore(s => s.selectedIds)
  const toggleSelection = useStore(s => s.toggleSelection)

  const lights = sceneObjects.filter(o =>
    ['pointlight','directionallight','spotlight','ambientlight','hemispherelight'].includes(o.type)
  )

  const addLight = (type: string) => {
    saveHistory()
    addPrimitive(type)
  }

  return (
    <div className="p-3 flex flex-col gap-4 font-sans">
      {/* Add light buttons */}
      <div>
        <span className="text-[9px] font-bold uppercase tracking-widest text-light-muted dark:text-dark-muted block mb-2">Add Light</span>
        <div className="grid grid-cols-1 gap-1">
          {LIGHT_TYPES.map(lt => (
            <button
              key={lt.type}
              onClick={() => addLight(lt.type)}
              className="flex items-center gap-2.5 px-3 py-2 rounded-lg border border-light-border dark:border-dark-border hover:border-light-primary/40 hover:bg-light-surface dark:hover:bg-dark-surface text-light-text dark:text-dark-text transition-all duration-150 group"
            >
              <span className="text-light-muted dark:text-dark-muted group-hover:text-light-primary transition-colors">
                {lt.icon}
              </span>
              <div className="text-left">
                <div className="text-[12px] font-medium">{lt.label}</div>
                <div className="text-[9px] text-light-muted dark:text-dark-muted">{lt.desc}</div>
              </div>
              <Plus size={11} className="ml-auto text-light-muted dark:text-dark-muted group-hover:text-light-primary transition-colors" />
            </button>
          ))}
        </div>
      </div>

      {/* Lights in scene */}
      {lights.length > 0 && (
        <div className="border-t border-light-border dark:border-dark-border pt-3">
          <span className="text-[9px] font-bold uppercase tracking-widest text-light-muted dark:text-dark-muted block mb-2">
            Scene Lights ({lights.length})
          </span>
          <div className="flex flex-col gap-1">
            {lights.map(light => {
              const sel = selectedIds.includes(light.id)
              const def = LIGHT_TYPES.find(lt => lt.type === light.type)
              return (
                <div
                  key={light.id}
                  onClick={() => toggleSelection(light.id, false)}
                  className={`flex items-center gap-2 px-2 py-2 rounded-lg cursor-pointer transition-colors border group ${
                    sel
                      ? 'border-light-primary/30 bg-light-primary/5'
                      : 'border-transparent hover:bg-light-surface dark:hover:bg-dark-surface'
                  }`}
                >
                  <span className={sel ? 'text-light-primary' : 'text-light-muted dark:text-dark-muted'}>
                    {def?.icon}
                  </span>

                  <div className="flex-1 min-w-0">
                    <div className="text-[11px] font-medium text-light-text dark:text-dark-text truncate">
                      {light.name || def?.label}
                    </div>
                    <div className="text-[9px] text-light-muted dark:text-dark-muted">{def?.desc}</div>
                  </div>

                  {light.color && (
                    <input
                      type="color"
                      value={light.color || '#ffffff'}
                      onClick={e => e.stopPropagation()}
                      onChange={e => { saveHistory(); updateObject(light.id, { color: e.target.value }) }}
                      className="w-5 h-5 rounded border-none cursor-pointer bg-transparent p-0 shrink-0"
                    />
                  )}

                  <button
                    onClick={e => { e.stopPropagation(); saveHistory(); removePrimitive(light.id) }}
                    className="opacity-0 group-hover:opacity-100 p-1 text-light-muted hover:text-red-400 transition-all"
                  >
                    <Trash2 size={11} />
                  </button>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {lights.length === 0 && (
        <p className="text-[11px] text-light-muted dark:text-dark-muted text-center py-2">
          No lights in scene.<br />
          <span className="text-[10px]">Add one above to illuminate your objects.</span>
        </p>
      )}
    </div>
  )
}
