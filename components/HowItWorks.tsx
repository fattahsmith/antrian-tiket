'use client';

import { motion } from 'framer-motion';
import Section from './Section';

export default function HowItWorks() {
  const steps = [
    {
      number: '1',
      title: 'Isi Data',
      description:
        'Isi data diri Anda dan pilih tanggal kunjungan serta layanan yang diinginkan melalui formulir online.',
    },
    {
      number: '2',
      title: 'Dapatkan Nomor Antrian',
      description:
        'Setelah mengisi data, Anda akan langsung mendapatkan nomor antrian dan estimasi waktu tunggu.',
    },
    {
      number: '3',
      title: 'Datang Sesuai Jadwal',
      description:
        'Datang ke rumah sakit sesuai jadwal yang telah ditentukan dan tunggu hingga nomor Anda dipanggil.',
    },
  ];

  return (
    <Section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Cara Kerja Antrian Online
          </h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Proses yang sederhana dan mudah untuk mendapatkan pelayanan kesehatan
            yang lebih efisien
          </p>
        </motion.div>

        <div className="relative max-w-4xl mx-auto">
          {/* Timeline Line */}
          <div className="absolute left-8 top-0 bottom-0 w-1 bg-blue-200 hidden md:block" />

          <div className="space-y-12">
            {steps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2, duration: 0.6 }}
                className="relative flex items-start space-x-6"
              >
                {/* Step Number Circle */}
                <div className="relative z-10 flex-shrink-0">
                  <div className="w-16 h-16 rounded-full bg-blue-600 text-white flex items-center justify-center text-2xl font-bold shadow-lg">
                    {step.number}
                  </div>
                </div>

                {/* Content */}
                <div className="flex-1 bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow">
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">
                    {step.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.6, duration: 0.6 }}
          className="mt-12 text-center"
        >
          <div className="inline-block bg-blue-50 border border-blue-200 rounded-xl px-6 py-4">
            <p className="text-sm text-gray-700">
              <span className="font-semibold">Catatan:</span> Disarankan datang
              lebih awal untuk proses verifikasi data
            </p>
          </div>
        </motion.div>
      </div>
    </Section>
  );
}

