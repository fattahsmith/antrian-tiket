'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { fetchDoctors, updateDoctorStatus, } from '@/lib/doctorUtils';
import { Doctor, DoctorStatus } from '@/types/doctor';
import { Stethoscope, Clock, CircleDot, User, Coffee, Plus } from 'lucide-react';
import AddDoctorModal from './AddDoctorModal';

export default function DoctorsView() {
    const [doctors, setDoctors] = useState<Doctor[]>([]);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState<string | null>(null);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);

    useEffect(() => {
        loadDoctors();

        // Realtime subscription
        const channel = supabase
            .channel('doctors-dashboard')
            .on(
                'postgres_changes',
                { event: '*', schema: 'public', table: 'doctors' },
                (payload) => {
                    // Optimistic or fetches again, here we fetch simply to ensure join correctness
                    loadDoctors();
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, []);

    const loadDoctors = async () => {
        const data = await fetchDoctors();
        setDoctors(data);
        setLoading(false);
    };

    const handleStatusChange = async (doctor: Doctor, newStatus: DoctorStatus) => {
        // Optimistic update
        setDoctors((prev) =>
            prev.map((d) => (d.id === doctor.id ? { ...d, status: newStatus } : d))
        );
        setActionLoading(doctor.id);

        try {
            await updateDoctorStatus(doctor.id, newStatus);
        } catch (error) {
            // Revert on error
            console.error('Failed to update status', error);
            loadDoctors();
        } finally {
            setActionLoading(null);
        }
    };

    const getStatusColor = (status: DoctorStatus) => {
        switch (status) {
            case 'practice':
                return 'bg-emerald-100 text-emerald-700 border-emerald-200';
            case 'online':
                return 'bg-blue-100 text-blue-700 border-blue-200';
            case 'cuti':
                return 'bg-amber-100 text-amber-700 border-amber-200';
            default:
                return 'bg-slate-100 text-slate-600 border-slate-200';
        }
    };

    const getStatusLabel = (status: DoctorStatus) => {
        switch (status) {
            case 'practice': return 'Sedang Praktik';
            case 'online': return 'Tersedia';
            case 'cuti': return 'Cuti';
            case 'offline': return 'Offline';
            default: return status;
        }
    }

    if (loading) {
        return (
            <div className="flex h-64 items-center justify-center">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-500 border-t-transparent"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="rounded-xl bg-white p-6 shadow-sm border border-slate-100">
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h2 className="text-2xl font-semibold text-slate-900">Manajemen Dokter</h2>
                        <p className="text-slate-500 text-sm mt-1">Atur jadwal dan status kehadiran dokter</p>
                    </div>

                    <button
                        onClick={() => setIsAddModalOpen(true)}
                        className="inline-flex items-center gap-2 px-4 py-2.5 bg-indigo-600 text-white text-sm font-semibold rounded-xl hover:bg-indigo-700 transition-colors shadow-sm shadow-indigo-100"
                    >
                        <Plus size={18} />
                        Tambah Dokter
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {doctors.map((doctor) => (
                        <div
                            key={doctor.id}
                            className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 transition-all hover:shadow-lg hover:border-indigo-100"
                        >
                            <div className="flex items-start justify-between pb-4 border-b border-slate-100 mb-4">
                                <div className="flex gap-4">
                                    <div className="h-12 w-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 text-xl font-bold overflow-hidden border-2 border-white shadow-sm relative">
                                        {doctor.image_url ? (
                                            <img
                                                src={doctor.image_url}
                                                alt={doctor.profiles?.name}
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <User size={24} />
                                        )}
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-slate-900 line-clamp-1">{doctor.profiles?.name}</h3>
                                        <p className="text-xs font-medium text-indigo-600 uppercase tracking-wide mt-0.5">
                                            {doctor.specialty}
                                        </p>
                                    </div>
                                </div>
                                <div className={`px-2.5 py-1 rounded-full text-xs font-bold border flex items-center gap-1.5 ${getStatusColor(doctor.status)}`}>
                                    <div className={`w-1.5 h-1.5 rounded-full ${doctor.status === 'practice' ? 'bg-emerald-500 animate-pulse' :
                                        doctor.status === 'online' ? 'bg-blue-500' :
                                            doctor.status === 'cuti' ? 'bg-amber-500' : 'bg-slate-400'
                                        }`} />
                                    {getStatusLabel(doctor.status)}
                                </div>
                            </div>

                            <div className="space-y-3 mb-6">
                                <div className="flex items-center gap-2 text-sm text-slate-600 bg-slate-50 px-3 py-2 rounded-lg">
                                    <Clock className="w-4 h-4 text-indigo-500" />
                                    <span className="text-xs font-medium">
                                        Jadwal: {doctor.practice_start?.slice(0, 5)} - {doctor.practice_end?.slice(0, 5)}
                                    </span>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-2">
                                <button
                                    onClick={() => handleStatusChange(doctor, 'practice')}
                                    disabled={actionLoading === doctor.id}
                                    className={`px-3 py-2 rounded-lg text-xs font-semibold transition-all flex items-center justify-center gap-2
                    ${doctor.status === 'practice'
                                            ? 'bg-emerald-600 text-white shadow-md shadow-emerald-200'
                                            : 'bg-white border border-emerald-200 text-emerald-700 hover:bg-emerald-50'
                                        }`}
                                >
                                    <CircleDot size={14} />
                                    Praktek
                                </button>
                                <button
                                    onClick={() => handleStatusChange(doctor, 'online')}
                                    disabled={actionLoading === doctor.id}
                                    className={`px-3 py-2 rounded-lg text-xs font-semibold transition-all flex items-center justify-center gap-2
                    ${doctor.status === 'online'
                                            ? 'bg-blue-600 text-white shadow-md shadow-blue-200'
                                            : 'bg-white border border-blue-200 text-blue-700 hover:bg-blue-50'
                                        }`}
                                >
                                    <User size={14} />
                                    Standby
                                </button>
                                <button
                                    onClick={() => handleStatusChange(doctor, 'cuti')}
                                    disabled={actionLoading === doctor.id}
                                    className={`px-3 py-2 rounded-lg text-xs font-semibold transition-all flex items-center justify-center gap-2
                    ${doctor.status === 'cuti'
                                            ? 'bg-amber-500 text-white shadow-md shadow-amber-200'
                                            : 'bg-white border border-amber-200 text-amber-700 hover:bg-amber-50'
                                        }`}
                                >
                                    <Coffee size={14} />
                                    Cuti
                                </button>
                                <button
                                    onClick={() => handleStatusChange(doctor, 'offline')}
                                    disabled={actionLoading === doctor.id}
                                    className={`px-3 py-2 rounded-lg text-xs font-semibold transition-all flex items-center justify-center gap-2
                    ${doctor.status === 'offline'
                                            ? 'bg-slate-600 text-white shadow-md shadow-slate-200'
                                            : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
                                        }`}
                                >
                                    Offline
                                </button>
                            </div>
                        </div>
                    ))}

                    {doctors.length === 0 && (
                        <div className="col-span-full py-12 text-center text-slate-500 bg-slate-50 rounded-2xl border border-dashed border-slate-300">
                            <p>Belum ada data dokter.</p>
                        </div>
                    )}
                </div>
            </div>

            <AddDoctorModal
                isOpen={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
                onSuccess={() => {
                    loadDoctors();
                }}
            />
        </div>
    );
}
