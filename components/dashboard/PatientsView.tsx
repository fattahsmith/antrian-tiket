'use client';

import { useEffect, useState } from 'react';
import { fetchPatientRecap } from '@/lib/patientUtils';
import { supabase } from '@/lib/supabase';

const {data , error} = await supabase 
.from('queues')
.select('id, service_name, name, queue_code, complaint,status, created_at')
.order('service_name', { ascending: true })
.order('created_at', {ascending:false});

export default function PatientsView() {
  const [queues, setQueues] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
 

  useEffect(() => {
    const load = async () => {
      const data = await fetchPatientRecap();
      setQueues(data);
      setLoading(false);
    };
    load();
  }, []);

  if (loading) {
    return <p className="text-gray-500">Loading data...</p>;
  }

  if (!queues.length) {
    return <p className="text-gray-500">Belum ada data antrian.</p>;
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Rekap Antrian Pasien</h2>

      <div className="overflow-x-auto">
        <table className="w-full border rounded-lg">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-2 text-left">Kode Antrian</th>
              <th className="px-4 py-2 text-left">Nama Pasien</th>
              <th className="px-4 py-2 text-left">Layanan</th>
              <th className="px-4 py-2 text-left">Keluhan</th>
              <th className="px-4 py-2 text-left">Status</th>
              <th className="px-4 py-2 text-left">Tanggal</th>  
            </tr>
          </thead>
          <tbody>
            {queues.map((q) => (
              <tr key={q.id} className="border-t">
                <td className="px-4 py-2 font-medium">
                  {q.queue_code}
                </td>
                <td className="px-4 py-2">
                  {q.name}
                </td>
                <td className="px-4 py-2">
                  {q.service_name}
                </td>
                <td className="px-4 py-2">
                  {q.complaint}
                </td>
                <td className="px-4 py-2">
                  {q.status}
                </td>
                <td className="px-4 py-2 text-sm text-gray-500">
                  {new Date(q.created_at).toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
