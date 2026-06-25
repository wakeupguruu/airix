// @ts-nocheck
/* eslint-disable */
import React, { Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, Grid, GizmoHelper, GizmoViewport, PerformanceMonitor } from '@react-three/drei'
import { useThree } from '@react-three/fiber'
import { GLTFExporter } from 'three/examples/jsm/exporters/GLTFExporter.js'
import SceneObjects from './SceneObjects'
import useStore from '../../../store/editorStore'

function LoadingFallback() {
  return (
    <mesh>
      <sphereGeometry args={[0.3, 16, 16]} />
      <meshBasicMaterial color="#cc785c" wireframe />
    </mesh>
  )
}

const BACKGROUNDS: Record<string, string> = {
  light: '#faf9f5',
  dark: '#0C0C0E',
  dracula: '#282a36',
  ocean: '#0f172a',
  sage: '#eef2ec'
}

export default function Viewport() {
  const setSelectedIds = useStore((s) => s.setSelectedIds)
  const envSettings = useStore((s) => s.envSettings)
  const [dpr, setDpr]  = React.useState(1.5)
  const containerRef   = React.useRef(null)

  const bgColor = BACKGROUNDS[envSettings.bgId] || '#0C0C0E'
  const isDarkBg = envSettings.bgId === 'dark' || envSettings.bgId === 'ocean' || envSettings.bgId === 'dracula'

  return (
    <div ref={containerRef} className="w-full h-full">
    <Canvas
      camera={{ position: [6, 5, 8], fov: 50, near: 0.1, far: 1000 }}
      gl={{ antialias: true, powerPreference: 'high-performance', stencil: false, alpha: true }}
      dpr={dpr}
      shadows={envSettings.shadowsOn}
      style={{ width: '100%', height: '100%', background: bgColor }}
      onPointerMissed={() => setSelectedIds([])}
    >
      <PerformanceMonitor onIncline={() => setDpr(2)} onDecline={() => setDpr(1)} />

      {envSettings.fogEnabled && (
        <fog attach="fog" color={bgColor} near={10} far={10 + (1 / envSettings.fogDensity)} />
      )}

      {envSettings.showAxes && <axesHelper args={[5]} />}

      <Suspense fallback={<LoadingFallback />}>
        <SceneLighting intensity={envSettings.ambientInt} />
        {envSettings.showGrid && <SceneGrid isDark={isDarkBg} />}
        <SceneObjects />
        <SceneControls isDark={isDarkBg} />
        <SceneExporter />
      </Suspense>
    </Canvas>
    </div>
  )
}

function SceneLighting({ intensity }) {
  return (
    <>
      <ambientLight intensity={intensity} color="#ffffff" />
      <directionalLight position={[8, 14, 6]}  intensity={1.2} color="#fffaf5" castShadow />
      <directionalLight position={[-6, 4, -8]} intensity={0.3} color="#8898c0" />
      <hemisphereLight color="#ffffff" groundColor="#444444" intensity={intensity * 0.5} />
    </>
  )
}

function SceneGrid({ isDark }) {
  const gridColor = isDark ? "#282828" : "#e8e8e8";
  return (
    <Grid
      position={[0, -0.01, 0]}
      args={[40, 40]}
      cellSize={1}
      cellThickness={1}
      cellColor={gridColor}
      sectionSize={5}
      sectionThickness={1}
      sectionColor={gridColor}
      fadeDistance={50}
      fadeStrength={1.5}
      infiniteGrid
    />
  )
}

function SceneControls({ isDark }) {
  return (
    <>
      <OrbitControls
        makeDefault
        enableDamping
        dampingFactor={0.08}
        minDistance={2}
        maxDistance={50}
        maxPolarAngle={Math.PI * 0.85}
      />
      <GizmoHelper alignment="top-right" margin={[70, 70]}>
        <GizmoViewport
          axisColors={['#c96442', '#5a8a4a', '#3898ec']}
          labelColor={isDark ? '#faf9f5' : '#141413'}
        />
      </GizmoHelper>
    </>
  )
}

function SceneExporter() {
  const { scene } = useThree()

  React.useEffect(() => {
    const handleExport = (e) => {
      const isBinary = e.detail === 'glb'
      const exporter = new GLTFExporter()
      const target   = useStore.getState().exportGroupRef || scene
      exporter.parse(
        target,
        (gltf) => {
          const blob = new Blob(
            [isBinary ? gltf : JSON.stringify(gltf, null, 2)],
            { type: isBinary ? 'application/octet-stream' : 'text/plain' }
          )
          const url  = URL.createObjectURL(blob)
          const link = document.createElement('a')
          link.href     = url
          link.download = `airix_export.${isBinary ? 'glb' : 'gltf'}`
          link.click()
          URL.revokeObjectURL(url)
        },
        (err) => console.error('Export failed:', err),
        { binary: isBinary }
      )
    }

    window.addEventListener('export-scene', handleExport)
    return () => window.removeEventListener('export-scene', handleExport)
  }, [scene])

  return null
}
