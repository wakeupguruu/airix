// @ts-nocheck
/* eslint-disable */
import React from 'react'
import useStore from '../../../store/editorStore'

export default function ViewportInfo() {
  const sceneObjects = useStore((s) => s.sceneObjects)
  const materialMode = useStore((s) => s.materialMode)

  const vertEst = sceneObjects.reduce((acc, o) => {
    if (o.type === 'csg_result' && o.geometry) return acc + (o.geometry.attributes?.position?.count || 0)
    if (o.type === 'gltf') return acc + 2000
    const t = o.type
    if (t === 'sphere') return acc + 528
    if (t === 'cylinder' || t === 'cone') return acc + 66
    if (t === 'torus') return acc + 1600
    if (t === 'torusknot') return acc + 512
    return acc + 24
  }, 0)

  const triEst = Math.round(vertEst * 0.67)

  return (
    <div className="absolute bottom-10 left-4 flex items-center gap-3 text-[10px] font-mono text-light-muted dark:text-dark-muted leading-relaxed pointer-events-none z-15 select-none drop-shadow-sm">
      <span>{sceneObjects.length} objects / {vertEst} vertices / {triEst} tris</span>
      <div className="flex items-center gap-1.5">
        <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
        <span>0.5ms | {materialMode} mode</span>
      </div>
    </div>
  )
}
