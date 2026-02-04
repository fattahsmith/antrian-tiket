'use client';

import { motion } from 'framer-motion';
import Section from './Section';
import Image from 'next/image';

export default function Testimonials() {
  const testimonials = [
    {
      name: 'Wanto',
      age: 28,
      text: 'Sangat memudahkan! Tidak perlu antri lama di rumah sakit. Tinggal daftar online, datang sesuai jadwal, langsung dilayani.',
      avatar: <Image
        src="/masbud2.png"
        alt="Doctor"
        width={50}
        height={50}
        className="rounded-full"
      />,
    },
    {
      name: 'Budi',
      age: 35,
      text: 'Sistem antrian online ini sangat membantu. Saya bisa daftar dari rumah dan tahu estimasi waktu tunggu. Recommended!',
      avatar: <Image
        src="/masbud.png"
        alt="Doctor"
        width={100}
        height={100}
        className="rounded-full"
      />,
    },
    {
      name: 'Sari',
      age: 42,
      text: 'Pelayanan cepat dan efisien. Tidak perlu repot datang pagi-pagi untuk antri. Sistem ini benar-benar menghemat waktu.',
      avatar: <Image
        src="/women.jpg"
        alt="Doctor"
        width={100}
        height={100}
        className="rounded-full"
      />,
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
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Testimoni</h2>
          <p className="text-gray-600 text-lg">
            Mereka Sudah Merasakan Kemudahannya
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.6 }}
              whileHover={{ y: -10, scale: 1.02 }}
              className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all"
            >
              <div className="flex items-center space-x-4 mb-4">
                <div className="w-16 h-16 rounded-full flex items-center justify-center text-3xl">
                  {testimonial.avatar}
                </div>
                <div>
                  <p className="font-semibold text-gray-900 ">{testimonial.name}</p>
                  <p className="text-sm text-gray-500">{testimonial.age} tahun</p>
                </div>
              </div>
              <p className="text-gray-700 leading-relaxed italic">
                "{testimonial.text}"
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </Section>
  );
}

