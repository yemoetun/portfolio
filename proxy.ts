import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getToken } from 'next-auth/jwt'

export async function proxy(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET })
  const isAdminRoute = req.nextUrl.pathname.startsWith('/admin')
  const isLoginPage  = req.nextUrl.pathname === '/admin/login'
  const isAuthed     = !!token

  if (isAdminRoute && !isLoginPage && !isAuthed) {
    return NextResponse.redirect(new URL('/admin/login', req.url))
  }

  if (isLoginPage && isAuthed) {
    return NextResponse.redirect(new URL('/admin', req.url))
  }
}

export const config = {
  matcher: ['/admin/:path*'],
}
