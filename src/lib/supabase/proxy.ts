import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) => supabaseResponse.cookies.set(name, value, options))
        },
      },
    }
  )

  const { data } = await supabase.auth.getUser()
  const user = data?.user

  // Ensure user.amr exists and contains 'recovery'
  const isRecoverySession = (user as any)?.amr?.some((amr: any) => amr.method === 'recovery')

  const isAuthRoute = request.nextUrl.pathname.startsWith('/login') || 
                      request.nextUrl.pathname.startsWith('/register') || 
                      request.nextUrl.pathname.startsWith('/forgot-password');
  const isResetRoute = request.nextUrl.pathname.startsWith('/reset-password');

  const isProtectedRoute = request.nextUrl.pathname.startsWith('/dashboard') || 
                           request.nextUrl.pathname.startsWith('/search') ||
                           request.nextUrl.pathname.startsWith('/view') ||
                           request.nextUrl.pathname.startsWith('/bookmarks') ||
                           request.nextUrl.pathname.startsWith('/settings') ||
                           request.nextUrl.pathname.startsWith('/categories') ||
                           request.nextUrl.pathname.startsWith('/user-management') || 
                           request.nextUrl.pathname.startsWith('/upload');  
  const isAdminRoute = request.nextUrl.pathname.startsWith('/user-management') || 
                       request.nextUrl.pathname.startsWith('/upload');

  // Authenticated user trying to visit auth pages → instant redirect to dashboard
  if (user && isAuthRoute) {
    const url = request.nextUrl.clone()
    url.pathname = '/dashboard'
    return NextResponse.redirect(url)
  }

  // Normal authenticated user trying to visit reset-password → redirect to dashboard
  if (user && isResetRoute && !isRecoverySession) {
    const url = request.nextUrl.clone()
    url.pathname = '/dashboard'
    return NextResponse.redirect(url)
  }

  if (!user && isProtectedRoute) {
    const url = request.nextUrl.clone()
    url.pathname = '/login'
    return NextResponse.redirect(url)
  }

  if (user && isAdminRoute) {
    // Check if the user is an admin
    const { data: userData } = await supabase
      .from("users")
      .select("role")
      .eq("id", user.id)
      .single();

    if (userData?.role !== "admin") {
      // Instead of an actual forbidden page or redirecting to one, the user wants us to 
      // "just use the Not found too (For security)". So we rewrite the URL to a non-existent path.
      const url = request.nextUrl.clone();
      url.pathname = '/404-not-found-dummy-path-to-force-404';
      return NextResponse.rewrite(url);
    }
  }

  return supabaseResponse
}
