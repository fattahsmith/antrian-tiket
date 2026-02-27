'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Queue } from '@/types/queue';
import { getQueueByQrToken, getQueuePosition, getQueueStats } from '@/lib/queueUtils';
import { generateQrDataUrl } from '@/lib/qrUtils';
import {
  Clock,
  Users,
  Building2,
  Printer,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  Loader2,
  RefreshCw,
  Calendar,
  User,
  Ticket,
} from 'lucide-react';

// ─── Loading Skeleton ──────────────────────────────────────────────────────────
function LoadingSkeleton() {
  return (
    <div className="h-screen w-screen flex items-center justify-center bg-slate-50">
      <div className="flex flex-col items-center gap-4">
        <div className="relative">
          <div className="h-16 w-16 rounded-full border-4 border-blue-200 border-t-blue-500 animate-spin" />
          <div className="absolute inset-0 flex items-center justify-center">
            <Ticket className="h-6 w-6 text-blue-400" />
          </div>
        </div>
        <p className="text-slate-500 font-medium animate-pulse text-sm">Memuat tiket antrian…</p>
      </div>
    </div>
  );
}

// ─── Status Config ─────────────────────────────────────────────────────────────
function getStatusConfig(status: string) {
  switch (status) {
    case 'Dipanggil':
      return {
        label: 'Dipanggil',
        gradient: 'from-emerald-500 to-green-600',
        bg: 'bg-emerald-50',
        text: 'text-emerald-700',
        border: 'border-emerald-200',
        icon: CheckCircle2,
        pulse: true,
        dot: 'bg-emerald-500',
        numberColor: 'from-emerald-500 to-green-600',
      };
    case 'Selesai':
      return {
        label: 'Selesai',
        gradient: 'from-slate-400 to-slate-500',
        bg: 'bg-slate-50',
        text: 'text-slate-600',
        border: 'border-slate-200',
        icon: CheckCircle2,
        pulse: false,
        dot: 'bg-slate-400',
        numberColor: 'from-slate-500 to-slate-600',
      };
    case 'Dilewati':
      return {
        label: 'Dilewati',
        gradient: 'from-amber-500 to-orange-600',
        bg: 'bg-amber-50',
        text: 'text-amber-700',
        border: 'border-amber-200',
        icon: AlertCircle,
        pulse: false,
        dot: 'bg-amber-500',
        numberColor: 'from-amber-500 to-orange-600',
      };
    default:
      return {
        label: 'Menunggu',
        gradient: 'from-blue-500 to-violet-600',
        bg: 'bg-blue-50',
        text: 'text-blue-700',
        border: 'border-blue-200',
        icon: Clock,
        pulse: true,
        dot: 'bg-blue-500',
        numberColor: 'from-blue-500 to-violet-600',
      };
  }
}

