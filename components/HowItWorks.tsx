'use client';

import { useEffect, useRef, useState } from 'react';
import { ClipboardList, Ticket, CalendarCheck } from 'lucide-react';

// ─── Step data ────────────────────────────────────────────────────────────────
const STEPS = [
  {
    number: 1,
    icon: ClipboardList,
    title: 'Isi Data',
    tag: 'Langkah Pertama',
    description:
      'Isi data diri Anda dan pilih tanggal kunjungan serta layanan yang diinginkan melalui formulir online yang mudah digunakan.',
    detail: 'Proses ini hanya membutuhkan waktu kurang dari 2 menit.',
    accent: 'from-blue-500 to-blue-600',
    soft: 'bg-blue-50',
    icon_color: 'text-blue-600',
    ring: 'ring-blue-200',
  },
  {
    number: 2,
    icon: Ticket,
    title: 'Dapatkan Nomor Antrian',
    tag: 'Langkah Kedua',
    description:
      'Setelah mengisi data, Anda akan langsung mendapatkan nomor antrian beserta QR code dan estimasi waktu tunggu secara real-time.',
    detail: 'Simpan QR code untuk akses cepat status antrian Anda.',
    accent: 'from-violet-500 to-violet-600',
    soft: 'bg-violet-50',
    icon_color: 'text-violet-600',
    ring: 'ring-violet-200',
  },
  {
    number: 3,
    icon: CalendarCheck,
    title: 'Datang Sesuai Jadwal',
    tag: 'Langkah Ketiga',
    description:
      'Datang ke rumah sakit sesuai jadwal yang telah ditentukan. Pantau status antrian Anda secara langsung dan tunggu hingga nomor dipanggil.',
    detail: 'Disarankan datang 10 menit lebih awal untuk verifikasi data.',
    accent: 'from-emerald-500 to-emerald-600',
    soft: 'bg-emerald-50',
    icon_color: 'text-emerald-600',
    ring: 'ring-emerald-200',
  },
];

