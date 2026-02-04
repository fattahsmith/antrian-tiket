'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useStaffAuth } from '@/contexts/StaffAuthContext';
import { supabase } from '@/lib/supabase';
import { Queue } from '@/types/queue';
import {
  getTodayQueues,
  getCurrentQueue,
  getQueueStats,
  callQueue,
  completeQueue,
  skipQueue,
} from '@/lib/queueUtils';
import {
  fetchServices,
  createService,
  updateService,
  setServiceActive,
  deleteService,
} from '@/lib/serviceUtils';
import { Service } from '@/types/service';
import DashboardSidebar from '@/components/dashboard/DashboardSidebar';
import DashboardView from '@/components/dashboard/DashboardView';
import DoctorsView from '@/components/dashboard/DoctorsView';
import PatientsView from '@/components/dashboard/PatientsView';
import ExportButtons from '@/components/dashboard/ExportButtons';
import SettingsView from '@/components/dashboard/SettingsView';

type StaffView = 'dashboard' | 'queues' | 'services' | 'doctors' | 'patients' | 'reports' | 'settings';

const glassCard =
  'bg-white/10 border border-white/10 backdrop-blur-2xl rounded-3xl shadow-[0_25px_100px_rgba(15,23,42,0.35)]';
const glassInput =
  'w-full rounded-2xl border border-white/15 bg-white/5 px-4 py-3 text-white placeholder-white/60 outline-none transition focus:border-cyan-200 focus:ring-2 focus:ring-cyan-300';

