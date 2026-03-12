import { NextResponse, type NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // For now, just allow all requests through
  // Session management is handled by the Supabase client
  return NextResponse.next()
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
