"use client"
import { Canvas } from '@react-three/fiber'
import { Environment } from '@react-three/drei'
import { HomePageModel } from './HomePageModel'
import { Suspense } from 'react'

export function Scene() {
    return (
        <Canvas camera={{ position: [0, 2, 5], fov: 25 }} dpr={[1, 1.5]} performance={{ min: 0.5 }}>
            <Environment preset="city" resolution={256} />

            <Suspense fallback={null}>
                <HomePageModel />
            </Suspense>
        </Canvas>
    )
}
