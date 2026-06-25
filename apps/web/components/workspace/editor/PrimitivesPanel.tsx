// @ts-nocheck
/* eslint-disable */
import React, { useState } from 'react'
import useStore from '../../../store/editorStore'
import { 
  Box, Cylinder, Circle, Triangle, Square, LifeBuoy, Magnet, 
  Orbit, Plane, Shield, Navigation, Wind, Droplet, Fuel, Shell,
  Lightbulb, Sun, Flashlight, ChevronDown, ChevronRight, Plus, Minus, XCircle
} from 'lucide-react'

const shapes = [
  { id: 'box', label: 'Box', icon: <Box size={20} strokeWidth={1.5} /> },
  { id: 'cylinder', label: 'Cylinder', icon: <Cylinder size={20} strokeWidth={1.5} /> },
  { id: 'sphere', label: 'Sphere', icon: <Circle size={20} strokeWidth={1.5} /> },
  { id: 'cone', label: 'Cone', icon: <Triangle size={20} strokeWidth={1.5} /> },
  { id: 'plane', label: 'Plane', icon: <Square size={20} strokeWidth={1.5} /> },
  { id: 'torus', label: 'Torus', icon: <LifeBuoy size={20} strokeWidth={1.5} /> },
  { id: 'capsule', label: 'Capsule', icon: <Magnet size={20} strokeWidth={1.5} /> },
  { id: 'ring', label: 'Ring', icon: <Orbit size={20} strokeWidth={1.5} /> },
  { id: 'torusknot', label: 'TorusKnot', icon: <Magnet size={20} strokeWidth={1.5} /> },
]

const aircraftParts = [
  { label: 'Fuselage', type: 'cylinder', scale: [0.4, 0.4, 3], rotation: [Math.PI / 2, 0, 0], position: [0, 1, 0], icon: <Plane size={18} strokeWidth={1.5} /> },
  { label: 'Delta Wing', type: 'box', scale: [3, 0.05, 1.5], rotation: [0, 0.785, 0], position: [0, 1, 0], icon: <Navigation size={18} strokeWidth={1.5} /> },
  { label: 'Swept Wing', type: 'box', scale: [2.5, 0.05, 1.2], rotation: [0, 0.4, 0], position: [1.5, 1, 0], icon: <Wind size={18} strokeWidth={1.5} /> },
  { label: 'Jet Engine', type: 'cylinder', scale: [0.3, 0.3, 1.2], rotation: [Math.PI / 2, 0, 0], position: [-1, 0.8, 0.8], icon: <Orbit size={18} strokeWidth={1.5} /> },
  { label: 'Tail Fin', type: 'box', scale: [0.05, 0.8, 0.6], rotation: [0, 0, 0], position: [0, 1.5, -1.5], icon: <Shield size={18} strokeWidth={1.5} /> },
  { label: 'Sensor Pod', type: 'sphere', scale: [0.3, 0.3, 0.5], rotation: [0, 0, 0], position: [0, 0.5, 1.5], icon: <Droplet size={18} strokeWidth={1.5} /> },
  { label: 'Fuel Tank', type: 'cylinder', scale: [0.2, 0.2, 0.8], rotation: [Math.PI / 2, 0, 0], position: [1, 0.5, 0], icon: <Fuel size={18} strokeWidth={1.5} /> },
  { label: 'Landing Gear', type: 'cylinder', scale: [0.05, 0.05, 0.6], rotation: [0, 0, 0], position: [0, 0.3, 0], icon: <Shell size={18} strokeWidth={1.5} /> },
]

const lightTypes = [
  { id: 'pointlight', label: 'Point', icon: <Lightbulb size={18} strokeWidth={1.5} /> },
  { id: 'directionallight', label: 'Dir.', icon: <Sun size={18} strokeWidth={1.5} /> },
  { id: 'spotlight', label: 'Spot', icon: <Flashlight size={18} strokeWidth={1.5} /> },
]

