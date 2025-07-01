import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'

import type { NextRequest } from 'next/server'

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()
  const supabase = createMiddlewareClient({ req, res })

  const { data: { user } } = await supabase.auth.getUser()

  // Check if the user is an admin (you'll need to implement your own logic for this)
  // For example, you might have a 'roles' table or a 'is_admin' column in your profiles table
  const isAdmin = user && user.email === 'admin@example.com'; // Placeholder logic

  if (req.nextUrl.pathname.startsWith('/admin') && !isAdmin) {
    // Redirect unauthenticated or non-admin users away from admin routes
    return NextResponse.redirect(new URL('/signin', req.url))
  }

  return res
}

export const config = {
  matcher: ['/admin/:path*'],
}
