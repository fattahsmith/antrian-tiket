'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Star, ShieldCheck } from 'lucide-react';
import CountUp from './CountUp'

export default function Hero() {
  const marqueeItems = [
    'Pelayanan Penuh Kasih', 'Dokter Terpercaya', 'Fasilitas Modern', 'Bebas Antri',
    'Akses Mudah', 'Ramah & Profesional', 'Teknologi Terkini', 'Solusi Kesehatan',
    'Pelayanan Penuh Kasih', 'Dokter Terpercaya', 'Fasilitas Modern', 'Bebas Antri',
    'Akses Mudah', 'Ramah & Profesional', 'Teknologi Terkini', 'Solusi Kesehatan',
  ];

  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden bg-slate-50 pt-20">

      {/* Dynamic Background Elements */}
      <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-blue-400/20 rounded-full blur-[120px]" />
        <div className="absolute top-[20%] right-[-5%] w-[400px] h-[400px] bg-purple-400/20 rounded-full blur-[100px]" />
        <div className="absolute bottom-[-10%] left-[20%] w-[600px] h-[600px] bg-teal-400/10 rounded-full blur-[120px]" />
      </div>

      <div className="container mx-auto px-6 lg:px-12 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 xl:gap-20 items-center">

          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, ease: 'easeOut' }}
            className="space-y-8"
          >
            {/* Tagline Badge */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100/50 border border-blue-200 rounded-full text-blue-700 text-sm font-semibold tracking-wide"
            >
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-500 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-blue-600"></span>
              </span>
              Solusi Kesehatan Masa Depan
            </motion.div>

            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold text-slate-900 leading-[1.1] tracking-tight">
              Kesehatan Anda, <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600">
                Prioritas Kami
              </span>
            </h1>

            <p className="text-lg sm:text-xl text-slate-600 leading-relaxed max-w-xl">
              Nikmati kemudahan layanan kesehatan tanpa antri. Jadwalkan kunjungan Anda dari mana saja, kapan saja.
            </p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.8 }}
              className="flex flex-col sm:flex-row gap-4"
            >
              <Link href="/booking">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="group w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-full font-bold text-lg shadow-xl shadow-blue-500/30 flex items-center justify-center gap-2 transition-all"
                >
                  Daftar Sekarang
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </motion.button>
              </Link>

              <Link href="#features">
                <motion.button
                  whileHover={{ scale: 1.05, backgroundColor: "rgba(255,255,255,0.8)" }}
                  whileTap={{ scale: 0.95 }}
                  className="w-full sm:w-auto px-8 py-4 bg-white/50 backdrop-blur-sm border border-slate-200 text-slate-700 rounded-full font-semibold text-lg hover:border-blue-300 transition-all shadow-sm"
                >
                  Pelajari Lebih Lanjut
                </motion.button>
              </Link>
            </motion.div>

            {/* Trust Stats */}
            <div className="flex items-center gap-8 mb-10">
              <div>
                <h4 className="text-3xl font-bold text-slate-900"><CountUp
                  from={0}
                  to={1000}
                  separator=","
                  direction="up"
                  duration={1}
                  className="count-up-text"
                />+</h4>
                <p className="text-sm text-slate-500">Pasien Terlayani</p>
              </div>
              <div className="w-px h-10 bg-slate-300" />
              <div>
                <h4 className="text-3xl font-bold text-slate-900"><CountUp
                  from={0}
                  to={4.9}
                  separator=","
                  direction="up"
                  duration={1}
                  className="count-up-text"
                /></h4>
                <p className="text-sm text-slate-500 flex items-center gap-1">
                  Rating Kepuasan <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                </p>
              </div>
            </div>
          </motion.div>

          {/* Right Content - Floating Image & Cards */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, ease: 'easeOut', delay: 0.2 }}
            className="relative hidden lg:block"
          >
            <motion.div
              animate={{ y: [0, -20, 0] }}
              transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
              className="relative z-10"
            >
              <div className="relative rounded-[2.5rem] overflow-hidden shadow-2xl shadow-blue-900/20 border-4 border-white">
                <Image
                  src="/doc3.jpg"
                  alt="Professional Doctor"
                  width={550}
                  height={700}
                  className="w-full h-auto object-cover"
                  priority
                />

                {/* Floating Glass Card 1 */}
                <div className="absolute top-8 left-8 p-4 bg-white/80 backdrop-blur-xl border border-white/40 rounded-2xl shadow-lg flex items-center gap-3 animate-float-slow">
                  <div className="p-2 bg-green-100 rounded-full text-green-600">
                    <ShieldCheck className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 font-medium">Status Medis</p>
                    <p className="text-sm font-bold text-slate-800">Terverifikasi</p>
                  </div>
                </div>

                {/* Floating Glass Card 2 */}
                <div className="absolute bottom-10 right-8 p-4 bg-white/90 backdrop-blur-xl border border-white/40 rounded-2xl shadow-lg max-w-[180px]">
                  <div className="flex -space-x-3 mb-2">
                    {[1, 2, 3].map(i => (
                      <div key={i} className="w-8 h-8 rounded-full bg-slate-200 border-2 border-white" />
                    ))}
                    <div className="w-8 h-8 rounded-full bg-blue-600 border-2 border-white flex items-center justify-center text-[10px] text-white font-bold">+2k</div>
                  </div>
                  <p className="text-xs text-slate-600 font-medium">Telah bergabung bulan ini</p>
                </div>
              </div>
            </motion.div>

            {/* Background Blob behind image */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[110%] h-[110%] bg-blue-100/50 rounded-full blur-3xl -z-10" />
          </motion.div>
        </div>
      </div>

      {/* Modern Marquee Footer */}
      <div className="absolute bottom-0 w-full bg-white/50 backdrop-blur-md border-t border-white/40 py-6 overflow-hidden ">
        <div className="flex animate-marquee whitespace-nowrap">
          {marqueeItems.map((item, i) => (
            <div key={i} className="flex items-center mx-8  group cursor-default">
              <span className="w-2 h-2 rounded-full bg-blue-400 mr-3 group-hover:bg-blue-600 transition-colors" />
              <span className="text-slate-600 font-medium text-lg tracking-wide group-hover:text-blue-700 transition-colors">
                {item}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}