"use client";

import React from 'react'
import { motion } from 'framer-motion'
import { slideInFromLeft, slideInFromRight, slideInFromTop } from '@/utils/motion'
import { SparklesIcon } from '@heroicons/react/24/outline'
import Image from 'next/image';

const Test = () => {
    return (
        <motion.div

            className='flex flex-row items-center justify-center px-20 mt-40 w-full'
        >
            <h1 className="text-white">Gello</h1>

        </motion.div>
    )
}

export default Test