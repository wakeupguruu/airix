/* eslint-disable react/no-unknown-property */
"use client"
import { useGLTF, Center } from '@react-three/drei'
import { useRef, useLayoutEffect, JSX } from 'react'
import * as THREE from 'three'
import { useFrame } from '@react-three/fiber'

export function FeaturesModel(props: JSX.IntrinsicElements['group']) {
    const { scene } = useGLTF('/models/Jet_Turbine_draco.glb')
    const modelRef = useRef<THREE.Group>(null)

    // Finalized production values
    const position: [number, number, number] = [0, 0, 0]
    const rotation: [number, number, number] = [0, 0, 0]
    const scale = 0.02
    const wireframeOpacity = 0.35
    const color = '#c57e66'

    // Apply wireframe material — dispose old materials to prevent memory leak
    useLayoutEffect(() => {
        const oldMaterials: THREE.Material[] = []

        scene.traverse((child) => {
            if ((child as THREE.Mesh).isMesh) {
                const mesh = child as THREE.Mesh
                if (mesh.material) {
                    // Collect old materials for disposal
                    if (Array.isArray(mesh.material)) {
                        oldMaterials.push(...mesh.material)
                    } else {
                        oldMaterials.push(mesh.material)
                    }

                    mesh.material = new THREE.MeshBasicMaterial({ 
                        color: new THREE.Color(color),
                        wireframe: true,
                        transparent: true,
                        opacity: wireframeOpacity
                    })
                }
            }
        })

        // Dispose old materials
        oldMaterials.forEach((mat) => mat.dispose())
    }, [scene, color, wireframeOpacity])

    // Gentle slow rotation
    useFrame((state, delta) => {
        if (modelRef.current) {
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
