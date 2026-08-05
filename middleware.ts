import { NextResponse, type NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Read Supabase auth token cookie (sb-access-token, sb-refresh-token, or supabase-auth-token)
  const authCookie =
    request.cookies.get('sb-access-token')?.value ||
    request.cookies.get('supabase-auth-token')?.value ||
    request.cookies.getAll().find((c) => c.name.includes('auth-token'))?.value;

  const protectedRoutes = ['/dashboard', '/documents', '/chat', '/reports', '/settings', '/analysis'];
  const authRoutes = ['/login', '/register', '/forgot-password', '/reset-password'];

  const isProtectedRoute = protectedRoutes.some((route) => pathname.startsWith(route));
  const isAuthRoute = authRoutes.some((route) => pathname.startsWith(route));

  // 1. If trying to access protected route without auth session cookie
  if (isProtectedRoute && !authCookie) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // 2. If authenticated user attempts to open login/register pages, redirect to dashboard
  if (isAuthRoute && authCookie) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/documents/:path*',
    '/chat/:path*',
    '/reports/:path*',
    '/settings/:path*',
    '/analysis/:path*',
    '/login',
    '/register',
    '/forgot-password',
    '/reset-password',
  ],
};
