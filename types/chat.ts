export interface Chat {
  id: number;
  pasien_id: number;
  petugas_id: number | null;
  queue_id: number;
  created_at: string;
  updated_at: string;
  // Joined data
  pasien_name?: string;
  pasien_contact?: string;
  queue_code?: string;
  service_name?: string;
  unread_count?: number;
  last_message?: string;
  last_message_at?: string;
}

export interface Message {
  id: number;
  chat_id: number;
  sender_id: number;
  message: string;
  is_read: boolean;
  created_at: string;
  // Joined data
  sender_name?: string;
  sender_role?: string;
}
