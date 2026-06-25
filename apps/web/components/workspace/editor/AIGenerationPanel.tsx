// @ts-nocheck
/* eslint-disable */
'use client'
import React, { useState, useRef, useEffect, useCallback } from 'react'
import {
  Sparkles, Send, X, Paperclip, ImageIcon, FileText,
  PanelRight, Maximize2, PanelRightOpen, Plus, ChevronDown,
} from 'lucide-react'
import { useAIGeneration } from '../../../hooks/useAIGeneration'

type ActionMode = 'chat' | 'text-to-3d' | 'image-to-3d'
type ViewMode   = 'floating' | 'sidebar' | 'fullscreen'

interface Message {
  id: string
  role: 'user' | 'ai'
  content: string
  status?: string
  tag?: string
}

const REPLIES = [
  'I can generate 3D models from text or images. Try the text-to-3D option below.',
  'Describe any object and I\'ll generate a 3D model for it.',
  'You can also attach an image to reconstruct it as a 3D model.',
  'Use the File menu to import existing GLTF / GLB files.',
  'Press ? for keyboard shortcuts.',
]

let replyIdx = 0
const nextReply = () => REPLIES[replyIdx++ % REPLIES.length]

const VIEW_MODES = [
  { id: 'floating' as ViewMode,   label: 'Floating',    icon: <PanelRightOpen size={13} /> },
  { id: 'sidebar'  as ViewMode,   label: 'Sidebar',     icon: <PanelRight size={13} /> },
  { id: 'fullscreen' as ViewMode, label: 'Full screen', icon: <Maximize2 size={13} /> },
]

const PROVIDERS = [
  { id: 'piapi', label: 'PiAPI' },
  { id: 'hf',    label: 'Hunyuan3D' },
  { id: 'tripo', label: 'Tripo3D' },
]

export default function AIGenerationPanel() {
  const [isOpen, setIsOpen]         = useState(false)
  const [viewMode, setViewMode]     = useState<ViewMode>('floating')
  const [viewDrop, setViewDrop]     = useState(false)
  const [actionMode, setActionMode] = useState<ActionMode>('chat')
  const [actionDrop, setActionDrop] = useState(false)
  const [provider, setProvider]     = useState<'piapi' | 'hf' | 'tripo'>('piapi')
  const [provDrop, setProvDrop]     = useState(false)
  const [prompt, setPrompt]         = useState('')
  const [file, setFile]             = useState<File | null>(null)
  const [messages, setMessages]     = useState<Message[]>([
    { id: '0', role: 'ai', content: 'How can I help? Describe a 3D model, attach an image, or just chat.' },
  ])

  const fileRef    = useRef<HTMLInputElement>(null)
  const chatEndRef = useRef<HTMLDivElement>(null)

  const { isGenerating, generationStatus, startGeneration } = useAIGeneration()

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  useEffect(() => {
    if (isGenerating && generationStatus) {
      setMessages(prev => {
        const last = prev[prev.length - 1]
        if (last?.role === 'ai' && last.status != null) {
          return [...prev.slice(0, -1), { ...last, status: generationStatus }]
        }
        return [...prev, { id: Date.now().toString(), role: 'ai', content: '', status: generationStatus }]
      })
    } else if (!isGenerating && messages[messages.length - 1]?.status != null) {
      setMessages(prev => [
        ...prev.slice(0, -1),
        { id: Date.now().toString(), role: 'ai', content: '✓ Model generated and added to scene.' },
      ])
    }
  }, [isGenerating, generationStatus])

  const send = useCallback(async () => {
    if (!prompt.trim() && !file) return

    const content = file ? `[Image] ${file.name}${prompt ? ' — ' + prompt : ''}` : prompt
    const tag = actionMode !== 'chat'
      ? (actionMode === 'text-to-3d' ? 'Text → 3D' : 'Image → 3D')
      : undefined

    setMessages(prev => [...prev, { id: Date.now().toString(), role: 'user', content, tag }])

    const p = prompt
    const f = file
    setPrompt('')
    setFile(null)

    if (actionMode === 'chat') {
      setTimeout(() => {
        setMessages(prev => [...prev, { id: Date.now().toString(), role: 'ai', content: nextReply() }])
      }, 380)
      return
    }

    await startGeneration(p, f, provider)
  }, [prompt, file, actionMode, provider, startGeneration])

  const handleFile = (e: any) => {
    e.preventDefault()
    const f = 'dataTransfer' in e ? e.dataTransfer.files[0] : e.target?.files?.[0]
    if (f) { setFile(f); setActionMode('image-to-3d') }
  }

  const onKey = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send() }
  }

  const placeholder =
    actionMode === 'text-to-3d'  ? 'Describe the 3D model to generate…'
    : actionMode === 'image-to-3d' ? 'Describe the image (optional)…'
    : 'Ask anything…'

  const triggerBtn = (
    <button
      onClick={() => setIsOpen(true)}
      className="absolute bottom-6 right-6 w-11 h-11 bg-light-primary text-white rounded-full flex items-center justify-center shadow-lg hover:scale-105 active:scale-95 transition-all duration-150 z-[60]"
      title="Ask AI"
    >
      <Sparkles size={18} />
    </button>
  )

  if (!isOpen) return triggerBtn

  const panelContents = (
    <>
      <Header
        viewMode={viewMode} viewDrop={viewDrop} setViewDrop={setViewDrop} setViewMode={setViewMode}
        provider={provider} setProvider={setProvider} provDrop={provDrop} setProvDrop={setProvDrop}
        onClose={() => setIsOpen(false)}
      />
      <Messages messages={messages} isGenerating={isGenerating} chatEndRef={chatEndRef} />
      <Composer
        prompt={prompt} setPrompt={setPrompt}
        file={file} setFile={setFile}
        fileRef={fileRef} handleFile={handleFile}
        actionMode={actionMode} setActionMode={setActionMode}
        actionDrop={actionDrop} setActionDrop={setActionDrop}
        isGenerating={isGenerating} send={send} onKey={onKey}
        placeholder={placeholder}
      />
    </>
  )

  if (viewMode === 'sidebar') {
    return (
      <div className="absolute top-0 right-0 h-full w-[320px] flex flex-col bg-light-bg dark:bg-dark-bg border-l border-light-border dark:border-dark-border shadow-2xl z-[60]">
        {panelContents}
      </div>
    )
  }

  if (viewMode === 'fullscreen') {
    return (
      <div className="fixed inset-0 flex flex-col bg-light-bg dark:bg-dark-bg z-[100]">
        <div className="flex-1 flex flex-col max-w-3xl mx-auto w-full pt-12 pb-8 px-6">
          {panelContents}
        </div>
      </div>
    )
  }

  return (
    <div className="absolute bottom-6 right-6 w-[340px] max-h-[560px] flex flex-col bg-light-bg dark:bg-dark-bg backdrop-blur-xl border border-light-border dark:border-dark-border rounded-2xl shadow-2xl overflow-hidden z-[60]">
      {panelContents}
    </div>
  )
}

