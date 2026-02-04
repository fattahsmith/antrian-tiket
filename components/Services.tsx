'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import Section from './Section';
import Image from 'next/image';
import { ArrowRight, Baby, Stethoscope, HeartPulse, Activity } from 'lucide-react';

export default function Services() {
  const services = [
    {
      title: 'Kandungan',
      description: 'Pelayanan kesehatan ibu dan janin dengan teknologi USG 4D terkini dan dokter spesialis berpengalaman.',
      image: '/images/kandungan.jpg',
      icon: Baby,
      accent: 'pink'
    },
    {
      title: 'Poli Umum',
      description: 'Penanganan pertama yang cepat dan tepat untuk berbagai keluhan kesehatan keluarga Anda.',
      image: '/images/poliumum.jpg',
      icon: Stethoscope,
      accent: 'blue'
    },
    {
      title: 'Spesialis Anak',
      description: 'Pendekatan ramah anak untuk tumbuh kembang optimal buah hati Anda.',
      image: '/images/speanak.jpg',
      icon: Activity,
      accent: 'orange'
    },
    {
      title: 'UGD & Rawat Inap',
      description: 'Layanan gawat darurat 24 jam dengan fasilitas rawat inap yang nyaman dan modern.',
      image: '/images/ugd.jpg',
      icon: HeartPulse,
      accent: 'red'
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 50 } as any },
  };

  const getColorClasses = (accent: string) => {
    switch (accent) {
      case 'pink': return 'text-pink-600 bg-pink-50 group-hover:bg-pink-600 group-hover:text-white';
      case 'blue': return 'text-blue-600 bg-blue-50 group-hover:bg-blue-600 group-hover:text-white';
      case 'orange': return 'text-orange-600 bg-orange-50 group-hover:bg-orange-600 group-hover:text-white';
      case 'red': return 'text-red-600 bg-red-50 group-hover:bg-red-600 group-hover:text-white';
      default: return 'text-blue-600 bg-blue-50 group-hover:bg-blue-600 group-hover:text-white';
    }
  };

  return (
    <Section id="services" className="py-24 bg-slate-50 relative overflow-hidden">
      {/* Background Patterns */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none opacity-40">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-100 rounded-full blur-[100px] translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-teal-100 rounded-full blur-[100px] -translate-x-1/2 translate-y-1/2" />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16 space-y-4"
        >
          <div className="inline-block px-4 py-1.5 rounded-full bg-blue-100/50 border border-blue-200 text-blue-700 text-sm font-semibold tracking-wide uppercase">
            Layanan Kami
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-slate-900 tracking-tight">
            Solusi Kesehatan Komprehensif
          </h2>
          <p className="text-slate-600 text-lg max-w-2xl mx-auto leading-relaxed">
            Didukung oleh tenaga medis profesional dan teknologi modern, kami siap melayani kebutuhan kesehatan Anda dan keluarga.
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-50px" }}
          className="grid md:grid-cols-2 lg:grid-cols-4 gap-8"
        >
          {services.map((service, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              whileHover={{ y: -10 }}
              className="group bg-white rounded-[2rem] overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 border border-slate-100"
            >
              {/* Image Section */}
              <div className="relative h-56 overflow-hidden">
                <div className="absolute inset-0 bg-slate-200 animate-pulse" /> {/* Loading placeholder effect */}
                {service.image.startsWith('/') ? (
                  <Image
                    src={service.image}
                    alt={service.title}
                    fill
                    className="object-cover transform group-hover:scale-110 transition-transform duration-700"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-slate-100 text-slate-300">
                    <span className="text-sm">Image not found</span>
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />

                {/* Floating Icon */}
                <div className={`absolute bottom-4 right-4 p-3 rounded-2xl shadow-lg transition-colors duration-300 ${getColorClasses(service.accent)}`}>
                  <service.icon className="w-6 h-6" />
                </div>
              </div>

              {/* Content Section */}
              <div className="p-6 pt-8 relative">
                <h3 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-blue-600 transition-colors">
                  {service.title}
                </h3>
                <p className="text-slate-500 text-sm leading-relaxed mb-6 line-clamp-3">
                  {service.description}
                </p>

                <Link href="/booking" className="block">
                  <button className="w-full py-3 px-4 rounded-xl border border-blue-100 bg-blue-50/50 text-blue-600 font-semibold text-sm hover:bg-blue-600 hover:text-white hover:border-blue-600 transition-all duration-300 flex items-center justify-center gap-2 group/btn">
                    Daftar Antrian
                    <ArrowRight className="w-4 h-4 transform group-hover/btn:translate-x-1 transition-transform" />
                  </button>
                </Link>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </Section>
  );
}