export default function PetugasPage() {
  const router = useRouter();
  const { isStaffLoggedIn, logout, isLoading: authLoading } = useStaffAuth();
  const [queues, setQueues] = useState<Queue[]>([]);
  const [currentQueue, setCurrentQueue] = useState<Queue | null>(null);
  const [stats, setStats] = useState({
    totalToday: 0,
    totalWaiting: 0,
  });
  const [actionLoading, setActionLoading] = useState<number | null>(null);
  const [services, setServices] = useState<Service[]>([]);
  const [serviceForm, setServiceForm] = useState({ name: '', prefix: '' });
  const [serviceError, setServiceError] = useState('');
  const [serviceLoading, setServiceLoading] = useState(false);
  const [serviceActionLoading, setServiceActionLoading] = useState<number | null>(null);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [activeView, setActiveView] = useState<StaffView>('dashboard');

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

  const formatQueueCodeForSpeech = (code: string) =>
    code
      .split('')
      .map((char) => digitWords[char] ?? char)
      .join(' ');

  const announceQueueCall = (queue: Queue) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      return;
    }

    const message = `Nomor antrian ${formatQueueCodeForSpeech(queue.queue_code)}, layanan ${queue.service_name}. Silakan menuju loket pemeriksaan.`;
    const utterance = new SpeechSynthesisUtterance(message);
    utterance.lang = 'id-ID';
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
  };

  useEffect(() => {
    if (!authLoading && !isStaffLoggedIn) {
      router.push('/login');
      return;
    }

    if (isStaffLoggedIn) {
      loadQueueData();
      loadServicesData();

      const queueChannel = supabase
        .channel('queues-staff')
        .on(
          'postgres_changes',
          { event: '*', schema: 'public', table: 'queues' },
          loadQueueData
        )
        .subscribe();

      const serviceChannel = supabase
        .channel('services-staff')
        .on(
          'postgres_changes',
          { event: '*', schema: 'public', table: 'services' },
          loadServicesData
        )
        .subscribe();

      return () => {
        supabase.removeChannel(queueChannel);
        supabase.removeChannel(serviceChannel);
      };
    }
  }, [isStaffLoggedIn, authLoading, router]);

  const loadQueueData = async () => {
    const [queuesData, currentQueueData, statsData] = await Promise.all([
      getTodayQueues(),
      getCurrentQueue(),
      getQueueStats(),
    ]);

    setQueues(queuesData);
    setCurrentQueue(currentQueueData);
    setStats({
      totalToday: statsData.totalToday,
      totalWaiting: statsData.totalWaiting,
    });
  };

  const loadServicesData = async () => {
    const servicesData = await fetchServices();
    setServices(servicesData);
  };

  const handleCall = async (queue: Queue) => {
    setActionLoading(queue.id);
    try {
      const { error } = await callQueue(queue.id);
      if (error) {
        alert('Gagal memanggil antrian. Silakan coba lagi.');
        console.error('Error calling queue:', error);
      } else {
        announceQueueCall(queue);
        await loadQueueData();
      }
    } catch (err) {
      alert('Terjadi kesalahan. Silakan coba lagi.');
      console.error('Error:', err);
    } finally {
      setActionLoading(null);
    }
  };

  const handleComplete = async (queueId: number) => {
    setActionLoading(queueId);
    try {
      const { error } = await completeQueue(queueId);
      if (error) {
        alert('Gagal menyelesaikan antrian. Silakan coba lagi.');
        console.error('Error completing queue:', error);
      } else {
        await loadQueueData();
      }
    } catch (err) {
      alert('Terjadi kesalahan. Silakan coba lagi.');
      console.error('Error:', err);
    } finally {
      setActionLoading(null);
    }
  };

  const handleSkip = async (queueId: number) => {
    setActionLoading(queueId);
    try {
      const { error } = await skipQueue(queueId);
      if (error) {
        alert('Gagal melewati antrian. Silakan coba lagi.');
        console.error('Error skipping queue:', error);
      } else {
        await loadQueueData();
      }
    } catch (err) {
      alert('Terjadi kesalahan. Silakan coba lagi.');
      console.error('Error:', err);
    } finally {
      setActionLoading(null);
    }
  };

  const handleCreateService = async (e: React.FormEvent) => {
    e.preventDefault();
    setServiceError('');

    if (!serviceForm.name || !serviceForm.prefix) {
      setServiceError('Nama dan prefix layanan wajib diisi');
      return;
    }

    const normalizedPrefix = serviceForm.prefix.trim().toUpperCase();

    if (services.some((service) => service.prefix === normalizedPrefix)) {
      setServiceError('Prefix sudah digunakan oleh layanan lain');
      return;
    }

    setServiceLoading(true);
    try {
      const { error } = await createService(serviceForm.name, normalizedPrefix);
      if (error) {
        throw error;
      }
      setServiceForm({ name: '', prefix: '' });
      setServiceError('');
    } catch (err) {
      console.error('Error creating service:', err);
      setServiceError('Gagal menambah layanan. Coba lagi.');
    } finally {
      setServiceLoading(false);
    }
  };

  const startEditService = (service: Service) => {
    setEditingService(service);
    setServiceError('');
  };

  const handleUpdateService = async () => {
    if (!editingService) return;
    if (!editingService.name || !editingService.prefix) {
      setServiceError('Nama dan prefix wajib diisi');
      return;
    }

    const normalizedPrefix = editingService.prefix.trim().toUpperCase();

    if (
      services.some(
        (service) => service.prefix === normalizedPrefix && service.id !== editingService.id
      )
    ) {
      setServiceError('Prefix sudah digunakan oleh layanan lain');
      return;
    }

    setServiceActionLoading(editingService.id);
    try {
      const { error } = await updateService(editingService.id, {
        name: editingService.name,
        prefix: normalizedPrefix,
      });
      if (error) {
        throw error;
      }
      setEditingService(null);
      setServiceError('');
    } catch (err) {
      console.error('Error updating service:', err);
      setServiceError('Gagal mengubah layanan. Coba lagi.');
    } finally {
      setServiceActionLoading(null);
    }
  };

  const handleToggleService = async (service: Service) => {
    setServiceActionLoading(service.id);
    try {
      const { error } = await setServiceActive(service.id, !service.is_active);
      if (error) {
        throw error;
      }
      setServiceError('');
    } catch (err) {
      console.error('Error toggling service:', err);
      setServiceError('Gagal memperbarui status layanan.');
    } finally {
      setServiceActionLoading(null);
    }
  };

  const handleDeleteService = async (service: Service) => {
    if (!confirm(`Apakah Anda yakin ingin menghapus layanan "${service.name}"?`)) {
      return;
    }

    setServiceActionLoading(service.id);
    try {
      const { error } = await deleteService(service.id);
      if (error) {
        // Check if error is due to foreign key constraint
        if (error.code === '23503' || error.message?.includes('foreign key')) {
          setServiceError(
            'Layanan tidak dapat dihapus karena masih digunakan oleh antrian yang ada.'
          );
        } else {
          throw error;
        }
      } else {
        setServiceError('');
        // If editing this service, cancel edit
        if (editingService?.id === service.id) {
          setEditingService(null);
        }
      }
    } catch (err) {
      console.error('Error deleting service:', err);
      setServiceError('Gagal menghapus layanan. Coba lagi.');
    } finally {
      setServiceActionLoading(null);
    }
  };

  const cancelEdit = () => {
    setEditingService(null);
    setServiceError('');
  };

  const handleLogout = () => {
    logout();
    router.push('/');
  };


  if (authLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#030917] via-[#0a1f3d] to-[#0f73a8] text-white flex items-center justify-center">
        <div className="text-white/70">Memuat dashboard...</div>
      </div>
    );
  }

  if (!isStaffLoggedIn) {
    return null;
  }

  const renderQueueView = () => (
    <div className="space-y-6">
      <div className="rounded-xl bg-white p-6 shadow-sm">
        <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-2xl font-semibold text-gray-900">Antrian Hari Ini</h2>
            <p className="text-sm text-gray-500">
              Total {stats.totalToday} pasien • {new Date().toLocaleDateString('id-ID')}
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs uppercase tracking-wider text-gray-500">
                <th className="py-3 px-4">Kode</th>
                <th className="py-3 px-4">Layanan</th>
                <th className="py-3 px-4">Nama</th>
                <th className="py-3 px-4">Keluhan</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {queues.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-gray-500">
                    Belum ada antrian hari ini
                  </td>
                </tr>
              ) : (
                queues.map((queue) => (
                  <tr
                    key={queue.id}
                    className={`border-t border-gray-200 ${queue.is_current ? 'bg-emerald-50' : 'hover:bg-gray-50'
                      }`}
                  >
                    <td className="py-3 px-4 font-semibold text-gray-900">{queue.queue_code}</td>
                    <td className="py-3 px-4">
                      <span className="inline-flex items-center gap-2">
                        <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700">
                          {queue.service_prefix}
                        </span>
                        <span className="text-gray-900">{queue.service_name}</span>
                      </span>
                    </td>
                    <td className="py-3 px-4 text-gray-900">{queue.name}</td>
                    <td className="py-3 px-4 text-gray-600">
                      {queue.complaint.length > 60
                        ? `${queue.complaint.substring(0, 60)}...`
                        : queue.complaint}
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${queue.status === 'Dipanggil'
                          ? 'bg-emerald-100 text-emerald-700'
                          : queue.status === 'Selesai'
                            ? 'bg-indigo-100 text-indigo-700'
                            : queue.status === 'Dilewati'
                              ? 'bg-amber-100 text-amber-700'
                              : 'bg-blue-100 text-blue-700'
                          }`}
                      >
                        {queue.status}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => router.push(`/print-ticket/${queue.id}`)}
                          className="rounded-lg bg-purple-600 px-4 py-1.5 text-xs font-semibold text-white transition hover:bg-purple-700"
                          title="Cetak Antrian"
                        >
                          🖨️ Cetak
                        </button>
                        {queue.status !== 'Dipanggil' && queue.status !== 'Selesai' && (
                          <button
                            onClick={() => handleCall(queue)}
                            disabled={actionLoading === queue.id}
                            className="rounded-lg bg-blue-600 px-4 py-1.5 text-xs font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                          >
                            {actionLoading === queue.id ? '...' : 'Call'}
                          </button>
                        )}
                        {queue.status === 'Dipanggil' && (
                          <button
                            onClick={() => handleComplete(queue.id)}
                            disabled={actionLoading === queue.id}
                            className="rounded-lg bg-emerald-600 px-4 py-1.5 text-xs font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
                          >
                            {actionLoading === queue.id ? '...' : 'Complete'}
                          </button>
                        )}
                        {queue.status !== 'Selesai' && queue.status !== 'Dilewati' && (
                          <button
                            onClick={() => handleSkip(queue.id)}
                            disabled={actionLoading === queue.id}
                            className="rounded-lg bg-amber-600 px-4 py-1.5 text-xs font-semibold text-white transition hover:bg-amber-700 disabled:cursor-not-allowed disabled:opacity-60"
                          >
                            {actionLoading === queue.id ? '...' : 'Skip'}
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderServicesView = () => (
    <div className="space-y-6">
      <div className="rounded-xl bg-white p-6 shadow-sm">
        <h2 className="mb-6 text-2xl font-semibold text-gray-900">Kelola Layanan</h2>
        <form onSubmit={handleCreateService} className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <label className="mb-2 block text-sm font-medium text-gray-700">Nama Layanan</label>
            <input
              type="text"
              value={serviceForm.name}
              onChange={(e) => setServiceForm({ ...serviceForm, name: e.target.value })}
              className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 placeholder-gray-400 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
              placeholder="Contoh: Pemeriksaan Umum"
              required
            />
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">Prefix</label>
            <input
              type="text"
              value={serviceForm.prefix}
              maxLength={3}
              onChange={(e) =>
                setServiceForm({ ...serviceForm, prefix: e.target.value.toUpperCase() })
              }
              className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 placeholder-gray-400 uppercase outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
              placeholder="A"
              required
            />
          </div>
          <div className="lg:col-span-3 flex flex-col gap-3">
            {serviceError && (
              <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {serviceError}
              </div>
            )}
            <button
              type="submit"
              disabled={serviceLoading}
              className="self-start rounded-lg bg-blue-600 px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {serviceLoading ? 'Menyimpan...' : 'Tambah Layanan'}
            </button>
          </div>
        </form>
      </div>

      <div className="rounded-xl bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-2xl font-semibold text-gray-900">Daftar Layanan</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs uppercase tracking-wider text-gray-500">
                <th className="py-3 px-4">Nama</th>
                <th className="py-3 px-4">Prefix</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {services.length === 0 ? (
                <tr>
                  <td colSpan={4} className="py-8 text-center text-gray-500">
                    Belum ada layanan
                  </td>
                </tr>
              ) : (
                services.map((service) => {
                  const isEditing = editingService?.id === service.id;
                  return (
                    <tr key={service.id} className="border-t border-gray-200 hover:bg-gray-50">
                      <td className="py-3 px-4">
                        {isEditing ? (
                          <input
                            type="text"
                            value={editingService?.name ?? ''}
                            onChange={(e) =>
                              setEditingService((prev) =>
                                prev ? { ...prev, name: e.target.value } : prev
                              )
                            }
                            className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                          />
                        ) : (
                          <span className="text-gray-900">{service.name}</span>
                        )}
                      </td>
                      <td className="py-3 px-4">
                        {isEditing ? (
                          <input
                            type="text"
                            value={editingService?.prefix ?? ''}
                            maxLength={3}
                            onChange={(e) =>
                              setEditingService((prev) =>
                                prev
                                  ? { ...prev, prefix: e.target.value.toUpperCase() }
                                  : prev
                              )
                            }
                            className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 uppercase outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                          />
                        ) : (
                          <span className="inline-flex rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700">
                            {service.prefix}
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-semibold ${service.is_active
                            ? 'bg-emerald-100 text-emerald-700'
                            : 'bg-gray-100 text-gray-600'
                            }`}
                        >
                          {service.is_active ? 'Aktif' : 'Nonaktif'}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex justify-end gap-2">
                          {isEditing ? (
                            <>
                              <button
                                onClick={handleUpdateService}
                                disabled={serviceActionLoading === service.id}
                                className="rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
                              >
                                Simpan
                              </button>
                              <button
                                onClick={cancelEdit}
                                className="rounded-lg bg-gray-100 px-3 py-1.5 text-xs font-semibold text-gray-700 transition hover:bg-gray-200"
                              >
                                Batal
                              </button>
                            </>
                          ) : (
                            <>
                              <button
                                onClick={() => startEditService(service)}
                                className="rounded-lg bg-gray-100 px-3 py-1.5 text-xs font-semibold text-gray-700 transition hover:bg-gray-200"
                              >
                                Edit
                              </button>
                              <button
                                onClick={() => handleToggleService(service)}
                                disabled={serviceActionLoading === service.id}
                                className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition disabled:cursor-not-allowed disabled:opacity-60 ${service.is_active
                                  ? 'bg-red-100 text-red-700 hover:bg-red-200'
                                  : 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200'
                                  }`}
                              >
                                {service.is_active ? 'Nonaktifkan' : 'Aktifkan'}
                              </button>
                              <button
                                onClick={() => handleDeleteService(service)}
                                disabled={serviceActionLoading === service.id}
                                className="rounded-lg bg-red-600 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
                              >
                                {serviceActionLoading === service.id ? '...' : 'Hapus'}
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderDashboardView = () => (
    <div className="space-y-6">
      <DashboardView queues={queues} currentQueue={currentQueue} />
    </div>
  );


  const handleViewChange = (view: string) => {
    setActiveView(view as StaffView);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex min-h-screen">
        <DashboardSidebar
          activeView={activeView}
          onViewChange={handleViewChange}
          onLogout={handleLogout}
        />

        <div className="flex-1 lg:ml-0">
          <main className="p-4 md:p-6 lg:p-8">
            {activeView === 'dashboard' && renderDashboardView()}
            {activeView === 'queues' && renderQueueView()}
            {activeView === 'services' && renderServicesView()}
            {activeView === 'doctors' && <DoctorsView />}
            {activeView === 'patients' && <PatientsView />}
            {activeView === 'reports' && (
              <ExportButtons
                queues={queues}
                filters={{
                  from: new Date().toLocaleDateString('id-ID'),
                  to: new Date().toLocaleDateString('id-ID'),
                }}
              />
            )}



            {activeView === 'settings' && <SettingsView />}
          </main>
        </div>
      </div>
    </div>
  );
}


