// @ts-nocheck
/* eslint-disable */
'use client'
import React, { useState } from 'react'
import Link from 'next/link'
import useStore from '../../../store/editorStore'
import { ChevronRight, ChevronLeft, PanelLeftOpen } from 'lucide-react'

const AirixLogo = () => (
  <svg viewBox="0 0 24 24" className="w-5 h-5 text-light-primary" fill="none" stroke="currentColor" strokeWidth={2.5}>
    <circle cx="12" cy="12" r="9" strokeDasharray="3 3" className="opacity-40" />
    <path d="M12 3v18M3 12h18M9 9l6 6M9 15l6-6" />
  </svg>
)

const meshItems = [
  'Box','Capsule','Circle','Cone','Cylinder','Dodecahedron','Icosahedron',
  'Octahedron','Plane','Ring','Sphere','Tetrahedron','Torus','TorusKnot',
]

const menus = [
  { label: 'File', items: ['New Project','Import...','Save','Export GLB','Export GLTF'] },
  { label: 'Edit', items: ['Undo','Redo','Delete Selected','Copy','Paste','Clear Scene'] },
  { label: 'Add',  submenus: [
    { label: 'Mesh',  items: meshItems, submenu: true },
    { label: 'Light', items: ['AmbientLight','DirectionalLight','HemisphereLight','PointLight','SpotLight'], submenu: true },
  ]},
  { label: 'View', items: ['Front','Right','Top','Reset Camera'] },
  { label: 'Theme', items: ['Dark Theme', 'Light Theme', 'Sage Theme', 'Ocean Theme', 'Dracula Theme'] },
  { label: 'Help', items: ['Keyboard Shortcuts','About Airix'] },
]

