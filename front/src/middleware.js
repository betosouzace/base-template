import { NextResponse } from 'next/server'

// Rotas que não precisam de autenticação
const publicRoutes = ['/login', '/register', '/forgot-password']
const protectedRoutes = ['/dashboard', '/home', '/profile'] // Adicione todas as rotas protegidas aqui

// Middleware que verifica se a rota atual precisa de autenticação
export async function middleware(request) {
  const { pathname } = request.nextUrl;
  
  // Verifica se é uma rota pública ou protegida
  const isPublicRoute = publicRoutes.some(route => pathname.startsWith(route));
  const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route));

  // Se não for nem pública nem protegida, permite o acesso
  if (!isPublicRoute && !isProtectedRoute) {
    return NextResponse.next();
  }

  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/user`, {
      credentials: 'include',
      headers: {
        'Accept': 'application/json',
        'X-Requested-With': 'XMLHttpRequest'
      }
    });

    const isAuthenticated = response.ok;

    // Se estiver autenticado e tentar acessar rota pública
    if (isAuthenticated && isPublicRoute) {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }

    // Se não estiver autenticado e tentar acessar rota protegida
    if (!isAuthenticated && isProtectedRoute) {
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(loginUrl);
    }

    return NextResponse.next();
  } catch (error) {
    // Em caso de erro na verificação de autenticação
    if (isProtectedRoute) {
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(loginUrl);
    }
    return NextResponse.next();
  }
}

// Configuração de quais caminhos o middleware deve atuar
export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * 1. /api routes
     * 2. /_next (Next.js internals)
     * 3. /fonts (inside /public)
     * 4. /examples (inside /public)
     * 5. all root files inside /public (e.g. /favicon.ico)
     */
    '/((?!api|_next|fonts|examples|[\\w-]+\\.\\w+).*)',
  ],
} 