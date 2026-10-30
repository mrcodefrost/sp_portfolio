"use client"


import React, {useState, useRef, useEffect, Suspense} from 'react'
import {Canvas, useFrame} from '@react-three/fiber'
import {Points, PointMaterial} from '@react-three/drei'
// @ts-ignore
import * as random from 'maath/random/dist/maath-random.esm'


const StarBackground = (props: any) => {
    const ref:any = useRef(null)
    const [sphere] = useState(() =>
        random.inSphere(new Float32Array(5001), {radius: 1.2})
);

    useFrame((state, delta) => {
        if (!ref.current) return
        ref.current.rotation.x -= delta/10;
        ref.current.rotation.y -= delta/15;

})
  return (
    <group rotation={[0,0, Math.PI / 4]}>
    <Points
    ref={ref}
    positions={sphere}
    stride={3}
    frustumCulled
    {...props}
    >
        <PointMaterial
            transparent
            color="#fff"
            size={0.002}
            sizeAttenuation={true}
            depthWrite={false}
        />
    </Points>
</group>
  )
};

// Freeze the drift (render once, on demand) for visitors who ask for reduced motion.
const usePrefersReducedMotion = () => {
    const [reduced, setReduced] = useState(false)
    useEffect(() => {
        const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
        const sync = () => setReduced(mq.matches)
        sync()
        mq.addEventListener('change', sync)
        return () => mq.removeEventListener('change', sync)
    }, [])
    return reduced
}

const StarsCanvas = () => {
    const reduced = usePrefersReducedMotion()
    return (
    <div className="w-full h-auto fixed inset-0 z-[20] pointer-events-none" aria-hidden="true">
        {/* tiny points need no anti-aliasing, and a 1.5x cap keeps retina screens cheap */}
        <Canvas
            camera={{position: [0, 0, 1]}}
            dpr={[1, 1.5]}
            frameloop={reduced ? 'demand' : 'always'}
            gl={{antialias: false, powerPreference: 'low-power'}}
        >
        <Suspense fallback={null}>
            <StarBackground />
        </Suspense>
        </Canvas>
    </div>
    )
}

export default StarsCanvas;
