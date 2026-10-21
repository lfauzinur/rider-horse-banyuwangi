'use client';

import { useEffect, useState } from 'react';
import BeachRiderLoader from '@/components/app/BeachRiderLoader';

const LOADER_SESSION_KEY = 'rider-horse-opening-loader';

export default function GlobalPageLoader() {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    if (window.sessionStorage.getItem(LOADER_SESSION_KEY)) {
      const hideImmediately = window.setTimeout(() => setVisible(false), 0);
      return () => window.clearTimeout(hideImmediately);
    }
    window.sessionStorage.setItem(LOADER_SESSION_KEY, 'shown');
    const timer = window.setTimeout(() => setVisible(false), 1450);
    return () => {
      window.clearTimeout(timer);
    };
  }, []);

  return visible ? <BeachRiderLoader /> : null;
}
