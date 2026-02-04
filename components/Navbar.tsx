'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, ChevronRight, Stethoscope } from 'lucide-react';
import Image from "next/image";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { name: 'Beranda', href: '#home' },
    { name: 'Tentang Kami', href: '#about' },
    { name: 'Layanan', href: '#services' },
    { name: 'Dokter', href: '#doctors' },
  ];

  const handleNavClick = (href: string) => {
    setIsMobileMenuOpen(false);
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5, ease: 'circOut' }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 border-b ${isScrolled
            ? 'bg-white/80 backdrop-blur-xl border-slate-200/50 shadow-sm py-2'
            : 'bg-transparent border-transparent py-4'
          }`}
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14 md:h-16">
            <Link href="/" className="flex items-center gap-3 group">
              <div className={`relative p-2 rounded-xl transition-all duration-300 ${isScrolled ? 'bg-blue-50' : 'bg-white/10 backdrop-blur-sm'
                }`}>
                <Image
                  src="/logo.png"
                  width={32}
                  height={32}
                  alt="Logo"
                  className="w-8 h-8 object-contain"
                />
              </div>
              <div className="flex flex-col">
                <span className={`text-lg font-bold tracking-tight transition-colors duration-300 ${isScrolled ? 'text-slate-900' : 'text-slate-900 md:text-white'
                  }`}>
                  RS Kita
                </span>
                <span className={`text-[10px] uppercase tracking-wider font-semibold transition-colors duration-300 ${isScrolled ? 'text-blue-600' : 'text-blue-600 md:text-blue-200'
                  }`}>
                  Mitra Kesehatan Keluarga
                </span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-1">
              {navItems.map((item, index) => (
                <motion.a
                  key={item.name}
                  href={item.href}
                  onClick={(e) => {
                    e.preventDefault();
                    handleNavClick(item.href);
                  }}
                  className={`relative px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 group overflow-hidden ${isScrolled
                      ? 'text-slate-600 hover:text-blue-600'
                      : 'text-white/90 hover:text-white'
                    }`}
                >
                  <span className="relative z-10">{item.name}</span>
                  <span className={`absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-0 ${isScrolled ? 'bg-blue-50' : 'bg-white/10'
                    }`} />
                </motion.a>
              ))}
            </div>

            <div className="flex items-center gap-3">
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="hidden md:block"
              >
                <Link
                  href="/booking"
                  className={`px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 shadow-lg hover:shadow-xl flex items-center gap-2 ${isScrolled
                      ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-blue-500/25'
                      : 'bg-white text-blue-600 shadow-black/5 hover:bg-blue-50'
                    }`}
                >
                  <span>Ambil Antrian</span>
                  <ChevronRight className="w-4 h-4" />
                </Link>
              </motion.div>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className={`md:hidden p-2.5 rounded-xl transition-all duration-300 ${isScrolled || isMobileMenuOpen
                    ? 'bg-slate-100 text-slate-900 active:bg-slate-200'
                    : 'bg-white/10 text-white backdrop-blur-sm active:bg-white/20'
                  }`}
              >
                {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40 bg-slate-900/20 backdrop-blur-sm md:hidden"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="absolute right-0 top-0 bottom-0 w-[80%] max-w-sm bg-white shadow-2xl p-6 flex flex-col"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-8 pb-6 border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-50 rounded-lg">
                    <Stethoscope className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900">RS Kita</h3>
                    <p className="text-xs text-slate-500">Menu Navigasi</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-lg transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="space-y-2 flex-1 overflow-y-auto">
                {navItems.map((item, index) => (
                  <motion.a
                    key={item.name}
                    href={item.href}
                    onClick={(e) => {
                      e.preventDefault();
                      handleNavClick(item.href);
                    }}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center justify-between p-3 rounded-xl text-slate-600 font-medium hover:bg-blue-50 hover:text-blue-600 transition-colors group"
                  >
                    {item.name}
                    <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-blue-400 transition-colors" />
                  </motion.a>
                ))}
              </div>

              <div className="mt-8 pt-6 border-t border-slate-100">
                <Link
                  href="/booking"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block w-full py-3.5 px-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-center rounded-xl font-bold shadow-lg shadow-blue-600/25 hover:shadow-xl hover:scale-[1.02] transition-all duration-300"
                >
                  Daftar Antrian Online
                </Link>
                <p className="text-center text-xs text-slate-400 mt-4">
                  &copy; 2024 Rumah Sakit Kita.
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

