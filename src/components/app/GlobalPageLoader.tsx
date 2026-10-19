'use client';

import { useEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';
import BeachRiderLoader from '@/components/app/BeachRiderLoader';

export default function GlobalPageLoader() {
  const pathname = usePathname();
  const [visible, setVisible] = useState(true);
  const firstRender = useRef(true);
  const safetyTimer = useRef<number | undefined>(undefined);

  useEffect(() => {
    window.clearTimeout(safetyTimer.current);
    const delay = firstRender.current ? 1050 : 520;
    firstRender.current = false;
    const timer = window.setTimeout(() => setVisible(false), delay);
    return () => window.clearTimeout(timer);
  }, [pathname]);

  useEffect(() => {
    function showForInternalNavigation(event: MouseEvent) {
      if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      const anchor = (event.target as Element | null)?.closest('a[href]') as HTMLAnchorElement | null;
      if (!anchor || anchor.target === '_blank' || anchor.hasAttribute('download')) return;
      const destination = new URL(anchor.href, window.location.href);
      if (destination.origin !== window.location.origin || destination.href === window.location.href || destination.hash && destination.pathname === window.location.pathname) return;
      setVisible(true);
      window.clearTimeout(safetyTimer.current);
      safetyTimer.current = window.setTimeout(() => setVisible(false), 1800);
    }

    document.addEventListener('click', showForInternalNavigation, true);
    return () => {
      document.removeEventListener('click', showForInternalNavigation, true);
      window.clearTimeout(safetyTimer.current);
    };
  }, []);

  return <BeachRiderLoader visible={visible} />;
}
