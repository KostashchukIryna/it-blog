import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('token')?.value;
  const role = request.cookies.get('user_role')?.value;
  const isLoginPage = request.nextUrl.pathname === '/admin/login';

  // Захист всіх маршрутів /admin (окрім логіну)
  if (request.nextUrl.pathname.startsWith('/admin') && !isLoginPage) {
    if (!token || role !== 'admin') {
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }
  }

  // Якщо адмін вже авторизований, не пускаємо його знову на сторінку логіну
  if (isLoginPage && token && role === 'admin') {
    return NextResponse.redirect(new URL('/admin/articles', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};