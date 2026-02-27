'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useStaffAuth } from '@/contexts/StaffAuthContext';
import Image from 'next/image';
import { ArrowLeft, Eye, EyeOff, Lock, User, AlertCircle, Loader2 } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const { login } = useStaffAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    try {
      const success = login(username, password);
      if (success) {
        router.push('/petugas');
      } else {
        setError('Username atau password salah');
      }
    } catch {
      setError('Terjadi kesalahan. Silakan coba lagi.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex">

      {/* ── Left decorative panel (hidden on mobile) ── */}
      <div className="hidden lg:flex w-[45%] flex-col relative overflow-hidden bg-gradient-to-br from-blue-600 via-blue-500 to-violet-600">
        {/* Background layers */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_20%_40%,rgba(255,255,255,0.12)_0%,transparent_100%)]" />
        <div className="absolute -bottom-24 -left-20 h-80 w-80 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute top-20 right-0 h-64 w-64 rounded-full bg-violet-400/20 blur-3xl" />
        <div
          className="absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)',
            backgroundSize: '28px 28px',
          }}
        />

        {/* Content */}
        <div className="relative z-10 flex flex-col justify-between h-full px-14 py-14">
          {/* Logo + brand */}
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white ring-1 ring-white/30">
              <Image src="/logo.png" width={24} height={24} alt="Logo" />
            </div>
            <span className="text-sm font-semibold tracking-widest text-white/80 uppercase">RS Kita</span>
          </div>

          {/* Center copy */}
          <div>
            <span className="inline-flex items-center gap-2 rounded-full bg-white/15 border border-white/20 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-white/80 mb-6">
              <span className="h-1.5 w-1.5 rounded-full bg-white/80" />
              Portal Petugas
            </span>
            <h2 className="text-5xl font-extrabold leading-[1.1] tracking-tight text-white mb-5">
              Selamat<br />
              <span className="text-white/70">Datang Kembali</span>
            </h2>
            <p className="text-white/60 text-[15px] leading-relaxed max-w-[280px]">
              Masuk ke dashboard petugas untuk mengelola antrian dan layanan RS Kita.
            </p>

            {/* Feature pills */}
            <div className="mt-8 flex flex-col gap-3">
              {[
                'Kelola antrian real-time',
                'Monitor status pasien',
                'Laporan layanan harian',
              ].map((item) => (
                <div key={item} className="flex items-center gap-3">
                  <span className="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-white/20">
                    <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                      <path d="M2 5.5L4 7.5L8 3" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </span>
                  <span className="text-sm text-white/70">{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom note */}
          <p className="text-[11px] text-white/30">
            © 2025 RS Kita · Sistem Antrian Online
          </p>
        </div>
      </div>

      {/* ── Right form panel ── */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-12 bg-slate-50 relative overflow-hidden">
        {/* Subtle background blobs */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -top-32 -right-32 h-72 w-72 rounded-full bg-blue-100/60 blur-3xl" />
          <div className="absolute -bottom-20 left-0 h-56 w-56 rounded-full bg-violet-100/40 blur-3xl" />
        </div>

        <div className="relative z-10 w-full max-w-[400px]">

          {/* Mobile logo */}
          <div className="flex lg:hidden items-center gap-2 mb-10">
            <Image src="/logo.png" width={28} height={28} alt="Logo" />
            <span className="text-sm font-semibold tracking-widest text-slate-600 uppercase">RS Kita</span>
          </div>

          {/* Card */}
          <div className="rounded-2xl bg-white border border-slate-100 shadow-sm shadow-slate-200/60 p-8">

            {/* Header */}
            <div className="mb-7">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-blue-100 bg-blue-50 px-3 py-1 text-[10px] font-semibold uppercase tracking-widest text-blue-600 mb-4">
                <span className="h-1.5 w-1.5 rounded-full bg-blue-500" />
                Khusus Petugas
              </span>
              <h1 className="text-2xl font-extrabold tracking-tight text-slate-800 mb-1">Login Petugas</h1>
              <p className="text-sm text-slate-400">Masuk ke dashboard petugas RS Kita</p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">

              {/* Username */}
              <div>
                <label htmlFor="username" className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Username
                </label>
                <div className="relative">
                  <span className="pointer-events-none absolute inset-y-0 left-3.5 flex items-center">
                    <User className="h-4 w-4 text-slate-400" />
                  </span>
                  <input
                    type="text"
                    id="username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-4 py-3 text-sm text-slate-800 placeholder-slate-400 outline-none transition focus:border-blue-400 focus:bg-white focus:ring-3 focus:ring-blue-100"
                    placeholder="Masukkan username"
                    required
                    autoComplete="username"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label htmlFor="password" className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Password
                </label>
                <div className="relative">
                  <span className="pointer-events-none absolute inset-y-0 left-3.5 flex items-center">
                    <Lock className="h-4 w-4 text-slate-400" />
                  </span>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-11 py-3 text-sm text-slate-800 placeholder-slate-400 outline-none transition focus:border-blue-400 focus:bg-white focus:ring-3 focus:ring-blue-100"
                    placeholder="Masukkan password"
                    required
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((p) => !p)}
                    className="absolute inset-y-0 right-3.5 flex items-center text-slate-400 hover:text-slate-600 transition-colors"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              {/* Error */}
              {error && (
                <div className="flex items-center gap-2.5 rounded-xl border border-red-100 bg-red-50 px-4 py-3">
                  <AlertCircle className="h-4 w-4 flex-shrink-0 text-red-500" />
                  <p className="text-sm text-red-600">{error}</p>
                </div>
              )}

              {/* Submit */}
              <button
                type="submit"
                disabled={isLoading}
                className="group relative mt-1 w-full overflow-hidden rounded-xl bg-gradient-to-r from-blue-500 to-violet-600 py-3 text-sm font-semibold text-white shadow-md shadow-blue-200 transition-all hover:shadow-blue-300 hover:-translate-y-0.5 disabled:opacity-60 disabled:pointer-events-none"
              >
                <span className="relative z-10 flex items-center justify-center gap-2">
                  {isLoading ? (
                    <><Loader2 className="h-4 w-4 animate-spin" /> Memproses…</>
                  ) : (
                    'Masuk ke Dashboard'
                  )}
                </span>
                <span className="absolute inset-0 -translate-x-full bg-white/10 group-hover:translate-x-full transition-transform duration-700" />
              </button>
            </form>
          </div>

          {/* Footer link */}
          <div className="mt-5 text-center">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-sm text-slate-400 hover:text-blue-600 transition-colors"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              Kembali ke halaman pasien
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
