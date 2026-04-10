import React from 'react'
import HeroContent from '../sub/HeroContent'

const Hero = () => {
  return (
    <div id='about-me' className= 'relative flex flex-col h-full w-full'>

        <video

        autoPlay
        muted
        loop
        preload="none"
        className='rotate-180 absolute top-[-340px] left-0 z-[1] w-full h-full object-cover'

        >

            <source src='/blackhole.webm' type='video/webm'/>

        </video>
        <HeroContent/>

    </div>
  )
}

export default Hero