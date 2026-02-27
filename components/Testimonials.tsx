'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';

const testimonials = [
  {
    name: 'Wanto',
    age: 28,
    role: 'Pasien Umum',
    text: 'Sangat memudahkan! Tidak perlu antri lama di rumah sakit. Tinggal daftar online, datang sesuai jadwal, langsung dilayani.',
    avatar: '/masbud2.png',
    rating: 5,
  },
  {
    name: 'Budi',
    age: 35,
    role: 'Pasien BPJS',
    text: 'Sistem antrian online ini sangat membantu. Saya bisa daftar dari rumah dan tahu estimasi waktu tunggu. Recommended!',
    avatar: '/masbud.png',
    rating: 5,
  },
  {
    name: 'Sari',
    age: 42,
    role: 'Pasien Rawat Jalan',
    text: 'Pelayanan cepat dan efisien. Tidak perlu repot datang pagi-pagi untuk antri. Sistem ini benar-benar menghemat waktu.',
    avatar: '/women.jpg',
    rating: 5,
  },
];

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.15 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
};

function StarRating({ count }: { count: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: count }).map((_, i) => (
        <svg
          key={i}
          className="w-4 h-4 text-amber-400"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
}

export default function Testimonials() {
  return (
    <section className="relative py-24 overflow-hidden bg-gradient-to-b from-slate-50 to-white">
      {/* Decorative blobs */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-32 -left-32 w-[420px] h-[420px] rounded-full bg-blue-100 opacity-40 blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-32 -right-32 w-[420px] h-[420px] rounded-full bg-indigo-100 opacity-40 blur-3xl"
      />

      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50 border border-blue-100 text-blue-600 text-sm font-medium mb-4">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-3 3-3-3z" />
            </svg>
            Testimoni
          </span>

          <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4 leading-tight">
            Apa Kata{' '}
            <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Pengguna Kami
            </span>
          </h2>
          <p className="text-gray-500 text-lg max-w-xl mx-auto">
            Ribuan pasien telah merasakan kemudahan layanan antrian online kami.
          </p>
        </motion.div>

        {/* Cards */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          {testimonials.map((t, index) => (
            <motion.div
              key={index}
              whileHover={{ y: -6, scale: 1.02 }}
              transition={{ type: 'spring', stiffness: 260, damping: 20 }}
              className="group relative bg-white rounded-3xl p-7 shadow-md hover:shadow-xl border border-gray-100 transition-shadow duration-300 flex flex-col"
            >
              {/* Top accent line */}
              <div className="absolute inset-x-0 top-0 h-1 rounded-t-3xl bg-gradient-to-r from-blue-500 to-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

              {/* Quote icon */}
              <div className="mb-5">
                <svg
                  className="w-8 h-8 text-blue-100"
                  fill="currentColor"
                  viewBox="0 0 32 32"
                >
                  <path d="M10 8C5.6 8 2 11.6 2 16s3.6 8 8 8c4.4 0 8-3.6 8-8V8h-8zm20 0c-4.4 0-8 3.6-8 8s3.6 8 8 8c4.4 0 8-3.6 8-8V8h-8z" />
                </svg>
              </div>

              {/* Star rating */}
              <StarRating count={t.rating} />

              {/* Text */}
              <p className="mt-4 text-gray-600 leading-relaxed text-[15px] flex-1">
                {t.text}
              </p>

              {/* Divider */}
              <div className="my-6 border-t border-gray-100" />

              {/* Author */}
              <div className="flex items-center gap-3">
                <div className="relative w-12 h-12 rounded-full overflow-hidden ring-2 ring-offset-2 ring-blue-100">
                  <Image
                    src={t.avatar}
                    alt={t.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div>
                  <p className="font-semibold text-gray-900 text-sm">{t.name}</p>
                  <p className="text-xs text-gray-400">
                    {t.age} tahun · {t.role}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Bottom stats banner */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-16 grid grid-cols-3 gap-4 sm:gap-8 text-center"
        >
          {[
            { value: '10K+', label: 'Pengguna Aktif' },
            { value: '4.9★', label: 'Rating Rata-rata' },
            { value: '99%', label: 'Kepuasan Pasien' },
          ].map((stat) => (
            <div
              key={stat.label}
              className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl py-6 px-4 border border-blue-100"
            >
              <p className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                {stat.value}
              </p>
              <p className="text-xs sm:text-sm text-gray-500 mt-1">{stat.label}</p>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
