import type { Metadata } from 'next';
import Navbar from '@/components/landing/Navbar';
import Hero from '@/components/landing/Hero';
import About from '@/components/landing/About';
import Services from '@/components/landing/Services';
import Trips from '@/components/landing/Trips';
import Testimonials from '@/components/landing/Testimonials';
import Contact from '@/components/landing/Contact';
import Footer from '@/components/landing/Footer';

export const metadata: Metadata = {
  title: 'Rider Horse Banyuwangi – Pengalaman Berkuda Terbaik di Jawa Timur',
  description:
    'Jelajahi jalur berkuda yang menakjubkan, pelajaran profesional, dan petualangan equestrian tak terlupakan di Banyuwangi. Tersedia Beach Ride, Forest Trail, Sunset Ride, dan banyak lagi.',
  keywords: ['horse riding banyuwangi', 'berkuda banyuwangi', 'equestrian jawa timur', 'sunset beach ride', 'wisata banyuwangi'],
  openGraph: {
    title: 'Rider Horse Banyuwangi – Pengalaman Berkuda Terbaik',
    description: 'Pengalaman berkuda profesional di Banyuwangi – pantai, hutan, dan pelajaran berkuda.',
    type: 'website',
  },
};

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <About />
        <Services />
        <Trips />
        <Testimonials />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
