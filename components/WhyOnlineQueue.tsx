'use client';

import { motion } from 'framer-motion';
import { MapPin, Clock, Timer, Users, ArrowRight } from 'lucide-react';
import Image from 'next/image';
import CountUp from './CountUp';

/* ─── data ─────────────────────────────────────── */
const features = [
  {
    icon: MapPin,
    title: 'Daftar dari Mana Saja',
    description: 'Akses pendaftaran antrian tanpa batasan lokasi, cukup dari genggaman Anda.',
    gradient: 'from-blue-500 to-cyan-400',
    lightBg: 'bg-blue-50',
    iconColor: 'text-blue-600',
    border: 'border-blue-100',
    hoverBorder: 'hover:border-blue-300',
    accent: 'from-blue-500 to-cyan-400',
  },
  {
    icon: Clock,
    title: 'Real-Time & Akurat',
    description: 'Pantau status antrian secara langsung dengan estimasi waktu yang presisi.',
    gradient: 'from-violet-500 to-fuchsia-400',
    lightBg: 'bg-violet-50',
    iconColor: 'text-violet-600',
    border: 'border-violet-100',
    hoverBorder: 'hover:border-violet-300',
    accent: 'from-violet-500 to-fuchsia-400',
  },
  {
    icon: Timer,
    title: 'Efisiensi Waktu',
    description: 'Datang tepat waktu, tanpa perlu menunggu berjam-jam di ruang tunggu.',
    gradient: 'from-amber-500 to-orange-400',
    lightBg: 'bg-amber-50',
    iconColor: 'text-amber-600',
    border: 'border-amber-100',
    hoverBorder: 'hover:border-amber-300',
    accent: 'from-amber-500 to-orange-400',
  },
  {
    icon: Users,
    title: 'Pelayanan Optimal',
    description: 'Sistem terintegrasi memastikan Anda mendapatkan layanan terbaik dari petugas.',
    gradient: 'from-emerald-500 to-teal-400',
    lightBg: 'bg-emerald-50',
    iconColor: 'text-emerald-600',
    border: 'border-emerald-100',
    hoverBorder: 'hover:border-emerald-300',
    accent: 'from-emerald-500 to-teal-400',
  },
];

const stats = [
  { value: 
    <span>
    <CountUp
  from={0}
  to={50}
  separator=","
  direction="up"
  duration={1}
  className="count-up-text"
/>
<span>K+</span>
</span>
, label: 'Pasien Terlayani' },
  { value: <span>
    <CountUp
  from={0}
  to={15}
  separator=","
  direction="up"
  duration={1}
  className="count-up-text"
/>
<span>menit</span>
</span>, label: 'Rata-rata Tunggu' },
  { value: <span>
    <CountUp
  from={0}
  to={98}
  separator=","
  direction="up"
  duration={1}
  className="count-up-text"
/>
<span>%</span>
</span>, label: 'Kepuasan Pengguna' },
];

/* ─── animation variants ─────────────────────────── */
const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12 } },
};
const item = {
  hidden: { opacity: 0, y: 36 },
  show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: 'easeOut' } },
};

