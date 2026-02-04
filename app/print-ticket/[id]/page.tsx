'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Queue } from '@/types/queue';
import { supabase } from '@/lib/supabase';
import { generateQrDataUrl } from '@/lib/qrUtils';
import { incrementPrintCount } from '@/lib/queueUtils';

export default function PrintTicketPage() {
  const params = useParams();
  const router = useRouter();
  const queueId = Number(params.id);
  const [queue, setQueue] = useState<Queue | null>(null);
  const [qrImageUrl, setQrImageUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [hasPrinted, setHasPrinted] = useState(false);

  useEffect(() => {
    const loadQueue = async () => {
      try {
        const { data, error } = await supabase
          .from('queues')
          .select('*')
          .eq('id', queueId)
          .single();

        if (error || !data) {
          console.error('Error loading queue:', error);
          return;
        }

        setQueue(data);

        // Generate QR code if token exists
        if (data.qr_token) {
          const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';
          const qrUrl = `${baseUrl}/myqueue?token=${data.qr_token}`;
          const qrDataUrl = await generateQrDataUrl(qrUrl, 400);
          setQrImageUrl(qrDataUrl);
        }
      } catch (err) {
        console.error('Error:', err);
      } finally {
        setLoading(false);
      }
    };

    loadQueue();
  }, [queueId]);

  const handlePrint = () => {
    window.print();
    
    // Increment print count after print dialog is shown
    if (!hasPrinted && queue) {
      incrementPrintCount(queue.id);
      setHasPrinted(true);
    }
  };

  const handleClose = () => {
    router.back();
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-100">
        <div className="text-gray-600">Memuat tiket...</div>
      </div>
    );
  }

  if (!queue) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-100">
        <div className="text-center">
          <p className="text-gray-600">Tiket tidak ditemukan</p>
          <button
            onClick={handleClose}
            className="mt-4 rounded bg-blue-500 px-4 py-2 text-white"
          >
            Kembali
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <style jsx global>{`
        @media print {
          body * {
            visibility: hidden;
          }
          .ticket-container,
          .ticket-container * {
            visibility: visible;
          }
          .ticket-container {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
          }
          .no-print {
            display: none !important;
          }
        }
        @page {
          size: A6 landscape;
          margin: 10mm;
        }
      `}</style>

      <div className="flex min-h-screen items-center justify-center bg-gray-100 p-4">
        <div className="ticket-container max-w-2xl rounded-lg bg-white p-5 shadow-lg">
          <div className="text-center">
            {/* Hospital Logo/Header */}
            <div className="mb-6">
              <h1 className="text-3xl font-bold text-gray-800">RS Kita</h1>
              <p className="text-sm text-gray-600">Rumah Sakit Terpercaya</p>
            </div>

            {/* Queue Code - Big and Prominent */}
            <div className="mb-6">
              <p className="mb-2 text-sm uppercase tracking-widest text-gray-500">
                Nomor Antrian
              </p>
              <p className="text-6xl font-bold text-sky-600">{queue.queue_code}</p>
            </div>

            {/* Service Name */}
            <div className="mb-6">
              <p className="text-lg font-semibold text-gray-700">{queue.service_name}</p>
            </div>

            {/* Patient Name (Optional) */}
            {queue.name && (
              <div className="mb-6">
                <p className="text-sm text-gray-500">Nama Pasien</p>
                <p className="text-base font-medium text-gray-700">{queue.name}</p>
              </div>
            )}

            {/* Date and Time */}
            <div className="mb-2 grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-500">Tanggal</p>
                <p className="font-medium text-gray-700">
                  {new Date(queue.visit_date).toLocaleDateString('id-ID', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </p>
              </div>
              <div>
                <p className="text-gray-500">Waktu</p>
                <p className="font-medium text-gray-700">
                  {new Date(queue.created_at).toLocaleTimeString('id-ID', {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </p>
              </div>
            </div>

            {/* QR Code */}
            {qrImageUrl && (
              <div className="mb-6 flex justify-center">
                <div className="rounded-lg bg-white p-4">
                  <img
                    src={qrImageUrl}
                    alt="QR Code"
                    className="h-48 w-48"
                    style={{ imageRendering: 'crisp-edges' }}
                  />
                </div>
              </div>
            )}

            {/* Footer Message */}
            <div className="mt-6 border-t border-gray-200 mb-10  ">
              <p className="text-xs text-gray-500">
                Scan QR code untuk melihat status antrian secara real-time
              </p>
              {queue.print_count !== undefined && queue.print_count > 0 && (
                <p className="mt-2 text-xs text-gray-400">
                  Cetakan ke-{queue.print_count + 1}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Print and Close Buttons - Hidden when printing */}
        <div className="no-print fixed bottom-8 left-1/2 flex -translate-x-1/2 gap-4 pt-5">
          <button
            onClick={handlePrint}
            className="rounded-lg bg-blue-500 px-4 py-2 font-semibold text-white shadow-lg transition hover:bg-blue-600"
          >
            🖨️ Cetak Tiket
          </button>
          <button
            onClick={handleClose}
            className="rounded-lg bg-gray-500 px-4 py-1 font-semibold text-white shadow-lg transition hover:bg-gray-600"
          >
            ✕ Tutup
          </button>
        </div>
      </div>
    </>
  );
}


