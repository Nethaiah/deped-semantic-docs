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

  const isAuthRoute = request.nextUrl.pathname.startsWith('/login') || 
                      request.nextUrl.pathname.startsWith('/register') || 
                      request.nextUrl.pathname.startsWith('/forgot-password');

  const isProtectedRoute = request.nextUrl.pathname.startsWith('/dashboard') || 
                           request.nextUrl.pathname.startsWith('/search') ||
                           request.nextUrl.pathname.startsWith('/view') ||
                           request.nextUrl.pathname.startsWith('/bookmarks') ||
                           request.nextUrl.pathname.startsWith('/settings') ||
                           request.nextUrl.pathname.startsWith('/categories') ||
                           request.nextUrl.pathname.startsWith('/user-management') || 
                           request.nextUrl.pathname.startsWith('/upload') ||
                           request.nextUrl.pathname.startsWith('/archive') || 
                           request.nextUrl.pathname.startsWith('/review');
  const isAdminRoute = request.nextUrl.pathname.startsWith('/user-management') || 
                       request.nextUrl.pathname.startsWith('/upload') ||
                       request.nextUrl.pathname.startsWith('/archive') || 
                       request.nextUrl.pathname.startsWith('/review');

  // Authenticated user trying to visit auth pages → instant redirect to dashboard
  // But NOT reset-password — that route needs to be accessible after recovery code exchange.
  // The reset-password page component handles its own session validation.
  if (user && isAuthRoute) {
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