/* ─── component ──────────────────────────────────── */
export default function WhyOnlineQueue() {
  return (
    <section className="relative overflow-hidden bg-white py-24">
      {/* ── decorative blobs ── */}
      <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -left-40 w-[500px] h-[500px] rounded-full bg-blue-100/70 blur-[100px]" />
        <div className="absolute -bottom-40 -right-40 w-[500px] h-[500px] rounded-full bg-indigo-100/70 blur-[100px]" />
      </div>

      {/* ── subtle dot pattern ── */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.035]"
        style={{
          backgroundImage: 'radial-gradient(circle, #6366f1 1px, transparent 1px)',
          backgroundSize: '28px 28px',
        }}
      />

      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">

        {/* ══ HERO SPLIT ══════════════════════════════════ */}
        <div className="grid lg:grid-cols-2 gap-14 items-center mb-24">

          {/* left copy */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: 'easeOut' }}
            className="space-y-7"
          >
            {/* badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-blue-200 bg-blue-50 text-blue-600 text-sm font-medium">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-blue-500" />
              </span>
              Solusi Kesehatan Modern
            </div>

            {/* headline */}
            <h2 className="text-4xl sm:text-5xl xl:text-6xl font-extrabold leading-tight tracking-tight text-gray-900">
              Kenapa Harus{' '}
              <span className="relative inline-block">
                <span className="bg-gradient-to-r from-blue-600 via-indigo-500 to-cyan-500 bg-clip-text text-transparent">
                  Antrian Online?
                </span>
                <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-gradient-to-r from-blue-500 to-cyan-400 rounded-full" />
              </span>
            </h2>

            <p className="text-gray-500 text-lg leading-relaxed max-w-lg">
              Transformasi pengalaman berobat Anda menjadi lebih simpel, cepat, dan transparan.
              Fokus pada kesehatan Anda — biarkan teknologi mengatur jadwalnya.
            </p>

            {/* inline stats */}
            <div className="grid grid-cols-3 gap-4 pt-2">
              {stats.map((s) => (
                <div
                  key={s.label}
                  className="rounded-2xl border border-gray-200 bg-gray-50 px-4 py-4 text-center shadow-sm"
                >
                  <p className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                    {s.value}
                  </p>
                  <p className="text-xs text-gray-500 mt-0.5 leading-snug">{s.label}</p>
                </div>
              ))}
            </div>

            {/* CTA */}
            <motion.a
              href="/booking"
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
              className="inline-flex items-center gap-2.5 px-8 py-4 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold text-base shadow-lg shadow-blue-300/50 transition-all duration-300"
            >
              Daftar Antrian Sekarang
              <ArrowRight className="w-4 h-4" />
            </motion.a>
          </motion.div>

          {/* right image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.92 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.75, ease: 'easeOut' }}
            className="relative"
          >
            {/* soft shadow behind image */}
            <div className="absolute inset-4 rounded-3xl bg-blue-200/50 blur-2xl" />

            <motion.div
              animate={{ y: [0, -12, 0] }}
              transition={{ repeat: Infinity, duration: 6, ease: 'easeInOut' }}
              className="relative z-10"
            >
              <div className="relative rounded-3xl overflow-hidden border border-gray-200 shadow-2xl shadow-blue-100/80">
                <Image
                  src="/queue.jpg"
                  alt="Antrian Online"
                  width={800}
                  height={520}
                  className="w-full h-full object-cover"
                  priority
                />
                {/* light overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-white/30 via-transparent to-transparent" />

                {/* floating badge */}
                <div className="absolute bottom-5 left-5 right-5 flex items-center gap-3 rounded-2xl border border-white/80 bg-white/80 backdrop-blur-xl px-4 py-3 shadow-lg">
                  <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center">
                    <Timer className="w-5 h-5 text-emerald-600" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Estimasi Waktu Tunggu</p>
                    <p className="text-lg font-bold text-gray-900">~15 Menit</p>
                  </div>
                  <div className="ml-auto flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="text-xs text-emerald-600 font-semibold">Live</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>

        {/* ══ FEATURE CARDS ════════════════════════════════ */}
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-80px' }}
          className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5"
        >
          {features.map((f) => (
            <motion.div
              key={f.title}
              whileHover={{ y: -7, transition: { duration: 0.22 } }}
              className={`group relative rounded-2xl border ${f.border} ${f.hoverBorder} bg-white p-7 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden`}
            >
              {/* icon */}
              <div className={`w-12 h-12 rounded-xl mb-5 flex items-center justify-center ${f.lightBg}`}>
                <f.icon className={`w-6 h-6 ${f.iconColor}`} strokeWidth={2} />
              </div>

              <h3 className="text-base font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors duration-200">
                {f.title}
              </h3>
              <p className="text-sm text-gray-500 leading-relaxed">{f.description}</p>

              {/* bottom accent sweep */}
              <div
                className={`absolute bottom-0 left-0 h-0.5 w-0 group-hover:w-full bg-gradient-to-r ${f.accent} transition-all duration-500 rounded-b-2xl`}
              />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
