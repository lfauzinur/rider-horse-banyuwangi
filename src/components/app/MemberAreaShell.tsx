'use client';

import type { ReactNode } from 'react';
import DashboardShell from '@/components/app/DashboardShell';
import { useAuth } from '@/lib/use-auth';

export default function MemberAreaShell({ children }: { children: ReactNode }) {
  const { profile, loading } = useAuth('member');

  if (loading) return <div className="min-h-screen animate-pulse bg-[#f2f0e8]" />;

  return (
    <DashboardShell
      role="member"
      userName={profile?.full_name || 'Demo Rider'}
      userEmail={profile?.email || 'preview@riderhorse.id'}
      canAccessAdmin={profile?.role === 'admin'}
    >
      {children}
    </DashboardShell>
  );
}
