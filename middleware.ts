import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyJwtToken } from '@/lib/auth';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Protect /dashboard routes and /api/ routes EXCEPT /api/auth
  const isDashboardRoute = pathname.startsWith('/dashboard');
  const isApiRoute = pathname.startsWith('/api/') && !pathname.startsWith('/api/auth');

  if (isDashboardRoute || isApiRoute) {
    const token = request.cookies.get('token')?.value;

    if (!token) {
      if (isApiRoute) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }
      return NextResponse.redirect(new URL('/login', request.url));
    }

    const payload = await verifyJwtToken(token);

    if (!payload) {
      if (isApiRoute) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  // If user is already logged in, redirect away from /login
  if (pathname === '/login') {
    const token = request.cookies.get('token')?.value;
    if (token) {
      const payload = await verifyJwtToken(token);
      if (payload) {
        return NextResponse.redirect(new URL('/dashboard', request.url));
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/login', '/api/:path*'],
};
