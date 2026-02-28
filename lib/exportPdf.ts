import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export async function exportQueueRecapPDF(
  queues: any[],
  filters: { from: string; to: string }
) {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();

  // ========== HEADER ========== //
  try {
    const logo = await fetch("/logo.png").then(res => res.blob());
    const reader = new FileReader();

    const base64Logo: string = await new Promise(resolve => {
      reader.onloadend = () => resolve(reader.result as string);
      reader.readAsDataURL(logo);
    });

    doc.addImage(base64Logo, "PNG", 10, 8, 18, 18);
  } catch (error) {
    console.warn("Logo gagal dimuat, lanjut tanpa logo");
  }

  doc.setFontSize(16);
  doc.setFont("helvetica", "bold");
  doc.text("Rumah Sakit Kita", 33, 15);

  doc.setFontSize(12);
  doc.setFont("helvetica", "normal");
  doc.text("Laporan Rekap Antrian Pasien", 33, 22);

  // Garis pemisah
  doc.setDrawColor(0, 150, 136);
  doc.setLineWidth(0.8);
  doc.line(10, 30, pageWidth - 10, 30);

  // ========== PERIODE ========== //
  doc.setFontSize(11);
  doc.text(`Periode: ${filters.from}  -  ${filters.to}`, 10, 38);

  // ========== TABLE ========== //
  autoTable(doc, {
    startY: 45,
    head: [["Kode Antrian", "Nama", "Keluhan", "Layanan", "Tanggal"]],
    body: queues.map(q => [
      q.queue_code,
      q.name,
      q.complaint,
      q.service_name,
      new Date(q.created_at).toLocaleString("id-ID", {
        day: "2-digit",
        month: "long",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    ]),
    styles: {
      fontSize: 10,
      cellPadding: 3,
    },
    headStyles: {
      fillColor: [0, 150, 136],
      fontSize: 11,
    },
    alternateRowStyles: {
      fillColor: [240, 255, 251],
    },
    margin: { left: 10, right: 10 },
  });

  // ========== FOOTER ========== //
  const pageCount = (doc as any).internal.getNumberOfPages();

  doc.setFontSize(10);
  doc.setTextColor(120);
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.text(
      `Halaman ${i} dari ${pageCount}`,
      pageWidth - 35,
      doc.internal.pageSize.height - 10
    );
  }

  doc.save("rekap-antrian.pdf");
}