export default function Menubar() {
  const [openMenu, setOpenMenu] = useState(null)
  const [openSub,  setOpenSub]  = useState(null)

  const addPrimitive    = useStore((s) => s.addPrimitive)
  const clearScene      = useStore((s) => s.clearScene)
  const addModel        = useStore((s) => s.addModel)
  const undo            = useStore((s) => s.undo)
  const redo            = useStore((s) => s.redo)
  const copySelected    = useStore((s) => s.copySelected)
  const pasteClipboard  = useStore((s) => s.pasteClipboard)
  const removePrimitive = useStore((s) => s.removePrimitive)
  const selectedIds     = useStore((s) => s.selectedIds)
  const setSelectedIds  = useStore((s) => s.setSelectedIds)
  const setShowShortcuts = useStore((s) => s.setShowShortcuts)
  const setEditorTheme  = useStore((s) => s.setEditorTheme)

  const doAdd = (name) => {
    setOpenMenu(null); setOpenSub(null)
    addPrimitive(name.toLowerCase().replace(/\s+/g, ''))
  }

  const doImport = () => {
    const inp = document.createElement('input')
    inp.type = 'file'; inp.accept = '.glb,.gltf'
    inp.onchange = (e) => { const f = e.target.files[0]; if (f) addModel(URL.createObjectURL(f), f.name) }
    inp.click()
  }

  const doAction = (item) => {
    setOpenMenu(null)
    if (item === 'Clear Scene')        clearScene()
    if (item === 'Import...')          doImport()
    if (item === 'Keyboard Shortcuts') setShowShortcuts(true)
    if (item === 'Undo')               undo()
    if (item === 'Redo')               redo()
    if (item === 'Copy')               copySelected()
    if (item === 'Paste')              pasteClipboard()
    if (item === 'Delete Selected')    selectedIds.forEach(id => removePrimitive(id))
    if (item === 'Dark Theme') {
      document.documentElement.classList.add('dark')
      localStorage.setItem('theme', 'dark')
      setEditorTheme(null)
    }
    if (item === 'Light Theme') {
      document.documentElement.classList.remove('dark')
      localStorage.setItem('theme', 'light')
      setEditorTheme(null)
    }
    if (item === 'Sage Theme')         setEditorTheme('sage')
    if (item === 'Ocean Theme')        setEditorTheme('ocean')
    if (item === 'Dracula Theme')      setEditorTheme('dracula')
    if (item === 'Export GLB') {
      setSelectedIds([])
      setTimeout(() => window.dispatchEvent(new CustomEvent('export-scene', { detail: 'glb' })), 50)
    }
    if (item === 'Export GLTF') {
      setSelectedIds([])
      setTimeout(() => window.dispatchEvent(new CustomEvent('export-scene', { detail: 'gltf' })), 50)
    }
  }

  return (
    <div className="flex items-center h-10 bg-light-bg dark:bg-dark-bg border-b border-light-border dark:border-dark-border select-none shrink-0 z-50 px-3 font-sans gap-3">
      {/* Logo — links back to workspace list */}
      <Link href="/workspace" className="flex items-center gap-2.5 mr-3 group">
        <AirixLogo />
        <span
          className="font-garamond-light text-[15px] text-light-text dark:text-dark-text tracking-widest whitespace-nowrap leading-none group-hover:text-light-primary transition-colors duration-150"
          style={{ fontWeight: 400, letterSpacing: '0.1em' }}
        >
          AIRIX
        </span>
      </Link>

      {/* Separator */}
      <div className="w-px h-4 bg-light-border dark:bg-dark-border" />

      {/* Menu items */}
      <div className="flex gap-0.5 h-full items-center">
        {menus.map((m) => (
          <div
            key={m.label}
            className="relative h-full flex items-center"
            onMouseEnter={() => openMenu !== null && setOpenMenu(m.label)}
            onMouseLeave={() => setOpenSub(null)}
          >
            <button
              className={`px-3 py-1 text-xs rounded-md transition-colors duration-150 ${
                openMenu === m.label
                  ? 'text-light-text dark:text-dark-text bg-light-surface dark:bg-dark-surface'
                  : 'text-light-muted dark:text-dark-muted hover:text-light-text dark:hover:text-dark-text hover:bg-light-surface/60 dark:hover:bg-dark-surface/60'
              }`}
              onClick={() => setOpenMenu(openMenu === m.label ? null : m.label)}
            >
              {m.label}
            </button>

            {openMenu === m.label && (
              <div className="absolute top-full left-0 mt-0.5 min-w-[180px] bg-light-bg dark:bg-dark-bg border border-light-border dark:border-dark-border rounded-lg shadow-xl py-1 z-50 animate-in fade-in zoom-in-95 duration-100">
                {m.submenus
                  ? m.submenus.map((sub, i) =>
                      sub.submenu ? (
                        <div
                          key={i}
                          className="relative"
                          onMouseEnter={() => setOpenSub(sub.label)}
                          onMouseLeave={() => setOpenSub(null)}
                        >
                          <div className="flex w-full text-left px-4 py-1.5 text-xs text-light-muted dark:text-dark-muted hover:bg-light-surface dark:hover:bg-dark-surface hover:text-light-text dark:hover:text-dark-text cursor-pointer justify-between items-center transition-colors">
                            {sub.label} <ChevronRight size={12} />
                          </div>
                          {openSub === sub.label && (
                            <div className="absolute top-0 left-full ml-1 min-w-[150px] bg-light-bg dark:bg-dark-bg border border-light-border dark:border-dark-border rounded-lg shadow-xl py-1 z-50">
                              {sub.items.map(item => (
                                <button
                                  key={item}
                                  className="block w-full text-left px-4 py-1.5 text-xs text-light-muted dark:text-dark-muted hover:bg-light-surface dark:hover:bg-dark-surface hover:text-light-text dark:hover:text-dark-text transition-colors"
                                  onClick={(e) => { e.stopPropagation(); doAdd(item) }}
                                >
                                  {item}
                                </button>
                              ))}
                            </div>
                          )}
                        </div>
                      ) : null
                    )
                  : m.items.map(item => (
                      <button
                        key={item}
                        className="block w-full text-left px-4 py-1.5 text-xs text-light-muted dark:text-dark-muted hover:bg-light-surface dark:hover:bg-dark-surface hover:text-light-text dark:hover:text-dark-text transition-colors"
                        onClick={() => doAction(item)}
                      >
                        {item}
                      </button>
                    ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
