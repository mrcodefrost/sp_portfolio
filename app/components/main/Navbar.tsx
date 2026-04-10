"use client";

import { Socials } from "@/constants";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
      <div className="w-full h-[65px] fixed top-0 shadow-lg shadow-[#2A0E61]/50 bg-[#03001417] backdrop-blur-md z-50 px-4 md:px-10">
        <div className="w-full h-full flex flex-row items-center justify-between m-auto">
          <a href="#about-me" className="flex flex-row items-center">
            <span className="font-bold text-gray-300">DAKSH NAUNI</span>
          </a>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center border border-[#7042f861] bg-[#0300145e] px-[20px] py-[10px] rounded-full text-gray-200 gap-6">
            <a href="#about-me" className="cursor-pointer hover:text-purple-400 transition-colors">
              About me
            </a>
            <a href="#skills" className="cursor-pointer hover:text-purple-400 transition-colors">
              Skills
            </a>
            <a href="#projects" className="cursor-pointer hover:text-purple-400 transition-colors">
              Projects
            </a>
            <Link href="/blog" className="cursor-pointer hover:text-purple-400 transition-colors">
              Blog
            </Link>
            <a href="#contact" className="cursor-pointer hover:text-purple-400 transition-colors">
              Contact
            </a>
          </div>

          {/* Desktop socials */}
          <div className="hidden md:flex flex-row gap-5">
            {Socials.map((social) => (
              <a
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                key={social.name}
                className="cursor-pointer hover:opacity-80 transition-opacity"
              >
                <Image src={social.src} alt={social.name} width={24} height={24} />
              </a>
            ))}
          </div>

          {/* Mobile hamburger */}
          <button
            className="md:hidden text-gray-300 p-2 flex flex-col justify-center gap-1.5"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            <span
              className={`block w-6 h-0.5 bg-gray-300 transition-all duration-300 origin-center ${
                menuOpen ? "rotate-45 translate-y-2" : ""
              }`}
            />
            <span
              className={`block w-6 h-0.5 bg-gray-300 transition-all duration-300 ${
                menuOpen ? "opacity-0" : ""
              }`}
            />
            <span
              className={`block w-6 h-0.5 bg-gray-300 transition-all duration-300 origin-center ${
                menuOpen ? "-rotate-45 -translate-y-2" : ""
              }`}
            />
          </button>
        </div>
      </div>

      {/* Mobile dropdown */}
      {menuOpen && (
        <div className="md:hidden fixed top-[65px] left-0 w-full bg-[#030014]/95 backdrop-blur-md z-40 flex flex-col items-center gap-5 py-8 shadow-lg border-t border-[#7042f861]">
          <a
            href="#about-me"
            onClick={() => setMenuOpen(false)}
            className="text-gray-200 hover:text-purple-400 transition-colors text-lg"
          >
            About me
          </a>
          <a
            href="#skills"
            onClick={() => setMenuOpen(false)}
            className="text-gray-200 hover:text-purple-400 transition-colors text-lg"
          >
            Skills
          </a>
          <a
            href="#projects"
            onClick={() => setMenuOpen(false)}
            className="text-gray-200 hover:text-purple-400 transition-colors text-lg"
          >
            Projects
          </a>
          <Link
            href="/blog"
            onClick={() => setMenuOpen(false)}
            className="text-gray-200 hover:text-purple-400 transition-colors text-lg"
          >
            Blog
          </Link>
          <a
            href="#contact"
            onClick={() => setMenuOpen(false)}
            className="text-gray-200 hover:text-purple-400 transition-colors text-lg"
          >
            Contact
          </a>
          <div className="flex flex-row gap-5 mt-2">
            {Socials.map((social) => (
              <a
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                key={social.name}
                className="cursor-pointer hover:opacity-80 transition-opacity"
              >
                <Image src={social.src} alt={social.name} width={24} height={24} />
              </a>
            ))}
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
