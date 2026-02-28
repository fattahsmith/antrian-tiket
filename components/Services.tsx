'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Baby, Stethoscope, HeartPulse, Activity } from 'lucide-react';

export default function Services() {
  const services = [
    {
      title: 'Kandungan',
      description: 'Pelayanan kesehatan ibu dan janin dengan teknologi USG 4D terkini dan dokter spesialis berpengalaman.',
      image: '/images/kandungan.jpg',
      icon: Baby,
      gradient: 'from-pink-500 to-rose-400',
      lightBg: 'bg-pink-50',
      iconColor: 'text-pink-600',
      border: 'border-pink-100',
      hoverBorder: 'hover:border-pink-300',
      accent: 'from-pink-500 to-rose-400',
    },
    {
      title: 'Poli Umum',
      description: 'Penanganan pertama yang cepat dan tepat untuk berbagai keluhan kesehatan keluarga Anda.',
      image: '/images/poliumum.jpg',
      icon: Stethoscope,
      gradient: 'from-blue-500 to-cyan-400',
      lightBg: 'bg-blue-50',
      iconColor: 'text-blue-600',
      border: 'border-blue-100',
      hoverBorder: 'hover:border-blue-300',
      accent: 'from-blue-500 to-cyan-400',
    },
    {
      title: 'Spesialis Anak',
      description: 'Pendekatan ramah anak untuk tumbuh kembang optimal buah hati Anda.',
      image: '/images/speanak.jpg',
      icon: Activity,
      gradient: 'from-amber-500 to-orange-400',
      lightBg: 'bg-amber-50',
      iconColor: 'text-amber-600',
      border: 'border-amber-100',
      hoverBorder: 'hover:border-amber-300',
      accent: 'from-amber-500 to-orange-400',
    },
    {
      title: 'UGD & Rawat Inap',
      description: 'Layanan gawat darurat 24 jam dengan fasilitas rawat inap yang nyaman dan modern.',
      image: '/images/ugd.jpg',
      icon: HeartPulse,
      gradient: 'from-emerald-500 to-teal-400',
      lightBg: 'bg-emerald-50',
      iconColor: 'text-emerald-600',
      border: 'border-emerald-100',
      hoverBorder: 'hover:border-emerald-300',
      accent: 'from-emerald-500 to-teal-400',
    },
  ];

  /* ─── animation variants ─────────────────────────── */
  const container = {
    hidden: {},
    show: { transition: { staggerChildren: 0.12 } },
  };

  const item: any = {
    hidden: { opacity: 0, y: 36 },
    show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: 'easeOut' } },
  };

  return (
    <section id="services" className="relative overflow-hidden bg-white py-24">
      {/* ── decorative blobs ── */}
      <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full bg-blue-50 blur-[120px] translate-x-1/3 -translate-y-1/3 opacity-70" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] rounded-full bg-indigo-50 blur-[100px] -translate-x-1/3 translate-y-1/3 opacity-70" />
      </div>

      {/* ── subtle dot pattern ── */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: 'radial-gradient(circle, #6366f1 1.5px, transparent 1.5px)',
          backgroundSize: '32px 32px',
        }}
      />

      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        {/* HEADER SECTION */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="text-center mb-16 space-y-6 max-w-3xl mx-auto"
        >
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-blue-200 bg-blue-50 text-blue-600 text-sm font-medium">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-blue-500" />
            </span>
            Layanan Kami
          </div>

          <h2 className="text-4xl sm:text-5xl font-extrabold text-gray-900 tracking-tight leading-tight">
            Solusi Kesehatan{' '}
            <span className="relative inline-block">
              <span className="bg-gradient-to-r from-blue-600 via-indigo-500 to-cyan-500 bg-clip-text text-transparent">
                Komprehensif
              </span>
              <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-gradient-to-r from-blue-500 to-cyan-400 rounded-full" />
            </span>
          </h2>
          <p className="text-gray-500 text-lg leading-relaxed">
            Didukung oleh tenaga medis profesional dan teknologi modern, kami siap melayani kebutuhan kesehatan Anda dan keluarga.
          </p>
        </motion.div>

        {/* SERVICE CARDS */}
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-50px' }}
          className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 xl:gap-8"
        >
          {services.map((service, index) => (
            <motion.div
              key={index}
              variants={item}
              whileHover={{ y: -8, transition: { duration: 0.25 } }}
              className={`group flex flex-col relative rounded-3xl border ${service.border} ${service.hoverBorder} bg-white shadow-sm hover:shadow-xl hover:shadow-blue-100/40 transition-all duration-300 overflow-hidden h-full`}
            >
              {/* Image Section */}
              <div className="relative h-56 lg:h-48 xl:h-52 overflow-hidden bg-slate-100">
                {service.image.startsWith('/') ? (
                  <Image
                    src={service.image}
                    alt={service.title}
                    fill
                    className="object-cover transform group-hover:scale-105 transition-transform duration-700 ease-out"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-slate-400">
                    <span className="text-sm">No Image</span>
                  </div>
                )}
                {/* Overlay Soft Gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900/60 via-gray-900/20 to-transparent opacity-80 group-hover:opacity-60 transition-opacity duration-300" />

                {/* Floating Icon Over Image */}
                <div className="absolute bottom-4 right-4 z-10 w-12 h-12 rounded-2xl bg-white/95 backdrop-blur-md shadow-lg flex items-center justify-center group-hover:-translate-y-1 transition-transform duration-300 ease-out">
                  <service.icon className={`w-6 h-6 ${service.iconColor}`} strokeWidth={2.5} />
                </div>
              </div>

              {/* Content Section */}
              <div className="p-6 sm:p-7 flex flex-col flex-1 relative z-20 bg-white">
                <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors duration-200">
                  {service.title}
                </h3>
                <p className="text-gray-500 text-sm leading-relaxed mb-8 flex-1">
                  {service.description}
                </p>

                <Link href="/booking" className="mt-auto block">
                  <button className="w-full relative flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-medium text-sm transition-all duration-300 bg-gray-50 text-gray-700 hover:text-white group/btn overflow-hidden z-10">
                    {/* Background Sweep */}
                    <span className={`absolute inset-0 w-full h-full bg-gradient-to-r ${service.gradient} opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300 -z-10`} />
                    Daftar Antrian
                    <ArrowRight className="w-4 h-4 transform group-hover/btn:translate-x-1 transition-transform duration-300" />
                  </button>
                </Link>
              </div>

              {/* Bottom accent sweep */}
              <div
                className={`absolute bottom-0 left-0 h-1 w-0 group-hover:w-full bg-gradient-to-r ${service.accent} transition-all duration-500`}
              />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

