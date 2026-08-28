import Image from "next/image";
import React from "react";

interface Props {
  src: string;
  title: string;
  subtitle: string;
  tech: string;
  highlights: string[];
  archived?: boolean;
  linkAUrl?: string;
  linkAText?: string;
  linkBUrl?: string;
  linkBText?: string;
}

const linkClass =
  "button-primary inline-block px-6 py-2 text-white rounded-lg border border-[#7042f88b] text-sm font-medium transition-all duration-300 cursor-pointer";

const ProjectCard = ({
  src,
  title,
  subtitle,
  tech,
  highlights,
  archived,
  linkAUrl,
  linkAText,
  linkBUrl,
  linkBText,
}: Props) => {
  const techList = tech.split(",").map((item) => item.trim());

  return (
    <div className="relative overflow-hidden rounded-lg shadow-lg border border-[#2A0E61] w-full flex flex-col h-full">
      {archived && (
        <span className="absolute top-3 right-3 z-10 rounded-full border border-[#7042f88b] bg-[#0d0d1f]/80 px-3 py-1 text-xs text-gray-300 backdrop-blur-sm">
          Archived
        </span>
      )}
      <Image
        src={src}
        alt={title}
        width={1280}
        height={720}
        sizes="(min-width: 768px) 33vw, 100vw"
        className="w-full h-56 object-cover object-top"
      />

      <div className="relative p-4 flex flex-col flex-1">
        <div className="space-y-2">
          <h1 className="text-2xl font-semibold text-white">{title}</h1>
          <div className="w-full h-0.5 bg-[#2A0E61]"></div>
        </div>
        <h3 className="text-lg font-medium text-[#8b26eb] mb-2">{subtitle}</h3>

        <div className="flex flex-wrap gap-1.5 mb-3">
          {techList.map((item) => (
            <span
              key={item}
              className="text-xs font-medium px-2.5 py-1 rounded-full border border-[#0AD3FF]/30 bg-[#0AD3FF]/5 text-[#0AD3FF]"
            >
              {item}
            </span>
          ))}
        </div>

        <ul className="space-y-1.5 text-gray-300 text-sm">
          {highlights.map((point) => (
            <li key={point} className="flex gap-2">
              <span className="text-[#8b26eb] mt-0.5 shrink-0">▸</span>
              <span>{point}</span>
            </li>
          ))}
        </ul>

        <div className="flex justify-center items-center gap-4 mt-auto pt-5">
          {linkAUrl && (
            <a href={linkAUrl} target="_blank" rel="noopener noreferrer" className={linkClass}>
              {linkAText || "View"}
            </a>
          )}
          {linkBUrl && (
            <a href={linkBUrl} target="_blank" rel="noopener noreferrer" className={linkClass}>
              {linkBText || "View"}
            </a>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProjectCard;
