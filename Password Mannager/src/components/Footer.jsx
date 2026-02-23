import React from "react";
import { FaHeart, FaGithub } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="w-full bg-gradient-to-r from-[#0f2027]/80 via-[#203a43]/80 to-[#2c5364]/80 backdrop-blur-xl border-t border-cyan-400/20 shadow-[0_0_20px_#00ffff25] text-white text-sm">
      <div className="max-w-7xl mx-auto px-4 py-4 flex flex-col md:flex-row items-center justify-between gap-2 text-center md:text-left">

        {/* Brand */}
        <h2 className="text-base font-semibold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent drop-shadow-[0_0_8px_#00ffff]">
          Password Keeper
        </h2>

        {/* Links */}
        <div className="flex gap-4 text-gray-300">
          <a
            href="https://akpatra.netlify.app/"
            target="_blank"
            rel="noreferrer"
            className="hover:text-cyan-400 hover:drop-shadow-[0_0_6px_#00ffff] transition"
          >
            About
          </a>
          <a
            href="https://github.com/amitkumarpatra99"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1 hover:text-cyan-400 hover:drop-shadow-[0_0_6px_#00ffff] transition"
          >
            <FaGithub className="text-base" />
            GitHub
          </a>
        </div>

        {/* Credits */}
        <div className="flex items-center justify-center gap-2 text-gray-400">
          <span>Made with</span>
          <FaHeart className="text-pink-500 animate-pulse drop-shadow-[0_0_6px_#ff4d6d]" />
          <span>
            by{" "}
            <a
              href="https://mrpatra.vercel.app/"
              target="_blank"
              rel="noreferrer"
              className="text-cyan-400 font-semibold hover:text-blue-300 transition"
            >
              MR&nbsp;PATRA
            </a>
          </span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
