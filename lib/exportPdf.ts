import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export async function exportQueueRecapPDF(queues: any[], filters: { from: string; to: string }) {
    const doc = new jsPDF();

   doc.setFontSize(15);
   doc.text("Laporan antrian Rumah Sakit Kita", 10, 10);

   doc.setFontSize(12);
   doc.text(`Periode: ${filters.from} - ${filters.to}`, 10, 15);

    autoTable(doc, {
        startY: 20,
        head: [['Kode Antrian','nama','keluhan', 'Layanan', 'Tanggal']],
        body:queues.map(q => [q.queue_code,q.name,q.complaint, 
             q.service_name, 
             new Date(q.created_at).toLocaleString()
             ]),
             styles: {
                fontSize: 10,
             },
             headStyles: {
                fillColor: [0, 150, 136],
             },

    });

    doc.save('queue-recap.pdf');
}