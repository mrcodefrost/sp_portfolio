"use client";

import React from 'react'
import { motion } from 'framer-motion'
import { slideInFromLeft, slideInFromRight, slideInFromTop } from '@/utils/motion'
import Image from 'next/image';
import VerticalCutReveal from './VerticalCutReveal';
import { SOCIALS } from '@/constants/socials';

const HeroContent = () => {
    return (
        <motion.div
            initial="hidden"
            animate="visible"
            className='flex flex-col md:flex-row items-center justify-center px-6 md:px-20 mt-36 md:mt-40 w-full z-[20] gap-10'
        >
            <div className='flex flex-col gap-5 justify-center items-center md:items-start text-center md:text-start'>

                <motion.div
                    variants={slideInFromTop()}
                    className='Welcome-box py-[8px] px-[7px] border border-[#7042f88b] opacity-[0.9]'
                >
                    <h1 className='Welcome-text text-[13px] flex items-center gap-1.5'>
                        <span className='h-1.5 w-1.5 rounded-full bg-green-400' />
                        Full-Stack & Mobile Engineer
                    </h1>
                </motion.div>

                <div className='flex flex-col gap-6 mt-2 text-5xl md:text-6xl font-bold text-white max-w-[600px]'>
                    <span className='text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-cyan-500'>
                        <VerticalCutReveal
                            splitBy="characters"
                            staggerDuration={0.025}
                            staggerFrom="first"
                            transition={{ type: 'spring', stiffness: 200, damping: 21, delay: 0.15 }}
                        >
                            Daksh Nauni
                        </VerticalCutReveal>
                    </span>
                </div>

                <motion.p
                    variants={slideInFromLeft(0.3)}
                    className='text-lg text-gray-400 max-w-[600px]'
                >
                    I build full-stack web platforms and production mobile apps, from idea to deployment.
                    <br />
                    Open to remote roles, contract work, and freelance projects.
                </motion.p>
                <motion.div
                    variants={slideInFromLeft(0.45)}
                    className='flex flex-row gap-4'
                >
                    <a
                        className='py-2 button-primary text-center text-white cursor-pointer rounded-lg w-[160px]'
                        href='#contact'
                    >
                        Let&apos;s Connect
                    </a>
                    <a
                        className='py-2 text-center text-white cursor-pointer rounded-lg w-[160px] border border-[#7042f88b] hover:bg-[#7042f81a] transition-colors duration-300'
                        href='#projects'
                    >
                        View Projects
                    </a>
                </motion.div>

                <motion.div
                    variants={slideInFromLeft(0.6)}
                    className='flex md:hidden flex-row gap-5 mt-1'
                >
                    {SOCIALS.map((social) => (
                        <a
                            href={social.href}
                            target={social.href.startsWith('mailto') ? undefined : '_blank'}
                            rel={social.href.startsWith('mailto') ? undefined : 'noopener noreferrer'}
                            key={social.name}
                            aria-label={social.name}
                            className='cursor-pointer text-gray-300 hover:text-purple-400 transition-colors'
                        >
                            {social.icon}
                        </a>
                    ))}
                </motion.div>

            </div>
            <motion.div
                variants={slideInFromRight(0.3)}
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
