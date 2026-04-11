import Image from "next/image";
import React from "react";

interface Props {
  src: string;
  title: string;
  subtitle: string;
  tech: string;
  description: string;
  githubUrl?: string;
  githubText?: string;
  demoUrl?: string;
  demoText?: string;
}

const ProjectCard = ({ src, title, subtitle, tech, description, githubUrl, demoUrl, githubText, demoText }: Props) => {
  return (
    <div className="relative overflow-hidden rounded-lg shadow-lg border border-[#2A0E61] w-full flex flex-col h-full">
      <Image
        src={src}
        alt={title}
        width={600}
        height={400}
        className="w-full h-56 object-cover"
      />

      <div className="relative p-4 flex flex-col flex-1">
        <div className="space-y-2">
          <h1 className="text-2xl font-semibold text-white">{title}</h1>
          <div className="w-full h-0.5 bg-[#2A0E61]"></div>
        </div>
        <h3 className="text-lg font-medium text-[#8b26eb] mb-2">{subtitle}</h3>
        <h2 className="text-l italic text-[#0AD3FF]">{tech}</h2>
        <p className="mt-2 text-gray-300 whitespace-pre-line break-words">{description}</p>

        <div className="flex justify-center items-center mt-auto">
          {/* GitHub Button */}
          {githubUrl && (
            <a
              href={githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block mt-5 p-2 text-white hover:text-gray-300 bg-transparent border-2 rounded cursor-pointer"
            >
              {githubText || 'Github'}
            </a>
          )}
          {/* Demo Button */}
          {demoUrl && (
            <a
              href={demoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block mt-5 p-2 ml-10 text-white hover:text-gray-300 bg-transparent border-2 rounded cursor-pointer"
            >
              {demoText || 'Demo'}
            </a>
          )}
        </div>

      </div>

    </div>

  );
};

export default ProjectCard;