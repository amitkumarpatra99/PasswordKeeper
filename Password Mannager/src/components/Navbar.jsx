import React, { useState, useEffect } from "react";
import { FiMenu, FiX } from "react-icons/fi";
import { FaShieldAlt, FaGithub, FaUserCircle, FaHome } from "react-icons/fa";
import { Link, useLocation } from "react-router-dom";

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  // Close mobile menu on route change
  useEffect(() => {
    setOpen(false);
  }, [location]);

  // Auto hide + background change on scroll (optimized)
  useEffect(() => {
    let lastScrollY = window.scrollY;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      // Background change
      setScrolled(currentScrollY > 50);

      // Hide on scroll down
      if (currentScrollY > lastScrollY && currentScrollY > 80) {
        setHidden(true);
      } else {
        setHidden(false);
      }

      lastScrollY = currentScrollY;
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ${
        hidden ? "-translate-y-full" : "translate-y-0"
      } ${
        scrolled
          ? "bg-[#0A192F]/95 backdrop-blur-xl shadow-lg border-b border-cyan-500/20"
          : "bg-gradient-to-r from-[#0F2027]/80 via-[#203A43]/80 to-[#2C5364]/80 backdrop-blur-lg border-b border-white/10"
      }`}
    >
      <div className="max-w-7xl mx-auto flex justify-between items-center py-3 px-6 text-white">
        {/* Brand Logo */}
        <Link
          to="/"
          className="flex items-center gap-2 cursor-pointer select-none group"
        >
          <FaShieldAlt className="text-cyan-400 text-3xl drop-shadow-lg group-hover:rotate-12 transition duration-300" />
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-wide bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-400 group-hover:scale-105 transition-all duration-300">
            Password <span className="text-white">Keeper</span>
          </h1>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-6 font-semibold">
          <Link
            to="/"
            className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 hover:bg-cyan-500/20 hover:shadow-[0_0_12px_#00ffff] transition-all duration-300"
          >
            <FaHome className="text-lg" />
          </Link>

          <a
            href="https://github.com/amitkumarpatra99"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 hover:bg-cyan-500/20 hover:shadow-[0_0_12px_#00ffff] transition-all duration-300"
          >
            <FaGithub className="text-2xl" />
          </a>

          <a
            href="https://mrpatra.vercel.app/"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 hover:bg-cyan-500/20 hover:shadow-[0_0_12px_#00ffff] transition-all duration-300"
          >
            <FaUserCircle className="text-2xl text-cyan-400" />
          </a>
        </div>

        {/* Mobile Toggle */}
        <button
          onClick={() => setOpen(!open)}
          className="md:hidden focus:outline-none text-2xl transition-transform duration-300"
        >
          {open ? <FiX /> : <FiMenu />}
        </button>
      </div>

      {/* Mobile Menu */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-500 ${
          open ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
        } bg-[#0A2647]/95 backdrop-blur-xl border-t border-white/10`}
      >
        <div className="py-4 px-6 flex flex-col gap-4">
          <Link
            to="/"
            className="flex items-center gap-2 text-white hover:text-cyan-400 transition-all duration-200"
          >
            <FaHome className="text-lg" />
            Home
          </Link>

          <a
            href="https://github.com/amitkumarpatra99"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-2 text-white hover:text-cyan-400 transition-all duration-200"
          >
            <FaGithub className="text-2xl" />
            GitHub
          </a>

          <a
            href="https://mrpatra.vercel.app/"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-2 text-white hover:text-cyan-400 transition-all duration-200"
          >
            <FaUserCircle className="text-2xl text-cyan-400" />
            Developer
          </a>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;