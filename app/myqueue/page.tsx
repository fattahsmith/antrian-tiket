'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Queue } from '@/types/queue';
import { getQueueByQrToken, getQueuePosition, getQueueStats } from '@/lib/queueUtils';
import { generateQrDataUrl } from '@/lib/qrUtils';
import { Clock, Users, Building2, Printer, ArrowLeft, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';

// Glassmorphism card style
const glassCard = 'bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border border-white/20 dark:border-gray-700/30 rounded-2xl shadow-xl';

// Loading Skeleton Component
function LoadingSkeleton() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-blue-50 via-white to-emerald-50">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-transparent to-emerald-500/5" />
      
      <div className="relative z-10 mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Header Skeleton */}
        <div className="mb-8 flex items-center justify-between">
          <div className="h-8 w-32 animate-pulse rounded-lg bg-gray-200" />
          <div className="h-10 w-24 animate-pulse rounded-full bg-gray-200" />
        </div>

        {/* Large Queue Number Skeleton */}
        <div className="mb-8 flex flex-col items-center justify-center space-y-4">
          <div className="h-32 w-64 animate-pulse rounded-3xl bg-gradient-to-br from-blue-200 to-emerald-200" />
          <div className="h-6 w-48 animate-pulse rounded-lg bg-gray-200" />
        </div>

        {/* Info Cards Skeleton */}
        <div className="grid gap-6 md:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className={`${glassCard} p-6`}>
              <div className="mb-4 h-4 w-24 animate-pulse rounded bg-gray-200" />
              <div className="h-8 w-32 animate-pulse rounded bg-gray-200" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function MyQueueContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const [queue, setQueue] = useState<Queue | null>(null);
  const [position, setPosition] = useState<number>(0);
  const [estimatedWait, setEstimatedWait] = useState<number>(0);
  const [qrImageUrl, setQrImageUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isPrinting, setIsPrinting] = useState(false);

  useEffect(() => {
    if (!token) {
      setError('Token tidak ditemukan');
      setLoading(false);
      return;
    }

    const loadQueueData = async () => {
      try {
        const { data, error: fetchError } = await getQueueByQrToken(token);
        
        if (fetchError || !data) {
          setError('Tiket tidak ditemukan atau sudah kadaluarsa.');
          setLoading(false);
          return;
        }

        setQueue(data);

        // Get queue position
        const pos = await getQueuePosition(data);
        setPosition(pos);

        // Get estimated wait time
        const stats = await getQueueStats(data.visit_date);
        setEstimatedWait(stats.estimatedWaitMinutes);

        // Generate QR code image
        const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';
        const qrUrl = `${baseUrl}/myqueue?token=${token}`;
        const qrDataUrl = await generateQrDataUrl(qrUrl, 300);
        setQrImageUrl(qrDataUrl);
      } catch (err) {
        console.error('Error loading queue:', err);
        setError('Terjadi kesalahan saat memuat data.');
      } finally {
        setLoading(false);
      }
    };

    loadQueueData();

    // Auto-refresh every 10 seconds
    const interval = setInterval(() => {
      loadQueueData();
    }, 10000);

    return () => clearInterval(interval);
  }, [token]);

  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'Dipanggil':
        return {
          label: 'Dipanggil',
          color: 'from-emerald-500 to-green-600',
          bgColor: 'bg-emerald-50 dark:bg-emerald-900/20',
          textColor: 'text-emerald-700 dark:text-emerald-300',
          borderColor: 'border-emerald-200 dark:border-emerald-800',
          icon: CheckCircle2,
        };
      case 'Selesai':
        return {
          label: 'Selesai',
          color: 'from-gray-500 to-gray-600',
          bgColor: 'bg-gray-50 dark:bg-gray-900/20',
          textColor: 'text-gray-700 dark:text-gray-300',
          borderColor: 'border-gray-200 dark:border-gray-800',
          icon: CheckCircle2,
        };
      case 'Dilewati':
        return {
          label: 'Dilewati',
          color: 'from-amber-500 to-orange-600',
          bgColor: 'bg-amber-50 dark:bg-amber-900/20',
          textColor: 'text-amber-700 dark:text-amber-300',
          borderColor: 'border-amber-200 dark:border-amber-800',
          icon: AlertCircle,
        };
      default:
        return {
          label: 'Menunggu',
          color: 'from-blue-500 to-cyan-600',
          bgColor: 'bg-blue-50 dark:bg-blue-900/20',
          textColor: 'text-blue-700 dark:text-blue-300',
          borderColor: 'border-blue-200 dark:border-blue-800',
          icon: Clock,
        };
    }
  };

  const handlePrint = () => {
    if (!qrImageUrl || !queue) return;
    
    setIsPrinting(true);
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>Tiket Antrian ${queue.queue_code}</title>
            <meta charset="utf-8">
            <style>
              * {
                margin: 0;
                padding: 0;
                box-sizing: border-box;
              }
              @media print {
                @page {
                  size: A4;
                  margin: 10mm;
                }
              }
              body {
                font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                min-height: 100vh;
                padding: 20px;
                background: white;
                color: #1f2937;
              }
              .ticket {
                text-align: center;
                max-width: 400px;
                width: 100%;
                padding: 30px;
                border: 2px solid #e5e7eb;
                border-radius: 16px;
              }
              .header {
                margin-bottom: 24px;
              }
              .header h1 {
                font-size: 24px;
                font-weight: 700;
                color: #1f2937;
                margin-bottom: 4px;
              }
              .header p {
                font-size: 14px;
                color: #6b7280;
              }
              .queue-code {
                font-size: 64px;
                font-weight: 800;
                background: linear-gradient(135deg, #3b82f6 0%, #10b981 100%);
                -webkit-background-clip: text;
                -webkit-text-fill-color: transparent;
                background-clip: text;
                margin: 20px 0;
                letter-spacing: -2px;
              }
              .info-section {
                margin: 24px 0;
                padding: 16px;
                background: #f9fafb;
                border-radius: 12px;
                text-align: left;
              }
              .info-row {
                display: flex;
                justify-content: space-between;
                margin-bottom: 12px;
                font-size: 14px;
              }
              .info-row:last-child {
                margin-bottom: 0;
              }
              .info-label {
                color: #6b7280;
                font-weight: 500;
              }
              .info-value {
                color: #1f2937;
                font-weight: 600;
              }
              .qr-code {
                margin: 24px 0;
                padding: 16px;
                background: white;
                border-radius: 12px;
                display: inline-block;
              }
              .qr-code img {
                width: 200px;
                height: 200px;
                display: block;
              }
              .footer {
                margin-top: 24px;
                font-size: 12px;
                color: #9ca3af;
              }
              @media print {
                body {
                  padding: 0;
                }
                .ticket {
                  border: none;
                  max-width: 100%;
                }
              }
            </style>
          </head>
          <body>
            <div class="ticket">
              <div class="header">
                <h1>Rumah Sakit Kita</h1>
                <p>Tiket Antrian</p>
              </div>
              
              <div class="queue-code">${queue.queue_code}</div>
              
              <div class="info-section">
                <div class="info-row">
                  <span class="info-label">Layanan:</span>
                  <span class="info-value">${queue.service_name}</span>
                </div>
                <div class="info-row">
                  <span class="info-label">Nama:</span>
                  <span class="info-value">${queue.name}</span>
                </div>
                <div class="info-row">
                  <span class="info-label">Tanggal:</span>
                  <span class="info-value">${new Date(queue.visit_date).toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
                </div>
                <div class="info-row">
                  <span class="info-label">Status:</span>
                  <span class="info-value">${queue.status}</span>
                </div>
              </div>
              
              <div class="qr-code">
                <img src="${qrImageUrl}" alt="QR Code" />
              </div>
              
              <div class="footer">
                <p>Simpan QR code ini untuk akses cepat ke status antrian Anda</p>
                <p style="margin-top: 8px;">Scan QR code untuk melihat update status antrian</p>
              </div>
            </div>
          </body>
        </html>
      `);
      printWindow.document.close();
      
      setTimeout(() => {
        printWindow.print();
        setIsPrinting(false);
      }, 250);
    }
  };

  if (loading) {
    return <LoadingSkeleton />;
  }

  if (error || !queue) {
    return (
      <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-blue-50 via-white to-emerald-50">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-transparent to-emerald-500/5" />
        
        <div className="relative z-10 mx-auto max-w-2xl px-4 py-8 sm:px-6 lg:px-8">
          <header className="mb-8 flex items-center justify-between">
            <Link href="/" className="text-sm font-semibold text-gray-600 hover:text-gray-900">
              ← Kembali ke Beranda
            </Link>
          </header>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`${glassCard} p-8 text-center`}
          >
            <div className="mb-4 text-6xl">⚠️</div>
            <h1 className="mb-4 text-2xl font-bold text-gray-900 dark:text-white">
              {error || 'Tiket tidak ditemukan'}
            </h1>
            <p className="mb-6 text-gray-600 dark:text-gray-400">
              {error || 'Tiket tidak ditemukan atau sudah kadaluarsa.'}
            </p>
            <Link
              href="/"
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-emerald-600 px-6 py-3 text-base font-semibold text-white shadow-lg transition hover:shadow-xl"
            >
              Kembali ke Halaman Utama
            </Link>
          </motion.div>
        </div>
      </div>
    );
  }

  const statusConfig = getStatusConfig(queue.status);
  const StatusIcon = statusConfig.icon;

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-blue-50 via-white to-emerald-50">
      {/* Background gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-transparent to-emerald-500/5" />
      
      {/* Animated background circles */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-blue-400/10 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-emerald-400/10 blur-3xl" />
      </div>

      <div className="relative z-10 mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.header
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 flex items-center justify-between"
        >
          <Link
            href="/"
            className="flex items-center gap-2 text-sm font-semibold text-gray-600 transition hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" />
            Kembali
          </Link>
          <Link
            href="/myqueue/reprint"
            className="flex items-center gap-2 rounded-xl bg-white/80 px-4 py-2 text-sm font-semibold text-gray-700 shadow-sm transition hover:bg-white dark:bg-gray-800/80 dark:text-gray-300"
          >
            <Printer className="h-4 w-4" />
            Cetak Ulang
          </Link>
        </motion.header>

        {/* Main Content */}
        <div className="space-y-8">
          {/* Large Queue Number - Main Focus */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col items-center justify-center space-y-4"
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={queue.queue_code}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className={`relative overflow-hidden rounded-3xl bg-gradient-to-br ${statusConfig.color} p-8 shadow-2xl`}
              >
                <div className="absolute inset-0 bg-white/10 backdrop-blur-sm" />
                <div className="relative text-center">
                  <p className="mb-2 text-sm font-semibold uppercase tracking-wider text-white/90">
                    Nomor Antrian
                  </p>
                  <h1 className="text-7xl font-black tracking-tight text-white sm:text-8xl lg:text-9xl">
                    {queue.queue_code}
                  </h1>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Status Badge */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className={`inline-flex items-center gap-2 rounded-full border ${statusConfig.borderColor} ${statusConfig.bgColor} px-6 py-3`}
            >
              <StatusIcon className={`h-5 w-5 ${statusConfig.textColor}`} />
              <span className={`text-sm font-semibold ${statusConfig.textColor}`}>
                {statusConfig.label}
              </span>
            </motion.div>
          </motion.div>

          {/* Information Cards */}
          <div className="grid gap-6 md:grid-cols-3">
            {/* Estimated Waiting Time */}
            {estimatedWait > 0 && queue.status === 'Menunggu' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className={`${glassCard} p-6`}
              >
                <div className="mb-3 flex items-center gap-3">
                  <div className="rounded-xl bg-blue-100 p-2 dark:bg-blue-900/30">
                    <Clock className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                    Estimasi Waktu
                  </p>
                </div>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">
                  {estimatedWait}
                  <span className="ml-2 text-lg font-normal text-gray-600 dark:text-gray-400">
                    menit
                  </span>
                </p>
              </motion.div>
            )}

            {/* Remaining Queues */}
            {position > 0 && queue.status === 'Menunggu' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className={`${glassCard} p-6`}
              >
                <div className="mb-3 flex items-center gap-3">
                  <div className="rounded-xl bg-emerald-100 p-2 dark:bg-emerald-900/30">
                    <Users className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                    Antrian di Depan
                  </p>
                </div>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">
                  {position}
                  <span className="ml-2 text-lg font-normal text-gray-600 dark:text-gray-400">
                    {position === 1 ? 'orang' : 'orang'}
                  </span>
                </p>
              </motion.div>
            )}

            {/* Service Counter */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className={`${glassCard} p-6`}
            >
              <div className="mb-3 flex items-center gap-3">
                <div className="rounded-xl bg-purple-100 p-2 dark:bg-purple-900/30">
                  <Building2 className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                </div>
                <p className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                  Layanan
                </p>
              </div>
              <p className="text-lg font-bold text-gray-900 dark:text-white">
                {queue.service_name}
              </p>
            </motion.div>
          </div>

          {/* Additional Info Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className={`${glassCard} p-6`}
          >
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                  Nama Pasien
                </p>
                <p className="text-base font-semibold text-gray-900 dark:text-white">
                  {queue.name}
                </p>
              </div>
              <div>
                <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                  Tanggal Kunjungan
                </p>
                <p className="text-base font-semibold text-gray-900 dark:text-white">
                  {new Date(queue.visit_date).toLocaleDateString('id-ID', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </p>
              </div>
            </div>
          </motion.div>

          {/* QR Code & Print Button */}
          {qrImageUrl && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className={`${glassCard} p-6`}
            >
              <div className="flex flex-col items-center gap-6">
                <div className="rounded-2xl bg-white p-4 shadow-lg">
                  <img src={qrImageUrl} alt="QR Code" className="h-48 w-48 sm:h-64 sm:w-64" />
                </div>
                <button
                  onClick={handlePrint}
                  disabled={isPrinting}
                  className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-emerald-600 px-8 py-3 text-base font-semibold text-white shadow-lg transition hover:shadow-xl disabled:opacity-50"
                >
                  {isPrinting ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin" />
                      Mencetak...
                    </>
                  ) : (
                    <>
                      <Printer className="h-5 w-5" />
                      Cetak Tiket
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function MyQueuePage() {
  return (
    <Suspense fallback={<LoadingSkeleton />}>
      <MyQueueContent />
    </Suspense>
  );
}
