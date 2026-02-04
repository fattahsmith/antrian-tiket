'use client';

import { exportQueueRecapPDF } from "@/lib/exportPdf";

export default function ExportButtons(   {queues, filters}: {queues: any[]; filters: { from: string; to: string } }) {
    return (
        <button
        onClick={() => exportQueueRecapPDF(queues, filters)}
        className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
        >
            Export PDF
        </button>
    );
}