// ── Header ────────────────────────────────────────────────────────────────────

function Header({ viewMode, viewDrop, setViewDrop, setViewMode, provider, setProvider, provDrop, setProvDrop, onClose }) {
  const viewRef = useRef<HTMLDivElement>(null)
  const provRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const close = (e) => {
      if (viewRef.current && !viewRef.current.contains(e.target)) setViewDrop(false)
      if (provRef.current && !provRef.current.contains(e.target)) setProvDrop(false)
    }
    document.addEventListener('mousedown', close)
    return () => document.removeEventListener('mousedown', close)
  }, [])

  const currentProvider = PROVIDERS.find(p => p.id === provider)

  return (
    <div className="flex items-center justify-between px-4 py-3 shrink-0">
      <div className="flex items-center gap-2">
        <Sparkles size={14} className="text-light-primary" />
        <span className="text-xs font-semibold text-light-text dark:text-dark-text">Ask AI</span>
      </div>

      <div className="flex items-center gap-1">
        {/* Provider */}
        <div className="relative" ref={provRef}>
          <button
            onClick={() => { setProvDrop(v => !v); setViewDrop(false) }}
            className="flex items-center gap-1 px-2 py-1 text-[10px] text-light-muted dark:text-dark-muted hover:text-light-text dark:hover:text-dark-text rounded-md hover:bg-light-border/40 dark:hover:bg-dark-border/40 transition-colors"
          >
            {currentProvider?.label}
            <ChevronDown size={10} className={`transition-transform ${provDrop ? 'rotate-180' : ''}`} />
          </button>
          {provDrop && (
            <div className="absolute top-full right-0 mt-1 w-32 bg-light-bg dark:bg-dark-bg border border-light-border dark:border-dark-border rounded-xl shadow-xl py-1 z-50">
              {PROVIDERS.map(p => (
                <button
                  key={p.id}
                  onClick={() => { setProvider(p.id as any); setProvDrop(false) }}
                  className={`w-full text-left px-3 py-1.5 text-[11px] transition-colors ${
                    provider === p.id
                      ? 'text-light-primary'
                      : 'text-light-text dark:text-dark-text hover:bg-light-bg dark:hover:bg-dark-bg'
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* View mode */}
        <div className="relative" ref={viewRef}>
          <button
            onClick={() => { setViewDrop(v => !v); setProvDrop(false) }}
            className="p-1.5 text-light-muted dark:text-dark-muted hover:text-light-text dark:hover:text-dark-text transition-colors rounded-lg hover:bg-light-border/40 dark:hover:bg-dark-border/40"
            title="View mode"
          >
            {viewMode === 'sidebar' ? <PanelRight size={14} /> : viewMode === 'fullscreen' ? <Maximize2 size={14} /> : <PanelRightOpen size={14} />}
          </button>
          {viewDrop && (
            <div className="absolute top-full right-0 mt-1 w-36 bg-light-bg dark:bg-dark-bg border border-light-border dark:border-dark-border rounded-xl shadow-xl py-1 z-50">
              {VIEW_MODES.map(v => (
                <button
                  key={v.id}
                  onClick={() => { setViewMode(v.id); setViewDrop(false) }}
                  className={`w-full flex items-center gap-2 px-3 py-1.5 text-[11px] transition-colors ${
                    viewMode === v.id ? 'text-light-primary' : 'text-light-text dark:text-dark-text hover:bg-light-bg dark:hover:bg-dark-bg'
                  }`}
                >
                  {v.icon} {v.label}
                  {viewMode === v.id && <span className="ml-auto">✓</span>}
                </button>
              ))}
            </div>
          )}
        </div>

        <button
          onClick={onClose}
          className="p-1.5 text-light-muted dark:text-dark-muted hover:text-light-text dark:hover:text-dark-text transition-colors rounded-lg hover:bg-light-border/40 dark:hover:bg-dark-border/40"
        >
          <X size={14} />
        </button>
      </div>
    </div>
  )
}

// ── Messages ──────────────────────────────────────────────────────────────────

function Messages({ messages, isGenerating, chatEndRef }) {
  return (
    <div className="flex-1 overflow-y-auto px-3 py-3 flex flex-col gap-3 min-h-[180px] custom-scrollbar">
      {messages.map(msg => (
        <div key={msg.id} className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'} max-w-[88%] ${msg.role === 'user' ? 'self-end' : 'self-start'}`}>
          {msg.tag && (
            <span className="text-[9px] text-light-muted dark:text-dark-muted mb-0.5 px-0.5 font-medium tracking-widest uppercase">
              {msg.tag}
            </span>
          )}
          <div className={`px-3 py-2 rounded-2xl text-[12px] leading-relaxed ${
            msg.role === 'user'
              ? 'bg-light-primary text-white rounded-br-sm'
              : 'bg-light-surface dark:bg-dark-surface text-light-text dark:text-dark-text rounded-bl-sm border border-light-border dark:border-dark-border'
          }`}>
            {msg.status ? (
              <div className="flex flex-col gap-1.5">
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-light-primary animate-pulse shrink-0" />
                  <span className="text-[10px] font-mono text-light-primary">{msg.status}</span>
                </div>
                <div className="w-full bg-light-border dark:bg-dark-border rounded-full h-0.5 overflow-hidden">
                  <div className="h-full bg-light-primary rounded-full animate-pulse" style={{ width: '60%' }} />
                </div>
              </div>
            ) : msg.content}
          </div>
        </div>
      ))}

      {isGenerating && !messages[messages.length - 1]?.status && (
        <div className="self-start px-3 py-2.5 bg-light-surface dark:bg-dark-surface border border-light-border dark:border-dark-border rounded-2xl rounded-bl-sm flex gap-1.5 items-center">
          {['-0.3s', '-0.15s', '0s'].map(d => (
            <span key={d} className="w-1.5 h-1.5 bg-light-muted dark:bg-dark-muted rounded-full animate-bounce" style={{ animationDelay: d }} />
          ))}
        </div>
      )}

      <div ref={chatEndRef} />
    </div>
  )
}

// ── Composer ──────────────────────────────────────────────────────────────────

function Composer({ prompt, setPrompt, file, setFile, fileRef, handleFile, actionMode, setActionMode, actionDrop, setActionDrop, isGenerating, send, onKey, placeholder }) {
  const dropRef   = useRef<HTMLDivElement>(null)
  const canSend   = (prompt.trim().length > 0 || !!file) && !isGenerating

  useEffect(() => {
    const close = (e) => { if (dropRef.current && !dropRef.current.contains(e.target)) setActionDrop(false) }
    document.addEventListener('mousedown', close)
    return () => document.removeEventListener('mousedown', close)
  }, [])

  const ACTION_OPTS = [
    { id: 'chat',         label: 'Chat',        icon: <Sparkles size={12} /> },
    { id: 'text-to-3d',   label: 'Text → 3D',   icon: <FileText size={12} /> },
    { id: 'image-to-3d',  label: 'Image → 3D',  icon: <ImageIcon size={12} /> },
  ]

  const current = ACTION_OPTS.find(a => a.id === actionMode)!

  return (
    <div className="px-3 pb-3 pt-1 shrink-0">
      {/* File preview strip */}
      {file && (
        <div className="mb-2 flex items-center gap-2 px-3 py-1.5 bg-light-bg dark:bg-dark-bg rounded-xl border border-light-border dark:border-dark-border">
          <ImageIcon size={12} className="text-light-primary shrink-0" />
          <span className="flex-1 text-[11px] text-light-text dark:text-dark-text truncate">{file.name}</span>
          <button onClick={() => setFile(null)} className="text-light-muted hover:text-red-400 transition-colors">
            <X size={11} />
          </button>
        </div>
      )}

      {/* Main composer box */}
      <div className={`rounded-2xl border transition-all duration-150 ${
        prompt.length > 0 || file
          ? 'border-light-primary/40 bg-light-surface dark:bg-dark-surface shadow-sm'
          : 'border-light-border dark:border-dark-border bg-light-surface dark:bg-dark-surface'
      }`}>
        {/* Textarea */}
        <div className="px-4 pt-3 pb-2">
          <textarea
            value={prompt}
            onChange={e => setPrompt(e.target.value)}
            onKeyDown={onKey}
            placeholder={placeholder}
            disabled={isGenerating}
            rows={1}
            className="w-full bg-transparent text-[13px] text-light-text dark:text-dark-text outline-none resize-none placeholder:text-light-muted/50 dark:placeholder:text-dark-muted/50 max-h-28 min-h-[22px] leading-relaxed"
          />
        </div>

        {/* Bottom action bar */}
        <div className="flex items-center px-2 pb-2 gap-1">
          {/* Mode selector */}
          <div className="relative" ref={dropRef}>
            <button
              onClick={() => setActionDrop(v => !v)}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-[11px] font-medium transition-all duration-150 ${
                actionMode !== 'chat'
                  ? 'bg-light-primary/10 text-light-primary border border-light-primary/20'
                  : 'text-light-muted dark:text-dark-muted hover:text-light-text dark:hover:text-dark-text hover:bg-light-border/50 dark:hover:bg-dark-border/50'
              }`}
            >
              {current.icon}
              <span>{current.label}</span>
              <ChevronDown size={10} className={`transition-transform ${actionDrop ? 'rotate-180' : ''}`} />
            </button>

            {actionDrop && (
              <div className="absolute bottom-full left-0 mb-1 w-40 bg-light-surface dark:bg-dark-surface border border-light-border dark:border-dark-border rounded-xl shadow-xl py-1 z-50 animate-in fade-in slide-in-from-bottom-2 duration-100">
                {ACTION_OPTS.map(opt => (
                  <button
                    key={opt.id}
                    onClick={() => { setActionMode(opt.id as ActionMode); setActionDrop(false) }}
                    className={`w-full flex items-center gap-2.5 px-3 py-2 text-[12px] transition-colors ${
                      actionMode === opt.id
                        ? 'text-light-primary bg-light-primary/5'
                        : 'text-light-text dark:text-dark-text hover:bg-light-bg dark:hover:bg-dark-bg'
                    }`}
                  >
                    {opt.icon}
                    {opt.label}
                    {actionMode === opt.id && <span className="ml-auto text-[10px]">✓</span>}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Attach */}
          <button
            onClick={() => fileRef.current?.click()}
            className="p-1.5 text-light-muted dark:text-dark-muted hover:text-light-primary transition-colors rounded-lg hover:bg-light-border/40 dark:hover:bg-dark-border/40"
            title="Attach image"
          >
            <Paperclip size={14} />
          </button>
          <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFile} />

          <div className="flex-1" />

          {/* Send */}
          <button
            onClick={send}
            disabled={!canSend}
            className={`w-8 h-8 flex items-center justify-center rounded-xl transition-all duration-150 ${
              canSend
                ? 'bg-light-primary text-white shadow-sm hover:opacity-90 active:scale-95'
                : 'bg-light-border dark:bg-dark-border text-light-muted cursor-not-allowed'
            }`}
          >
            <Send size={13} />
          </button>
        </div>
      </div>
    </div>
  )
}
