'use client';

import { useEffect, useState, useMemo } from 'react';
import { fetchPatientRecap } from '@/lib/patientUtils';
import {
  Search,
  Filter,
  RefreshCcw,
  User,
  Calendar,
  Activity,
  ChevronRight,
  History,
  AlertCircle,
  CheckCircle2,
  Clock,
  ArrowRightLeft
} from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const glassInput =
  'rounded-xl border border-white/20 bg-white/5 px-4 py-2.5 text-sm text-gray-800 placeholder-gray-400 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20';

interface QueueRecord {
  id: number;
  service_name: string;
  name: string;
  queue_code: string;
  complaint: string;
  status: string;
  created_at: string;
}

export default function PatientsView() {
  const [queues, setQueues] = useState<QueueRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [isRefreshing, setIsRefreshing] = useState(false);

  const loadData = async () => {
    setIsRefreshing(true);
    try {
      const data = await fetchPatientRecap();
      setQueues(data);
    } catch (error) {
      console.error('Failed to load patient data:', error);
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const filteredQueues = useMemo(() => {
    return queues.filter((q) => {
      const matchesSearch =
        q.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        q.queue_code.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === 'All' || q.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [queues, searchTerm, statusFilter]);

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'Dipanggil':
        return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      case 'Selesai':
        return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'Dilewati':
        return 'bg-amber-100 text-amber-700 border-amber-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Dipanggil':
        return <Activity size={14} />;
      case 'Selesai':
        return <CheckCircle2 size={14} />;
      case 'Dilewati':
        return <ArrowRightLeft size={14} />;
      default:
        return <Clock size={14} />;
    }
  };

  if (loading && !isRefreshing) {
    return (
      <div className="flex h-64 flex-col items-center justify-center space-y-4">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"></div>
        <p className="text-gray-500 font-medium">Memuat data pasien...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-700">
      {/* Header Section */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <History className="text-blue-600" />
            Rekap Antrian Pasien
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Kelola dan tinjau riwayat kunjungan pasien hari ini
          </p>
        </div>
        <button
          onClick={loadData}
          disabled={isRefreshing}
          className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-all shadow-sm active:scale-95 disabled:opacity-50"
        >
          <RefreshCcw size={16} className={cn(isRefreshing && "animate-spin")} />
          Refresh
        </button>
      </div>

      {/* Controls Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="relative md:col-span-2">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Cari nama pasien atau kode antrian..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={cn(glassInput, "w-full pl-10 bg-white border-gray-200")}
          />
        </div>
        <div className="relative">
          <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className={cn(glassInput, "w-full pl-10 bg-white border-gray-200 appearance-none")}
          >
            <option value="All">Semua Status</option>
            <option value="Menunggu">Menunggu</option>
            <option value="Dipanggil">Dipanggil</option>
            <option value="Selesai">Selesai</option>
            <option value="Dilewati">Dilewati</option>
          </select>
        </div>
      </div>

      {/* Table Section */}
      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm ring-1 ring-black/5">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50 border-b border-gray-200">
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-gray-500">
                  <div className="flex items-center gap-2">
                    <Activity size={14} />
                    Kode
                  </div>
                </th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-gray-500">
                  <div className="flex items-center gap-2">
                    <User size={14} />
                    Pasien
                  </div>
                </th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-gray-500">
                  Layanan
                </th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-gray-500">
                  Keluhan
                </th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-gray-500">
                  Status
                </th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-gray-500">
                  <div className="flex items-center gap-2">
                    <Calendar size={14} />
                    Waktu
                  </div>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredQueues.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center justify-center text-gray-400">
                      <AlertCircle size={48} className="mb-4 opacity-20" />
                      <p className="text-lg font-medium">Tidak ada data ditemukan</p>
                      <p className="text-sm">Coba sesuaikan pencarian atau filter Anda</p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredQueues.map((q) => (
                  <tr key={q.id} className="group hover:bg-blue-50/30 transition-colors">
                    <td className="px-6 py-4">
                      <span className="font-bold text-gray-900 bg-gray-100 px-2.5 py-1 rounded-lg text-sm">
                        {q.queue_code}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-semibold text-gray-900">{q.name}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10">
                        {q.service_name}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-gray-600 line-clamp-1 max-w-[200px]" title={q.complaint}>
                        {q.complaint}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <span className={cn(
                        "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold border",
                        getStatusStyle(q.status)
                      )}>
                        {getStatusIcon(q.status)}
                        {q.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">
                      {new Date(q.created_at).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
                      <span className="block text-[10px] text-gray-400">
                        {new Date(q.created_at).toLocaleDateString('id-ID')}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Footer Stats */}
      <div className="flex items-center justify-between text-sm text-gray-500 px-2">
        <p>Menampilkan {filteredQueues.length} dari {queues.length} pasien</p>
        <div className="flex items-center gap-1 text-blue-600 font-medium cursor-pointer hover:underline">
          Lihat laporan lengkap <ChevronRight size={14} />
        </div>
      </div>
    </div>
  );
}
