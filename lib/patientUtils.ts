import { supabase } from "./supabase";

export async function fetchPatientRecap() {
    const { data, error } = await supabase
        .from('queues')
        .select('id, service_name, name, queue_code, complaint,status, created_at')
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Error fetching patient:', error);
        return [];
    }

    return data || [];
}