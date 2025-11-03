import { type EmailOtpType } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { syncGoogleUser } from '@/app/api/auth/google/route'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const code = searchParams.get('code')
  const token_hash = searchParams.get('token_hash')
  const type = searchParams.get('type') as EmailOtpType | null
  const next = searchParams.get('next')
  
  const supabase = await createClient()
  const forwardedHost = request.headers.get('x-forwarded-host')
  const isLocalEnv = process.env.NODE_ENV === 'development'
  
  // Determine redirect origin
  let redirectOrigin = request.nextUrl.origin
  if (!isLocalEnv && forwardedHost) {
    redirectOrigin = `https://${forwardedHost}`
  }

  // Handle PKCE flow (code parameter)
  if (code) {
    const { data, error } = await supabase.auth.exchangeCodeForSession(code)
    
    if (!error && data.session) {
      // Handle password recovery
      if (type === 'recovery') {
        const redirectPath = next ?? '/reset-password'
        return NextResponse.redirect(`${redirectOrigin}${redirectPath}`)
      }
      
      // Handle email verification (signup)
      if (type === 'signup') {
        return NextResponse.redirect(`${redirectOrigin}/verify-email`)
      }
      
      // Handle OAuth (Google, etc.) - no type or other types
      if (data.user) {
        await syncGoogleUser(data.user)
      }
      
      const redirectPath = next ?? '/dashboard'
      return NextResponse.redirect(`${redirectOrigin}${redirectPath}`)
    }
    
    // If code exchange failed, redirect to error page
    return NextResponse.redirect(`${redirectOrigin}/auth/auth-code-error`)
  }

  // Handle magic link flow (token_hash parameter)
  if (token_hash && type) {
    const { error } = await supabase.auth.verifyOtp({ 
      type, 
      token_hash 
    })

    if (!error) {
      // Determine redirect path based on type
      let redirectPath = '/dashboard'
      if (type === 'recovery') {
        redirectPath = next ?? '/reset-password'
      } else if (type === 'signup') {
        redirectPath = '/verify-email'
      } else if (next) {
        redirectPath = next
      }
      
      return NextResponse.redirect(`${redirectOrigin}${redirectPath}`)
    }
  }

  // If verification failed or no valid parameters, redirect to error page
  return NextResponse.redirect(`${redirectOrigin}/auth/auth-code-error`)
}