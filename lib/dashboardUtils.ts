import { Queue } from '@/types/queue';

/**
 * Calculate statistics from queue data
 */
export function calculateQueueStats(queues: Queue[]) {
  const totalToday = queues.length;
  const waiting = queues.filter((q) => q.status === 'Menunggu').length;
  const inService = queues.filter((q) => q.status === 'Dipanggil').length;
  const completed = queues.filter((q) => q.status === 'Selesai').length;
  const skipped = queues.filter((q) => q.status === 'Dilewati').length;

  return {
    totalToday,
    waiting,
    inService,
    completed,
    skipped,
  };
}

/**
 * Get hourly queue distribution for today
 */
export function getHourlyQueueData(queues: Queue[]) {
  const hours = Array.from({ length: 24 }, (_, i) => i);
  const hourlyCount: Record<number, number> = {};

  hours.forEach((hour) => {
    hourlyCount[hour] = 0;
  });

  queues.forEach((queue) => {
    const createdAt = new Date(queue.created_at);
    const hour = createdAt.getHours();
    hourlyCount[hour] = (hourlyCount[hour] || 0) + 1;
  });

  return hours.map((hour) => ({
    hour: `${hour.toString().padStart(2, '0')}:00`,
    count: hourlyCount[hour] || 0,
  }));
}

/**
 * Get status distribution for pie chart
 */
export function getStatusDistribution(queues: Queue[]) {
  const statusCount: Record<string, number> = {
    Menunggu: 0,
    Dipanggil: 0,
    Selesai: 0,
    Dilewati: 0,
  };

  queues.forEach((queue) => {
    statusCount[queue.status] = (statusCount[queue.status] || 0) + 1;
  });

  return Object.entries(statusCount)
    .filter(([_, count]) => count > 0)
    .map(([status, count]) => ({
      name: status,
      value: count,
    }));
}

/**
 * Calculate average wait time (dummy calculation)
 */
export function calculateAverageWaitTime(queues: Queue[]): number {
  const completedQueues = queues.filter((q) => q.status === 'Selesai');
  if (completedQueues.length === 0) return 0;

  // Simplified: assume 5 minutes per queue
  return Math.round((completedQueues.length * 5) / completedQueues.length);
}

/**
 * Get busiest service today
 */
export function getBusiestService(queues: Queue[]): string {
  const serviceCount: Record<string, number> = {};

  queues.forEach((queue) => {
    serviceCount[queue.service_name] = (serviceCount[queue.service_name] || 0) + 1;
  });

  const entries = Object.entries(serviceCount);
  if (entries.length === 0) return 'Tidak ada data';

  const [busiest] = entries.sort((a, b) => b[1] - a[1]);
  return busiest[0];
}

/**
 * Get peak hour
 */
export function getPeakHour(queues: Queue[]): string {
  const hourlyCount: Record<number, number> = {};

  queues.forEach((queue) => {
    const createdAt = new Date(queue.created_at);
    const hour = createdAt.getHours();
    hourlyCount[hour] = (hourlyCount[hour] || 0) + 1;
  });

  const entries = Object.entries(hourlyCount);
  if (entries.length === 0) return 'Tidak ada data';

  const [peakHour] = entries.sort((a, b) => Number(b[1]) - Number(a[1]));
  return `${peakHour[0].toString().padStart(2, '0')}:00`;
}

