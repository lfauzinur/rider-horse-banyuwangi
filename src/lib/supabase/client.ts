import { createBrowserClient } from '@supabase/ssr';

function createNewClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}

let browserClient: ReturnType<typeof createNewClient> | undefined;

export function createClient() {
  if (browserClient) return browserClient;
  browserClient = createNewClient();
  return browserClient;
}
