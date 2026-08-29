"use client"

import React from 'react'
import { motion } from 'framer-motion'
import Image from 'next/image';

interface Props {
    src: string;
    width: number;
    height: number;
    index: number;
    name: string;
    inView: boolean;
}

const HEX_WIDTH = 66;
const HEX_HEIGHT = 76;
const HEX_CLIP = 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)';

const SkillDataProvider = ({ src, width, height, index, name, inView }: Props) => {
    const iconVariants = {
        hidden: { opacity: 0, y: 16, scale: 0.7 },
        visible: {
            opacity: 1,
            y: 0,
            scale: 1,
            transition: { type: 'spring' as const, stiffness: 260, damping: 20, delay: index * 0.06 },
        },
    }

    return (
        <motion.div
            initial="hidden"
            animate={inView ? "visible" : "hidden"}
            variants={iconVariants}
            whileHover={{ scale: 1.15, zIndex: 10 }}
            transition={{ type: 'spring', stiffness: 350, damping: 30 }}
            className="group relative shrink-0 cursor-default"
            style={{ width: HEX_WIDTH, height: HEX_HEIGHT, zIndex: 0 }}
        >
            <div
                className="absolute inset-0 bg-linear-to-br from-purple-500/60 to-cyan-400/40 transition-colors duration-300 group-hover:from-purple-400 group-hover:to-cyan-300"
                style={{ clipPath: HEX_CLIP }}
            />
            <div
                className="absolute inset-[2px] flex items-center justify-center bg-[#0d0225] transition-colors duration-300 group-hover:bg-[#1a0b3d]"
                style={{ clipPath: HEX_CLIP }}
            >
                <Image
                    src={src}
                    width={width}
                    height={height}
                    alt={name}
                    style={{ height: '36px', width: 'auto' }}
                />
            </div>
        </motion.div>
    )
}

export default SkillDataProvider
