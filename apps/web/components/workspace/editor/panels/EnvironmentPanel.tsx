// @ts-nocheck
/* eslint-disable */
'use client'
import React, { useState } from 'react'
import { Grid3x3, Eye, CloudFog, Monitor, Layers } from 'lucide-react'
import useStore from '../../../../store/editorStore'

const BACKGROUNDS = [
  { id: 'light',     label: 'Warm Canvas',  color: '#faf9f5' },
  { id: 'dark',      label: 'Dark Studio',  color: '#0C0C0E' },
  { id: 'dracula',   label: 'Slate',        color: '#282a36' },
  { id: 'ocean',     label: 'Ocean',        color: '#0f172a' },
  { id: 'sage',      label: 'Sage',         color: '#eef2ec' },
]

export default function EnvironmentPanel() {
  const envSettings = useStore(s => s.envSettings)
  const setEnvSettings = useStore(s => s.setEnvSettings)
  const setEditorTheme = useStore(s => s.setEditorTheme)

  const { showGrid, showAxes, fogEnabled, fogDensity, bgId, ambientInt, shadowsOn, toneMapping } = envSettings

  const handleBgSelect = (id) => {
    setEnvSettings({ bgId: id })
    
    if (id === 'light') {
      document.documentElement.classList.remove('dark')
      localStorage.setItem('theme', 'light')
      setEditorTheme(null)
    } else if (id === 'dark') {
      document.documentElement.classList.add('dark')
      localStorage.setItem('theme', 'dark')
      setEditorTheme(null)
    } else {
      setEditorTheme(id)
    }
  }

  const TONE_MAPS = ['none','linear','aces','reinhard','cineon']

  return (
    <div className="p-3 flex flex-col gap-4 font-sans">

      {/* Background */}
      <div>
        <span className="text-[9px] font-bold uppercase tracking-widest text-light-muted dark:text-dark-muted block mb-2">Background</span>
        <div className="grid grid-cols-5 gap-1.5">
          {BACKGROUNDS.map(bg => (
            <button
              key={bg.id}
              onClick={() => handleBgSelect(bg.id)}
              title={bg.label}
              className={`aspect-square rounded-lg border-2 transition-all duration-150 ${
                bgId === bg.id ? 'border-light-primary' : 'border-light-border dark:border-dark-border hover:border-light-primary/40'
              }`}
              style={{ background: bg.color }}
            />
          ))}
        </div>
        <span className="text-[9px] text-light-muted dark:text-dark-muted mt-1 block text-center">
          {BACKGROUNDS.find(b => b.id === bgId)?.label}
        </span>
      </div>

      {/* Toggles */}
      <div className="border-t border-light-border dark:border-dark-border pt-3 flex flex-col gap-2">
        <span className="text-[9px] font-bold uppercase tracking-widest text-light-muted dark:text-dark-muted block mb-1">Viewport</span>

        <Toggle icon={<Grid3x3 size={13} />} label="Grid" value={showGrid} onChange={v => setEnvSettings({ showGrid: v })} />
        <Toggle icon={<Layers size={13} />}  label="Shadow Maps" value={shadowsOn} onChange={v => setEnvSettings({ shadowsOn: v })} />
        <Toggle icon={<CloudFog size={13} />} label="Fog" value={fogEnabled} onChange={v => setEnvSettings({ fogEnabled: v })} />
        <Toggle icon={<Eye size={13} />}     label="Axes Helper" value={showAxes} onChange={v => setEnvSettings({ showAxes: v })} />

        {fogEnabled && (
          <div className="ml-5 flex flex-col gap-1">
            <div className="flex justify-between">
              <span className="text-[10px] text-light-muted dark:text-dark-muted">Density</span>
              <span className="text-[10px] font-mono text-light-text dark:text-dark-text">{fogDensity.toFixed(3)}</span>
            </div>
            <input
              type="range" min={0} max={0.1} step={0.001}
              value={fogDensity} onChange={e => setEnvSettings({ fogDensity: parseFloat(e.target.value) })}
              className="w-full h-1 bg-light-border dark:bg-dark-border rounded-full appearance-none cursor-pointer accent-light-primary"
            />
          </div>
        )}
      </div>

      {/* Ambient intensity */}
      <div className="border-t border-light-border dark:border-dark-border pt-3 flex flex-col gap-2">
        <span className="text-[9px] font-bold uppercase tracking-widest text-light-muted dark:text-dark-muted">Ambient Light</span>
        <div className="flex justify-between">
          <span className="text-[10px] text-light-muted dark:text-dark-muted">Intensity</span>
          <span className="text-[10px] font-mono text-light-text dark:text-dark-text">{ambientInt.toFixed(2)}</span>
        </div>
        <input
          type="range" min={0} max={3} step={0.05}
          value={ambientInt} onChange={e => setEnvSettings({ ambientInt: parseFloat(e.target.value) })}
          className="w-full h-1 bg-light-border dark:bg-dark-border rounded-full appearance-none cursor-pointer accent-light-primary"
        />
      </div>

      {/* Tone Mapping */}
      <div className="border-t border-light-border dark:border-dark-border pt-3 flex flex-col gap-2">
        <span className="text-[9px] font-bold uppercase tracking-widest text-light-muted dark:text-dark-muted block mb-1">
          <Monitor size={10} className="inline mr-1" />Tone Mapping
        </span>
        <div className="flex gap-1 flex-wrap">
          {TONE_MAPS.map(tm => (
            <button
              key={tm}
              onClick={() => setEnvSettings({ toneMapping: tm })}
              className={`px-2 py-1 text-[10px] rounded-md border capitalize transition-all duration-150 ${
                toneMapping === tm
                  ? 'border-light-primary bg-light-primary/8 text-light-primary'
                  : 'border-light-border dark:border-dark-border text-light-muted dark:text-dark-muted hover:text-light-text dark:hover:text-dark-text'
              }`}
            >
              {tm}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

function Toggle({ icon, label, value, onChange }) {
  return (
    <button
      onClick={() => onChange(!value)}
      className="flex items-center gap-2 group"
    >
      <div className={`relative w-7 h-4 rounded-full transition-colors duration-200 ${value ? 'bg-light-primary' : 'bg-light-border dark:bg-dark-border'}`}>
        <div className={`absolute top-0.5 w-3 h-3 bg-white rounded-full shadow transition-transform duration-200 ${value ? 'translate-x-3.5' : 'translate-x-0.5'}`} />
      </div>
      <span className={`text-[12px] flex items-center gap-1.5 ${value ? 'text-light-text dark:text-dark-text' : 'text-light-muted dark:text-dark-muted group-hover:text-light-text dark:group-hover:text-dark-text'} transition-colors`}>
        <span className={value ? 'text-light-primary' : ''}>{icon}</span>
        {label}
      </span>
    </button>
  )
}
