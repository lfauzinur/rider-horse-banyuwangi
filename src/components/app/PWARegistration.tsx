'use client';

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';

export default function PWARegistration() {
  const pathname = usePathname();
  const memberShellWarmed = useRef(false);

  useEffect(() => {
    if (!('serviceWorker' in navigator)) return;
    const localPreview = ['localhost', '127.0.0.1'].includes(window.location.hostname);
    if (process.env.NODE_ENV !== 'production' && !localPreview) return;

    let active = true;
    function warmMemberShell(registration: ServiceWorkerRegistration) {
      if (!pathname.startsWith('/dashboard') || memberShellWarmed.current) return;
      const worker = registration.active || registration.waiting || navigator.serviceWorker.controller;
      if (worker) {
        worker.postMessage({ type: 'CACHE_MEMBER_SHELL' });
        memberShellWarmed.current = true;
      }
    }

    function warmWhenReady() {
      void navigator.serviceWorker.ready.then((registration) => {
        if (active) warmMemberShell(registration);
      });
    }

    function refreshMemberShell() {
      memberShellWarmed.current = false;
      warmWhenReady();
    }

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
      warmMemberShell(registration);
      warmWhenReady();
    }).catch(() => {
      window.dispatchEvent(new CustomEvent('rider-pwa-status', { detail: { registered: false, offlineReady: false } }));
    });

    navigator.serviceWorker.addEventListener('controllerchange', refreshMemberShell);

    function useOfflineDocumentNavigation(event: MouseEvent) {
      if (navigator.onLine || event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      const anchor = (event.target as Element | null)?.closest('a[href]') as HTMLAnchorElement | null;
      if (!anchor || anchor.target === '_blank' || anchor.hasAttribute('download')) return;
      const destination = new URL(anchor.href, window.location.href);
      if (destination.origin !== window.location.origin || !destination.pathname.startsWith('/dashboard')) return;
      event.preventDefault();
      window.location.assign(destination.href);
    }

    document.addEventListener('click', useOfflineDocumentNavigation, true);
    return () => {
      active = false;
      navigator.serviceWorker.removeEventListener('controllerchange', refreshMemberShell);
      document.removeEventListener('click', useOfflineDocumentNavigation, true);
    };
  }, [pathname]);

  return null;
}
