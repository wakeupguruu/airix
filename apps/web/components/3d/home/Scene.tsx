"use client"
import { Canvas } from '@react-three/fiber'
import { Environment } from '@react-three/drei'
import { HomePageModel } from './HomePageModel'
import { Suspense, useState, useEffect, useRef } from 'react'

export function Scene() {
    const [isMobile, setIsMobile] = useState(false)
    const [dynamicFov, setDynamicFov] = useState(25)
    const containerRef = useRef<HTMLDivElement>(null)
    const [isInView, setIsInView] = useState(true)

    useEffect(() => {
        const handleResize = () => {
            const w = window.innerWidth
            setIsMobile(w < 768)

            if (w > 1400) {
                setDynamicFov(25)
            } else if (w > 1024) {
                setDynamicFov(40)
            } else if (w > 768) {
                setDynamicFov(56)
            } else if (w > 480) {
                setDynamicFov(64)
            } else {
                setDynamicFov(72)
            }
        }
        
        handleResize()
        window.addEventListener('resize', handleResize)
        return () => window.removeEventListener('resize', handleResize)
    }, [])

    // Pause rendering when scrolled off-screen
    useEffect(() => {
        const el = containerRef.current
        if (!el) return

        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0]) setIsInView(entries[0].isIntersecting)
            },
            { threshold: 0, rootMargin: "100px" }
        )
        observer.observe(el)
        return () => observer.disconnect()
    }, [])

    return (
        <div ref={containerRef} className="w-full h-full">
            <Canvas 
                camera={{ position: [0, 2, 5], fov: dynamicFov }} 
                dpr={isMobile ? [1, 1] : [1, 1.5]} 
                performance={{ min: 0.5 }}
                frameloop={isInView ? "always" : "never"}
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
        </div>
    )
}
