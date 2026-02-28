'use client';

import { motion } from 'framer-motion';
import {
  MapPin,
  Phone,
  Mail,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  HeartPulse,
} from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

const socialLinks = [
  { icon: Facebook, href: '#', label: 'Facebook' },
  { icon: Twitter, href: '#', label: 'Twitter' },
  { icon: Instagram, href: '#', label: 'Instagram' },
  { icon: Linkedin, href: '#', label: 'Linkedin' },
];

const servicesLinks = [
  'Radiologi',
  'Poli Umum',
  'Poli Gigi',
  'UGD & Rawat Inap',
  'Laboratorium Utama',
];

const patientLinks = [
  'Jadwal Dokter',
  'Buat Janji Temu',
  'Asuransi & Pembayaran',
  'Panduan Pasien',
  'Artikel Kesehatan',
];

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer id="contact" className="relative bg-[#0A0F1C] text-slate-300 pt-20 pb-8 overflow-hidden border-t border-slate-800">
      {/* Decorative Blur Backdrops */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] bg-blue-600/10 blur-[120px] rounded-full" />
        <div className="absolute -bottom-[20%] -right-[10%] w-[50%] h-[50%] bg-teal-600/10 blur-[120px] rounded-full" />
      </div>

      <div className="container mx-auto px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-8 xl:gap-12 mb-16">

          {/* Brand & Mission section */}
          <div className="lg:col-span-4 space-y-6">
            <Link href="/" className="inline-flex items-center gap-3 group">
              <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center text-white shadow-lg shadow-blue-500/25 group-hover:scale-105 transition-transform duration-300">
                <Image
                  src="/logo.png"
                  width={32}
                  height={32}
                  alt="RS Kita Logo"
                  className="w-8 h-8 object-contain"
                />
              </div>
              <span className="text-2xl font-bold text-white tracking-tight">
                RS Kita
              </span>
            </Link>
            <p className="text-slate-400 text-sm leading-relaxed max-w-sm">
              Memberikan pelayanan kesehatan terbaik, modern, dan terpercaya untuk Anda dan keluarga dengan sepenuh hati dan dedikasi tinggi.
            </p>
            <div className="flex items-center gap-3 pt-2">
              {socialLinks.map((social, index) => {
                const Icon = social.icon;
                return (
                  <Link
                    key={index}
                    href={social.href}
                    aria-label={social.label}
                    className="w-10 h-10 rounded-full bg-slate-800/80 border border-slate-700/80 flex items-center justify-center text-slate-400 hover:bg-blue-600 hover:text-white hover:border-blue-500 transition-all duration-300 hover:shadow-[0_0_15px_rgba(37,99,235,0.4)]"
                  >
                    <Icon size={18} />
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Links: Layanan */}
          <div className="lg:col-span-2">
            <h3 className="text-white font-semibold mb-6 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-blue-500"></span>
              Layanan
            </h3>
            <ul className="space-y-4">
              {servicesLinks.map((link, index) => (
                <li key={index}>
                  <Link
                    href="#"
                    className="text-sm text-slate-400 hover:text-blue-400 hover:translate-x-1 inline-block transition-transform duration-300"
                  >
                    {link}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Links: Pasien */}
          <div className="lg:col-span-2">
            <h3 className="text-white font-semibold mb-6 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-teal-500"></span>
              Informasi
            </h3>
            <ul className="space-y-4">
              {patientLinks.map((link, index) => (
                <li key={index}>
                  <Link
                    href="#"
                    className="text-sm text-slate-400 hover:text-blue-400 hover:translate-x-1 inline-block transition-transform duration-300"
                  >
                    {link}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Information */}
          <div className="lg:col-span-4">
            <h3 className="text-white font-semibold mb-6 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-purple-500"></span>
              Kontak
            </h3>
            <ul className="space-y-5">
              {/* Address */}
              <li className="flex items-start gap-4 group">
                <div className="w-10 h-10 rounded-xl bg-slate-800/80 border border-slate-700/80 flex flex-shrink-0 items-center justify-center text-blue-400 group-hover:bg-blue-500 group-hover:text-white transition-colors duration-300">
                  <MapPin size={20} />
                </div>
                <div className="pt-0.5">
                  <p className="text-white text-sm font-medium mb-1 relative inline-block group-hover:text-blue-400 transition-colors">
                    Alamat
                  </p>
                  <p className="text-sm text-slate-400 leading-relaxed">
                    Jl. Kesehatan No. 123,
                    <br />
                    Kebayoran Baru, Jakarta Selatan
                    <br />
                    DKI Jakarta 12345
                  </p>
                </div>
              </li>

              {/* Phone */}
              <li className="flex items-center gap-4 group">
                <div className="w-10 h-10 rounded-xl bg-slate-800/80 border border-slate-700/80 flex flex-shrink-0 items-center justify-center text-teal-400 group-hover:bg-teal-500 group-hover:text-white transition-colors duration-300">
                  <Phone size={20} />
                </div>
                <div>
                  <p className="text-white text-sm font-medium mb-1 group-hover:text-teal-400 transition-colors">Telepon</p>
                  <p className="text-sm text-slate-400">(021) 1234-5678</p>
                </div>
              </li>

              {/* Email */}
              <li className="flex items-center gap-4 group">
                <div className="w-10 h-10 rounded-xl bg-slate-800/80 border border-slate-700/80 flex flex-shrink-0 items-center justify-center text-purple-400 group-hover:bg-purple-500 group-hover:text-white transition-colors duration-300">
                  <Mail size={20} />
                </div>
                <div>
                  <p className="text-white text-sm font-medium mb-1 group-hover:text-purple-400 transition-colors">Email</p>
                  <p className="text-sm text-slate-400 hover:text-white cursor-pointer transition-colors">info@rumahsakitkita.com</p>
                </div>
              </li>
            </ul>
          </div>
        </div>

        {/* Footer Bottom / Legal */}
        <div className="pt-8 border-t border-slate-800/80 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-slate-500 text-center md:text-left">
            &copy; {currentYear} Rumah Sakit Kita. All rights reserved.
          </p>
          <div className="flex flex-wrap gap-4 items-center justify-center md:justify-end text-xs text-slate-500">
            <Link href="#" className="hover:text-slate-300 transition-colors duration-300">
              Kebijakan Privasi
            </Link>
            <span className="w-1 h-1 rounded-full bg-slate-700"></span>
            <Link href="#" className="hover:text-slate-300 transition-colors duration-300">
              Syarat & Ketentuan
            </Link>
            <span className="w-1 h-1 rounded-full bg-slate-700"></span>
            <Link href="#" className="hover:text-slate-300 transition-colors duration-300">
              FAQ
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

