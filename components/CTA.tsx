'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import Section from './Section';
import Image from 'next/image';

export default function CTA() {
  return (
    <Section className="py-20 bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 text-white rounded-t-3xl">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="space-y-6"
          >
            <h2 className="text-4xl font-bold">
              Siap Daftar Antrian Tanpa Harus Menunggu Lama?
            </h2>
            <p className="text-blue-100 text-lg leading-relaxed">
              Dengan beberapa langkah sederhana, nomor antrian Anda sudah siap.
              Tidak perlu install aplikasi, cukup menggunakan browser di
              smartphone atau komputer Anda.
            </p>
            <Link href="/booking">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 bg-white text-blue-600 rounded-full font-semibold text-lg shadow-lg hover:shadow-xl transition-shadow"
              >
                Antri Tiket
              </motion.button>
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            <div className="relative w-full h-[400px] rounded-2xl overflow-hidden">
                <div className="text-center">
                <Image
                src="/log2.png"
                alt="Dokter profesional memberikan pelayanan ramah"
                width={520}
                height={680}
                className="w-full h-auto object-cover object-top brightness-[0.97] contrast-[1.03]' mb-10 "
                priority
              />
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </Section>
  );
}

