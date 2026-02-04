'use client';

import { motion } from 'framer-motion';
import { Check, ShieldCheck, Activity, Users } from 'lucide-react';
import Section from './Section';
import Image from "next/image";

export default function About() {
  const features = [
    'Memberikan pelayanan kesehatan yang aman, cepat, dan berkualitas',
    'Mengedepankan keselamatan, kenyamanan, dan privasi pasien',
    'Mengembangkan teknologi digital untuk mendukung proses pelayanan',
    'Meningkatkan kompetensi tenaga medis melalui pelatihan berkelanjutan',
  ];

  return (
    <Section id="about" className="py-15 bg-white relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-blue-50 rounded-full blur-3xl opacity-60" />
      <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 bg-teal-50 rounded-full blur-3xl opacity-60" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">

          {/* Left - Image Composition */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="relative"
          >
            <div className="relative">
              {/* Decorative backdrop for images */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[110%] h-[110%] border border-blue-100 rounded-[2.5rem] -rotate-6 transform" />

              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ repeat: Infinity, duration: 5, ease: "easeInOut" }}
                className="relative z-10 w-full h-[450px] rounded-2xl overflow-hidden shadow-2xl shadow-blue-200/50"
              >
                <Image
                  src="/kumdoc.jpg"
                  alt="Fasilitas Medis Modern"
                  width={700}
                  height={500}
                  className="object-cover w-full h-full hover:scale-105 transition-transform duration-700"
                  priority
                />
                {/* Gradient Overlay */}
                <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/50 to-transparent" />
              </motion.div>

              {/* Floating Badge/Second Image */}
              <motion.div
                initial={{ opacity: 0, y: 40, scale: 0.9 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4, duration: 0.6 }}
                className="absolute -bottom-10 -right-4 lg:-right-10 w-48 h-48 rounded-2xl overflow-hidden shadow-2xl border-4 border-white z-20 group"
              >
                <Image
                  src="/kumdoc2.jpg"
                  alt="Dokter Profesional"
                  width={300}
                  height={300}
                  className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-500"
                />
              </motion.div>
            </div>
          </motion.div>

          {/* Right - Content */}
          <div className="space-y-1">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className="inline-block px-3 py-1 mb-4 text-xs font-semibold tracking-wider text-blue-600 uppercase bg-blue-50 rounded-full">
                Tentang Kami
              </div>
              <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 leading-tight">
                Kesehatan Anda Adalah <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-teal-500">Prioritas Utama</span>
              </h2>
            </motion.div>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="text-lg text-gray-600 leading-relaxed"
            >
              Kami berkomitmen untuk memberikan pelayanan kesehatan yang aman,
              modern, dan penuh kasih. Dengan teknologi terkini dan tim medis
              yang berpengalaman, kami hadir untuk mendampingi perjalanan
              kesehatan Anda setiap langkahnya.
            </motion.p>

            <div className="space-y-4 pt-4">
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3 + index * 0.1, duration: 0.5 }}
                  whileHover={{ x: 5 }}
                  className="flex items-start space-x-4 p-3 rounded-xl hover:bg-gray-50 transition-colors cursor-default group"
                >
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center group-hover:bg-blue-600 transition-colors duration-300">
                    <Check className="w-5 h-5 text-blue-600 group-hover:text-white transition-colors duration-300" />
                  </div>
                  <p className="text-gray-700 font-medium group-hover:text-gray-900 transition-colors pt-2">{feature}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Section>
  );
}


