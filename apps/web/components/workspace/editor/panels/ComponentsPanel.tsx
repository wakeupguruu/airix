// @ts-nocheck
/* eslint-disable */
'use client'
import React, { useState } from 'react'
import { Search, Plus, Eye, X } from 'lucide-react'
import useStore from '../../../../store/editorStore'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, Environment, Stage } from '@react-three/drei'

const MOCK_COMPONENTS = [
  { id: 'c1', name: 'Air Draft', category: 'Aerospace', color: '#c96442' },
  { id: 'c2', name: 'Drone Recon', category: 'UAV', color: '#3898ec' },
  { id: 'c3', name: 'Fighter Jet', category: 'Military', color: '#88aadd' },
  { id: 'c4', name: 'Quadcopter', category: 'UAV', color: '#5a8a4a' },
  { id: 'c5', name: 'Stealth Bomber', category: 'Military', color: '#333333' },
  { id: 'c6', name: 'Helicopter', category: 'Aerospace', color: '#c98842' },
  { id: 'c7', name: 'Cargo Glider', category: 'Aerospace', color: '#f5f0e8' },
  { id: 'c8', name: 'Jet Engine', category: 'Parts', color: '#a09d96' },
]

export default function ComponentsPanel() {
  const [search, setSearch] = useState('')
  const [previewItem, setPreviewItem] = useState<any>(null)
  const addPrimitive = useStore(s => s.addPrimitive)

  const filtered = MOCK_COMPONENTS.filter(c => 
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.category.toLowerCase().includes(search.toLowerCase())
  )

  const handleAdd = (comp) => {
    addPrimitive('box', { name: comp.name, color: comp.color })
    setPreviewItem(null)
  }

  return (
    <>
      <div className="flex flex-col h-full font-sans relative">
        {/* Top Bar: Search */}
        <div className="p-3 border-b border-light-border dark:border-dark-border shrink-0">
          <div className="relative">
            <Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-light-muted dark:text-dark-muted" />
            <input
              type="text"
              placeholder="Search components..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full bg-light-surface dark:bg-dark-surface border border-light-border dark:border-dark-border rounded-lg pl-8 pr-3 py-1.5 text-[11px] text-light-text dark:text-dark-text outline-none focus:border-light-primary transition-colors"
            />
          </div>
        </div>

        {/* Components List */}
        <div className="flex-1 overflow-y-auto custom-scrollbar">
          {filtered.length === 0 ? (
            <div className="text-center py-8 text-light-muted dark:text-dark-muted text-[11px]">
              No components found.
            </div>
          ) : (
            <div className="flex flex-col">
              {filtered.map(comp => (
                <div key={comp.id} className="group flex items-center justify-between px-3 py-2 border-b border-light-border dark:border-dark-border hover:bg-light-surface dark:hover:bg-dark-surface transition-colors">
                  
                  <div className="flex flex-col min-w-0">
                    <span className="text-[12px] font-medium text-light-text dark:text-dark-text truncate">{comp.name}</span>
                    <span className="text-[10px] text-light-muted dark:text-dark-muted truncate">{comp.category}</span>
                  </div>

                  <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button 
                      onClick={() => setPreviewItem(comp)} 
                      className="p-1.5 text-light-muted hover:text-light-text dark:text-dark-muted dark:hover:text-dark-text transition-colors"
                      title="Preview"
                    >
                      <Eye size={14} />
                    </button>
                    <button 
                      onClick={() => handleAdd(comp)} 
                      className="p-1.5 bg-light-primary text-white rounded transition-colors hover:bg-light-primary/80"
                      title="Add to Scene"
                    >
                      <Plus size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Preview Modal */}
      {previewItem && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 font-sans">
          <div className="w-full max-w-lg bg-light-bg dark:bg-dark-bg border border-light-border dark:border-dark-border rounded-xl shadow-2xl overflow-hidden flex flex-col">
            
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-light-border dark:border-dark-border bg-light-surface dark:bg-dark-surface">
              <span className="font-medium text-light-text dark:text-dark-text">{previewItem.name} Preview</span>
              <button onClick={() => setPreviewItem(null)} className="text-light-muted hover:text-light-text dark:text-dark-muted dark:hover:text-dark-text transition-colors">
                <X size={16} />
              </button>
            </div>

            {/* 3D Viewport */}
            <div className="w-full h-[300px] bg-light-surface/50 dark:bg-dark-surface/50 relative">
              <Canvas shadows dpr={[1, 2]} camera={{ fov: 50, position: [0, 0, 4] }}>
                <ambientLight intensity={0.5} />
                <directionalLight position={[10, 10, 10]} intensity={1} castShadow />
                <Stage environment="city" intensity={0.5}>
                  <mesh castShadow receiveShadow>
                    <boxGeometry args={[1, 1, 1]} />
                    <meshStandardMaterial color={previewItem.color} roughness={0.3} metalness={0.2} />
                  </mesh>
                </Stage>
                <OrbitControls makeDefault autoRotate autoRotateSpeed={2} />
              </Canvas>
            </div>

            {/* Footer / Details */}
            <div className="p-4 flex items-center justify-between">
              <div>
                <h3 className="text-[15px] font-bold text-light-text dark:text-dark-text">{previewItem.name}</h3>
                <p className="text-[11px] text-light-muted dark:text-dark-muted">Category: {previewItem.category}</p>
              </div>
              <button 
                onClick={() => handleAdd(previewItem)}
                className="flex items-center gap-2 px-4 py-2 bg-light-primary text-white rounded-lg text-sm font-medium hover:bg-light-primary/90 transition-colors"
              >
                <Plus size={16} />
                Add to Scene
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
