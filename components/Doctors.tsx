'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import {
  Calendar,
  Clock,
  ArrowRight,
  Star,
  User,
  ChevronLeft,
  ChevronRight,
  Stethoscope,
} from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { fetchDoctors } from '@/lib/doctorUtils';
import { Doctor } from '@/types/doctor';

/* ── Status config ─────────────────────────────────────────── */
const statusConfig: Record<string, { label: string; dot: string; badge: string }> = {
  practice: {
    label: 'Sedang Praktik',
    dot: 'bg-emerald-400',
    badge: 'bg-emerald-50 text-emerald-700 border border-emerald-200',
  },
  online: {
    label: 'Tersedia',
    dot: 'bg-blue-400',
    badge: 'bg-blue-50 text-blue-700 border border-blue-200',
  },
  cuti: {
    label: 'Cuti',
    dot: 'bg-amber-400',
    badge: 'bg-amber-50 text-amber-700 border border-amber-200',
  },
  offline: {
    label: 'Offline',
    dot: 'bg-slate-300',
    badge: 'bg-slate-50 text-slate-500 border border-slate-200',
  },
};

/* ── Skeleton card ─────────────────────────────────────────── */
function SkeletonCard() {
  return (
    <div className="flex-shrink-0 w-[260px] rounded-3xl bg-white border border-slate-100 shadow-sm overflow-hidden animate-pulse">
      <div className="w-full h-48 bg-slate-100" />
      <div className="p-5 space-y-3">
        <div className="h-3 w-24 bg-slate-100 rounded-full" />
        <div className="h-4 w-40 bg-slate-100 rounded-full" />
        <div className="h-3 w-32 bg-slate-100 rounded-full" />
        <div className="h-3 w-28 bg-slate-100 rounded-full" />
        <div className="h-9 w-full bg-slate-100 rounded-xl mt-2" />
      </div>
    </div>
  );
}

/* ── Doctor card ───────────────────────────────────────────── */
function DoctorCard({ doctor, index }: { doctor: Doctor; index: number }) {
  const isAvailable =
    doctor.status === 'online' || doctor.status === 'practice';
  const status =
    statusConfig[doctor.status ?? 'offline'] ?? statusConfig.offline;

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-30px' }}
      transition={{ delay: index * 0.06, duration: 0.45, type: 'spring', stiffness: 90 }}
      whileHover={{ y: -6 }}
      className="group snap-start flex-shrink-0 w-[260px] bg-white rounded-3xl border border-slate-100
                 shadow-md hover:shadow-xl hover:border-blue-100 transition-all duration-300 flex flex-col overflow-hidden"
    >
      {/* ── Image area ── */}
      <div className="relative w-full h-48 bg-gradient-to-br from-blue-50 to-indigo-100 overflow-hidden">
        {doctor.image_url ? (
          <img
            src={doctor.image_url}
            alt={doctor.profiles?.name}
            className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <div className="w-20 h-20 rounded-full bg-white/60 backdrop-blur-sm flex items-center justify-center shadow-inner">
              <User className="w-10 h-10 text-blue-300" />
            </div>
          </div>
        )}

        {/* Gradient overlay at bottom */}
        <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/20 to-transparent" />

        {/* Status badge top-left */}
        <span
          className={`absolute top-3 left-3 flex items-center gap-1.5 text-[10px] font-semibold px-2.5 py-1 rounded-full backdrop-blur-sm ${status.badge}`}
        >
          <span className={`w-1.5 h-1.5 rounded-full ${status.dot} animate-pulse`} />
          {status.label}
        </span>

        {/* Rating badge top-right */}
        <div className="absolute top-3 right-3 flex items-center gap-1 bg-white/90 backdrop-blur-sm px-2.5 py-1 rounded-full shadow-sm">
          <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
          <span className="text-[10px] font-bold text-slate-700">4.9</span>
        </div>
      </div>

      {/* ── Info ── */}
      <div className="flex flex-col flex-1 p-5 gap-3">
        {/* Specialty & Name */}
        <div>
          <p className="text-[10px] font-bold text-blue-600 uppercase tracking-widest truncate">
            {doctor.specialty}
          </p>
          <h3
            className="text-base font-bold text-slate-900 leading-snug line-clamp-1 mt-1"
            title={doctor.profiles?.name}
          >
            {doctor.profiles?.name}
          </h3>
        </div>

        {/* Divider */}
        <div className="border-t border-slate-100" />

        {/* Schedule */}
        <div className="space-y-1.5">
          <div className="flex items-center gap-2 text-slate-500">
            <div className="w-5 h-5 rounded-md bg-blue-50 flex items-center justify-center flex-shrink-0">
              <Calendar className="w-3 h-3 text-blue-500" />
            </div>
            <span className="text-[11px]">Senin – Jumat</span>
          </div>
          <div className="flex items-center gap-2 text-slate-500">
            <div className="w-5 h-5 rounded-md bg-blue-50 flex items-center justify-center flex-shrink-0">
              <Clock className="w-3 h-3 text-blue-500" />
            </div>
            <span className="text-[11px]">
              {doctor.practice_start?.slice(0, 5)} – {doctor.practice_end?.slice(0, 5)}
            </span>
          </div>
        </div>

        {/* CTA */}
        <Link
          href="/booking"
          className={`mt-auto ${!isAvailable ? 'pointer-events-none' : ''}`}
        >
          <button
            disabled={!isAvailable}
            className={`w-full py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all duration-300
              ${isAvailable
                ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700 shadow-md hover:shadow-blue-500/30 hover:shadow-lg'
                : 'bg-slate-100 text-slate-400 cursor-not-allowed'
              }`}
          >
            {isAvailable ? 'Buat Janji Sekarang' : 'Tidak Tersedia'}
            {isAvailable && <ArrowRight className="w-3.5 h-3.5" />}
          </button>
        </Link>
      </div>
    </motion.div>
  );
}

