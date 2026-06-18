"use client"
import { useGLTF, Center } from '@react-three/drei'
import { useRef, useLayoutEffect } from 'react'
import * as THREE from 'three'
import { useFrame } from '@react-three/fiber'

export function FeaturesModel(props: any) {
    const { scene } = useGLTF('/models/Jet_Turbine_draco.glb')
    const modelRef = useRef<THREE.Group>(null)

    // Finalized production values
    const position: [number, number, number] = [0, 0, 0]
    const rotation: [number, number, number] = [0, 0, 0]
    const scale = 0.02
    const wireframeOpacity = 0.35
    const color = '#c57e66'
    const autoRotate = true

    // Apply wireframe material
    useLayoutEffect(() => {
        scene.traverse((child) => {
            if ((child as THREE.Mesh).isMesh) {
                const mesh = child as THREE.Mesh
                if (mesh.material) {
                    // Create a lightweight wireframe material
                    mesh.material = new THREE.MeshBasicMaterial({ 
                        color: new THREE.Color(color),
                        wireframe: true,
                        transparent: true,
                        opacity: wireframeOpacity
                    })
                }
            }
        })
    }, [scene, color, wireframeOpacity])

    // Gentle slow rotation
    useFrame((state, delta) => {
        if (modelRef.current && autoRotate) {
            modelRef.current.rotation.y += delta * 0.4
            modelRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.5) * 0.1
        }
    })

    return (
        <group 
            ref={modelRef} 
            position={position}
            rotation={rotation}
            scale={scale}
            {...props}
        >
            <Center>
                <primitive object={scene} />
            </Center>
        </group>
    )
}

// Preload the model
useGLTF.preload('/models/Jet_Turbine_draco.glb')
