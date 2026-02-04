'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useStaffAuth } from '@/contexts/StaffAuthContext';
import Image from 'next/image';

export default function LoginPage() {
  const router = useRouter();
  const { login } = useStaffAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
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
    } catch (err) {
      setError('Terjadi kesalahan. Silakan coba lagi.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-[#020817] via-[#091938] to-[#0b5fa8] px-4 py-10 text-white">
      <div className="pointer-events-none absolute inset-0 opacity-80">
        <div className="absolute top-[-10%] left-1/4 h-72 w-72 rounded-full bg-sky-500/40 blur-[150px]" />
        <div className="absolute bottom-0 right-0 h-96 w-96 rounded-full bg-cyan-400/30 blur-[160px]" />
      </div>
      <div className="relative z-10 mx-auto flex max-w-5xl flex-col items-center">
      <Image
    src="/logo.png"
    width={40}
    height={40}
    alt="Logo"
  />
        <Link
          href="/"
          className="mb-8 text-sm font-semibold uppercase tracking-[0.4em] text-white/70"
        >
          RS Kita
        </Link>
        <div className="w-full max-w-md rounded-[32px] border border-white/15 bg-white/10 p-8 backdrop-blur-2xl shadow-[0_30px_120px_rgba(15,23,42,0.5)]">
          <div className="mb-8 text-center">
            <p className="text-xs uppercase tracking-[0.5em] text-cyan-200">Khusus petugas</p>
            <h1 className="mt-3 text-3xl font-semibold text-white">Login Petugas</h1>
            <p className="text-sm text-white/70">Masuk ke dashboard petugas RS Kita</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="username" className="mb-2 block text-sm font-medium text-white/70">
                Username
              </label>
              <input
                type="text"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full rounded-2xl border border-white/20 bg-white/5 px-4 py-3 text-white placeholder-white/60 outline-none transition focus:border-cyan-200 focus:ring-2 focus:ring-cyan-300"
                placeholder="Masukkan username"
                required
                autoComplete="username"
              />
            </div>

            <div>
              <label htmlFor="password" className="mb-2 block text-sm font-medium text-white/70">
                Password
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-2xl border border-white/20 bg-white/5 px-4 py-3 text-white placeholder-white/60 outline-none transition focus:border-cyan-200 focus:ring-2 focus:ring-cyan-300"
                placeholder="Masukkan password"
                required
                autoComplete="current-password"
              />
            </div>

            {error && (
              <div className="rounded-2xl border border-red-400/40 bg-red-500/10 px-4 py-3 text-sm text-red-100">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full rounded-2xl bg-gradient-to-r from-cyan-400 via-sky-500 to-blue-600 py-3 text-lg font-semibold text-white shadow-[0_20px_60px_rgba(59,130,246,0.45)] transition hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isLoading ? 'Memproses...' : 'Login'}
            </button>
          </form>

          <div className="mt-8 text-center">
            <Link href="/" className="text-sm font-medium text-white/70 hover:text-white">
              ← Kembali ke halaman pasien
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

