"use client";

import React from 'react'
import { motion } from 'framer-motion'
import { slideInFromLeft, slideInFromRight, slideInFromTop } from '@/utils/motion'
import { SparklesIcon } from '@heroicons/react/24/outline'
import Image from 'next/image';

const HeroContent = () => {
    return (
        <motion.div
            initial="hidden"
            animate="visible"
            className='flex flex-col md:flex-row items-center justify-center px-6 md:px-20 mt-36 md:mt-40 w-full z-[20] gap-10'
        >
            <div className='flex flex-col gap-5 justify-center items-center md:items-start text-center md:text-start'>

                <motion.div
                    variants={slideInFromTop}
                    className='Welcome-box py-[8px] px-[7px] border border-[#7042f88b] opacity-[0.9]'
                >
                    <SparklesIcon className='text-[#b49bff] mr-[10px] h-5 w-5' />
                    <h1 className='Welcome-text text-[13px]'>Full Stack Developer | Mobile Developer  </h1>
                </motion.div>

                <motion.div
                    variants={slideInFromLeft(0.5)}
                    className='flex flex-col gap-6 mt-2 text-5xl md:text-6xl font-bold text-white max-w-[600px]'
                >
                    <span className='text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-cyan-500'> Daksh Nauni </span>
                </motion.div>

                <motion.p
                    variants={slideInFromLeft(0.8)}
                    className='text-lg text-gray-400 max-w-[600px]'
                >
                    Hi! I&apos;m a Full Stack Developer specializing in creating websites, mobile apps, and robust software solutions.
                    <br />
                    Explore my portfolio to see how I bring ideas to life through code!
                </motion.p>
                <motion.a
                    variants={slideInFromLeft(1)}
                    className='py-2 button-primary text-center text-white cursor-pointer rounded-lg w-[200px]'
                    href='#contact'
                >
                    Let&apos;s Connect
                </motion.a>

            </div>
            <motion.div
                variants={slideInFromRight(0.8)}
                className='hidden md:flex justify-center items-center'
            >
                <Image
                    src="/mainIconsdark.svg"
                    alt="work icons"
                    height={650}
                    width={650}
                    className='w-64 md:w-auto'
                    style={{ height: 'auto' }}
                    priority
                />

            </motion.div>
        </motion.div>
    )
}

export default HeroContent;
