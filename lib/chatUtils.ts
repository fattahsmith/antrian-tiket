import { supabase } from './supabase';
import { Chat, Message } from '@/types/chat';

/**
 * Get or create chat for a queue
 */
export async function getOrCreateChat(queueId: number, pasienId: number): Promise<{ data: Chat | null; error: any }> {
  // Check if chat already exists
  const { data: existingChat, error: fetchError } = await supabase
    .from('chats')
    .select('*')
    .eq('queue_id', queueId)
    .eq('pasien_id', pasienId)
    .maybeSingle();

  if (fetchError && fetchError.code !== 'PGRST116') {
    return { data: null, error: fetchError };
  }

  if (existingChat) {
    return { data: existingChat as Chat, error: null };
  }

  // Create new chat
  const { data: newChat, error: createError } = await supabase
    .from('chats')
    .insert({
      pasien_id: pasienId,
      petugas_id: null,
      queue_id: queueId,
    })
    .select()
    .single();

  return { data: newChat as Chat, error: createError };
}

/**
 * Get chat by ID with joined data
 */
export async function getChatById(chatId: number): Promise<{ data: Chat | null; error: any }> {
  const { data, error } = await supabase
    .from('chats')
    .select(`
      *,
      queues!inner (
        queue_code,
        service_name,
        name,
        contact
      )
    `)
    .eq('id', chatId)
    .single();

  if (error) {
    return { data: null, error };
  }

  const chat = data as any;
  return {
    data: {
      ...chat,
      pasien_name: chat.queues?.name,
      pasien_contact: chat.queues?.contact,
      queue_code: chat.queues?.queue_code,
      service_name: chat.queues?.service_name,
    } as Chat,
    error: null,
  };
}

/**
 * Get chat by queue ID
 */
export async function getChatByQueueId(queueId: number): Promise<{ data: Chat | null; error: any }> {
  const { data, error } = await supabase
    .from('chats')
    .select('*')
    .eq('queue_id', queueId)
    .maybeSingle();

  return { data: data as Chat | null, error };
}