// ─── Component ─────────────────────────────────────────────────────────────────
export default function HowItWorks() {
  const [activeStep, setActiveStep] = useState(0);
  const [progressPct, setProgressPct] = useState(0);
  const stepRefs = useRef<(HTMLDivElement | null)[]>([]);
  const rightRef = useRef<HTMLDivElement>(null);

  // IntersectionObserver: detect which step card is in view
  useEffect(() => {
    const observers: IntersectionObserver[] = [];

    stepRefs.current.forEach((el, idx) => {
      if (!el) return;
      const obs = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setActiveStep(idx);
          }
        },
        { threshold: 0.55, root: rightRef.current }
      );
      obs.observe(el);
      observers.push(obs);
    });

    return () => observers.forEach((o) => o.disconnect());
  }, []);

  // Scroll progress bar on right panel
  useEffect(() => {
    const el = rightRef.current;
    if (!el) return;

    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = el;
      const pct = scrollHeight <= clientHeight ? 100 : (scrollTop / (scrollHeight - clientHeight)) * 100;
      setProgressPct(Math.min(100, Math.max(0, pct)));
    };

    el.addEventListener('scroll', handleScroll, { passive: true });
    return () => el.removeEventListener('scroll', handleScroll);
  }, []);

  // Scroll right panel to a specific step
  const scrollToStep = (idx: number) => {
    const el = stepRefs.current[idx];
    if (!el || !rightRef.current) return;
    el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const active = STEPS[activeStep];

  return (
    <section id="how-it-works" className="relative w-full bg-white overflow-hidden">

      {/* ── Desktop: split layout ─────────────────────────────────────────── */}
      <div className="hidden lg:flex h-[calc(100vh_-_0px)] min-h-[640px]">

        {/* LEFT — sticky panel 40% */}
        <div className="w-[40%] flex-shrink-0 sticky top-0 h-screen flex flex-col overflow-hidden border-r border-slate-100">
          {/* Layered background */}
          <div className="absolute inset-0 bg-white" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_20%_40%,rgba(219,234,254,0.6)_0%,transparent_100%)]" />
          <div className="absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-blue-100/60 blur-3xl" />
          <div className="absolute -top-16 right-0 h-56 w-56 rounded-full bg-violet-100/40 blur-3xl" />
          {/* Dot grid */}
          <div
            className="absolute inset-0 opacity-[0.35]"
            style={{
              backgroundImage: 'radial-gradient(circle, #bfdbfe 1px, transparent 1px)',
              backgroundSize: '28px 28px',
            }}
          />

          {/* Content */}
          <div className="relative z-10 flex flex-col h-full px-12 justify-center gap-10">

            {/* Heading block */}
            <div>
              <span className="inline-flex items-center gap-2 mb-5 rounded-full border border-blue-200 bg-blue-50 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-blue-600">
                <span className="h-1.5 w-1.5 rounded-full bg-blue-500" />
                Cara Kerja
              </span>

              <h2 className="text-5xl font-extrabold leading-[1.1] tracking-tight mb-5">
                <span className="bg-gradient-to-br from-blue-600 to-blue-500 bg-clip-text text-transparent">
                  Antrian Online
                </span>
                <br />
                <span className="bg-gradient-to-br from-slate-700 to-slate-500 bg-clip-text text-transparent">
                  yang Mudah &amp; Cepat
                </span>
              </h2>

              <p className="text-slate-500 text-[15px] leading-relaxed ">
                Tiga langkah sederhana untuk mendapatkan pelayanan kesehatan yang lebih efisien — kapan saja, di mana saja.
              </p>
            </div>

            {/* Progress indicator */}
            <div className="max-w-[300px]">
              <div className="flex items-center justify-between mb-2">
                <p className="text-[15px] font-semibold uppercase tracking-[0.18em] text-slate-400">
                  Scroll untuk melihat langkah
                </p>
                <p className="text-[20px] font-bold text-blue-500">{Math.round(progressPct)}%</p>
              </div>
              <div className="h-1.5 w-full rounded-full bg-slate-100 overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-blue-500 to-violet-500 transition-all duration-300 ease-out"
                  style={{ width: `${progressPct}%` }}
                />
              </div>
              {/* Step dots */}
              <div className="flex items-center gap-2 mt-3">
                {STEPS.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => scrollToStep(i)}
                    className={`transition-all duration-300 rounded-full ${activeStep === i
                        ? 'w-6 h-2 bg-blue-500'
                        : 'w-2 h-2 bg-slate-200 hover:bg-blue-300'
                      }`}
                  />
                ))}
              </div>
            </div>

          </div>
        </div>

        {/* RIGHT — scrollable 60% with scroll-snap */}
        <div
          ref={rightRef}
          className="flex-1 overflow-y-auto"
          style={{
            scrollSnapType: 'y mandatory',
            scrollBehavior: 'smooth',
          }}
        >
          {STEPS.map((step, idx) => {
            const Icon = step.icon;
            const isActive = activeStep === idx;

            return (
              <div
                key={idx}
                ref={(el) => { stepRefs.current[idx] = el; }}
                className="h-screen flex items-center justify-center px-12"
                style={{ scrollSnapAlign: 'start' }}
              >
                <div
                  className={`w-full max-w-lg transition-all duration-500 ease-in-out ${isActive ? 'opacity-100 translate-y-0 scale-100' : 'opacity-30 translate-y-6 scale-95'
                    }`}
                >
                  {/* Tag */}
                  <div className="mb-5 flex items-center gap-3">
                    <span className={`text-xs font-semibold uppercase tracking-widest ${isActive ? 'text-blue-500' : 'text-slate-400'} transition-colors duration-300`}>
                      {step.tag}
                    </span>
                    {isActive && (
                      <span className="h-px flex-1 bg-gradient-to-r from-blue-200 to-transparent" />
                    )}
                  </div>

                  {/* Card */}
                  <div
                    className={`rounded-2xl bg-white border transition-all duration-500 ${isActive
                      ? 'border-slate-200 shadow-2xl shadow-slate-200/60'
                      : 'border-slate-100 shadow-sm'
                      } p-8`}
                  >
                    {/* Number + Icon row */}
                    <div className="flex items-start justify-between mb-6">
                      <div
                        className={`flex h-14 w-14 items-center justify-center rounded-2xl ${step.soft} ring-1 ${step.ring} transition-all duration-300 ${isActive ? 'scale-110 shadow-lg' : ''
                          }`}
                      >
                        <Icon className={`h-7 w-7 ${step.icon_color}`} />
                      </div>

                      <span
                        className={`text-7xl font-black leading-none transition-all duration-500 ${isActive
                          ? `bg-gradient-to-br ${step.accent} bg-clip-text text-transparent`
                          : 'text-slate-100'
                          }`}
                      >
                        {String(step.number).padStart(2, '0')}
                      </span>
                    </div>

                    {/* Text */}
                    <h3 className="text-2xl font-extrabold text-slate-800 mb-3 leading-tight">
                      {step.title}
                    </h3>
                    <p className="text-slate-500 leading-relaxed mb-5">
                      {step.description}
                    </p>

                    {/* Detail pill */}
                    <div className={`inline-flex items-center gap-2 rounded-xl ${step.soft} px-4 py-2.5`}>
                      <span className={`h-1.5 w-1.5 rounded-full bg-gradient-to-br ${step.accent} flex-shrink-0`} />
                      <p className={`text-xs font-medium ${step.icon_color}`}>{step.detail}</p>
                    </div>
                  </div>

                  {/* Connector arrow (not on last step) */}
                  {idx < STEPS.length - 1 && (
                    <div className={`mt-6 flex justify-center transition-opacity duration-300 ${isActive ? 'opacity-40' : 'opacity-10'}`}>
                      <svg width="20" height="32" viewBox="0 0 20 32" fill="none">
                        <line x1="10" y1="0" x2="10" y2="24" stroke="#94a3b8" strokeWidth="1.5" strokeDasharray="4 4" />
                        <polyline points="4,20 10,28 16,20" stroke="#94a3b8" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Tablet / Mobile: stacked layout ────────────────────────────────── */}
      <div className="lg:hidden">
        {/* Header */}
        <div className="bg-gradient-to-br from-blue-600 via-blue-500 to-violet-600 px-6 pt-16 pb-12 text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(255,255,255,0.1)_0%,transparent_70%)]" />
          <div
            className="absolute inset-0 opacity-[0.05]"
            style={{
              backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)',
              backgroundSize: '24px 24px',
            }}
          />
          <div className="relative z-10">
            <span className="inline-block mb-3 rounded-full bg-white/15 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-white/80">
              Cara Kerja
            </span>
            <h2 className="text-3xl font-extrabold text-white mb-3">
              Antrian Online yang Mudah &amp; Cepat
            </h2>
            <p className="text-white/70 text-sm max-w-sm mx-auto leading-relaxed">
              Tiga langkah sederhana untuk pelayanan kesehatan yang lebih efisien.
            </p>
          </div>
        </div>

        {/* Steps */}
        <div className="px-4 py-10 space-y-6 max-w-lg mx-auto">
          {STEPS.map((step, idx) => {
            const Icon = step.icon;
            return (
              <div
                key={idx}
                className="rounded-2xl bg-white border border-slate-100 shadow-sm p-6 transition-all duration-300 hover:shadow-md"
                style={{
                  animation: `fadeUp 0.5s ease-out ${idx * 0.12}s both`,
                }}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${step.soft} ring-1 ${step.ring}`}>
                    <Icon className={`h-6 w-6 ${step.icon_color}`} />
                  </div>
                  <span className={`text-5xl font-black leading-none bg-gradient-to-br ${step.accent} bg-clip-text text-transparent`}>
                    {String(step.number).padStart(2, '0')}
                  </span>
                </div>
                <p className="text-xs font-semibold uppercase tracking-widest text-slate-400 mb-1">{step.tag}</p>
                <h3 className="text-xl font-extrabold text-slate-800 mb-2">{step.title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed mb-4">{step.description}</p>
                <div className={`inline-flex items-center gap-2 rounded-xl ${step.soft} px-3 py-2`}>
                  <span className={`h-1.5 w-1.5 rounded-full bg-gradient-to-br ${step.accent} flex-shrink-0`} />
                  <p className={`text-xs font-medium ${step.icon_color}`}>{step.detail}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Keyframe for mobile fade-up */}
      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(24px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </section>
  );
}
