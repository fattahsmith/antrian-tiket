'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import Section from './Section';
import Image from 'next/image';
import {CalendarCheck, ShieldCheck, ArrowRight } from 'lucide-react';

export default function CTA() {
  return (
    <Section className="py-20 bg-white text-slate-800 rounded-t-3xl border-t border-slate-100 relative overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-50/50 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/3 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-teal-50/30 rounded-full blur-[60px] translate-y-1/3 -translate-x-1/3 pointer-events-none" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">

          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
            className="space-y-8"
          >
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 border border-blue-100 text-blue-600 text-sm font-semibold shadow-sm">
              Layanan Online Buka 24 Jam
            </div>

            <div className="space-y-4">
              <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 leading-tight tracking-tight">
                Siap Daftar Antrian Tanpa Harus <span className="text-transparent bg-clip-text bg-blue-600">Menunggu Lama?</span>
              </h2>
              <p className="text-slate-600 text-lg leading-relaxed max-w-lg">
                Dengan beberapa langkah sederhana, nomor antrian Anda sudah siap.
                Tidak perlu install aplikasi, cukup melalui browser di
                smartphone Anda.
              </p>
            </div>

            {/* Benefit Checkmarks */}
            <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 pt-2 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-100/50 flex items-center justify-center text-blue-600">
                  <CalendarCheck size={18} />
                </div>
                <span className="font-medium text-slate-700">Pilih Jadwal</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-green-100/50 flex items-center justify-center text-green-600">
                  <ShieldCheck size={18} />
                </div>
                <span className="font-medium text-slate-700">Terdaftar Cepat</span>
              </div>
            </div>

            <Link href="/booking" className="inline-block">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 bg-blue-600 text-white rounded-full font-semibold text-lg shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 transition-all flex items-center gap-2 group"
              >
                Antri Tiket Sekarang
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </motion.button>
            </Link>
          </motion.div>

          {/* Image Section */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 30 }}
            whileInView={{ opacity: 1, scale: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative"
          >
            {/* Decorative background shape for image */}
            <div className="absolute inset-0 bg-gradient-to-tr from-blue-100 to-teal-50 rounded-3xl transform rotate-3 scale-105 -z-10" />

            <div className="relative w-full h-[450px] rounded-3xl overflow-hidden bg-slate-50 border border-slate-100 shadow-2xl flex items-end justify-center group pointer-events-none">
              <Image
                src="/log2.png"
                alt="Dokter profesional memberikan pelayanan ramah"
                width={520}
                height={680}
                className="w-[85%] h-auto object-cover object-bottom transition-transform duration-700 group-hover:scale-105 drop-shadow-xl"
                priority
              />

              {/* Bottom Gradient Overlay for clean fading */}
              <div className="absolute bottom-0 left-0 w-full h-24 bg-gradient-to-t from-slate-50 to-transparent" />
            </div>

            {/* Floating Glass Box */}
            <motion.div
              animate={{ y: [-10, 10, -10] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -left-6 top-1/4 bg-white/80 backdrop-blur-md p-4 rounded-2xl shadow-xl border border-white/50 z-20 hidden md:block"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-lg">
                  #1
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-800">Antrian Cepat</p>
                  <p className="text-xs text-slate-500">Hemat waktu Anda</p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </Section>
  );
}

