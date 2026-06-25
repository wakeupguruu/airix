// @ts-nocheck
/* eslint-disable */
'use client'
import React from 'react'
import useStore from '../../../store/editorStore'
import {
  Box, Cylinder, Circle, Triangle, Square, LifeBuoy, Magnet,
  Orbit, Combine, Cuboid, Lightbulb, Sun, Flashlight, Component,
  Eye, EyeOff, X, Layers,
} from 'lucide-react'
import TransformPanel from './panels/TransformPanel'

const TypeIcon = ({ type, size = 13 }) => {
  const props = { size, strokeWidth: 1.5 }
  switch (type) {
    case 'box':             return <Box {...props} />
    case 'cylinder':        return <Cylinder {...props} />
    case 'sphere':          return <Circle {...props} />
    case 'cone':            return <Triangle {...props} />
    case 'plane':           return <Square {...props} />
    case 'torus':           return <LifeBuoy {...props} />
    case 'capsule':         return <Magnet {...props} />
    case 'ring':            return <Orbit {...props} />
    case 'torusknot':       return <Magnet {...props} />
    case 'csg_result':      return <Combine {...props} />
    case 'gltf':            return <Cuboid {...props} />
    case 'pointlight':      return <Lightbulb {...props} />
    case 'directionallight':return <Sun {...props} />
    case 'spotlight':       return <Flashlight {...props} />
    case 'hemispherelight': return <Component {...props} />
    case 'ambientlight':    return <Sun {...props} />
    default:                return <Layers {...props} />
  }
}

export default function SceneOutliner() {
  const sceneObjects    = useStore((s) => s.sceneObjects)
  const selectedIds     = useStore((s) => s.selectedIds)
  const toggleSelection = useStore((s) => s.toggleSelection)
  const removePrimitive = useStore((s) => s.removePrimitive)
  const updateObject    = useStore((s) => s.updateObject)

  return (
    <div className="flex flex-col font-sans">
      {sceneObjects.length === 0 ? (
        <div className="px-4 py-8 text-center">
          <Layers size={24} strokeWidth={1} className="mx-auto mb-3 text-light-muted/40 dark:text-dark-muted/40" />
          <p className="text-[11px] text-light-muted dark:text-dark-muted leading-relaxed">
            No objects yet.
            <br />
            <span className="text-[10px] text-light-muted/60 dark:text-dark-muted/60">Use Add → Mesh to get started.</span>
          </p>
        </div>
      ) : (
        sceneObjects.map((obj) => {
          const sel = selectedIds.includes(obj.id)
          return (
            <div
              key={obj.id}
              onClick={() => toggleSelection(obj.id, false)}
              className={`
                flex items-center gap-2 px-3 py-2 text-[12px] cursor-pointer
                transition-colors duration-100 group
                border-b border-light-border/30 dark:border-dark-border/30 last:border-0
                ${sel
                  ? 'bg-light-primary/8 text-light-primary'
                  : 'text-light-text dark:text-dark-text hover:bg-light-surface dark:hover:bg-dark-surface'}
              `}
            >
              <span className={sel ? 'text-light-primary' : 'text-light-muted dark:text-dark-muted'}>
                <TypeIcon type={obj.type} />
              </span>

              <span className="flex-1 truncate text-[12px] font-medium">
                {obj.name || obj.type}
              </span>

              <button
                onClick={(e) => { e.stopPropagation(); updateObject(obj.id, { visible: !obj.visible }) }}
                className={`opacity-0 group-hover:opacity-100 p-1 rounded transition-all ${
                  obj.visible ? 'text-light-muted dark:text-dark-muted hover:text-light-text dark:hover:text-dark-text' : 'text-red-400'
                }`}
                title={obj.visible ? 'Hide' : 'Show'}
              >
                {obj.visible ? <Eye size={12} /> : <EyeOff size={12} />}
              </button>

              <button
                onClick={(e) => { e.stopPropagation(); removePrimitive(obj.id) }}
                className="opacity-0 group-hover:opacity-100 p-1 rounded text-light-muted dark:text-dark-muted hover:text-red-400 transition-all"
              >
                <X size={12} />
              </button>
            </div>
          )
        })
      )}

      {/* Scene stats */}
      {sceneObjects.length > 0 && (
        <div className="px-3 py-2 border-t border-light-border dark:border-dark-border">
          <span className="text-[10px] text-light-muted dark:text-dark-muted font-mono">
            {sceneObjects.length} obj · {selectedIds.length} sel
          </span>
        </div>
      )}

      {/* Selected Object Transform Properties */}
      {selectedIds.length > 0 && (
        <div className="mt-auto border-t border-light-border dark:border-dark-border bg-light-surface dark:bg-dark-surface/50">
          <TransformPanel />
        </div>
      )}
    </div>
  )
}
