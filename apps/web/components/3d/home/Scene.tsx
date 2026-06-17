"use client"
import { Canvas } from '@react-three/fiber'
import { Environment } from '@react-three/drei'
import { HomePageModel } from './HomePageModel'
import { Suspense } from 'react'

export function Scene() {
    return (
        <Canvas camera={{ position: [0, 2, 5], fov: 25 }}>
            <Environment preset="city" />

            <Suspense fallback={null}>
                <HomePageModel />
            </Suspense>
        </Canvas>
    )
}
