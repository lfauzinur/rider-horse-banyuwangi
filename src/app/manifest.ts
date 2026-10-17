import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Rider Horse Banyuwangi',
    short_name: 'Rider Horse',
    description: 'Booking dan kelola perjalanan berkuda Rider Horse Banyuwangi.',
    start_url: '/dashboard',
    display: 'standalone',
    background_color: '#f5f2e9',
    theme_color: '#101f1a',
    orientation: 'portrait-primary',
    scope: '/',
    id: '/dashboard',
    categories: ['travel', 'lifestyle'],
    shortcuts: [
      { name: 'Dashboard', short_name: 'Dashboard', url: '/dashboard', icons: [{ src: '/app-icon.svg', sizes: 'any', type: 'image/svg+xml' }] },
      { name: 'Cari Trip', short_name: 'Trip', url: '/dashboard/trips', icons: [{ src: '/app-icon.svg', sizes: 'any', type: 'image/svg+xml' }] },
      { name: 'Booking Saya', short_name: 'Booking', url: '/dashboard/bookings', icons: [{ src: '/app-icon.svg', sizes: 'any', type: 'image/svg+xml' }] },
      { name: 'Baca Artikel', short_name: 'Artikel', url: '/dashboard/articles', icons: [{ src: '/app-icon.svg', sizes: 'any', type: 'image/svg+xml' }] },
    ],
    icons: [
      {
        src: '/app-icon-192.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: '/app-icon-512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: '/app-icon-512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable',
      },
    ],
  };
}