export default function PrimitivesPanel() {
  const addPrimitive = useStore((s) => s.addPrimitive)
  const performCSG = useStore((s) => s.performCSG)
  const selectedIds = useStore((s) => s.selectedIds)
  const [open, setOpen] = useState({ shapes: true, aircraft: true, csg: true, lights: false, csgInfo: false })
  const toggle = (k) => setOpen((p) => ({ ...p, [k]: !p[k] }))

  const csgReady = selectedIds.length >= 2

  return (
    <div className="flex flex-col gap-1 pb-12 font-sans">
      
      {/* 1. Basic Shapes */}
      <div>
        <button className="flex items-center justify-between px-3 py-2.5 w-full text-left font-serif text-light-text dark:text-dark-text hover:bg-light-bg dark:hover:bg-dark-bg transition-colors border-b border-light-border dark:border-dark-border" onClick={() => toggle('shapes')}>
          <span className="text-sm font-medium tracking-wide">Primitive Shapes</span>
          {open.shapes ? <ChevronDown size={14} className="text-light-muted dark:text-dark-muted"/> : <ChevronRight size={14} className="text-light-muted dark:text-dark-muted"/>}
        </button>
        {open.shapes && (
          <div className="grid grid-cols-3 gap-2 p-3 bg-light-surface dark:bg-dark-surface">
            {shapes.map((s) => (
              <button key={s.id} onClick={() => addPrimitive(s.id)}
                className="flex flex-col items-center justify-center gap-2 aspect-square rounded-lg border border-transparent hover:border-light-border dark:hover:border-dark-border bg-transparent hover:bg-light-bg dark:hover:bg-dark-bg text-light-muted dark:text-dark-muted hover:text-light-primary transition-all group"
              >
                <div className="text-light-muted dark:text-dark-muted group-hover:text-light-primary transition-colors">{s.icon}</div>
                <span className="text-[10px] tracking-wide font-medium">{s.label}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* 2. Aircraft Starter Kit */}
      <div>
        <button className="flex items-center justify-between px-3 py-2.5 w-full text-left font-serif text-light-text dark:text-dark-text hover:bg-light-bg dark:hover:bg-dark-bg transition-colors border-b border-light-border dark:border-dark-border" onClick={() => toggle('aircraft')}>
          <span className="text-sm font-medium tracking-wide">Aircraft Pre-fabs</span>
          {open.aircraft ? <ChevronDown size={14} className="text-light-muted dark:text-dark-muted"/> : <ChevronRight size={14} className="text-light-muted dark:text-dark-muted"/>}
        </button>
        {open.aircraft && (
          <div className="grid grid-cols-3 gap-2 p-3 bg-light-surface dark:bg-dark-surface">
            {aircraftParts.map((p) => (
              <button key={p.label} onClick={() => addPrimitive(p.type, p)}
                className="flex flex-col items-center justify-center gap-2 aspect-square rounded-lg border border-transparent hover:border-light-border dark:hover:border-dark-border bg-transparent hover:bg-light-bg dark:hover:bg-dark-bg text-light-muted dark:text-dark-muted hover:text-light-primary transition-all group"
              >
                <div className="text-light-muted dark:text-dark-muted group-hover:text-light-primary transition-colors">{p.icon}</div>
                <span className="text-[9px] tracking-wide text-center leading-tight">{p.label}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* 3. Lights */}
      <div>
        <button className="flex items-center justify-between px-3 py-2.5 w-full text-left font-serif text-light-text dark:text-dark-text hover:bg-light-bg dark:hover:bg-dark-bg transition-colors border-b border-light-border dark:border-dark-border" onClick={() => toggle('lights')}>
          <span className="text-sm font-medium tracking-wide">Lights</span>
          {open.lights ? <ChevronDown size={14} className="text-light-muted dark:text-dark-muted"/> : <ChevronRight size={14} className="text-light-muted dark:text-dark-muted"/>}
        </button>
        {open.lights && (
          <div className="grid grid-cols-3 gap-2 p-3 bg-light-surface dark:bg-dark-surface">
            {lightTypes.map((l) => (
              <button key={l.id} onClick={() => addPrimitive(l.id)}
                className="flex flex-col items-center justify-center gap-2 aspect-square rounded-lg border border-transparent hover:border-light-border dark:hover:border-dark-border bg-transparent hover:bg-light-bg dark:hover:bg-dark-bg text-light-muted dark:text-dark-muted hover:text-light-primary transition-all group"
              >
                <div className="text-light-muted dark:text-dark-muted group-hover:text-light-primary transition-colors">{l.icon}</div>
                <span className="text-[10px] tracking-wide font-medium">{l.label}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* 4. CSG Operations */}
      <div>
        <div className="px-3 py-2.5 flex justify-between items-center border-b border-light-border dark:border-dark-border">
          <span className="text-sm font-medium tracking-wide font-serif text-light-text dark:text-dark-text">CSG Ops</span>
          <button onClick={() => toggle('csgInfo')} className="text-light-muted dark:text-dark-muted hover:text-light-primary transition-colors w-5 h-5 flex items-center justify-center rounded-full border border-light-border dark:border-dark-border text-xs">?</button>
        </div>
        
        {open.csgInfo && (
          <div className="mx-3 mt-3 p-3 bg-light-bg dark:bg-dark-bg border border-light-border dark:border-dark-border rounded text-[11px] text-light-muted dark:text-dark-muted leading-relaxed">
            Constructive Solid Geometry lets you combine objects. Select 2+ overlapping shapes. The <strong className="text-light-text dark:text-dark-text">first selected</strong> is the base object.
          </div>
        )}

        <div className="p-3 grid grid-cols-3 gap-2">
          <button 
            disabled={!csgReady} 
            onClick={() => csgReady && performCSG('union')}
            title="Union (A + B)"
            className={`flex items-center justify-center gap-2 px-2 py-2.5 rounded border text-[10px] tracking-wide transition-colors ${csgReady ? 'border-light-border dark:border-dark-border bg-light-surface dark:bg-dark-surface hover:border-light-primary text-light-text dark:text-dark-text hover:text-light-primary' : 'border-transparent bg-light-bg/50 dark:bg-dark-bg/50 text-light-muted/50 dark:text-dark-muted/50 cursor-not-allowed'}`}
          >
            <Plus size={14} /> Union
          </button>
          
          <button 
            disabled={!csgReady} 
            onClick={() => csgReady && performCSG('subtract')}
            title="Subtract (A - B)"
            className={`flex items-center justify-center gap-2 px-2 py-2.5 rounded border text-[10px] tracking-wide transition-colors ${csgReady ? 'border-light-border dark:border-dark-border bg-light-surface dark:bg-dark-surface hover:border-light-primary text-light-text dark:text-dark-text hover:text-light-primary' : 'border-transparent bg-light-bg/50 dark:bg-dark-bg/50 text-light-muted/50 dark:text-dark-muted/50 cursor-not-allowed'}`}
          >
            <Minus size={14} /> Subtract
          </button>

          <button 
            disabled={!csgReady} 
            onClick={() => csgReady && performCSG('intersect')}
            title="Intersect (A ∩ B)"
            className={`flex items-center justify-center gap-2 px-2 py-2.5 rounded border text-[10px] tracking-wide transition-colors ${csgReady ? 'border-light-border dark:border-dark-border bg-light-surface dark:bg-dark-surface hover:border-light-primary text-light-text dark:text-dark-text hover:text-light-primary' : 'border-transparent bg-light-bg/50 dark:bg-dark-bg/50 text-light-muted/50 dark:text-dark-muted/50 cursor-not-allowed'}`}
          >
            <XCircle size={14} /> Intersect
          </button>
        </div>
      </div>
    </div>
  )
}
