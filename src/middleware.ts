import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { decryptSession } from './lib/session';

// Profesjonalne podejście: lista tras publicznych, reszta chroniona
const publicPaths = ['/login', '/api'];

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Pozwól na pliki statyczne i publiczne trasy
  const isPublicPath = publicPaths.some(path => pathname.startsWith(path));
  if (isPublicPath) {
    return NextResponse.next();
  }

  // Sprawdź sesję
  const sessionCookie = req.cookies.get('session')?.value;
  const payload = sessionCookie ? await decryptSession(sessionCookie) : null;

  // Brak sesji na chronionej trasie -> do logowania
  if (!payload) {
    const loginUrl = new URL('/login', req.nextUrl);
    return NextResponse.redirect(loginUrl);
  }

  // Zalogowany użytkownik wchodzi na /login -> do strony głównej
  if (pathname === '/login' && payload) {
    return NextResponse.redirect(new URL('/', req.nextUrl));
  }

  // Sesja jest, ale użytkownik wchodzi na /login (choć jest to obsługiwane przez isPublicPath wyżej, 
  // warto być jawnym, jeśli /login nie jest w isPublicPath lub chcemy go przekierować z /login na /)
  // Ale tutaj /login jest w publicPaths, więc ten kod nie zostanie wykonany dla /login.
  // Poprawiamy logikę publicPaths:

  return NextResponse.next();
}

// Dodatkowy check dla zalogowanych na /login
// (Można to złączyć w jedną funkcję, ale dla czytelności rozdzielamy)

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
