'use client';

import { motion } from 'framer-motion';
import { MapPin, Clock, Timer, Users } from 'lucide-react';
import Section from './Section';
import Image from "next/image";

export default function WhyOnlineQueue() {
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 50 } as any }, // casting to any to avoid strict type issues or import Variants
  };

  const features = [
    {
      icon: MapPin,
      title: 'Daftar dari Mana Saja',
      description: 'Akses pendaftaran antrian tanpa batasan lokasi, cukup dari genggaman Anda.',
      color: 'from-blue-400 to-cyan-300'
    },
    {
      icon: Clock,
      title: 'Real-Time & Akurat',
      description: 'Pantau status antrian secara langsung dengan estimasi waktu yang presisi.',
      color: 'from-purple-400 to-pink-300'
    },
    {
      icon: Timer,
      title: 'Efisiensi Waktu',
      description: 'Datang tepat waktu, tanpa perlu menunggu berjam-jam di ruang tunggu.',
      color: 'from-amber-400 to-orange-300'
    },
    {
      icon: Users,
      title: 'Pelayanan Optimal',
      description: 'Sistem terintegrasi memastikan Anda mendapatkan layanan terbaik dari petugas.',
      color: 'from-emerald-400 to-green-300'
    },
  ];

  return (
    <Section className="py-10 relative overflow-hidden bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 text-white ">
      {/* Decorative Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-blue-500/20 rounded-full blur-[100px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-purple-500/20 rounded-full blur-[100px]" />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center mb-20">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="space-y-8"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/10 text-blue-200 text-sm font-medium">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-blue-500"></span>
              </span>
              Solusi Kesehatan Modern
            </div>

            <h2 className="text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight">
              Kenapa Harus <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300">Antrian Online?</span>
            </h2>

            <p className="text-slate-300 text-lg leading-relaxed max-w-xl">
              Transformasi pengalaman berobat Anda menjadi lebih simpel, cepat, dan transparan.
              Fokus pada kesehatan Anda, biarkan teknologi mengatur jadwalnya.
            </p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="pt-4"
            >
              <h3 className="text-2xl font-semibold mb-6 flex items-center gap-3">
                <span className="w-10 h-1 bg-blue-500 rounded-full block"></span>
                Keunggulan Utama
              </h3>
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            <motion.div
              animate={{ y: [0, -15, 0] }}
              transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
              className="relative z-10"
            >
              <div className="relative rounded-2xl overflow-hidden shadow-2xl border-4 border-white/10 shadow-blue-500/20">
                <Image
                  src="/queue.jpg"
                  alt="Antrian Online Illustration"
                  width={800}
                  height={500}
                  className="object-cover w-full h-full transform hover:scale-105 transition-transform duration-700"
                  priority
                />

                {/* Glass Card Overlay */}
                <div className="absolute bottom-6 left-6  p-3 bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-green-500/20 rounded-lg">
                      <Timer className="w-6 h-6 text-green-400" />
                    </div>
                    <div>
                      <p className="text-sm text-slate-300">Estimasi Waktu Tunggu</p>
                      <p className="text-xl font-bold text-white">~15 Menit</p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Abstract Glow Behind Image */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-blue-600/30 blur-[100px] -z-10" />
          </motion.div>
        </div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
          className="grid md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              whileHover={{ y: -10, transition: { duration: 0.2 } }}
              className="group relative bg-white/5 backdrop-blur-lg rounded-2xl p-8 border border-white/10 hover:bg-white/10 transition-colors"
            >
              <div className={`w-14 h-14 rounded-xl mb-6 flex items-center justify-center bg-gradient-to-br ${feature.color} shadow-lg group-hover:shadow-${feature.color.split('-')[1]}-500/50 transition-shadow`}>
                <feature.icon className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-white group-hover:text-blue-300 transition-colors">{feature.title}</h3>
              <p className="text-slate-400 text-sm leading-relaxed">{feature.description}</p>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.6, duration: 0.8 }}
          className="mt-10 text-center"
        >
          <a href="/booking" className="inline-block">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="group relative px-10 py-5 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-full font-bold text-lg shadow-xl shadow-blue-600/30 overflow-hidden"
            >
              <span className="relative z-10 flex items-center gap-2">
                Daftar Antrian Sekarang
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5 group-hover:translate-x-1 transition-transform">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                </svg>
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-blue-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </motion.button>
          </a>
        </motion.div>
      </div>
    </Section>
  );
}

