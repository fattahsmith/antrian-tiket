'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Section from './Section';
import Image from 'next/image';
import Link from 'next/link';
import { Calendar, Clock, ArrowUpRight, Star, User } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { fetchDoctors } from '@/lib/doctorUtils';
import { Doctor } from '@/types/doctor';

export default function Doctors() {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDoctors();

    const channel = supabase
      .channel('doctors-public')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'doctors' },
        () => {
          loadDoctors();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
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

  return (
    <Section id="doctors" className="py-10 bg-slate-50 relative overflow-hidden">
      <div className="absolute top-1/4 right-0 w-[400px] h-[400px] bg-blue-100 rounded-full blur-[100px] -z-10" />
      <div className="absolute bottom-1/4 left-0 w-[300px] h-[300px] bg-indigo-50 rounded-full blur-[80px] -z-10" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-5 lg:pt-5">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16 space-y-2"
        >
          <div className="inline-block px-4 py-1.5 rounded-full bg-indigo-100/50 border border-indigo-200 text-indigo-700 text-sm font-semibold tracking-wide uppercase">
            Tim Medis Profesional
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-slate-900 tracking-tight">
            Bertemu dengan Dokter Kami
          </h2>
          <p className="text-slate-600 text-lg max-w-2xl mx-auto leading-relaxed">
            Didukung oleh tim dokter spesialis berpengalaman yang siap memberikan pelayanan kesehatan terbaik untuk pemulihan Anda.
          </p>
        </motion.div>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-indigo-500 border-t-transparent"></div>
          </div>
        ) : (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-50px" }}
            className="grid md:grid-cols-2 lg:grid-cols-4 gap-8"
          >
            {doctors.map((doctor) => {
              const isPracticing = doctor.status === 'practice';
              const isAvailable = doctor.status === 'online' || isPracticing;

              return (
                <motion.div
                  key={doctor.id}
                  variants={itemVariants}
                  whileHover={{ y: -10 }}
                  className={`group bg-white rounded-[2rem] p-4 shadow-lg hover:shadow-2xl transition-all duration-300 border relative ${isPracticing ? 'border-emerald-200 ring-1 ring-emerald-100' : 'border-slate-100'
                    }`}
                >
                  {/* Status Badge */}
                  <div className="absolute top-6 left-6 z-10">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider shadow-sm border ${doctor.status === 'practice' ? 'bg-emerald-500 text-white border-emerald-400' :
                      doctor.status === 'online' ? 'bg-blue-500 text-white border-blue-400' :
                        doctor.status === 'cuti' ? 'bg-amber-500 text-white border-amber-400' :
                          'bg-slate-200 text-slate-500 border-slate-300'
                      }`}>
                      {doctor.status === 'practice' ? 'Sedang Praktik' :
                        doctor.status === 'online' ? 'Tersedia' :
                          doctor.status === 'cuti' ? 'Cuti' : 'Offline'}
                    </span>
                  </div>

                  {/* Image Section */}
                  <div className="relative aspect-[4/5] rounded-[1.5rem] overflow-hidden bg-slate-100 mb-5">
                    {doctor.image_url ? (
                      <img
                        src={doctor.image_url}
                        alt={doctor.profiles?.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-slate-300 bg-slate-50">
                        <User size={64} />
                      </div>
                    )}

                    {/* Rating Badge (Mock for now) */}
                    <div className="absolute bottom-3 right-3 bg-white/90 backdrop-blur-sm px-2.5 py-1 rounded-full shadow-sm flex items-center gap-1">
                      <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
                      <span className="text-xs font-bold text-slate-700">4.9</span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="px-2 pb-2">
                    <div className="mb-1 text-indigo-600 text-xs font-bold uppercase tracking-wider">
                      {doctor.specialty}
                    </div>
                    <h3 className="text-lg font-bold text-slate-900 mb-1 leading-snug line-clamp-1" title={doctor.profiles?.name}>
                      {doctor.profiles?.name}
                    </h3>

                    <div className="space-y-2 mb-6 mt-4">
                      <div className="flex items-center gap-2 text-sm text-slate-600 bg-slate-50 p-2 rounded-lg">
                        <Calendar className="w-4 h-4 text-indigo-500" />
                        <span className="text-xs font-medium">Senin - Jumat</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-slate-600 bg-slate-50 p-2 rounded-lg">
                        <Clock className="w-4 h-4 text-indigo-500" />
                        <span className="text-xs font-medium">
                          {doctor.practice_start?.slice(0, 5)} - {doctor.practice_end?.slice(0, 5)}
                        </span>
                      </div>
                    </div>

                    <Link href="/booking" className={!isAvailable ? 'pointer-events-none' : ''}>
                      <button
                        disabled={!isAvailable}
                        className={`w-full py-3 rounded-xl font-semibold text-sm transition-colors flex items-center justify-center gap-2
                                ${isAvailable
                            ? 'bg-slate-900 text-white hover:bg-slate-800 group-hover:bg-indigo-600 group-hover:shadow-lg group-hover:shadow-indigo-500/25'
                            : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                          }`}
                      >
                        {isAvailable ? 'Buat Janji Temu' : 'Tidak Tersedia'}
                        <ArrowUpRight className="w-4 h-4" />
                      </button>
                    </Link>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        )}
      </div>
    </Section >
  );
}

