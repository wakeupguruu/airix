// @ts-nocheck
/* eslint-disable */
import React from 'react'
import ViewportInfo from './ViewportInfo'
import AIGenerationPanel from './AIGenerationPanel'

export default function ViewportOverlay() {
  return (
    <div className="absolute inset-0 pointer-events-none z-10">
      <div className="pointer-events-auto">
        <AIGenerationPanel />
      </div>
      <ViewportInfo />
    </div>
  )
}
