import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getToken } from 'next-auth/jwt'

export async function middleware(request: NextRequest) {
  // Vérifier si l'utilisateur est authentifié
  const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET })

  // Si l'utilisateur n'est pas authentifié, laisser passer
  if (!token) {
    return NextResponse.next()
  }

  // Vérifier le statut du compte seulement pour les routes protégées
  if (request.nextUrl.pathname.startsWith('/dashboard') || 
      request.nextUrl.pathname.startsWith('/api/user')) {
    
    try {
      // Appeler l'API pour vérifier le statut du compte
      const response = await fetch(`${request.nextUrl.origin}/api/user/delete/status`, {
        headers: {
          'Cookie': request.headers.get('cookie') || '',
        },
      })

      if (response.ok) {
        const data = await response.json()
        
        // Si le compte est en attente de suppression, rediriger vers une page d'information
        if (data.isPendingDeletion) {
          const url = request.nextUrl.clone()
          url.pathname = '/account-pending-deletion'
          return NextResponse.redirect(url)
        }
      }
    } catch (error) {
      // En cas d'erreur, laisser passer pour éviter de bloquer l'utilisateur
      console.error('Error checking account status in middleware:', error)
    }
  }

  return NextResponse.next()
}

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
} 