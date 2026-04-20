import { NextRequest, NextResponse } from 'next/server';

const TOKEN_COOKIE = 'erp_token';
const PUBLIC_PATHS = ['/login'];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isPublic = PUBLIC_PATHS.some((p) => pathname === p || pathname.startsWith(`${p}/`));
  if (isPublic) return NextResponse.next();

  const token = request.cookies.get(TOKEN_COOKIE)?.value;
  if (!token) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('from', pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next|favicon.ico|public).*)'],
};
