'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence, useMotionValueEvent, useScroll } from 'framer-motion';
import { Menu, X, ChevronRight, Stethoscope, CalendarCheck2 } from 'lucide-react';
import Image from 'next/image';

const navItems = [
  { name: 'Beranda', href: '#home' },
  { name: 'Tentang Kami', href: '#about' },
  { name: 'Layanan', href: '#services' },
  { name: 'Dokter', href: '#doctors' },
];

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeItem, setActiveItem] = useState('Beranda');
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, 'change', (latest) => {
    setIsScrolled(latest > 30);
  });

  const handleNavClick = (href: string, name: string) => {
    setIsMobileMenuOpen(false);
    setActiveItem(name);
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // Lock body scroll when mobile menu open
  useEffect(() => {
    document.body.style.overflow = isMobileMenuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isMobileMenuOpen]);

  return (
    <>
      {/* ─── Main Navbar ─── */}
      <motion.nav
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className={`fixed top-0 left-2 right-2 z-50 transition-all duration-500 rounded-full ${isScrolled
            ? 'bg-white/80 backdrop-blur-2xl shadow-[0_2px_24px_rgba(0,0,0,0.08)] border-b border-slate-200/60'
            : 'bg-transparent border-b border-transparent'
          }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 md:h-[70px]">

            {/* ── Logo ── */}
            <Link href="/" className="flex items-center gap-3 group flex-shrink-0">
              <motion.div
                whileHover={{ rotate: [0, -8, 8, 0], scale: 1.05 }}
                transition={{ duration: 0.5 }}
                className={`relative p-2 rounded-2xl transition-all duration-300 ${isScrolled
                    ? 'bg-gradient-to-br from-blue-50 to-indigo-100 shadow-md shadow-blue-100'
                    : 'bg-white/15 backdrop-blur-sm border border-white/20'
                  }`}
              >
                <Image
                  src="/logo.png"
                  width={32}
                  height={32}
                  alt="RS Kita Logo"
                  className="w-8 h-8 object-contain"
                />
              </motion.div>
              <div className="flex flex-col leading-tight">
                <span className={`text-[17px] font-extrabold tracking-tight transition-colors duration-300 ${isScrolled ? 'text-slate-900' : 'text-white drop-shadow-sm'
                  }`}>
                  RS Kita
                </span>
                <span className={`text-[9px] uppercase tracking-[0.15em] font-bold transition-colors duration-300 ${isScrolled ? 'text-blue-600' : 'text-blue-200'
                  }`}>
                  Mitra Kesehatan Keluarga
                </span>
              </div>
            </Link>

            {/* ── Desktop Nav Links ── */}
            <nav className="hidden md:flex items-center gap-1 bg-white/10 backdrop-blur-sm rounded-full px-2 py-1.5 border border-white/20">
              {navItems.map((item) => {
                const isActive = activeItem === item.name;
                return (
                  <button
                    key={item.name}
                    onClick={() => handleNavClick(item.href, item.name)}
                    className="relative px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-300 outline-none"
                  >
                    {isActive && (
                      <motion.span
                        layoutId="activeNavPill"
                        className={`absolute inset-0 rounded-full ${isScrolled
                            ? 'bg-blue-600 shadow-md shadow-blue-400/30'
                            : 'bg-white/20 border border-white/30'
                          }`}
                        transition={{ type: 'spring', stiffness: 400, damping: 35 }}
                      />
                    )}
                    <span className={`relative z-10 transition-colors duration-200 ${isActive
                        ? isScrolled ? 'text-white' : 'text-white font-semibold'
                        : isScrolled ? 'text-slate-600 hover:text-slate-900' : 'text-white/80 hover:text-white'
                      }`}>
                      {item.name}
                    </span>
                  </button>
                );
              })}
            </nav>

            {/* ── CTA + Hamburger ── */}
            <div className="flex items-center gap-3">
              <motion.div
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="hidden md:block"
              >
                <Link
                  href="/booking"
                  className={`group flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-bold transition-all duration-300 shadow-lg ${isScrolled
                      ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-blue-500/30 hover:shadow-blue-500/50 hover:shadow-xl'
                      : 'bg-white text-blue-700 shadow-black/10 hover:bg-blue-50'
                    }`}
                >
                  <CalendarCheck2 className="w-4 h-4" />
                  <span>Ambil Antrian</span>
                </Link>
              </motion.div>

              {/* Hamburger */}
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={() => setIsMobileMenuOpen((prev) => !prev)}
                aria-label="Toggle menu"
                className={`md:hidden p-2.5 rounded-2xl transition-all duration-300 ${isScrolled || isMobileMenuOpen
                    ? 'bg-slate-100 text-slate-800 hover:bg-slate-200'
                    : 'bg-white/15 border border-white/20 text-white backdrop-blur-sm hover:bg-white/25'
                  }`}
              >
                <AnimatePresence mode="wait" initial={false}>
                  <motion.span
                    key={isMobileMenuOpen ? 'close' : 'open'}
                    initial={{ rotate: -90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="block"
                  >
                    {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
                  </motion.span>
                </AnimatePresence>
              </motion.button>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* ─── Mobile Drawer ─── */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-sm md:hidden"
              onClick={() => setIsMobileMenuOpen(false)}
            />

            {/* Drawer Panel */}
            <motion.aside
              key="drawer"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', stiffness: 320, damping: 32 }}
              className="fixed right-0 top-0 bottom-0 z-50 w-[82%] max-w-[340px] bg-white md:hidden flex flex-col shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Drawer Header */}
              <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-400/30">
                    <Stethoscope className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="font-extrabold text-slate-900 text-base leading-tight">RS Kita</p>
                    <p className="text-[10px] text-slate-400 uppercase tracking-widest mt-0.5">Menu Navigasi</p>
                  </div>
                </div>
                <motion.button
                  whileTap={{ scale: 0.88 }}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
                >
                  <X size={20} />
                </motion.button>
              </div>

              {/* Nav Items */}
              <div className="flex-1 overflow-y-auto px-4 py-5 space-y-1">
                {navItems.map((item, i) => {
                  const isActive = activeItem === item.name;
                  return (
                    <motion.button
                      key={item.name}
                      onClick={() => handleNavClick(item.href, item.name)}
                      initial={{ opacity: 0, x: 30 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.07, duration: 0.3 }}
                      className={`w-full flex items-center justify-between px-4 py-3.5 rounded-2xl font-semibold text-[15px] transition-all duration-200 ${isActive
                          ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-400/25'
                          : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                        }`}
                    >
                      <span>{item.name}</span>
                      <ChevronRight className={`w-4 h-4 transition-colors ${isActive ? 'text-blue-200' : 'text-slate-300'}`} />
                    </motion.button>
                  );
                })}
              </div>

              {/* Drawer Footer */}
              <div className="px-4 pb-8 pt-4 border-t border-slate-100 space-y-3">
                <Link
                  href="/booking"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center justify-center gap-2.5 w-full py-4 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold text-[15px] shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300"
                >
                  <CalendarCheck2 className="w-5 h-5" />
                  Daftar Antrian Online
                </Link>
                <p className="text-center text-[11px] text-slate-400">
                  © {new Date().getFullYear()} Rumah Sakit Kita. All rights reserved.
                </p>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
