import { type EmailOtpType } from '@supabase/supabase-js'
import { type NextRequest } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const token_hash = searchParams.get('token_hash')
  const code = searchParams.get('code') // Explicitly supporting OAuth code flow natively too
  const type = searchParams.get('type') as EmailOtpType | null
  const next = searchParams.get('next') ?? '/dashboard'

  if (token_hash && type) {
    const supabase = await createClient()

    const { error } = await supabase.auth.verifyOtp({
      type,
      token_hash,
    })
    
    if (!error) {
      if (type === 'signup') {
        // Direct new signups to the close-tab success screen
        redirect('/email-verified?verified=true')
      } else {
        // Redirect user to specified redirect URL (e.g. password recovery)
        redirect(next)
      }
    }
  } else if (code) {
    // Handling generic PKCE flows, like OAuth plugins (ex: Google single sign-on)
    // Supabase often sends email confirmations through this generic code path instead of OTP
    const supabase = await createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    
    if (!error) {
      if (type === 'signup') {
        redirect('/email-verified?verified=true')
      } else {
        redirect(next)
      }
    }
  }

  // Redirect to the login page passing a strict error parameter. 
  // Next.js will catch this in the login page and securely THROW an error 
  // so the native error.tsx layout organically breaks the UI properly.
  redirect('/login?auth_error=The%20authentication%20link%20you%20clicked%20is%20invalid%20or%20expired.')
}
