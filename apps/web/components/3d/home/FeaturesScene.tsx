"use client"
import { Canvas } from '@react-three/fiber'
import { AdaptiveDpr, OrbitControls } from '@react-three/drei'
import { FeaturesModel } from './FeaturesModel'
import { Suspense } from 'react'

export function FeaturesScene() {
    return (
        <div className="w-full h-full relative z-20">
            <Suspense fallback={null}>
                <Canvas
                    camera={{ position: [0, 0, 8], fov: 45 }}
                    dpr={[1, 1]} // Keep DPR low for lightweight wireframe
                    gl={{
                        antialias: false,
                        powerPreference: "low-power", // Lightweight as requested
                        alpha: true,
                    }}
                >
                    <OrbitControls makeDefault enableZoom={true} enablePan={true} />
                    <AdaptiveDpr pixelated />
                    <FeaturesModel />
                </Canvas>
            </Suspense>
        </div>
    )
}
