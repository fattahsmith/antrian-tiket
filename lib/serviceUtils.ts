import { supabase } from './supabase';
import { Service } from '@/types/service';

export async function fetchServices(onlyActive = false): Promise<Service[]> {
  let query = supabase.from('services').select('*').order('name', { ascending: true });

  if (onlyActive) {
    query = query.eq('is_active', true);
  }

  const { data, error } = await query;

  if (error || !data) {
    console.error('Error fetching services:', error);
    return [];
  }

  return data;
}

export async function createService(
  name: string,
  prefix: string
): Promise<{ data: Service | null; error: any }> {
  const { data, error } = await supabase
    .from('services')
    .insert({
      name: name.trim(),
      prefix: prefix.trim().toUpperCase(),
    })
    .select()
    .single();

  return { data, error };
}

export async function updateService(
  id: number,
  updates: Pick<Service, 'name' | 'prefix'>
): Promise<{ data: Service | null; error: any }> {
  const { data, error } = await supabase
    .from('services')
    .update({
      name: updates.name.trim(),
      prefix: updates.prefix.trim().toUpperCase(),
    })
    .eq('id', id)
    .select()
    .single();

  return { data, error };
}

export async function setServiceActive(
  id: number,
  isActive: boolean
): Promise<{ error: any }> {
  const { error } = await supabase
    .from('services')
    .update({ is_active: isActive })
    .eq('id', id);

  return { error };
}

export async function deleteService(id: number): Promise<{ error: any }> {
  const { error } = await supabase.from('services').delete().eq('id', id);

  return { error };
}

