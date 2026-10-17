'use client';

import { useEffect } from 'react';

export default function PWARegistration() {
  useEffect(() => {
    if (!('serviceWorker' in navigator)) return;
    const localPreview = ['localhost', '127.0.0.1'].includes(window.location.hostname);
    if (process.env.NODE_ENV !== 'production' && !localPreview) return;

    let active = true;
    void navigator.serviceWorker.register('/sw.js', { scope: '/', updateViaCache: 'none' }).then((registration) => {
      if (!active) return;
      window.dispatchEvent(new CustomEvent('rider-pwa-status', { detail: { registered: true, offlineReady: Boolean(registration.active) } }));
      if (registration.waiting) window.dispatchEvent(new CustomEvent('rider-pwa-status', { detail: { registered: true, updateAvailable: true } }));
      registration.addEventListener('updatefound', () => {
        registration.installing?.addEventListener('statechange', () => {
          if (registration.installing?.state === 'installed') {
            window.dispatchEvent(new CustomEvent('rider-pwa-status', { detail: { registered: true, offlineReady: true, updateAvailable: Boolean(navigator.serviceWorker.controller) } }));
          }
        });
      });
    }).catch(() => {
      window.dispatchEvent(new CustomEvent('rider-pwa-status', { detail: { registered: false, offlineReady: false } }));
    });
    return () => { active = false; };
  }, []);

  return null;
}
