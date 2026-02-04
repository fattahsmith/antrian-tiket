"use client";

import { useState } from "react";
import { useStaffAuth } from "@/contexts/StaffAuthContext";

export default function SettingsView() {
    const { logout } = useStaffAuth();
    const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

    // Local state for preferences (simulated)
    const [theme, setTheme] = useState<"light" | "dark">("light");
    const [language, setLanguage] = useState<"id" | "en">("id");
    const [timeFormat, setTimeFormat] = useState<"24h" | "12h">("24h");

    // Local state for queue settings (simulated)
    const [maxQueue, setMaxQueue] = useState(100);
    const [autoReset, setAutoReset] = useState(true);
    const [resetTime, setResetTime] = useState("00:00");

    const handleLogoutClick = () => {
        setShowLogoutConfirm(true);
    };

    const confirmLogout = () => {
        logout();
    };

    return (
        <div className="space-y-8 max-w-4xl mx-auto pb-10">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900">Pengaturan</h2>
                    <p className="text-gray-500 text-sm mt-1">
                        Kelola preferensi akun dan konfigurasi sistem antrian
                    </p>
                </div>
            </div>

            {/* Profile Settings */}
            <section className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
                    <span>👤</span> Profil Pengguna
                </h3>
                <div className="flex items-center gap-6">
                    <div className="relative">
                        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center text-white text-3xl font-bold shadow-lg">
                            P
                        </div>
                        <div className="absolute bottom-0 right-0 w-6 h-6 bg-green-500 border-4 border-white rounded-full"></div>
                    </div>
                    <div>
                        <h4 className="text-xl font-bold text-gray-900">Petugas Antrian</h4>
                        <p className="text-gray-500 font-medium bg-gray-100 px-3 py-1 rounded-full text-xs w-fit mt-2">
                            Staff Admin
                        </p>
                    </div>
                </div>
            </section>

            {/* Queue System Settings */}
            <section className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
                    <span>🔢</span> Konfigurasi Antrian
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Maksimal Antrian per Layanan
                            </label>
                            <input
                                type="number"
                                value={maxQueue}
                                onChange={(e) => setMaxQueue(Number(e.target.value))}
                                className="w-full rounded-lg border border-gray-300 px-4 py-2.5 focus:ring-2 focus:ring-blue-100 focus:border-blue-400 outline-none transition"
                            />
                        </div>

                        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100">
                            <div>
                                <div className="font-medium text-gray-900">Reset Otomatis</div>
                                <div className="text-xs text-gray-500">Reset nomor antrian setiap hari</div>
                            </div>
                            <button
                                onClick={() => setAutoReset(!autoReset)}
                                className={`relative w-12 h-6 rounded-full transition-colors duration-200 ease-in-out ${autoReset ? 'bg-blue-600' : 'bg-gray-300'}`}
                            >
                                <span className={`absolute left-0.5 top-0.5 w-5 h-5 bg-white rounded-full transition-transform duration-200 ease-in-out shadow-sm ${autoReset ? 'translate-x-6' : 'translate-x-0'}`} />
                            </button>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Jadwal Reset Harian
                            </label>
                            <input
                                type="time"
                                value={resetTime}
                                onChange={(e) => setResetTime(e.target.value)}
                                className="w-full rounded-lg border border-gray-300 px-4 py-2.5 focus:ring-2 focus:ring-blue-100 focus:border-blue-400 outline-none transition"
                            />
                        </div>

                        <div className="p-4 bg-blue-50 rounded-xl border border-blue-100 text-sm text-blue-800">
                            <strong>Info:</strong> Prefix layanan diatur secara otomatis berdasarkan konfigurasi di menu "Kelola Layanan".
                        </div>
                    </div>
                </div>
            </section>

            {/* Security & Danger Zone */}
            <section className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
                    <span>🔒</span> Keamanan
                </h3>
                <div className="flex items-center justify-between p-4 bg-red-50 rounded-xl border border-red-100">
                    <div>
                        <h4 className="font-semibold text-red-900">Keluar dari Sesi</h4>
                        <p className="text-sm text-red-700 mt-1">Akhiri sesi anda sebagai petugas.</p>
                    </div>
                    <button
                        onClick={handleLogoutClick}
                        className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition-colors shadow-sm"
                    >
                        Logout
                    </button>
                </div>
            </section>

            {/* About App */}
            <section className="text-center py-8 text-gray-400">
                <p className="font-medium">Sistem Antrian Rumah Sakit</p>
                <p className="text-sm mt-1">Versi 1.0.0 • Build 2024</p>
            </section>

            {/* Logout Confirmation Modal */}
            {showLogoutConfirm && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-6 transform transition-all scale-100">
                        <h3 className="text-xl font-bold text-gray-900 mb-2">
                            Konfirmasi Logout
                        </h3>
                        <p className="text-gray-600 mb-6">
                            Apakah anda yakin ingin keluar dari halaman petugas?
                        </p>
                        <div className="flex gap-3">
                            <button
                                onClick={() => setShowLogoutConfirm(false)}
                                className="flex-1 px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-xl transition-colors"
                            >
                                Batal
                            </button>
                            <button
                                onClick={confirmLogout}
                                className="flex-1 px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white font-medium rounded-xl transition-colors shadow-lg shadow-red-200"
                            >
                                Ya, Logout
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
