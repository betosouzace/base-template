import { NextResponse } from 'next/server'

// Rotas que não precisam de autenticação
const publicRoutes = ['/login', '/register', '/forgot-password']

// Middleware que verifica se a rota atual precisa de autenticação
export function middleware(request) {
  // Verifica se é uma rota pública
  if (publicRoutes.some(route => request.nextUrl.pathname.startsWith(route))) {
    return NextResponse.next()
  }

  // Verifica se existe um token de autenticação
  const authToken = request.cookies.get('auth_token')
  
  // Se não existir token e não for rota pública, redireciona para login
  if (!authToken && !request.nextUrl.pathname.startsWith('/_next')) {
    const loginUrl = new URL('/login', request.url)
    loginUrl.searchParams.set('redirect', request.nextUrl.pathname)
    return NextResponse.redirect(loginUrl)
  }

  return NextResponse.next()
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