export type PreviewRole = 'admin' | 'member';

export interface PreviewAccount {
  role: PreviewRole;
  email: string;
  password: string;
  fullName: string;
}

export const PREVIEW_AUTH_COOKIE = 'rider_preview_role';
export const PREVIEW_AUTH_STORAGE = 'rider-horse-preview-role';

export const previewAccounts: Record<PreviewRole, PreviewAccount> = {
  admin: {
    role: 'admin',
    email: 'admin@riderhorse.local',
    password: 'AdminRider#2026',
    fullName: 'Admin Rider Horse',
  },
  member: {
    role: 'member',
    email: 'member@riderhorse.local',
    password: 'MemberRider#2026',
    fullName: 'Demo Member',
  },
};

export function findPreviewAccount(email: string, password: string) {
  return Object.values(previewAccounts).find(
    (account) => account.email === email.trim().toLowerCase() && account.password === password
  );
}
