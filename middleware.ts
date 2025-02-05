import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  // 检查是否需要鉴权
  const authPassword = process.env.AUTH_PASSWORD;
  if (!authPassword) {
    return NextResponse.next();
  }

  // 排除不需要鉴权的路径
  if (
    request.nextUrl.pathname.startsWith('/api/auth') ||
    request.nextUrl.pathname.startsWith('/_next') ||
    request.nextUrl.pathname.startsWith('/favicon.ico')
  ) {
    return NextResponse.next();
  }

  // 检查认证状态
  const isAuthenticated = request.cookies.get('authenticated');
  if (!isAuthenticated && request.nextUrl.pathname !== '/auth') {
    return NextResponse.redirect(new URL('/auth', request.url));
  }

  // 如果已认证且访问 /auth 页面，重定向到首页
  if (isAuthenticated && request.nextUrl.pathname === '/auth') {
    return NextResponse.redirect(new URL('/', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api/auth|_next/static|_next/image|favicon.ico).*)']
}; 