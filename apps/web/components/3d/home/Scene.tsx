"use client"
import { Canvas } from '@react-three/fiber'
import { Environment } from '@react-three/drei'
import { HomePageModel } from './HomePageModel'
import { Suspense, useState, useEffect } from 'react'

export function Scene() {
    const [isMobile, setIsMobile] = useState(false)
    const [dynamicFov, setDynamicFov] = useState(25)

    useEffect(() => {
        const handleResize = () => {
            const w = window.innerWidth
            
            // DPR and Performance check
            setIsMobile(w < 768)

            // Multi-step FOV scaling for perfect responsive fitting
            if (w > 1400) {
                setDynamicFov(25) // Perfect PC
            } else if (w > 1024) {
                setDynamicFov(40) // Small laptop
            } 
             else if (w > 768) {
                setDynamicFov(56) // Tablet
            } else if (w > 480) {
                setDynamicFov(64) // Large Mobile / Landscape
            } else {
                setDynamicFov(72) // Small Mobile 
            }
        }
        
        handleResize()
        window.addEventListener('resize', handleResize)
        return () => window.removeEventListener('resize', handleResize)
    }, [])

    return (
        <Canvas 
            camera={{ position: [0, 2, 5], fov: dynamicFov }} 
            dpr={isMobile ? [1, 1] : [1, 1.5]} 
            performance={{ min: 0.5 }}
            gl={{
                antialias: !isMobile,
                powerPreference: "high-performance",
                alpha: true
            }}
        >
            <Environment preset="city" resolution={256} />

            <Suspense fallback={null}>
                <HomePageModel />
            </Suspense>
        </Canvas>
    )
}
