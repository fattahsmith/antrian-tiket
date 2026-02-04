'use client';

import { useState } from 'react';
import { X, UserPlus, Clock, Stethoscope, Upload, Image as ImageIcon } from 'lucide-react';
import { createDoctor } from '@/lib/doctorUtils';
import Image from 'next/image';

interface AddDoctorModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
}



export default function AddDoctorModal({ isOpen, onClose, onSuccess }: AddDoctorModalProps) {
    const [formData, setFormData] = useState({
        name: '',
        specialty: '',
        practice_start: '',
        practice_end: '',
    });
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        try {
            if (!formData.name || !formData.specialty || !formData.practice_start || !formData.practice_end) {
                throw new Error('Mohon lengkapi semua data');
            }

            const { error: insertError } = await createDoctor({
                name: formData.name,
                specialty: formData.specialty,
                practice_start: formData.practice_start,
                practice_end: formData.practice_end,
                image: imageFile
            });

            if (insertError) throw insertError;

            // Reset & Close
            setFormData({ name: '', specialty: '', practice_start: '', practice_end: '' });
            setImageFile(null);
            setPreviewUrl(null);
            onSuccess();
            onClose();
        } catch (err: any) {
            console.error('CREATE DOCTOR ERROR:', err);

            setError(
                err?.message ||
                err?.details ||
                err?.hint ||
                'Gagal menambahkan dokter'
            );
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity"
                onClick={onClose}
            />

            {/* Modal */}
            <div className="relative w-full max-w-lg transform overflow-hidden rounded-2xl bg-white p-6 text-left shadow-xl transition-all animate-in fade-in zoom-in-95 duration-200">
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h3 className="text-xl font-bold text-slate-900 leading-6">Tambah Dokter Baru</h3>
                        <p className="mt-1 text-sm text-slate-500">Masukkan informasi dokter untuk ditampilkan di jadwal.</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="rounded-full p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-500 transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {error && (
                        <div className="rounded-lg bg-red-50 p-3 text-sm text-red-600 border border-red-100">
                            {error}
                        </div>
                    )}

                    <div className="space-y-4">
                        {/* Image Upload */}
                        <div className="flex justify-center mb-6">
                            <div className="relative group">
                                <div className="w-24 h-24 rounded-full overflow-hidden bg-slate-100 border-2 border-slate-200 flex items-center justify-center relative">
                                    {previewUrl ? (
                                        <Image
                                            src={previewUrl}
                                            alt="Preview"
                                            fill
                                            className="object-cover"
                                        />
                                    ) : (
                                        <ImageIcon className="text-slate-400 w-8 h-8" />
                                    )}
                                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                                        <Upload className="text-white w-6 h-6" />
                                    </div>
                                </div>
                                <input
                                    type="file"
                                    accept="image/*"
                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                    onChange={(e) => {
                                        const file = e.target.files?.[0];
                                        if (file) {
                                            setImageFile(file);
                                            setPreviewUrl(URL.createObjectURL(file));
                                        }
                                    }}
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Nama Lengkap</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                                    <UserPlus size={16} />
                                </div>
                                <input
                                    type="text"
                                    placeholder="Contoh: dr. Amanda Manopo, Sp.PD"
                                    className="block w-full rounded-lg border-slate-200 pl-10 pr-3 py-2.5 text-sm focus:border-indigo-500 focus:ring-indigo-500 shadow-sm border"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Spesialis</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                                    <Stethoscope size={16} />
                                </div>
                                <input
                                    type="text"
                                    placeholder="Contoh: Spesialis Penyakit Dalam"
                                    className="block w-full rounded-lg border-slate-200 pl-10 pr-3 py-2.5 text-sm focus:border-indigo-500 focus:ring-indigo-500 shadow-sm border"
                                    value={formData.specialty}
                                    onChange={(e) => setFormData({ ...formData, specialty: e.target.value })}
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Jam Mulai</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                                        <Clock size={16} />
                                    </div>
                                    <input
                                        type="time"
                                        className="block w-full rounded-lg border-slate-200 pl-10 pr-3 py-2.5 text-sm focus:border-indigo-500 focus:ring-indigo-500 shadow-sm border"
                                        value={formData.practice_start}
                                        onChange={(e) => setFormData({ ...formData, practice_start: e.target.value })}
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Jam Selesai</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                                        <Clock size={16} />
                                    </div>
                                    <input
                                        type="time"
                                        className="block w-full rounded-lg border-slate-200 pl-10 pr-3 py-2.5 text-sm focus:border-indigo-500 focus:ring-indigo-500 shadow-sm border"
                                        value={formData.practice_end}
                                        onChange={(e) => setFormData({ ...formData, practice_end: e.target.value })}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="mt-6 flex justify-end gap-3 pt-4 border-t border-slate-100">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                            Batal
                        </button>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="inline-flex justify-center px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isLoading ? 'Menyimpan...' : 'Simpan Dokter'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
