import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';
import { PREVIEW_AUTH_COOKIE } from '@/lib/preview-auth';

export async function updateSession(request: NextRequest) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  const pathname = request.nextUrl.pathname;
  const isAdminRoute = pathname.startsWith('/admin');
  const isMemberRoute = pathname.startsWith('/dashboard') || pathname.startsWith('/book');

  // Protect local preview dashboards with the demo-role cookie.
  if (!supabaseUrl || !supabaseAnonKey) {
    const previewRole = request.cookies.get(PREVIEW_AUTH_COOKIE)?.value;
    if ((isAdminRoute || isMemberRoute) && !previewRole) {
      const url = request.nextUrl.clone();
      url.pathname = '/login';
      url.searchParams.set('next', `${pathname}${request.nextUrl.search}`);
      return NextResponse.redirect(url);
    }
    if (isAdminRoute && previewRole !== 'admin') {
      const url = request.nextUrl.clone();
      url.pathname = '/dashboard';
      return NextResponse.redirect(url);
    }
    return NextResponse.next({ request });
  }

  let supabaseResponse = NextResponse.next({
    request,
  });

  const supabase = createServerClient(
    supabaseUrl,
    supabaseAnonKey,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // Refresh the session
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Protect dashboard routes
  if (
    !user &&
    (isMemberRoute || isAdminRoute)
  ) {
    const url = request.nextUrl.clone();
    url.pathname = '/login';
    url.searchParams.set('next', `${pathname}${request.nextUrl.search}`);
    return NextResponse.redirect(url);
  }

  return supabaseResponse;
}
