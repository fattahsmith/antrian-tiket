'use client';

import { useEffect, useState, useRef, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { Queue } from '@/types/queue';
import { Service } from '@/types/service';
import { getTodayQueues, getCurrentQueue } from '@/lib/queueUtils';
import { fetchServices } from '@/lib/serviceUtils';

const glassCard =
  'bg-white/10 border border-white/20 backdrop-blur-xl shadow-[0_30px_120px_rgba(15,23,42,0.35)] rounded-3xl';

function TVSimpleContent() {
  const searchParams = useSearchParams();
  const serviceFilter = searchParams.get('service');
  const isMuted = searchParams.get('mute') === 'true';
  
  const [queues, setQueues] = useState<Queue[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [currentQueues, setCurrentQueues] = useState<Map<number, Queue>>(new Map());
  const [recentCalled, setRecentCalled] = useState<Queue[]>([]);
  const lastCalledRef = useRef<Map<number, number>>(new Map());
  const speechSynthesisRef = useRef<SpeechSynthesis | null>(null);

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
      '0': 'nol',
      '1': 'satu',
      '2': 'dua',
      '3': 'tiga',
      '4': 'empat',
      '5': 'lima',
      '6': 'enam',
      '7': 'tujuh',
      '8': 'delapan',
      '9': 'sembilan',
    };

    return code
      .split('')
      .map((char) => digitWords[char] ?? char)
      .join(' ');
  };

  const loadData = async () => {
    const [queuesData, servicesData] = await Promise.all([
      getTodayQueues(),
      fetchServices(true),
    ]);

    setQueues(queuesData);
    setServices(servicesData);

    // Find current queues for each service
    const currentMap = new Map<number, Queue>();
    const newRecentCalled: Queue[] = [];

    queuesData.forEach((queue) => {
      if (queue.is_current) {
        currentMap.set(queue.service_id, queue);
        
        // Check if this is a new call
        const lastCalledId = lastCalledRef.current.get(queue.service_id);
        if (lastCalledId !== queue.id) {
          lastCalledRef.current.set(queue.service_id, queue.id);
          
          // Announce the call
          const message = `Nomor antrian ${formatQueueCodeForSpeech(queue.queue_code)}, layanan ${queue.service_name}. Silakan menuju loket pemeriksaan.`;
          speak(message);
          
          // Add to recent called
          newRecentCalled.push(queue);
        }
      }
    });

    setCurrentQueues(currentMap);
    
    // Update recent called list (keep last 10)
    setRecentCalled((prev) => {
      const combined = [...newRecentCalled, ...prev];
      return combined.slice(0, 10);
    });
  };

  useEffect(() => {
    loadData();

    const queueChannel = supabase
      .channel('queues-tv')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'queues',
        },
        () => {
          loadData();
        }
      )
      .subscribe();

    const serviceChannel = supabase
      .channel('services-tv')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'services',
        },
        () => {
          loadData();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(queueChannel);
      supabase.removeChannel(serviceChannel);
      if (speechSynthesisRef.current) {
        speechSynthesisRef.current.cancel();
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Filter services if serviceFilter is provided
  const displayServices = serviceFilter
    ? services.filter((s) => s.prefix === serviceFilter.toUpperCase())
    : services.filter((s) => s.is_active);

  // Get waiting queues for a service (next 3)
  const getWaitingQueues = (serviceId: number, limit = 3): Queue[] => {
    return queues
      .filter(
        (q) =>
          q.service_id === serviceId &&
          q.status === 'Menunggu' &&
          !q.is_current
      )
      .sort((a, b) => a.queue_number_seq - b.queue_number_seq)
      .slice(0, limit);
  };

  // Get waiting count for a service
  const getWaitingCount = (serviceId: number): number => {
    return queues.filter(
      (q) => q.service_id === serviceId && q.status === 'Menunggu' && !q.is_current
    ).length;
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-[#030917] via-[#0b1f3c] to-[#0f73a8] text-white">
      <div className="pointer-events-none absolute inset-0 opacity-80">
        <div className="absolute -top-20 left-0 h-72 w-72 rounded-full bg-cyan-400/20 blur-[140px]" />
        <div className="absolute top-10 right-0 h-96 w-96 rounded-full bg-sky-500/20 blur-[160px]" />
        <div className="absolute bottom-0 left-1/2 h-80 w-80 -translate-x-1/2 rounded-full bg-indigo-500/10 blur-[120px]" />
      </div>

      <div className="relative z-10 mx-auto flex min-h-screen max-w-7xl flex-col gap-6 px-4 py-6 lg:px-8">
        {/* Header */}
        <header className="text-center">
          <h1 className="text-4xl font-bold text-white lg:text-5xl">RS Kita</h1>
          <p className="mt-2 text-lg text-white/80">Layar Informasi Antrian</p>
          {serviceFilter && (
            <p className="mt-1 text-sm text-white/60">
              Layanan: {services.find((s) => s.prefix === serviceFilter.toUpperCase())?.name || serviceFilter}
            </p>
          )}
        </header>

        {/* Current Called Numbers - Big and Center */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 xl:grid-cols-3">
          {displayServices.map((service) => {
            const currentQueue = currentQueues.get(service.id);
            const waitingQueues = getWaitingQueues(service.id, 3);
            const waitingCount = getWaitingCount(service.id);

            return (
              <div key={service.id} className={`${glassCard} p-6`}>
                {/* Service Header */}
                <div className="mb-4 text-center">
                  <h2 className="text-xl font-semibold text-white">{service.name}</h2>
                  <p className="text-sm text-white/60">Prefix: {service.prefix}</p>
                </div>

                {/* Current Called Number - Big */}
                <div className="mb-6 text-center">
                  {currentQueue ? (
                    <>
                      <p className="mb-2 text-sm uppercase tracking-widest text-white/60">
                        Sedang Dilayani
                      </p>
                      <p className="text-6xl font-bold text-emerald-300 lg:text-7xl">
                        {currentQueue.queue_code}
                      </p>
                    </>
                  ) : (
                    <>
                      <p className="mb-2 text-sm uppercase tracking-widest text-white/60">
                        Sedang Dilayani
                      </p>
                      <p className="text-4xl font-semibold text-white/40">-</p>
                    </>
                  )}
                </div>

                {/* Next 3 Waiting */}
                <div className="mb-4">
                  <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-white/60">
                    Antrian Berikutnya
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {waitingQueues.length > 0 ? (
                      waitingQueues.map((q) => (
                        <span
                          key={q.id}
                          className="rounded-xl bg-sky-500/20 px-4 py-2 text-lg font-semibold text-sky-200"
                        >
                          {q.queue_code}
                        </span>
                      ))
                    ) : (
                      <span className="text-white/40">Tidak ada antrian</span>
                    )}
                  </div>
                </div>

                {/* Waiting Count */}
                <div className="text-center">
                  <p className="text-sm text-white/60">Total Menunggu</p>
                  <p className="text-2xl font-semibold text-amber-200">{waitingCount}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Recent Called Numbers Footer */}
        {recentCalled.length > 0 && (
          <div className={`${glassCard} p-4`}>
            <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-white/60">
              Baru Saja Dipanggil
            </p>
            <div className="flex flex-wrap gap-3">
              {recentCalled.map((queue) => (
                <div
                  key={queue.id}
                  className="flex items-center gap-2 rounded-xl bg-emerald-500/20 px-4 py-2"
                >
                  <span className="text-lg font-semibold text-emerald-200">
                    {queue.queue_code}
                  </span>
                  <span className="text-xs text-white/60">{queue.service_name}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Mute Indicator */}
        {isMuted && (
          <div className="fixed bottom-4 right-4 rounded-full bg-red-500/80 px-4 py-2 text-sm font-semibold text-white">
            🔇 Muted
          </div>
        )}
      </div>
    </div>
  );
}

export default function TVSimplePage() {
  return (
    <Suspense
      fallback={
        <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-[#030917] via-[#0b1f3c] to-[#0f73a8] text-white">
          <div className="relative z-10 flex min-h-screen items-center justify-center">
            <div className="text-white/70">Memuat layar TV...</div>
          </div>
        </div>
      }
    >
      <TVSimpleContent />
    </Suspense>
  );
}