// ─── Main Content ──────────────────────────────────────────────────────────────
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
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const loadQueueData = async (showRefresh = false) => {
    if (!token) { setError('Token tidak ditemukan'); setLoading(false); return; }
    if (showRefresh) setIsRefreshing(true);
    try {
      const { data, error: fetchError } = await getQueueByQrToken(token);
      if (fetchError || !data) { setError('Tiket tidak ditemukan atau sudah kadaluarsa.'); setLoading(false); return; }
      setQueue(data);
      setPosition(await getQueuePosition(data));
      const stats = await getQueueStats(data.visit_date);
      setEstimatedWait(stats.estimatedWaitMinutes);
      const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';
      setQrImageUrl(await generateQrDataUrl(`${baseUrl}/myqueue?token=${token}`, 300));
      setLastUpdated(new Date());
    } catch (err) {
      console.error(err);
      setError('Terjadi kesalahan saat memuat data.');
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    if (!token) { setError('Token tidak ditemukan'); setLoading(false); return; }
    loadQueueData();
    const interval = setInterval(() => loadQueueData(), 10000);
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  const handlePrint = () => {
    if (!qrImageUrl || !queue) return;
    setIsPrinting(true);
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`
        <!DOCTYPE html><html><head>
          <title>Tiket Antrian ${queue.queue_code}</title>
          <meta charset="utf-8">
          <style>
            *{margin:0;padding:0;box-sizing:border-box}
            @media print{@page{size:A4;margin:10mm}}
            body{font-family:'Inter',-apple-system,BlinkMacSystemFont,sans-serif;display:flex;flex-direction:column;align-items:center;justify-content:center;min-height:100vh;padding:20px;background:white;color:#1f2937}
            .ticket{text-align:center;max-width:400px;width:100%;padding:30px;border:2px solid #e5e7eb;border-radius:16px}
            .header{margin-bottom:24px}.header h1{font-size:24px;font-weight:700;color:#1f2937;margin-bottom:4px}.header p{font-size:14px;color:#6b7280}
            .queue-code{font-size:64px;font-weight:800;background:linear-gradient(135deg,#3b82f6 0%,#8b5cf6 100%);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;margin:20px 0;letter-spacing:-2px}
            .info-section{margin:24px 0;padding:16px;background:#f9fafb;border-radius:12px;text-align:left}
            .info-row{display:flex;justify-content:space-between;margin-bottom:12px;font-size:14px}.info-row:last-child{margin-bottom:0}
            .info-label{color:#6b7280;font-weight:500}.info-value{color:#1f2937;font-weight:600}
            .qr-code{margin:24px 0;padding:16px;background:white;border-radius:12px;display:inline-block}.qr-code img{width:200px;height:200px;display:block}
            .footer{margin-top:24px;font-size:12px;color:#9ca3af}
            @media print{body{padding:0}.ticket{border:none;max-width:100%}}
          </style>
        </head><body>
          <div class="ticket">
            <div class="header"><h1>Rumah Sakit Kita</h1><p>Tiket Antrian</p></div>
            <div class="queue-code">${queue.queue_code}</div>
            <div class="info-section">
              <div class="info-row"><span class="info-label">Layanan:</span><span class="info-value">${queue.service_name}</span></div>
              <div class="info-row"><span class="info-label">Nama:</span><span class="info-value">${queue.name}</span></div>
              <div class="info-row"><span class="info-label">Tanggal:</span><span class="info-value">${new Date(queue.visit_date).toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span></div>
              <div class="info-row"><span class="info-label">Status:</span><span class="info-value">${queue.status}</span></div>
            </div>
            <div class="qr-code"><img src="${qrImageUrl}" alt="QR Code" /></div>
            <div class="footer"><p>Simpan QR code ini untuk akses cepat</p><p style="margin-top:8px">Scan untuk melihat update status antrian</p></div>
          </div>
        </body></html>
      `);
      printWindow.document.close();
      setTimeout(() => { printWindow.print(); setIsPrinting(false); }, 250);
    }
  };

  if (loading) return <LoadingSkeleton />;

  // ── Error State ───────────────────────────────────────────────────────────────
  if (error || !queue) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-slate-50 px-4">
        <motion.div initial={{ opacity: 0, scale: 0.92 }} animate={{ opacity: 1, scale: 1 }} className="max-w-sm w-full text-center">
          <div className="mb-5 inline-flex h-16 w-16 items-center justify-center rounded-full bg-red-50 ring-1 ring-red-200">
            <AlertCircle className="h-8 w-8 text-red-500" />
          </div>
          <h1 className="mb-2 text-xl font-bold text-slate-800">{error || 'Tiket tidak ditemukan'}</h1>
          <p className="mb-7 text-sm text-slate-500">Tiket tidak ditemukan atau sudah kadaluarsa.</p>
          <Link href="/" className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-500 to-violet-600 px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-blue-200 hover:shadow-blue-300 transition-all hover:-translate-y-0.5">
            <ArrowLeft className="h-4 w-4" /> Kembali ke Beranda
          </Link>
        </motion.div>
      </div>
    );
  }

  const statusConfig = getStatusConfig(queue.status);
  const StatusIcon = statusConfig.icon;

  return (
    <div className="h-screen w-screen overflow-hidden bg-slate-50 flex flex-col">

      {/* ── Subtle top accent strip ── */}
      <div className={`h-1 w-full bg-gradient-to-r ${statusConfig.gradient} flex-shrink-0`} />

      {/* ── Top Nav ── */}
      <motion.nav
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex-shrink-0 flex items-center justify-between px-6 py-3 bg-white border-b border-slate-100"
      >
        <Link href="/" className="flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-slate-800 transition-colors">
          <ArrowLeft className="h-4 w-4" /> Kembali
        </Link>

        <div className="flex items-center gap-2">
          {/* Live dot */}
          <div className="flex items-center gap-1.5 text-xs text-slate-400">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-60" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-green-500" />
            </span>
            Live
          </div>

          <button
            onClick={() => loadQueueData(true)}
            disabled={isRefreshing}
            className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-50 transition-all disabled:opacity-50"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
            Refresh
          </button>

          <Link href="/myqueue/reprint" className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-50 transition-all">
            <Printer className="h-3.5 w-3.5" /> Cetak Ulang
          </Link>
        </div>
      </motion.nav>

      {/* ── Main Single Section (fills remaining height) ── */}
      <div className="flex-1 flex items-center justify-center p-4 min-h-0">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          className="w-full max-w-5xl h-full max-h-[660px] grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-4"
        >

          {/* ── Left panel ── */}
          <div className="flex flex-col gap-4 min-h-0">

            {/* Queue Number Hero */}
            <AnimatePresence mode="wait">
              <motion.div
                key={queue.queue_code}
                initial={{ opacity: 0, scale: 0.94 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4 }}
                className="relative overflow-hidden rounded-2xl bg-white border border-slate-100 shadow-sm flex flex-col items-center justify-center py-8 flex-1 min-h-0"
              >
                {/* Soft gradient blob behind number */}
                <div className={`absolute inset-0 bg-gradient-to-br ${statusConfig.gradient} opacity-[0.04]`} />
                <div className="relative text-center">
                  <p className="mb-1 text-[10px] font-semibold uppercase tracking-[0.25em] text-slate-400">
                    Nomor Antrian
                  </p>
                  <h1 className={`text-8xl sm:text-9xl font-black tracking-tight leading-none bg-gradient-to-br ${statusConfig.numberColor} bg-clip-text text-transparent`}>
                    {queue.queue_code}
                  </h1>

                  {/* Status badge */}
                  <div className="mt-4 inline-flex items-center gap-2">
                    <span className={`inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-xs font-semibold ${statusConfig.bg} ${statusConfig.text} ${statusConfig.border}`}>
                      {statusConfig.pulse && (
                        <span className="relative flex h-1.5 w-1.5">
                          <span className={`absolute inline-flex h-full w-full animate-ping rounded-full opacity-70 ${statusConfig.dot}`} />
                          <span className={`relative inline-flex h-1.5 w-1.5 rounded-full ${statusConfig.dot}`} />
                        </span>
                      )}
                      <StatusIcon className="h-3.5 w-3.5" />
                      {statusConfig.label}
                    </span>
                  </div>

                  {lastUpdated && (
                    <p className="mt-2 text-[10px] text-slate-400">
                      Update pukul {lastUpdated.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                    </p>
                  )}
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Stats + Info row */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">

              {/* Patient name */}
              <div className="rounded-xl bg-white border border-slate-100 shadow-sm px-4 py-3 flex items-center gap-3">
                <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-blue-50">
                  <User className="h-4 w-4 text-blue-500" />
                </div>
                <div className="min-w-0">
                  <p className="text-[10px] text-slate-400 uppercase tracking-wider">Pasien</p>
                  <p className="text-sm font-semibold text-slate-800 truncate">{queue.name}</p>
                </div>
              </div>

              {/* Visit date */}
              <div className="rounded-xl bg-white border border-slate-100 shadow-sm px-4 py-3 flex items-center gap-3">
                <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-violet-50">
                  <Calendar className="h-4 w-4 text-violet-500" />
                </div>
                <div className="min-w-0">
                  <p className="text-[10px] text-slate-400 uppercase tracking-wider">Tanggal</p>
                  <p className="text-sm font-semibold text-slate-800 truncate">
                    {new Date(queue.visit_date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </p>
                </div>
              </div>

              {/* Service */}
              <div className="rounded-xl bg-white border border-slate-100 shadow-sm px-4 py-3 flex items-center gap-3">
                <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-cyan-50">
                  <Building2 className="h-4 w-4 text-cyan-500" />
                </div>
                <div className="min-w-0">
                  <p className="text-[10px] text-slate-400 uppercase tracking-wider">Layanan</p>
                  <p className="text-sm font-semibold text-slate-800 truncate">{queue.service_name}</p>
                </div>
              </div>

              {/* Wait / Position */}
              {queue.status === 'Menunggu' && (
                <div className="rounded-xl bg-white border border-slate-100 shadow-sm px-4 py-3 flex items-center gap-3">
                  {position > 0 ? (
                    <>
                      <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-amber-50">
                        <Users className="h-4 w-4 text-amber-500" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-[10px] text-slate-400 uppercase tracking-wider">Di Depan</p>
                        <p className="text-sm font-semibold text-slate-800">{position} orang</p>
                      </div>
                    </>
                  ) : estimatedWait > 0 ? (
                    <>
                      <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-amber-50">
                        <Clock className="h-4 w-4 text-amber-500" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-[10px] text-slate-400 uppercase tracking-wider">Estimasi</p>
                        <p className="text-sm font-semibold text-slate-800">{estimatedWait} menit</p>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-amber-50">
                        <Clock className="h-4 w-4 text-amber-500" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-[10px] text-slate-400 uppercase tracking-wider">Giliran</p>
                        <p className="text-sm font-semibold text-slate-800">Menunggu</p>
                      </div>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* ── Right panel: QR Code ── */}
          {qrImageUrl && (
            <motion.div
              initial={{ opacity: 0, x: 16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2, duration: 0.4 }}
              className="flex flex-col items-center justify-between gap-4 rounded-2xl bg-white border border-slate-100 shadow-sm p-5 w-full lg:w-64"
            >
              {/* Header */}
              <div className="text-center">
                <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-400">QR Code Tiket</p>
                <p className="text-[10px] text-slate-400 mt-0.5">Tunjukkan ke petugas</p>
              </div>

              {/* QR with corner brackets */}
              <div className="relative">
                <span className="absolute -top-1.5 -left-1.5 h-5 w-5 rounded-tl-md border-t-2 border-l-2 border-blue-400" />
                <span className="absolute -top-1.5 -right-1.5 h-5 w-5 rounded-tr-md border-t-2 border-r-2 border-blue-400" />
                <span className="absolute -bottom-1.5 -left-1.5 h-5 w-5 rounded-bl-md border-b-2 border-l-2 border-blue-400" />
                <span className="absolute -bottom-1.5 -right-1.5 h-5 w-5 rounded-br-md border-b-2 border-r-2 border-blue-400" />
                <div className="rounded-xl bg-slate-50 border border-slate-100 p-2">
                  <img src={qrImageUrl} alt="QR Code" className="h-44 w-44 block" />
                </div>
              </div>

              <p className="text-[10px] text-slate-400 text-center">
                Scan untuk cek status antrian
              </p>

              {/* Print button */}
              <button
                onClick={handlePrint}
                disabled={isPrinting}
                className={`group relative w-full overflow-hidden rounded-xl bg-gradient-to-r ${statusConfig.gradient} px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:shadow-md hover:-translate-y-0.5 disabled:opacity-60 disabled:pointer-events-none`}
              >
                <span className="relative z-10 flex items-center justify-center gap-2">
                  {isPrinting
                    ? <><Loader2 className="h-4 w-4 animate-spin" /> Mencetak…</>
                    : <><Printer className="h-4 w-4" /> Cetak Tiket</>}
                </span>
                <span className="absolute inset-0 -translate-x-full bg-white/10 group-hover:translate-x-full transition-transform duration-700" />
              </button>

              {/* auto-refresh note */}
              <p className="text-[10px] text-slate-400 text-center leading-relaxed">
                ⚡ Auto-refresh setiap 10 detik
              </p>
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  );
}

// ─── Page Export ───────────────────────────────────────────────────────────────
export default function MyQueuePage() {
  return (
    <Suspense fallback={<LoadingSkeleton />}>
      <MyQueueContent />
    </Suspense>
  );
}
