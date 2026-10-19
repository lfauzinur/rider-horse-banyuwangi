'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import type { User as SupabaseUser } from '@supabase/supabase-js';
import { createClient } from '@/lib/supabase/client';
import { isSupabaseConfigured } from '@/lib/supabase/config';
import { previewAccounts, PREVIEW_AUTH_STORAGE, type PreviewRole } from '@/lib/preview-auth';

export interface MemberProfile {
  id: string;
  email: string;
  full_name: string;
  phone_number: string | null;
  role: 'member' | 'admin';
  riding_level: 'Beginner' | 'Intermediate' | 'Advanced';
}

export function useAuth(requiredRole?: 'member' | 'admin') {
  const router = useRouter();
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [profile, setProfile] = useState<MemberProfile | null>(null);
  const configured = isSupabaseConfigured();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!configured) {
      const timeout = window.setTimeout(() => {
        const role = window.localStorage.getItem(PREVIEW_AUTH_STORAGE) as PreviewRole | null;
        if (!role || !previewAccounts[role]) {
          router.replace('/login');
          setLoading(false);
          return;
        }
        if (requiredRole === 'admin' && role !== 'admin') {
          router.replace('/dashboard');
          setLoading(false);
          return;
        }
        if (requiredRole === 'member' && role === 'admin') {
          router.replace('/admin');
          setLoading(false);
          return;
        }
        const account = previewAccounts[role];
        setProfile({
          id: `preview-${role}`,
          email: account.email,
          full_name: account.fullName,
          phone_number: null,
          role,
          riding_level: role === 'member' ? 'Beginner' : 'Advanced',
        });
        setLoading(false);
      }, 0);
      return () => window.clearTimeout(timeout);
    }

    const supabase = createClient();
    let active = true;

    async function loadUser() {
      // The server proxy already verifies protected routes. Reading the browser
      // session here avoids a second network race during client navigation.
      const { data } = await supabase.auth.getSession();
      if (!active) return;
      const currentUser = data.session?.user;
      if (!currentUser) {
        router.replace('/login');
        setLoading(false);
        return;
      }

      const { data: profileData } = await supabase.from('profiles').select('*').eq('id', currentUser.id).maybeSingle();
      if (!active) return;
      const resolvedProfile = (profileData || {
        id: currentUser.id,
        email: currentUser.email || '',
        full_name: currentUser.user_metadata?.full_name || currentUser.email?.split('@')[0] || 'Rider',
        phone_number: null,
        role: 'member',
        riding_level: 'Beginner',
      }) as MemberProfile;

      if (requiredRole === 'admin' && resolvedProfile.role !== 'admin') {
        router.replace('/dashboard');
        setLoading(false);
        return;
      }
      if (requiredRole === 'member' && resolvedProfile.role === 'admin') {
        router.replace('/admin');
        setLoading(false);
        return;
      }

      setUser(currentUser);
      setProfile(resolvedProfile);
      setLoading(false);
    }

    void loadUser();
    return () => {
      active = false;
    };
  }, [configured, requiredRole, router]);

  return { configured, user, profile, loading };
}
