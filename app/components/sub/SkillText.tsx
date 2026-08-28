"use client"
import React from 'react'
import { useInView } from 'react-intersection-observer'
import VerticalCutReveal from './VerticalCutReveal'

const SkillText = () => {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.2 })

  return (
    <div ref={ref} className='w-full h-auto flex flex-col items-center justify-center'>
      <h1 className="text-[40px] font-semibold text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-cyan-500 mb-10">
        <VerticalCutReveal
          autoStart={inView}
          splitBy="characters"
          staggerDuration={0.03}
          staggerFrom="first"
          containerClassName="justify-center"
          transition={{ type: "spring", stiffness: 200, damping: 21 }}
        >
          SKILLS
        </VerticalCutReveal>
      </h1>
    </div>
  )
}

export default SkillText
