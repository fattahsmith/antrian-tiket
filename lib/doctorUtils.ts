import { supabase } from './supabase';
import { Doctor, DoctorStatus } from '@/types/doctor';

export async function fetchDoctors() {
    const { data, error } = await supabase
        .from('doctors')
        .select(`
      *,
      profiles (
        name,
        role
      )
    `)
        .order('status', { ascending: false });

    if (error) {
        console.error('Error fetching doctors:', error);
        return [];
    }

    return data as Doctor[];
}


export async function updateDoctorStatus(
    doctorId: string,
    status: DoctorStatus
) {
    const { data, error } = await supabase
        .from('doctors')
        .update({ status })
        .eq('id', doctorId)
        .select()
        .single();

    if (error) {
        console.error('Error updating doctor status:', error);
        throw error;
    }

    return data;
}

/* =========================
   ➕ TAMBAH DOKTER
========================= */

interface CreateDoctorPayload {
    name: string;
    specialty: string;
    practice_start?: string;
    practice_end?: string;
}

export async function createDoctor(payload: {
    name: string;
    specialty: string;
    practice_start: string;
    practice_end: string;
    image?: File | null;
}) {
    let image_url = null;

    // 1. Upload Image if exists
    if (payload.image) {
        const filename = `${Date.now()}-${payload.image.name.replace(/\s/g, '_')}`;
        const { data: uploadData, error: uploadError } = await supabase
            .storage
            .from('doctors')
            .upload(filename, payload.image, {
                cacheControl: '3600',
                upsert: false
            });

        if (uploadError) {
            console.error('Error uploading image:', uploadError);
            const { data: { user } } = await supabase.auth.getUser();
            console.warn('Current Auth User:', user);
            throw new Error(`Upload Failed: ${uploadError.message} (User: ${user ? 'Authenticated' : 'Anon'})`);
        }

        // Get Public URL
        const { data: publicUrlData } = supabase
            .storage
            .from('doctors')
            .getPublicUrl(filename);

        image_url = publicUrlData.publicUrl;
    }

    // 2. Insert into profiles first
    const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .insert({
            name: payload.name,
            role: 'petugas',
        })
        .select('id')
        .single();

    if (profileError) {
        console.error('Error creating profile:', profileError);
        throw new Error(`Profile Creation Failed: ${profileError.message}`);
    }

    // 3. Insert into doctors using the profile_id
    const { error: doctorError } = await supabase
        .from('doctors')
        .insert({
            profile_id: profile.id,
            specialty: payload.specialty,
            status: 'offline', // Default to lowercase match with explicit type
            practice_start: payload.practice_start,
            practice_end: payload.practice_end,
            is_active: true,
            image_url: image_url
        });

    if (doctorError) {
        console.error('Supabase Error (Doctors):', doctorError);
        // Note: In a real app we might want to rollback the profile creation and image upload
        throw new Error(`Doctor Creation Failed: ${doctorError.message}`);
    }

    return { error: null };
}

export async function deleteDoctors(id: number): Promise<{ error: any }> {
  const { error } = await supabase.from('doctors').delete().eq('id', id);

  return { error };
}