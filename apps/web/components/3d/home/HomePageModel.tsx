"use client"
import { useGLTF, Center } from '@react-three/drei'
import { useRef, useEffect } from 'react'
import * as THREE from 'three'
import gsap from 'gsap'
import { useThree } from '@react-three/fiber'

export function HomePageModel(props: any){

    const { scene } = useGLTF('/models/f-22_raptor.glb')
    const modelRef = useRef<THREE.Group>(null)

    // Finalized Coordinates
    const defaultPosition: [number, number, number] = [0.5, -16.0, -35.6]
    const defaultRotationY = 3.14
    const defaultRotation: [number, number, number] = [-0.32, defaultRotationY, 0.00]

    // State for interaction
    const isDragging = useRef(false)
    const previousMousePosition = useRef({ x: 0, y: 0 })
    const timeoutRef = useRef<NodeJS.Timeout | null>(null)

    const resetRotation = () => {
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
    }

    const triggerInteraction = () => {
        if (timeoutRef.current) clearTimeout(timeoutRef.current)
        if (modelRef.current) {
            gsap.killTweensOf(modelRef.current.rotation)
        }
        
        // Auto-revert after 1.5s of inactivity
        timeoutRef.current = setTimeout(() => {
            resetRotation()
        }, 1500)
    }

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
        
        // Only start drag if clicking inside the Hero canvas
        canvas.addEventListener('pointerdown', handlePointerDown)
        
        // These can stay on window so dragging doesn't break if mouse leaves the canvas bounds
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

useGLTF.preload('/models/f-22_raptor.glb')
