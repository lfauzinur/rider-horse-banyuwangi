import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Rider Horse Banyuwangi',
    short_name: 'Rider Horse',
    description: 'Book and manage your Rider Horse Banyuwangi riding journeys.',
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
      { name: 'Browse Trips', short_name: 'Trips', url: '/dashboard/trips', icons: [{ src: '/app-icon.svg', sizes: 'any', type: 'image/svg+xml' }] },
      { name: 'My Bookings', short_name: 'Bookings', url: '/dashboard/bookings', icons: [{ src: '/app-icon.svg', sizes: 'any', type: 'image/svg+xml' }] },
      { name: 'Read Articles', short_name: 'Articles', url: '/dashboard/articles', icons: [{ src: '/app-icon.svg', sizes: 'any', type: 'image/svg+xml' }] },
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
