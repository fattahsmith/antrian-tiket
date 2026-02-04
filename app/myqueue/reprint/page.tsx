'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Printer, ArrowLeft, AlertCircle, CheckCircle2, Loader2 } from 'lucide-react';
import { getQueueByQrToken } from '@/lib/queueUtils';
import { generateQrDataUrl } from '@/lib/qrUtils';

const glassCard = 'bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border border-white/20 dark:border-gray-700/30 rounded-2xl shadow-xl';
const glassInput = 'w-full rounded-xl border border-gray-200 bg-white/50 px-4 py-3 text-gray-900 placeholder-gray-400 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-gray-700 dark:bg-gray-800/50 dark:text-white dark:placeholder-gray-500';

export default function ReprintPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [foundQueue, setFoundQueue] = useState<any>(null);
  const [qrImageUrl, setQrImageUrl] = useState<string | null>(null);
  const [isPrinting, setIsPrinting] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setFoundQueue(null);
    setQrImageUrl(null);

    if (!searchQuery.trim()) {
      setError('Masukkan nomor antrian, nomor telepon, atau booking ID');
      return;
    }

    setIsSearching(true);

    try {
      // Try to find queue by token (if it's a token)
      // In a real app, you'd have a search endpoint that searches by queue code, phone, etc.
      // For now, we'll assume the search query could be a token
      const { data, error: fetchError } = await getQueueByQrToken(searchQuery.trim());

      if (fetchError || !data) {
        // Try searching by queue code (if you have that endpoint)
        // For now, we'll show an error
        setError('Tiket tidak ditemukan. Pastikan nomor antrian, nomor telepon, atau booking ID yang Anda masukkan benar.');
        setIsSearching(false);
        return;
      }

      setFoundQueue(data);

      // Generate QR code
      const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';
      const qrUrl = `${baseUrl}/myqueue?token=${searchQuery.trim()}`;
      const qrDataUrl = await generateQrDataUrl(qrUrl, 300);
      setQrImageUrl(qrDataUrl);
    } catch (err) {
      console.error('Error searching queue:', err);
      setError('Terjadi kesalahan saat mencari tiket. Silakan coba lagi.');
    } finally {
      setIsSearching(false);
    }
  };

  const handlePrint = () => {
    if (!qrImageUrl || !foundQueue) return;

    setIsPrinting(true);
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>Tiket Antrian ${foundQueue.queue_code}</title>
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
              
              <div class="queue-code">${foundQueue.queue_code}</div>
              
              <div class="info-section">
                <div class="info-row">
                  <span class="info-label">Layanan:</span>
                  <span class="info-value">${foundQueue.service_name}</span>
                </div>
                <div class="info-row">
                  <span class="info-label">Nama:</span>
                  <span class="info-value">${foundQueue.name}</span>
                </div>
                <div class="info-row">
                  <span class="info-label">Tanggal:</span>
                  <span class="info-value">${new Date(foundQueue.visit_date).toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
                </div>
                <div class="info-row">
                  <span class="info-label">Status:</span>
                  <span class="info-value">${foundQueue.status}</span>
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

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'Dipanggil':
        return 'bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-300 dark:border-emerald-800';
      case 'Selesai':
        return 'bg-gray-100 text-gray-700 border-gray-200 dark:bg-gray-900/20 dark:text-gray-300 dark:border-gray-800';
      case 'Dilewati':
        return 'bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-900/20 dark:text-amber-300 dark:border-amber-800';
      default:
        return 'bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-300 dark:border-blue-800';
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-blue-50 via-white to-emerald-50">
      {/* Background gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-transparent to-emerald-500/5" />
      
      {/* Animated background circles */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-blue-400/10 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-emerald-400/10 blur-3xl" />
      </div>

      <div className="relative z-10 mx-auto max-w-2xl px-4 py-8 sm:px-6 lg:px-8">
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
        </motion.header>

        {/* Main Content */}
        <div className="space-y-8">
          {/* Title Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <h1 className="mb-3 text-3xl font-bold text-gray-900 dark:text-white sm:text-4xl">
              Cetak Ulang Tiket Antrian
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Masukkan nomor antrian, nomor telepon, atau booking ID untuk mencari tiket Anda
            </p>
          </motion.div>

          {/* Search Form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className={`${glassCard} p-6 sm:p-8`}
          >
            <form onSubmit={handleSearch} className="space-y-4">
              <div>
                <label htmlFor="search" className="mb-2 block text-sm font-semibold text-gray-700 dark:text-gray-300">
                  Nomor Antrian / Telepon / Booking ID
                </label>
                <div className="relative">
                  <input
                    type="text"
                    id="search"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Contoh: A001, 081234567890, atau token booking"
                    className={glassInput}
                    disabled={isSearching}
                  />
                  <div className="absolute right-3 top-1/2 -translate-y-1/2">
                    <Search className="h-5 w-5 text-gray-400" />
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={isSearching}
                className="w-full rounded-xl bg-gradient-to-r from-blue-600 to-emerald-600 px-6 py-3 text-base font-semibold text-white shadow-lg transition hover:shadow-xl disabled:opacity-50"
              >
                {isSearching ? (
                  <span className="flex items-center justify-center gap-2">
                    <Loader2 className="h-5 w-5 animate-spin" />
                    Mencari...
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    <Search className="h-5 w-5" />
                    Cari Tiket
                  </span>
                )}
              </button>
            </form>
          </motion.div>

          {/* Error State */}
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className={`${glassCard} border-red-200 bg-red-50 p-6 dark:border-red-800 dark:bg-red-900/20`}
              >
                <div className="flex items-start gap-3">
                  <AlertCircle className="h-5 w-5 flex-shrink-0 text-red-600 dark:text-red-400" />
                  <div>
                    <h3 className="mb-1 font-semibold text-red-900 dark:text-red-300">
                      Tiket tidak ditemukan
                    </h3>
                    <p className="text-sm text-red-700 dark:text-red-400">{error}</p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Success State - Found Queue */}
          <AnimatePresence>
            {foundQueue && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className={`${glassCard} p-6 sm:p-8`}
              >
                <div className="mb-6 flex items-center gap-3">
                  <div className="rounded-full bg-emerald-100 p-2 dark:bg-emerald-900/30">
                    <CheckCircle2 className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                      Tiket Ditemukan
                    </h2>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Berikut detail tiket antrian Anda
                    </p>
                  </div>
                </div>

                {/* Queue Details */}
                <div className="mb-6 space-y-4">
                  <div className="rounded-xl bg-gradient-to-br from-blue-500 to-emerald-600 p-6 text-center">
                    <p className="mb-2 text-sm font-semibold uppercase tracking-wider text-white/90">
                      Nomor Antrian
                    </p>
                    <p className="text-5xl font-black text-white sm:text-6xl">
                      {foundQueue.queue_code}
                    </p>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="rounded-xl bg-gray-50 p-4 dark:bg-gray-800/50">
                      <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                        Layanan
                      </p>
                      <p className="text-base font-semibold text-gray-900 dark:text-white">
                        {foundQueue.service_name}
                      </p>
                    </div>
                    <div className="rounded-xl bg-gray-50 p-4 dark:bg-gray-800/50">
                      <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                        Status
                      </p>
                      <span
                        className={`inline-flex items-center rounded-full border px-3 py-1 text-sm font-semibold ${getStatusBadgeClass(
                          foundQueue.status
                        )}`}
                      >
                        {foundQueue.status}
                      </span>
                    </div>
                    <div className="rounded-xl bg-gray-50 p-4 dark:bg-gray-800/50">
                      <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                        Nama
                      </p>
                      <p className="text-base font-semibold text-gray-900 dark:text-white">
                        {foundQueue.name}
                      </p>
                    </div>
                    <div className="rounded-xl bg-gray-50 p-4 dark:bg-gray-800/50">
                      <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                        Tanggal
                      </p>
                      <p className="text-base font-semibold text-gray-900 dark:text-white">
                        {new Date(foundQueue.visit_date).toLocaleDateString('id-ID', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                        })}
                      </p>
                    </div>
                  </div>
                </div>

                {/* QR Code */}
                {qrImageUrl && (
                  <div className="mb-6 flex flex-col items-center gap-4">
                    <div className="rounded-2xl bg-white p-4 shadow-lg">
                      <img src={qrImageUrl} alt="QR Code" className="h-48 w-48 sm:h-64 sm:w-64" />
                    </div>
                  </div>
                )}

                {/* Actions */}
                <div className="flex flex-col gap-3 sm:flex-row">
                  <button
                    onClick={handlePrint}
                    disabled={isPrinting || !qrImageUrl}
                    className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-emerald-600 px-6 py-3 text-base font-semibold text-white shadow-lg transition hover:shadow-xl disabled:opacity-50"
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
                  <Link
                    href={`/myqueue?token=${searchQuery}`}
                    className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-gray-300 bg-white px-6 py-3 text-base font-semibold text-gray-700 transition hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
                  >
                    Lihat Status
                  </Link>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Empty State Illustration */}
          {!foundQueue && !error && !isSearching && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className={`${glassCard} p-8 text-center`}
            >
              <div className="mb-4 text-6xl">🎫</div>
              <h3 className="mb-2 text-lg font-semibold text-gray-900 dark:text-white">
                Cari Tiket Antrian Anda
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Masukkan nomor antrian, nomor telepon, atau booking ID di atas untuk mencari dan
                mencetak ulang tiket antrian Anda
              </p>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}





