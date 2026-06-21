/* eslint-disable react/no-unknown-property */
"use client"
import { useGLTF, Center } from '@react-three/drei'
import { useRef, useEffect, useCallback, JSX } from 'react'
import * as THREE from 'three'
import gsap from 'gsap'
import { useThree } from '@react-three/fiber'

export function HomePageModel(props: JSX.IntrinsicElements['group']){

    const { scene } = useGLTF('/models/f-22_raptor_draco.glb')
    const modelRef = useRef<THREE.Group>(null)

    // Finalized Coordinates
    const defaultPosition: [number, number, number] = [0.5, -16.0, -35.6]
    const defaultRotationY = 3.14
    const defaultRotation: [number, number, number] = [-0.32, defaultRotationY, 0.00]

    // State for interaction
    const isDragging = useRef(false)
    const previousMousePosition = useRef({ x: 0, y: 0 })
    const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

    const resetRotation = useCallback(() => {
        if (!modelRef.current) return
        
        const current = modelRef.current.rotation.y
        const target = defaultRotationY
        
        let diff = (target - current) % (Math.PI * 2)
        if (diff < -Math.PI) diff += Math.PI * 2
        if (diff > Math.PI) diff -= Math.PI * 2
        
        const closestTarget = current + diff

        gsap.to(modelRef.current.rotation, {
            y: closestTarget,
            duration: 1.5,
            ease: "power2.out"
        })
    }, [])

    const triggerInteraction = useCallback(() => {
        if (timeoutRef.current) clearTimeout(timeoutRef.current)
        if (modelRef.current) {
            gsap.killTweensOf(modelRef.current.rotation)
        }
        
        // Auto-revert after 1.5s of inactivity
        timeoutRef.current = setTimeout(() => {
            resetRotation()
        }, 1500)
    }, [resetRotation])

    const { gl } = useThree()

    useEffect(() => {
        const handlePointerDown = (e: PointerEvent) => {
            isDragging.current = true
            previousMousePosition.current = { x: e.clientX, y: e.clientY }
            triggerInteraction()
        }

        const handlePointerMove = (e: PointerEvent) => {
            if (!isDragging.current || !modelRef.current) return
            const deltaX = e.clientX - previousMousePosition.current.x
            modelRef.current.rotation.y += deltaX * 0.01
            previousMousePosition.current = { x: e.clientX, y: e.clientY }
            triggerInteraction()
        }

        const handlePointerUp = () => {
            if (isDragging.current) {
                isDragging.current = false
                triggerInteraction()
            }
        }

        const canvas = gl.domElement
        
        canvas.addEventListener('pointerdown', handlePointerDown)
        window.addEventListener('pointermove', handlePointerMove)
        window.addEventListener('pointerup', handlePointerUp)

        return () => {
            canvas.removeEventListener('pointerdown', handlePointerDown)
            window.removeEventListener('pointermove', handlePointerMove)
            window.removeEventListener('pointerup', handlePointerUp)
            if (timeoutRef.current) clearTimeout(timeoutRef.current)
        }
    }, [gl, triggerInteraction])

    return (
        <group 
            ref={modelRef}
            position={defaultPosition} 
            rotation={defaultRotation} 
            {...props}
        >
            <Center>
                <primitive object={scene} scale={1} />
            </Center>
        </group>
    )
}

useGLTF.preload('/models/f-22_raptor_draco.glb')