/* ── Main component ────────────────────────────────────────── */
export default function Doctors() {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  useEffect(() => {
    loadDoctors();
    const channel = supabase
      .channel('doctors-public')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'doctors' }, loadDoctors)
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, []);

  const loadDoctors = async () => {
    try {
      const data = await fetchDoctors();
      setDoctors(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const updateScrollButtons = () => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 8);
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 8);
  };

  const scroll = (dir: 'left' | 'right') => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollBy({ left: dir === 'left' ? -280 : 280, behavior: 'smooth' });
  };

  return (
    <section id="doctors" className="relative py-24 overflow-hidden bg-gradient-to-b from-slate-50 to-white">
      {/* Decorative blobs */}
      <div aria-hidden className="pointer-events-none absolute -top-28 -right-28 w-[440px] h-[440px] rounded-full bg-blue-100 opacity-40 blur-3xl" />
      <div aria-hidden className="pointer-events-none absolute -bottom-28 -left-28 w-[400px] h-[400px] rounded-full bg-indigo-100 opacity-40 blur-3xl" />

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* ── Header ── */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6 mb-12"
        >
          {/* Left: title */}
          <div className="space-y-3">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50 border border-blue-100 text-blue-600 text-sm font-medium">
              <Stethoscope className="w-4 h-4" />
              Tim Medis Profesional
            </span>
            <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 leading-tight">
              Dokter{' '}
              <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Kami
              </span>
            </h2>
            <p className="text-gray-500 text-base max-w-md leading-relaxed">
              Tim spesialis berpengalaman siap memberikan pelayanan kesehatan terbaik untuk Anda.
            </p>
          </div>

          {/* Right: scroll controls */}
          <div className="flex items-center gap-3 flex-shrink-0">
            <button
              onClick={() => scroll('left')}
              disabled={!canScrollLeft}
              aria-label="Scroll left"
              className="w-10 h-10 rounded-full border border-slate-200 bg-white flex items-center justify-center
                         text-slate-500 hover:text-blue-600 hover:border-blue-300 hover:shadow-md
                         disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-200"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              onClick={() => scroll('right')}
              disabled={!canScrollRight}
              aria-label="Scroll right"
              className="w-10 h-10 rounded-full border border-slate-200 bg-white flex items-center justify-center
                         text-slate-500 hover:text-blue-600 hover:border-blue-300 hover:shadow-md
                         disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-200"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </motion.div>

        {/* ── Cards track ── */}
        <AnimatePresence mode="wait">
          {loading ? (
            <motion.div
              key="skeleton"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex gap-5 overflow-hidden pb-2"
            >
              {[...Array(4)].map((_, i) => <SkeletonCard key={i} />)}
            </motion.div>
          ) : (
            <motion.div
              key="cards"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4 }}
              ref={scrollRef}
              onScroll={updateScrollButtons}
              className="flex gap-5 overflow-x-auto scroll-smooth snap-x snap-mandatory pb-4
                         [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
            >
              {doctors.map((doctor, index) => (
                <DoctorCard key={doctor.id} doctor={doctor} index={index} />
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Bottom stats ── */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-16 grid grid-cols-3 gap-4 sm:gap-6 text-center"
        >
          {[
            { value: '20+', label: 'Dokter Spesialis' },
            { value: '4.9★', label: 'Rating Rata-rata' },
            { value: '15K+', label: 'Pasien Ditangani' },
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
