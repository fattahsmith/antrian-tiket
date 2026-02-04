'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from 'framer-motion';
import {
  Calendar,
  User,
  Phone,
  FileText,
  ArrowLeft,
  ChevronDown,
  CheckCircle2,
  Download,
  Printer
} from 'lucide-react';
import { Service } from '@/types/service';
import { fetchServices } from '@/lib/serviceUtils';
import { getNextQueueSequence, createQueueEntry } from '@/lib/queueUtils';
import { generateQrToken, generateQrDataUrl } from '@/lib/qrUtils';

export default function BookingPage() {
  const today = new Date().toISOString().split('T')[0];
  const [services, setServices] = useState<Service[]>([]);
  const [formData, setFormData] = useState({
    contact: '',
    name: '',
    complaint: '',
    visitDate: today,
    serviceId: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [successCode, setSuccessCode] = useState<string | null>(null);
  const [qrImageUrl, setQrImageUrl] = useState<string | null>(null);
  const [qrToken, setQrToken] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const loadServices = async () => {
      const active = await fetchServices(true);
      setServices(active);
      if (active.length > 0) {
        setFormData((prev) => ({
          ...prev,
          serviceId: prev.serviceId || String(active[0].id),
        }));
      }
    };
    loadServices();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessCode(null);

    if (!formData.contact || !formData.name || !formData.complaint || !formData.visitDate || !formData.serviceId) {
      setError('Semua field harus diisi dan layanan harus dipilih');
      return;
    }

    const selectedService = services.find((service) => service.id === Number(formData.serviceId));
    if (!selectedService) {
      setError('Layanan tidak ditemukan');
      return;
    }

    setIsSubmitting(true);

    try {
      const visitDate = formData.visitDate;
      const currentMax = await getNextQueueSequence(selectedService.id, visitDate);
      const queueNumberSeq = currentMax + 1;
      const queueCode = `${selectedService.prefix}${queueNumberSeq.toString().padStart(3, '0')}`;

      const token = generateQrToken();
      setQrToken(token);

      const { data, error: createError } = await createQueueEntry({
        service_id: selectedService.id,
        service_name: selectedService.name,
        service_prefix: selectedService.prefix,
        queue_number_seq: queueNumberSeq,
        queue_code: queueCode,
        contact: formData.contact,
        name: formData.name,
        complaint: formData.complaint,
        visit_date: visitDate,
        qr_token: token,
      });

      if (createError || !data) throw createError;

      const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';
      const qrUrl = `${baseUrl}/myqueue?token=${token}`;
      const qrDataUrl = await generateQrDataUrl(qrUrl, 300);
      setQrImageUrl(qrDataUrl);

      setSuccessCode(data.queue_code);
      localStorage.setItem('lastQueueCode', data.queue_code);

      setFormData({
        contact: '',
        name: '',
        complaint: '',
        visitDate: today,
        serviceId: selectedService.id.toString(),
      });

      setTimeout(() => {
        router.push(`/myqueue?token=${token}`);
      }, 3000);

    } catch (err) {
      setError('Terjadi kesalahan. Silakan coba lagi.');
      console.error('Error:', err);
      setQrImageUrl(null);
      setQrToken(null);
    } finally {
      setIsSubmitting(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.5, ease: "easeOut" } as any
    }
  };

  const inputClasses = "w-full bg-white/5 border border-white/10 rounded-xl px-11 py-3.5 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-blue-400/50 focus:border-transparent transition-all hover:bg-white/10";
  const iconClasses = "absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-blue-300 pointer-events-none";

  return (
    <div className="min-h-screen bg-slate-900 relative overflow-hidden flex flex-col items-center justify-center py-12 px-4 sm:px-6">

      {/* Background Gradients */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] bg-blue-600/20 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-[120px]" />
      </div>

      <header className="absolute top-0 w-full p-6 flex justify-between items-center z-20 max-w-7xl mx-auto">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="p-2 bg-white/5 rounded-full backdrop-blur-sm border border-white/10 group-hover:bg-white/10 transition-colors">
            <ArrowLeft className="w-5 h-5 text-white" />
          </div>
          <span className="text-white/80 font-medium group-hover:text-white transition-colors">Kembali</span>
        </Link>
        <div className="flex items-center gap-3">
          <Image src="/logo.png" width={32} height={32} alt="Logo" className="w-8 h-8 opacity-90" />
          <span className="text-white font-bold tracking-wider uppercase text-sm hidden sm:block">RS Kita</span>
        </div>
      </header>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative z-10 w-full max-w-3xl"
      >
        <div className="bg-white/10 backdrop-blur-2xl border border-white/20 rounded-3xl overflow-hidden shadow-2xl shadow-blue-900/50">

          {/* Form Header */}
          <div className="px-8 py-8 border-b border-white/10 bg-white/5 text-center">
            <h1 className="text-3xl font-bold text-white mb-2">Pendaftaran Antrian</h1>
            <p className="text-blue-200/80">Silahkan isi data diri Anda untuk mendapatkan nomor antrian.</p>
          </div>

          <div className="p-8 lg:p-10">
            <AnimatePresence mode="wait">
              {successCode ? (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="flex flex-col items-center text-center space-y-6"
                >
                  <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mb-2">
                    <CheckCircle2 className="w-10 h-10 text-green-400" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-white mb-1">Berhasil Terdaftar!</h2>
                    <p className="text-blue-200">Menunggu pengalihan halaman...</p>
                  </div>

                  <div className="bg-white/5 border border-white/10 rounded-2xl p-6 w-full max-w-sm">
                    <p className="text-sm text-slate-400 uppercase tracking-widest mb-2">Nomor Antrian</p>
                    <div className="text-5xl font-mono font-bold text-white tracking-wider mb-6">{successCode}</div>

                    {qrImageUrl && (
                      <div className="relative bg-white p-4 rounded-xl mx-auto w-fit mb-6">
                        <img src={qrImageUrl} alt="QR Code" className="w-48 h-48" />
                      </div>
                    )}

                    <div className="flex gap-3 justify-center">
                      <button
                        onClick={() => {
                          const link = document.createElement('a');
                          link.href = qrImageUrl!;
                          link.download = `tiket-${successCode}.png`;
                          link.click();
                        }}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-600/20 hover:bg-blue-600/30 text-blue-300 rounded-lg text-sm transition-colors"
                      >
                        <Download className="w-4 h-4" /> Download
                      </button>
                    </div>
                  </div>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  {error && (
                    <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 flex items-start gap-3 text-red-200 text-sm">
                      <span className="mt-0.5 block w-2 h-2 rounded-full bg-red-400" />
                      {error}
                    </div>
                  )}

                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="relative group">
                      <label className="block text-sm font-medium text-blue-200 mb-2 ml-1">Nama Lengkap</label>
                      <div className="relative">
                        <User className={iconClasses} />
                        <input
                          type="text"
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          className={inputClasses}
                          placeholder="Contoh: Budi Santoso"
                          required
                        />
                      </div>
                    </div>

                    <div className="relative group">
                      <label className="block text-sm font-medium text-blue-200 mb-2 ml-1">Kontak</label>
                      <div className="relative">
                        <Phone className={iconClasses} />
                        <input
                          type="text"
                          value={formData.contact}
                          onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
                          className={inputClasses}
                          placeholder="Email atau WhatsApp"
                          required
                        />
                      </div>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="relative group">
                      <label className="block text-sm font-medium text-blue-200 mb-2 ml-1">Tanggal Kunjungan</label>
                      <div className="relative">
                        <Calendar className={iconClasses} />
                        <input
                          type="date"
                          value={formData.visitDate}
                          onChange={(e) => setFormData({ ...formData, visitDate: e.target.value })}
                          min={today}
                          className={`${inputClasses} [color-scheme:dark]`}
                          required
                        />
                      </div>
                    </div>

                    <div className="relative group">
                      <label className="block text-sm font-medium text-blue-200 mb-2 ml-1">Pilih Layanan</label>
                      <div className="relative">
                        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                          <ChevronDown className="w-4 h-4 text-white/50" />
                        </div>
                        <select
                          value={formData.serviceId}
                          onChange={(e) => setFormData({ ...formData, serviceId: e.target.value })}
                          className={`${inputClasses} px-5 appearance-none cursor-pointer`}
                          required
                        >
                          {services.length === 0 && <option value="">Tidak ada layanan aktif</option>}
                          {services.map((service) => (
                            <option key={service.id} value={service.id} className="bg-slate-800 text-white">
                              {service.name}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>

                  <div className="relative group">
                    <label className="block text-sm font-medium text-blue-200 mb-2 ml-1">Keluhan</label>
                    <div className="relative">
                      <FileText className={`${iconClasses} top-6 -translate-y-0`} />
                      <textarea
                        value={formData.complaint}
                        onChange={(e) => setFormData({ ...formData, complaint: e.target.value })}
                        className={`${inputClasses} min-h-[120px] resize-none`}
                        placeholder="Deskripsikan keluhan kesehatan Anda secara singkat..."
                        required
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full relative overflow-hidden group bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold py-4 rounded-xl shadow-lg shadow-blue-600/30 transition-all disabled:opacity-70 disabled:cursor-not-allowed mt-4"
                  >
                    <span className="relative z-10 flex items-center justify-center gap-2">
                      {isSubmitting ? 'Memproses...' : 'Ambil Antrian Sekarang'}
                      {!isSubmitting && <ArrowLeft className="w-5 h-5 rotate-180 group-hover:translate-x-1 transition-transform" />}
                    </span>
                  </button>
                </form>
              )}
            </AnimatePresence>
          </div>
        </div>

        <p className="text-center text-white/40 text-sm mt-8">
          &copy; {new Date().getFullYear()} RS Kita. Melayani dengan hati.
        </p>
      </motion.div>

    </div>
  );
}
