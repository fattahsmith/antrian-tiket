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
  ChevronRight,
  CheckCircle2,
  Download,
  Sparkles,
  ShieldCheck,
  Stethoscope,
  Clock,
  ArrowRight,
  Info
} from 'lucide-react';
import { Service } from '@/types/service';
import { fetchServices } from '@/lib/serviceUtils';
import { getNextQueueSequence, createQueueEntry } from '@/lib/queueUtils';
import { generateQrToken, generateQrDataUrl } from '@/lib/qrUtils';

const STEPS = [
  { id: 1, title: 'Layanan', description: 'Pilih Poli' },
  { id: 2, title: 'Waktu', description: 'Atur Jadwal' },
  { id: 3, title: 'Data Diri', description: 'Identitas Pasien' },
  { id: 4, title: 'Konfirmasi', description: 'Cek Kembali' },
];

const TIME_SLOTS = [
  '08:00', '09:00', '10:00', '11:00',
  '13:00', '14:00', '15:00', '16:00'
];

export default function BookingPage() {
  const today = new Date().toISOString().split('T')[0];
  const [currentStep, setCurrentStep] = useState(1);
  const [services, setServices] = useState<Service[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [formData, setFormData] = useState({
    contact: '',
    name: '',
    complaint: '',
    visitDate: today,
    serviceId: '',
    timeSlot: '08:00'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [successCode, setSuccessCode] = useState<string | null>(null);
  const [qrImageUrl, setQrImageUrl] = useState<string | null>(null);
  const [qrToken, setQrToken] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const loadServices = async () => {
      try {
        const active = await fetchServices(true);
        setServices(active);
        if (active.length > 0) {
          setFormData((prev) => ({
            ...prev,
            serviceId: prev.serviceId || String(active[0].id),
          }));
        }
      } catch (err) {
        console.error("Failed to load services:", err);
      } finally {
        setIsLoading(false);
      }
    };
    loadServices();
  }, []);

  const nextStep = () => {
    if (currentStep === 1 && !formData.serviceId) {
      setError('Silakan pilih layanan poli terlebih dahulu.');
      return;
    }
    if (currentStep === 3 && (!formData.name || !formData.contact || !formData.complaint)) {
      setError('Mohon lengkapi seluruh data diri dan keluhan Anda.');
      return;
    }
    setError('');
    setCurrentStep((prev) => Math.min(prev + 1, 4));
  };

  const prevStep = () => {
    setError('');
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    setError('');
    setIsSubmitting(true);

    const selectedService = services.find((s) => s.id === Number(formData.serviceId));
    if (!selectedService) {
      setError('Layanan tidak ditemukan.');
      setIsSubmitting(false);
      return;
    }

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
        complaint: formData.complaint + (formData.timeSlot ? ` (Sesi: ${formData.timeSlot})` : ''),
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

      setTimeout(() => {
        router.push(`/myqueue?token=${token}`);
      }, 5000);

    } catch (err) {
      setError('Gagal memproses pendaftaran. Silakan coba lagi.');
      console.error('Submission error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const selectedService = services.find(s => s.id === Number(formData.serviceId));

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 font-sans selection:bg-blue-100 selection:text-blue-900">

      {/* Header Area */}
      <header className="fixed top-0 left-0 right-0 h-20 bg-white/80 backdrop-blur-md border-b border-slate-200 z-50 px-6 sm:px-12 flex items-center justify-between shadow-sm">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl group-hover:bg-blue-50 group-hover:border-blue-200 transition-all duration-300">
            <ArrowLeft className="w-5 h-5 text-slate-500 group-hover:text-blue-600" />
          </div>
          <span className="hidden sm:block font-bold text-slate-600 group-hover:text-slate-900 transition-colors">Kembali</span>
        </Link>
        <div className="absolute left-1/2 -translate-x-1/2 flex items-center gap-2">
          <Image src="/logo.png" width={28} height={28} alt="Logo" className="w-7 h-7" />
          <h1 className="text-xl font-black tracking-tight text-slate-900">RS <span className="text-blue-600">KITA</span></h1>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 bg-blue-50 rounded-full border border-blue-100">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-600"></span>
          </span>
          <span className="text-[10px] font-bold text-blue-700 uppercase tracking-widest">Sistem Online</span>
        </div>
      </header>

      <main className="pt-32 pb-32 px-4 sm:px-6 max-w-5xl mx-auto">

        <AnimatePresence mode="wait">
          {successCode ? (
            <SuccessState successCode={successCode} qrImageUrl={qrImageUrl} />
          ) : (
            <div className="space-y-8">
              {/* Progress Indicator */}
              <div className="max-w-2xl mx-auto px-4">
                <div className="flex items-center justify-between relative">
                  <div className="absolute top-5 left-0 right-0 h-0.5 bg-slate-200 -z-0" />
                  <div
                    className="absolute top-5 left-0 h-0.5 bg-blue-600 transition-all duration-500 ease-out -z-0"
                    style={{ width: `${((currentStep - 1) / (STEPS.length - 1)) * 100}%` }}
                  />
                  {STEPS.map((step) => (
                    <div key={step.id} className="relative z-10 flex flex-col items-center">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-500 shadow-sm ${currentStep >= step.id
                          ? 'bg-blue-600 border-blue-600 text-white shadow-blue-200'
                          : 'bg-white border-slate-200 text-slate-400'
                        }`}>
                        {currentStep > step.id ? <CheckCircle2 className="w-5 h-5" /> : step.id}
                      </div>
                      <div className="mt-3 text-center">
                        <p className={`text-[10px] font-black uppercase tracking-widest ${currentStep >= step.id ? 'text-blue-600' : 'text-slate-400'}`}>
                          {step.title}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Step Content */}
              <div className="relative">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentStep}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.4, ease: "easeOut" }}
                    className="bg-white rounded-[2rem] border border-slate-200 shadow-[0_10px_40px_-15px_rgba(0,0,0,0.05)] overflow-hidden"
                  >
                    <div className="p-8 sm:p-12">
                      {currentStep === 1 && (
                        <StepServices
                          services={services}
                          selectedId={formData.serviceId}
                          onSelect={(id) => setFormData({ ...formData, serviceId: id })}
                          isLoading={isLoading}
                        />
                      )}
                      {currentStep === 2 && (
                        <StepDateTime
                          formData={formData}
                          setFormData={setFormData}
                        />
                      )}
                      {currentStep === 3 && (
                        <StepDetails
                          formData={formData}
                          setFormData={setFormData}
                        />
                      )}
                      {currentStep === 4 && (
                        <StepConfirmation
                          formData={formData}
                          selectedService={selectedService}
                        />
                      )}

                      {error && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          className="mt-8 p-4 bg-red-50 border border-red-100 rounded-xl flex items-center gap-3 text-red-700 text-sm font-bold"
                        >
                          <Info className="w-4 h-4" />
                          {error}
                        </motion.div>
                      )}
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
          )}
        </AnimatePresence>
      </main>

      {/* Sticky Bottom Actions */}
      {!successCode && (
        <div className="fixed bottom-0 left-0 right-0 p-4 sm:p-6 bg-white/80 backdrop-blur-lg border-t border-slate-200 z-40">
          <div className="max-w-5xl mx-auto flex items-center justify-between gap-4">
            <button
              onClick={prevStep}
              disabled={currentStep === 1 || isSubmitting}
              className={`flex items-center gap-2 px-6 py-4 rounded-2xl font-bold text-slate-600 transition-all ${currentStep === 1
                  ? 'opacity-0 pointer-events-none'
                  : 'hover:bg-slate-100 active:scale-95'
                }`}
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="hidden sm:inline">Sebelumnya</span>
            </button>

            {currentStep < 4 ? (
              <button
                onClick={nextStep}
                className="flex-1 sm:flex-none flex items-center justify-center gap-3 bg-blue-600 hover:bg-blue-700 text-white px-10 py-4 rounded-2xl font-black shadow-lg shadow-blue-200 active:scale-95 transition-all group"
              >
                Lanjutkan
                <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            ) : (
              <button
                onClick={() => handleSubmit()}
                disabled={isSubmitting}
                className="flex-1 sm:flex-none flex items-center justify-center gap-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-12 py-4 rounded-2xl font-black shadow-xl shadow-blue-200 active:scale-95 transition-all disabled:opacity-50 disabled:grayscale"
              >
                {isSubmitting ? (
                  <div className="w-6 h-6 border-4 border-white/20 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    Konfirmasi Pendaftaran
                    <Sparkles className="w-5 h-5" />
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function StepServices({ services, selectedId, onSelect, isLoading }: { services: Service[], selectedId: string, onSelect: (id: string) => void, isLoading: boolean }) {
  return (
    <div className="space-y-8">
      <div className="text-center sm:text-left">
        <h2 className="text-3xl font-black text-slate-900 tracking-tight">Pilih Layanan Poli</h2>
        <p className="text-slate-500 mt-2 font-medium">Silakan pilih spesialisasi yang Anda butuhkan.</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {isLoading ? (
          <>
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="h-24 bg-slate-50 animate-pulse rounded-2xl border border-slate-100" />
            ))}
          </>
        ) : (
          <>
            {services.length === 0 && <p className="text-slate-400">Tidak ada layanan aktif.</p>}
            {services.map((service) => (
              <button
                key={service.id}
                onClick={() => onSelect(service.id.toString())}
                className={`flex items-center gap-5 p-6 rounded-2xl border-2 transition-all text-left group ${selectedId === service.id.toString()
                    ? 'bg-blue-50 border-blue-600 shadow-md shadow-blue-100'
                    : 'bg-white border-slate-100 hover:border-slate-300 hover:shadow-sm'
                  }`}
              >
                <div className={`p-4 rounded-xl transition-colors ${selectedId === service.id.toString() ? 'bg-blue-600 text-white' : 'bg-slate-50 text-slate-400 group-hover:bg-slate-100'
                  }`}>
                  <Stethoscope className="w-6 h-6" />
                </div>
                <div>
                  <p className={`font-black text-lg ${selectedId === service.id.toString() ? 'text-blue-900' : 'text-slate-700'}`}>
                    {service.name}
                  </p>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Poli Rumah Sakit</p>
                </div>
                {selectedId === service.id.toString() && (
                  <div className="ml-auto">
                    <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center">
                      <CheckCircle2 className="w-4 h-4 text-white" />
                    </div>
                  </div>
                )}
              </button>
            ))}
          </>
        )}
      </div>
    </div>
  );
}

function StepDateTime({ formData, setFormData }: { formData: any, setFormData: any }) {
  return (
    <div className="space-y-10">
      <div className="text-center sm:text-left">
        <h2 className="text-3xl font-black text-slate-900 tracking-tight">Kapan Anda akan berkunjung?</h2>
        <p className="text-slate-500 mt-2 font-medium">Atur tanggal dan pilih sesi waktu konsultasi.</p>
      </div>

      <div className="space-y-8">
        <div className="space-y-4">
          <label className="flex items-center gap-2 text-sm font-black text-slate-800 uppercase tracking-widest">
            <Calendar className="w-4 h-4 text-blue-600" />
            Tanggal Periksa
          </label>
          <input
            type="date"
            min={new Date().toISOString().split('T')[0]}
            value={formData.visitDate}
            onChange={(e) => setFormData({ ...formData, visitDate: e.target.value })}
            className="w-full bg-slate-50 border-2 border-slate-200 rounded-2xl px-6 py-4 text-lg font-bold text-slate-900 focus:outline-none focus:border-blue-600 focus:bg-white transition-all appearance-none"
          />
        </div>

        <div className="space-y-4">
          <label className="flex items-center gap-2 text-sm font-black text-slate-800 uppercase tracking-widest">
            <Clock className="w-4 h-4 text-blue-600" />
            Pilih Sesi Waktu
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {TIME_SLOTS.map(slot => (
              <button
                key={slot}
                type="button"
                onClick={() => setFormData({ ...formData, timeSlot: slot })}
                className={`py-4 rounded-xl font-bold text-sm transition-all border-2 ${formData.timeSlot === slot
                    ? 'bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-100 translate-y-[-2px]'
                    : 'bg-white border-slate-100 text-slate-500 hover:border-slate-300'
                  }`}
              >
                {slot}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function StepDetails({ formData, setFormData }: { formData: any, setFormData: any }) {
  return (
    <div className="space-y-10">
      <div className="text-center sm:text-left">
        <h2 className="text-3xl font-black text-slate-900 tracking-tight">Lengkapi Data Diri</h2>
        <p className="text-slate-500 mt-2 font-medium">Informasi ini diperlukan untuk pendaftaran rekam medis.</p>
      </div>

      <div className="space-y-6">
        <div className="relative group">
          <User className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
          <input
            type="text"
            required
            placeholder="Nama Lengkap"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl pl-14 pr-6 py-4.5 text-lg font-bold text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-600 focus:bg-white transition-all"
          />
        </div>

        <div className="relative group">
          <Phone className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
          <input
            type="text"
            required
            placeholder="Kontak (WA/Email)"
            value={formData.contact}
            onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
            className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl pl-14 pr-6 py-4.5 text-lg font-bold text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-600 focus:bg-white transition-all"
          />
        </div>

        <div className="relative group">
          <FileText className="absolute left-5 top-6 w-5 h-5 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
          <textarea
            required
            placeholder="Ceritakan singkat keluhan Anda..."
            value={formData.complaint}
            onChange={(e) => setFormData({ ...formData, complaint: e.target.value })}
            className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl pl-14 pr-6 py-5 text-lg font-bold text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-600 focus:bg-white transition-all min-h-[160px] resize-none"
          />
        </div>
      </div>
    </div>
  );
}

function StepConfirmation({ formData, selectedService }: { formData: any, selectedService?: Service }) {
  return (
    <div className="space-y-10">
      <div className="text-center sm:text-left">
        <h2 className="text-3xl font-black text-slate-900 tracking-tight">Cek Kembali Pesanan Anda</h2>
        <p className="text-slate-500 mt-2 font-medium">Pastikan data yang Anda masukkan sudah benar sebelum konfirmasi.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {[
          { label: 'Layanan Poli', value: selectedService?.name, icon: Stethoscope },
          { label: 'Tanggal Periksa', value: formData.visitDate, icon: Calendar },
          { label: 'Sesi Waktu', value: formData.timeSlot, icon: Clock },
          { label: 'Nama Pasien', value: formData.name, icon: User },
          { label: 'Kontak', value: formData.contact, icon: Phone },
        ].map((item, idx) => (
          <div key={idx} className="p-6 bg-slate-50 rounded-2xl border border-slate-100">
            <div className="flex items-center gap-3 mb-2">
              <item.icon className="w-4 h-4 text-blue-600" />
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">{item.label}</p>
            </div>
            <p className="text-lg font-black text-slate-900 leading-tight">{item.value}</p>
          </div>
        ))}
        <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100 sm:col-span-2">
          <div className="flex items-center gap-3 mb-2">
            <FileText className="w-4 h-4 text-blue-600" />
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Keluhan</p>
          </div>
          <p className="text-slate-700 font-medium leading-relaxed">{formData.complaint}</p>
        </div>
      </div>

      <div className="p-6 bg-blue-50/50 rounded-2xl border border-blue-100 flex items-start gap-4">
        <div className="p-2 bg-blue-600 rounded-lg text-white">
          <ShieldCheck className="w-5 h-5" />
        </div>
        <div>
          <p className="font-black text-blue-900">Privasi Terjamin</p>
          <p className="text-sm font-medium text-blue-700/70 mt-1 leading-relaxed">Seluruh data yang Anda masukkan akan digunakan hanya untuk keperluan administrasi rumah sakit.</p>
        </div>
      </div>
    </div>
  );
}

function SuccessState({ successCode, qrImageUrl }: { successCode: string, qrImageUrl: string | null }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="max-w-xl mx-auto space-y-12 py-10"
    >
      <div className="text-center space-y-6">
        <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto shadow-xl shadow-green-100 border-4 border-white animate-bounce-slow">
          <CheckCircle2 className="w-12 h-12 text-green-600" />
        </div>
        <div>
          <h2 className="text-4xl font-black text-slate-900 tracking-tight">Anda Sudah Terdaftar</h2>
          <p className="text-slate-500 mt-3 text-lg font-medium">Halaman akan berpindah secara otomatis ke tiket digital Anda.</p>
        </div>
      </div>

      <div className="bg-white rounded-[3rem] border-2 border-slate-100 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] overflow-hidden relative">
        <div className="bg-blue-600 py-3 text-center">
          <p className="text-[10px] font-black text-white uppercase tracking-[0.3em]">Tiket Antrian Digital</p>
        </div>
        <div className="p-10 space-y-10 text-center">
          <div>
            <p className="text-xs font-black text-slate-300 uppercase tracking-widest mb-4">Kode Konfirmasi</p>
            <p className="text-8xl font-black text-blue-600 tracking-tighter font-mono">{successCode}</p>
          </div>

          {qrImageUrl && (
            <div className="relative group">
              <div className="absolute inset-0 bg-blue-500/10 blur-2xl group-hover:bg-blue-500/20 transition-all rounded-full" />
              <div className="relative bg-white p-6 rounded-3xl mx-auto w-fit shadow-xl border border-slate-100">
                <img src={qrImageUrl} alt="QR Code" className="w-48 h-48" />
              </div>
            </div>
          )}

          <div className="flex flex-col gap-3">
            <p className="text-slate-400 font-bold text-sm">Harap simpan atau screen-shot kode ini.</p>
            <button
              onClick={() => {
                const link = document.createElement('a');
                link.href = qrImageUrl!;
                link.download = `antrian-${successCode}.png`;
                link.click();
              }}
              className="flex items-center justify-center gap-3 w-full py-5 bg-slate-50 hover:bg-slate-100 text-blue-700 rounded-2xl text-lg font-black transition-all border-2 border-slate-100 group"
            >
              <Download className="w-6 h-6 group-hover:scale-110 transition-transform" />
              Simpan ke Perangkat
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
