import { supabase } from './supabase';
import { Queue } from '@/types/queue';

const todayString = () => new Date().toISOString().split('T')[0];

export async function getNextQueueSequence(
  serviceId: number,
  visitDate: string
): Promise<number> {
  const { data, error } = await supabase
    .from('queues')
    .select('queue_number_seq')
    .eq('visit_date', visitDate)
    .eq('service_id', serviceId)
    .order('queue_number_seq', { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error || !data) {
    return 0;
  }

  return data.queue_number_seq ?? 0;
}

export async function createQueueEntry(payload: {
  service_id: number;
  service_name: string;
  service_prefix: string;
  queue_number_seq: number;
  queue_code: string;
  contact: string;
  name: string;
  complaint: string;
  visit_date: string;
  qr_token?: string;
}): Promise<{ data: Queue | null; error: any }> {
  const { data, error } = await supabase
    .from('queues')
    .insert({
      ...payload,
      status: 'Menunggu',
      is_current: false,
    })
    .select()
    .single();

  return { data, error };
}

export async function getTodayQueues(date = todayString()): Promise<Queue[]> {
  const { data, error } = await supabase
    .from('queues')
    .select('*')
    .eq('visit_date', date)
    .order('service_prefix', { ascending: true })
    .order('queue_number_seq', { ascending: true });

  if (error) {
    // ignore no row errors only if caused by .single()
    if (error.code !== 'PGRST116') {
      console.error('Error fetching today queues:', error);
    }
    return [];
  }

  return data ?? [];
}


export async function getCurrentQueue(date = todayString()): Promise<Queue | null> {
  const { data, error } = await supabase
    .from('queues')
    .select('*')
    .eq('visit_date', date)
    .eq('is_current', true)
    .maybeSingle();

  if (error) {
    if (error.code !== 'PGRST116') {
      console.error('Error fetching current queue:', error);
    }
    return null;
  }

  return data;
}

export async function getQueueStats(date = todayString()) {
  const { data, error } = await supabase
    .from('queues')
    .select('status')
    .eq('visit_date', date);

  if (error || !data) {
    if (error) {
      console.error('Error fetching queue stats:', error);
    }
    return {
      totalToday: 0,
      totalWaiting: 0,
      estimatedWaitMinutes: 0,
    };
  }

  const totalToday = data.length;
  const totalWaiting = data.filter((q) => q.status === 'Menunggu').length;

  return {
    totalToday,
    totalWaiting,
    estimatedWaitMinutes: totalWaiting * 5,
  };
}

export async function updateQueueStatus(
  queueId: number,
  updates: Partial<Pick<Queue, 'status' | 'is_current'>>
): Promise<{ error: any }> {
  const { error } = await supabase.from('queues').update(updates).eq('id', queueId);
  return { error };
}

export async function callQueue(queueId: number): Promise<{ error: any }> {
  const today = todayString();

  await supabase
    .from('queues')
    .update({ is_current: false })
    .eq('visit_date', today)
    .neq('id', queueId);

  return updateQueueStatus(queueId, { status: 'Dipanggil', is_current: true });
}

export async function completeQueue(queueId: number): Promise<{ error: any }> {
  return updateQueueStatus(queueId, { status: 'Selesai', is_current: false });
}

export async function skipQueue(queueId: number): Promise<{ error: any }> {
  return updateQueueStatus(queueId, { status: 'Dilewati', is_current: false });
}

/**
 * Find queue by QR token for today's visit date
 */
export async function getQueueByQrToken(
  token: string,
  visitDate = todayString()
): Promise<{ data: Queue | null; error: any }> {
  const { data, error } = await supabase
    .from('queues')
    .select('*')
    .eq('qr_token', token)
    .eq('visit_date', visitDate)
    .maybeSingle();

  return { data, error };
}

/**
 * Get queue position (count of queues ahead with same service and status != 'Selesai')
 */
export async function getQueuePosition(queue: Queue): Promise<number> {
  const { count, error } = await supabase
    .from('queues')
    .select('*', { count: 'exact', head: true })
    .eq('visit_date', queue.visit_date)
    .eq('service_id', queue.service_id)
    .lt('queue_number_seq', queue.queue_number_seq)
    .neq('status', 'Selesai');

  if (error) {
    console.error('Error getting queue position:', error);
    return 0;
  }

  return count ?? 0;
}

/**
 * Increment print count for a queue
 */
export async function incrementPrintCount(queueId: number): Promise<{ error: any }> {
  // First get current print_count
  const { data: queue, error: fetchError } = await supabase
    .from('queues')
    .select('print_count')
    .eq('id', queueId)
    .single();

  if (fetchError || !queue) {
    return { error: fetchError };
  }

  const newCount = (queue.print_count ?? 0) + 1;

  const { error } = await supabase
    .from('queues')
    .update({ print_count: newCount })
    .eq('id', queueId);

  return { error };
}




