// @ts-nocheck
/* eslint-disable */
'use client'
import React, { useRef, useCallback } from 'react'
import useStore from '../../../store/editorStore'
import {
  MousePointer2, Move, RotateCw, Maximize,
  Layers, Palette, Sun, Combine, Globe, Component,
  ChevronLeft,
} from 'lucide-react'
import TransformPanel from './panels/TransformPanel'
import SceneOutliner from './SceneOutliner'
import MaterialPanel from './panels/MaterialPanel'
import LightPanel from './panels/LightPanel'
import CSGPanel from './panels/CSGPanel'
import EnvironmentPanel from './panels/EnvironmentPanel'
import ComponentsPanel from './panels/ComponentsPanel'

const TOOLS = [
  { id: 'select',    icon: <MousePointer2 size={15} strokeWidth={1.5} />, label: 'Select',    transform: 'select'    },
  { id: 'translate', icon: <Move size={15} strokeWidth={1.5} />,          label: 'Move (W)',  transform: 'translate' },
  { id: 'rotate',    icon: <RotateCw size={15} strokeWidth={1.5} />,      label: 'Rotate (E)',transform: 'rotate'    },
  { id: 'scale',     icon: <Maximize size={15} strokeWidth={1.5} />,      label: 'Scale (R)', transform: 'scale'     },
]

const PANELS = [
  { id: 'scene',       icon: <Layers size={15} strokeWidth={1.5} />,  label: 'Scene'       },
  { id: 'material',    icon: <Palette size={15} strokeWidth={1.5} />, label: 'Material'    },
  { id: 'lights',      icon: <Sun size={15} strokeWidth={1.5} />,     label: 'Lights'      },
  { id: 'csg',         icon: <Combine size={15} strokeWidth={1.5} />, label: 'CSG'         },
  { id: 'environment', icon: <Globe size={15} strokeWidth={1.5} />,   label: 'Environment' },
  { id: 'components',  icon: <Component size={15} strokeWidth={1.5} />,label: 'Components'  },
]

function PanelContent({ id }) {
  switch (id) {
    case 'scene':       return <SceneOutliner />
    case 'material':    return <MaterialPanel />
    case 'lights':      return <LightPanel />
    case 'csg':         return <CSGPanel />
    case 'environment': return <EnvironmentPanel />
    case 'components':  return <ComponentsPanel />
    default:            return null
  }
}

export default function Sidebar() {
  const transformMode      = useStore((s) => s.transformMode)
  const setTransformMode   = useStore((s) => s.setTransformMode)
  const sidebarTab         = useStore((s) => s.sidebarTab)
  const sidebarExpanded    = useStore((s) => s.sidebarExpanded)
  const setSidebarTab      = useStore((s) => s.setSidebarTab)
  const setSidebarExpanded = useStore((s) => s.setSidebarExpanded)

  const handlePanelClick = (id: string) => {
    if (sidebarTab === id && sidebarExpanded) {
      setSidebarExpanded(false)
    } else {
      setSidebarTab(id)
      setSidebarExpanded(true)
    }
  }

  const currentPanel = PANELS.find(p => p.id === sidebarTab)

  return (
    <div className="relative flex shrink-0 h-full z-20">
      {/* ── Icon Rail ── */}
      <div className="flex flex-col w-11 shrink-0 bg-light-bg dark:bg-dark-bg border-r border-light-border dark:border-dark-border">
        {/* Transform tools */}
        <div className="flex flex-col items-center gap-0.5 pt-2 pb-2">
          {TOOLS.map(tool => {
            const active = transformMode === tool.transform
            return (
              <button
                key={tool.id}
                onClick={() => setTransformMode(tool.transform)}
                title={tool.label}
                className={`w-8 h-8 flex items-center justify-center rounded-lg transition-all duration-150 ${
                  active
                    ? 'bg-light-primary text-white shadow-sm'
                    : 'text-light-muted dark:text-dark-muted hover:text-light-text dark:hover:text-dark-text hover:bg-light-surface dark:hover:bg-dark-surface'
                }`}
              >
                {tool.icon}
              </button>
            )
          })}
        </div>

        {/* Divider */}
        <div className="mx-auto w-5 h-px bg-light-border dark:bg-dark-border" />

        {/* Panel tabs */}
        <div className="flex flex-col items-center gap-0.5 pt-2">
          {PANELS.map(panel => {
            const active = sidebarTab === panel.id && sidebarExpanded
            return (
              <button
                key={panel.id}
                onClick={() => handlePanelClick(panel.id)}
                title={panel.label}
                className={`w-8 h-8 flex items-center justify-center rounded-lg transition-all duration-150 ${
                  active
                    ? 'bg-light-surface dark:bg-dark-surface text-light-primary border border-light-primary/20'
                    : 'text-light-muted dark:text-dark-muted hover:text-light-text dark:hover:text-dark-text hover:bg-light-surface dark:hover:bg-dark-surface border border-transparent'
                }`}
              >
                {panel.icon}
              </button>
            )
          })}
        </div>
      </div>

      {/* ── Slide-out Panel ── */}
      <div
        className={`flex flex-col bg-light-bg dark:bg-dark-bg border-r border-light-border dark:border-dark-border overflow-hidden transition-all duration-200 ease-out`}
        style={{ width: sidebarExpanded ? 228 : 0, opacity: sidebarExpanded ? 1 : 0 }}
      >
        {/* Panel header */}
        <div className="flex items-center justify-between px-3 py-2 border-b border-light-border dark:border-dark-border shrink-0">
          <span className="text-[10px] font-bold tracking-widest uppercase text-light-muted dark:text-dark-muted">
            {currentPanel?.label}
          </span>
          <button
            onClick={() => setSidebarExpanded(false)}
            className="p-1 rounded text-light-muted dark:text-dark-muted hover:text-light-text dark:hover:text-dark-text transition-colors"
          >
            <ChevronLeft size={13} />
          </button>
        </div>

        {/* Panel content — always rendered so state is preserved, but clipped */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden custom-scrollbar min-w-[228px]">
          {sidebarExpanded && <PanelContent id={sidebarTab} />}
        </div>
      </div>
    </div>
  )
}
