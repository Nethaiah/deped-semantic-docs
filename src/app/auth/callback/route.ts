import { NextResponse } from 'next/server'
// The client you created from the Server-Side Auth instructions
import { createClient } from '@/lib/supabase/server'
import { syncGoogleUser } from '@/app/api/auth/google/route'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const type = searchParams.get('type')
  
  // if "next" is in param, use it as the redirect URL
  let next = searchParams.get('next') ?? '/'
  if (!next.startsWith('/')) {
    // if "next" is not a relative URL, use the default
    next = '/'
  }

  if (code) {
    const supabase = await createClient()
    const { data, error } = await supabase.auth.exchangeCodeForSession(code)
    if (!error && data.session) {
      const forwardedHost = request.headers.get('x-forwarded-host') // original origin before load balancer
      const isLocalEnv = process.env.NODE_ENV === 'development'
      
      // Check if this is an email verification
      if (type === 'signup' || type === 'recovery') {
        // For email verification, redirect to verify-email page
        if (isLocalEnv) {
          return NextResponse.redirect(`${origin}/verify-email`)
        } else if (forwardedHost) {
          return NextResponse.redirect(`https://${forwardedHost}/verify-email`)
        } else {
          return NextResponse.redirect(`${origin}/verify-email`)
        }
      } else {
        // For Google OAuth, sync user to database and redirect to documents
        if (data.user) {
          await syncGoogleUser(data.user);
        }
        
        if (isLocalEnv) {
          return NextResponse.redirect(`${origin}/dashboard`)
        } else if (forwardedHost) {
          return NextResponse.redirect(`https://${forwardedHost}/dashboard`)
        } else {
          return NextResponse.redirect(`${origin}/dashboard`)
        }
      }
    }
  }

  // return the user to an error page with instructions
  return NextResponse.redirect(`${origin}/auth/auth-code-error`)
}