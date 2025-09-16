import React from 'react'
import { Link } from "react-router";

const DashboardPage = () => {
  return (
    <div className="flex min-h-screen w-full bg-gradient-to-r from-red-500 via-pink-500 to-orange-400">
      {/* Bagian kiri */}
      <div className="flex-1 flex flex-col items-center justify-center text-center px-6">
        <h1 className="text-5xl font-bold text-white drop-shadow-lg">
          Selamat Datang di Dashboard
        </h1>
        <p className="mt-4 text-lg text-white/90 max-w-md">
          Aplikasi ini membantu kamu mengelola data dengan mudah, cepat, 
          dan real-time. Silakan login untuk mulai menggunakan.
        </p>
        <div className="mt-6">
          <Link
            to="/login"
            className="px-6 py-3 bg-blue-600 text-white rounded-xl shadow-md hover:bg-blue-700 transition"
          >
            Masuk ke Login
          </Link>
        </div>
      </div>

      {/* Bagian kanan */}
      <div className="w-2/5 flex items-center justify-center p-8">
        <div className="bg-white rounded-2xl shadow-xl p-6 w-full text-center">
          <h2 className="text-2xl font-semibold text-gray-800 mb-3">
            Fitur Utama
          </h2>
          <ul className="text-gray-700 space-y-2">
            <li>✅ Manajemen data cepat</li>
            <li>✅ Update real-time</li>
            <li>✅ Tampilan sederhana & modern</li>
            <li>✅ Akses dari berbagai perangkat</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default DashboardPage;
