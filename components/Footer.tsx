'use client';

import { motion } from 'framer-motion';

export default function Footer() {
  return (
    <footer id="contact" className="bg-gray-900 text-white py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          <div>
            <h3 className="text-xl font-bold mb-4">Rumah Sakit Kita</h3>
            <p className="text-gray-400 text-sm">
              Memberikan pelayanan kesehatan terbaik untuk Anda dan keluarga.
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Layanan</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>Radiologi</li>
              <li>Poli Umum</li>
              <li>Poli Gigi</li>
              <li>UGD & Rawat Inap</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Informasi</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>Tentang Kami</li>
              <li>Dokter & Jadwal</li>
              <li>Kontak</li>
              <li>FAQ</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Kontak</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>📞 (021) 1234-5678</li>
              <li>📧 info@rumahsakitkita.com</li>
              <li>📍 Jl. Kesehatan No. 123, Jakarta</li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-800 pt-8 text-center text-sm text-gray-400">
          <p>&copy; {new Date().getFullYear()} Rumah Sakit Kita. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

