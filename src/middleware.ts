import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { decryptSession } from './lib/session';

// Trasy, które wymagają logowania
const protectedRoutes = ['/', '/schedules', '/equipment-analytics'];
// Trasy tylko dla gości (np. /login)
const publicRoutes = ['/login'];

export async function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname;
  const isProtectedRoute = protectedRoutes.includes(path) || path === '/';
  const isPublicRoute = publicRoutes.includes(path);

  const session = req.cookies.get('session')?.value;
  const payload = session ? decryptSession(session) : null;

  // 1. Przekierowanie do /login, jeśli brak sesji na chronionej trasie
  if (isProtectedRoute && !payload) {
    return NextResponse.redirect(new URL('/login', req.nextUrl));
  }

  // 2. Przekierowanie do / pulpitu, jeśli sesja aktywna na trasie publicznej
  if (isPublicRoute && payload) {
    return NextResponse.redirect(new URL('/', req.nextUrl));
  }

  return NextResponse.next();
}

// Konfiguracja matcherów, aby middleware nie działał dla plików statycznych itp.
export const config = {
  matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)'],
};
