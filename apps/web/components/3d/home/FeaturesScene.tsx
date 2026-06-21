"use client"
import { Canvas } from '@react-three/fiber'
import { AdaptiveDpr, OrbitControls } from '@react-three/drei'
import { FeaturesModel } from './FeaturesModel'
import { Suspense, useEffect, useRef, useState } from 'react'

export function FeaturesScene() {
    const containerRef = useRef<HTMLDivElement>(null)
    const [isInView, setIsInView] = useState(false)

    // Only render when the section is visible on screen
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
        <div ref={containerRef} className="w-full h-full relative z-20">
            <Suspense fallback={null}>
                <Canvas
                    camera={{ position: [0, 0, 8], fov: 45 }}
                    dpr={[1, 1.5]}
                    frameloop={isInView ? "always" : "never"}
                    gl={{
                        antialias: false,
                        powerPreference: "low-power",
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
