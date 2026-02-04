export type QueueStatus = 'Menunggu' | 'Dipanggil' | 'Selesai' | 'Dilewati';

export interface Queue {
  id: number;
  service_id: number;
  service_name: string;
  service_prefix: string;
  queue_number_seq: number;
  queue_code: string;
  contact: string;
  name: string;
  complaint: string;
  visit_date: string;
  status: QueueStatus;
  is_current: boolean;
  created_at: string;
}

