'use client';

import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import FloatingAIChat from '@/components/FloatingAIChat';
import About from '@/components/About';
import WhyOnlineQueue from '@/components/WhyOnlineQueue';
import HowItWorks from '@/components/HowItWorks';
import Services from '@/components/Services';
import Doctors from '@/components/Doctors';
import Testimonials from '@/components/Testimonials';
import CTA from '@/components/CTA';
import Footer from '@/components/Footer';
import SplashCursor from '@/components/SplashCursor';

export default function Home() {
  
  
  return (
    <main className="relative overflow-hidden">
      <SplashCursor />
      <Navbar />
      <Hero />
      <FloatingAIChat />
      <About />
      <WhyOnlineQueue />
      <HowItWorks />
      <Services />
      <Doctors />
      <Testimonials />
      <CTA />
      <Footer />
    </main>
  );
}


