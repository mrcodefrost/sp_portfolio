"use client";

import Image from "next/image";
import React from "react";

interface Props {
  src: string;
  title: string;
  description: string;
  githubUrl: string;
  demoUrl: string;
}

const ProjectCard = ({ src, title, description, githubUrl, demoUrl }: Props) => {
  return (
    <div className="relative overflow-hidden rounded-lg shadow-lg border border-[#2A0E61] w-full">
      <Image
        src={src}
        alt={title}
        width={1000}
        height={1000}
        className="w-full object-contain"
      />

      <div className="relative p-4">
        <h1 className="text-2xl font-semibold text-white">{title}</h1>
        <p className="mt-2 text-gray-300 break-words">{description}</p>

        <div className="flex justify-center items-center">


          {/* GitHub Button */}
          <a
            href={githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block mt-5 p-2 text-white hover:text-gray-300 bg-transparent border-2 rounded cursor-pointer"
          >
            Github
          </a>
          {/* Demo Button */}
          <a
            href={demoUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block mt-5 p-2 ml-10 text-white hover:text-gray-300 bg-transparent border-2 rounded cursor-pointer"
          >
            Demo
          </a>
        </div>

      </div>

    </div>

  );
};

export default ProjectCard;