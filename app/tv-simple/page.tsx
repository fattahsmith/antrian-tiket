'use client';

import { useEffect, useState, useRef, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { Queue } from '@/types/queue';
import { Service } from '@/types/service';
import { getTodayQueues } from '@/lib/queueUtils';
import { fetchServices } from '@/lib/serviceUtils';

function TVSimpleContent() {
  const searchParams = useSearchParams();
  const serviceFilter = searchParams.get('service');
  const isMuted = searchParams.get('mute') === 'true';

  const [queues, setQueues] = useState<Queue[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [currentQueues, setCurrentQueues] = useState<Map<number, Queue>>(new Map());
  const [recentCalled, setRecentCalled] = useState<Queue[]>([]);
  const [currentTime, setCurrentTime] = useState(new Date());
  const lastCalledRef = useRef<Map<number, number>>(new Map());
  const speechSynthesisRef = useRef<SpeechSynthesis | null>(null);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      speechSynthesisRef.current = window.speechSynthesis;
    }
  }, []);

  const speak = (text: string, lang = 'id-ID') => {
    if (isMuted || !speechSynthesisRef.current) return;
    try {
      speechSynthesisRef.current.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = lang;
      utterance.rate = 0.9;
      utterance.pitch = 1;
      speechSynthesisRef.current.speak(utterance);
    } catch (err) {
      console.error('Error with speech synthesis:', err);
    }
  };

  const formatQueueCodeForSpeech = (code: string) => {
    const digitWords: Record<string, string> = {
      '0': 'nol', '1': 'satu', '2': 'dua', '3': 'tiga', '4': 'empat',
      '5': 'lima', '6': 'enam', '7': 'tujuh', '8': 'delapan', '9': 'sembilan',
    };
    return code.split('').map((c) => digitWords[c] ?? c).join(' ');
  };

  const loadData = async () => {
    const [queuesData, servicesData] = await Promise.all([
      getTodayQueues(),
      fetchServices(true),
    ]);
    setQueues(queuesData);
    setServices(servicesData);

    const currentMap = new Map<number, Queue>();
    const newRecent: Queue[] = [];

    queuesData.forEach((q) => {
      if (q.is_current) {
        currentMap.set(q.service_id, q);
        const last = lastCalledRef.current.get(q.service_id);
        if (last !== q.id) {
          lastCalledRef.current.set(q.service_id, q.id);
          speak(`Nomor antrian ${formatQueueCodeForSpeech(q.queue_code)}, layanan ${q.service_name}. Silakan menuju loket pemeriksaan.`);
          newRecent.push(q);
        }
      }
    });

    setCurrentQueues(currentMap);
    setRecentCalled((prev) => [...newRecent, ...prev].slice(0, 10));
  };

  useEffect(() => {
    loadData();

    const qCh = supabase
      .channel('queues-tv')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'queues' }, loadData)
      .subscribe();

    const sCh = supabase
      .channel('services-tv')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'services' }, loadData)
      .subscribe();

    return () => {
      supabase.removeChannel(qCh);
      supabase.removeChannel(sCh);
      speechSynthesisRef.current?.cancel();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const displayServices = serviceFilter
    ? services.filter((s) => s.prefix === serviceFilter.toUpperCase())
    : services.filter((s) => s.is_active);

  const getWaiting = (serviceId: number, limit = 3) =>
    queues
      .filter((q) => q.service_id === serviceId && q.status === 'Menunggu' && !q.is_current)
      .sort((a, b) => a.queue_number_seq - b.queue_number_seq)
      .slice(0, limit);

  const getWaitingCount = (serviceId: number) =>
    queues.filter((q) => q.service_id === serviceId && q.status === 'Menunggu' && !q.is_current).length;

  const hh = currentTime.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
  const ss = currentTime.toLocaleTimeString('id-ID', { second: '2-digit' });
  const dateStr = currentTime.toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });

  const accents = [
    { solid: '#2563EB', light: '#EFF6FF', badge: '#DBEAFE', text: '#1E40AF', pill: '#BFDBFE' },
    { solid: '#059669', light: '#ECFDF5', badge: '#D1FAE5', text: '#065F46', pill: '#A7F3D0' },
    { solid: '#7C3AED', light: '#F5F3FF', badge: '#EDE9FE', text: '#5B21B6', pill: '#DDD6FE' },
    { solid: '#D97706', light: '#FFFBEB', badge: '#FEF3C7', text: '#92400E', pill: '#FDE68A' },
    { solid: '#DC2626', light: '#FEF2F2', badge: '#FEE2E2', text: '#991B1B', pill: '#FECACA' },
    { solid: '#0891B2', light: '#ECFEFF', badge: '#CFFAFE', text: '#164E63', pill: '#A5F3FC' },
  ];

  return (
    <div className="flex min-h-screen flex-col bg-slate-100" style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>

      {/* ── Minimal style block: only pseudo-elements + keyframes (not expressible in Tailwind) ── */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap');

        .nav-shell::before {
          content: '';
          position: absolute;
          inset: 0;
          background: radial-gradient(ellipse at 20% 50%, rgba(59,130,246,0.18) 0%, transparent 60%),
                      radial-gradient(ellipse at 80% 20%, rgba(14,165,233,0.14) 0%, transparent 55%);
          pointer-events: none;
        }
        .nav-shell::after {
          content: '';
          position: absolute;
          inset: 0;
          background-image: linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px),
                            linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px);
          background-size: 28px 28px;
          pointer-events: none;
        }

        @keyframes blink {
          0%, 100% { opacity: 1; }
          50%       { opacity: 0.3; }
        }
        @keyframes ticker {
          from { transform: translateX(0); }
          to   { transform: translateX(-50%); }
        }

        .anim-blink  { animation: blink  1.2s ease-in-out infinite; }
        .anim-pulse  { animation: blink  1.2s ease        infinite; }
        .anim-ticker { animation: ticker 20s  linear      infinite; }
      `}</style>

      {/* ══════════════════ NAVBAR ══════════════════ */}
      <nav
        className="nav-shell relative overflow-hidden shadow-[0_8px_32px_rgba(0,0,0,0.25)]"
        style={{ background: 'linear-gradient(120deg, #0F172A 0%, #1E3A5F 45%, #0C4A6E 100%)' }}
      >
        {/* Inner row */}
        <div className="relative z-10 mx-auto flex h-[78px] max-w-[1600px] items-center justify-between gap-5 px-7">

          {/* Brand */}
          <div className="flex flex-shrink-0 items-center gap-3.5">
            <div
              className="flex h-[50px] w-[50px] flex-shrink-0 items-center justify-center rounded-2xl text-2xl"
              style={{
                background: 'linear-gradient(135deg, #38BDF8, #3B82F6)',
                boxShadow: '0 0 0 2px rgba(56,189,248,0.35), 0 8px 24px rgba(59,130,246,0.4)',
              }}
            >
              🏥
            </div>
            <div>
              <div className="text-[22px] font-extrabold leading-none tracking-tight text-white">
                RS Kita
              </div>
              <div className="mt-[3px] text-[11px] font-medium uppercase tracking-widest text-white/50">
                {serviceFilter
                  ? services.find((s) => s.prefix === serviceFilter.toUpperCase())?.name || serviceFilter
                  : 'Layar Informasi Antrian'}
              </div>
            </div>
          </div>

          {/* Center live pill — hidden on mobile */}
          <div className="hidden flex-1 items-center justify-center md:flex">
            <div
              className="flex items-center gap-2 whitespace-nowrap rounded-full border border-white/[0.14] px-[18px] py-1.5 text-xs font-semibold text-white/85 backdrop-blur-lg"
              style={{ background: 'rgba(255,255,255,0.08)' }}
            >
              <span
                className="anim-blink inline-block h-2 w-2 rounded-full bg-green-400"
                style={{ boxShadow: '0 0 8px rgba(74,222,128,0.8)' }}
              />
              Real-Time · {displayServices.length} Layanan Aktif · {queues.filter(q => q.status === 'Menunggu').length} Menunggu
            </div>
          </div>

          {/* Clock — hidden on smallest screens */}
          <div className="hidden flex-shrink-0 text-right sm:block">
            <div
              className="text-[30px] font-extrabold leading-none tracking-[2px] text-white"
              style={{ fontVariantNumeric: 'tabular-nums' }}
            >
              {hh}
              <span className="text-base font-semibold text-white/40"> :{ss.padStart(2, '0')}</span>
            </div>
            <div className="mt-[3px] text-[11px] font-medium text-white/45">{dateStr}</div>
          </div>
        </div>

        {/* Ticker strip */}
        {recentCalled.length > 0 && (
          <div
            className="relative z-10 flex h-9 items-center overflow-hidden border-t"
            style={{ background: 'rgba(255,255,255,0.06)', borderColor: 'rgba(255,255,255,0.08)' }}
          >
            <div className="flex h-full flex-shrink-0 items-center bg-blue-500 px-4 text-[10px] font-extrabold uppercase tracking-[1.5px] text-white">
              📢 Dipanggil
            </div>
            <div className="flex-1 overflow-hidden">
              <div className="anim-ticker flex gap-12 whitespace-nowrap px-6">
                {[...recentCalled, ...recentCalled].map((q, i) => (
                  <span key={i} className="inline-flex items-center gap-2 text-xs font-bold text-white/80">
                    <span className="font-black text-blue-400">{q.queue_code}</span>
                    <span className="text-base text-white/20">—</span>
                    {q.service_name}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* ══════════════════ BODY ══════════════════ */}
      <main className="mx-auto w-full max-w-[1600px] flex-1 px-6 pb-5 pt-6 md:p-4">

        {/* Section header */}
        <div className="mb-[18px] flex flex-wrap items-center justify-between gap-[10px]">
          <div className="flex items-center gap-2 text-[13px] font-bold uppercase tracking-[1.5px] text-slate-500">
            🪑 Antrian Loket
            <span className="rounded-full bg-slate-200 px-[10px] py-[2px] text-[11px] font-bold text-slate-500">
              {displayServices.length}
            </span>
          </div>
        </div>

        {/* Cards grid — 1 col mobile, 2 col sm, auto-fill on lg */}
        <div className="grid grid-cols-1 gap-[18px] sm:grid-cols-2 lg:grid-cols-[repeat(auto-fill,minmax(280px,1fr))]">
          {displayServices.map((service, idx) => {
            const a = accents[idx % accents.length];
            const current = currentQueues.get(service.id);
            const waiting = getWaiting(service.id, 3);
            const count = getWaitingCount(service.id);

            return (
              <div
                key={service.id}
                className="flex flex-col overflow-hidden rounded-[22px] border border-slate-200 bg-white shadow-[0_2px_12px_rgba(0,0,0,0.05)]"
              >
                {/* Card top */}
                <div className="flex items-center gap-3 border-b border-slate-100 px-5 pb-3.5 pt-4">
                  <div
                    className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl text-sm font-black"
                    style={{ background: a.badge, color: a.solid }}
                  >
                    {service.prefix}
                  </div>
                  <div>
                    <div className="text-[15px] font-bold leading-tight text-slate-900">{service.name}</div>
                    <div className="mt-0.5 text-[10px] font-semibold uppercase tracking-[0.5px] text-slate-400">
                      Loket {service.prefix}
                    </div>
                  </div>
                </div>

                {/* Card mid */}
                <div className="flex-1 px-5 pb-3.5 pt-[18px]">
                  {/* "Sedang Dilayani" label */}
                  <div
                    className="mb-1.5 flex items-center gap-[5px] text-[10px] font-bold uppercase tracking-[1.5px]"
                    style={{ color: a.text }}
                  >
                    <span
                      className="anim-pulse h-[7px] w-[7px] rounded-full"
                      style={{ background: a.solid }}
                    />
                    Sedang Dilayani
                  </div>

                  {/* Current queue number */}
                  {current ? (
                    <div
                      className="mb-3.5 text-[68px] font-black leading-none tracking-[-2px] md:text-[48px] lg:text-[68px]"
                      style={{ color: a.solid }}
                    >
                      {current.queue_code}
                    </div>
                  ) : (
                    <div className="mb-3.5 text-[48px] font-extrabold leading-none tracking-[-1px] text-slate-300">
                      —
                    </div>
                  )}

                  {/* Divider */}
                  <div className="mb-3 h-px bg-slate-100" />

                  {/* Next queues */}
                  <div className="mb-2 text-[10px] font-bold uppercase tracking-[1.5px] text-slate-400">
                    Antrian Berikutnya
                  </div>
                  <div className="flex flex-wrap gap-[7px]">
                    {waiting.length > 0
                      ? waiting.map((q) => (
                        <span
                          key={q.id}
                          className="rounded-[9px] border-[1.5px] px-[13px] py-[5px] text-sm font-bold"
                          style={{ background: a.badge, color: a.text, borderColor: a.pill }}
                        >
                          {q.queue_code}
                        </span>
                      ))
                      : <span className="text-[13px] text-slate-300">Kosong</span>
                    }
                  </div>
                </div>

                {/* Card foot */}
                <div
                  className="flex items-center justify-between px-5 pb-3.5 pt-[11px]"
                  style={{ background: a.light, borderTop: `1px solid ${a.badge}` }}
                >
                  <div>
                    <div className="text-[22px] font-extrabold leading-none" style={{ color: a.solid }}>
                      {count}
                    </div>
                    <div className="text-[11px] font-medium text-slate-500">Menunggu</div>
                  </div>
                  <div className="flex items-center gap-[5px] rounded-full bg-green-100 px-3 py-1 text-[11px] font-bold text-green-700">
                    <span className="inline-block h-1.5 w-1.5 rounded-full bg-green-600" />
                    Aktif
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </main>

      {/* ══════════════════ FOOTER ══════════════════ */}
      <footer className="flex flex-wrap items-center justify-between gap-2 bg-slate-900 px-7 py-3">
        <div className="text-xs text-white/35">© 2025 Rumah Sakit Kita — Sistem Antrian Digital</div>
        <div className="flex items-center gap-1.5 text-xs text-white/50">
          <span
            className="inline-block h-[7px] w-[7px] rounded-full bg-green-400"
            style={{ boxShadow: '0 0 6px #4ADE80' }}
          />
          Data Real-Time
        </div>
      </footer>

      {/* Mute badge */}
      {isMuted && (
        <div className="fixed bottom-[18px] right-[18px] z-[100] rounded-full bg-red-600 px-[18px] py-2 text-[13px] font-bold text-white shadow-[0_4px_20px_rgba(220,38,38,0.45)]">
          🔇 Mode Hening
        </div>
      )}
    </div>
  );
}

export default function TVSimplePage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-slate-900 font-sans">
          <div className="text-center text-white/50">
            <div className="mb-4 text-5xl">🏥</div>
            <div className="text-[15px] font-semibold">Memuat layar antrian...</div>
          </div>
        </div>
      }
    >
      <TVSimpleContent />
    </Suspense>
  );
}
