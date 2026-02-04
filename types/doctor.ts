export type DoctorStatus = 'offline' | 'online' | 'practice' | 'cuti';

export interface Doctor {
    id: string; // UUID
    profile_id: number;
    specialty: string;
    image_url?: string;
    status: DoctorStatus;
    practice_start: string; // Time string like "09:00:00"
    practice_end: string;
    profiles?: {
        name: string;
        role?: string;
    };
}
