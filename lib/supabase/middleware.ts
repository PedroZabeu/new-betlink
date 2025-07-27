import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { hasEnvVars } from "../utils";
import { logger } from "../utils/logger";
import type { UserRole } from "../auth/types";

export async function updateSession(request: NextRequest) {
  // Log middleware execution apenas em desenvolvimento
  logger.debug('Middleware executando', {
    path: request.nextUrl.pathname,
    method: request.method,
    ip: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown',
    userAgent: request.headers.get('user-agent') || 'unknown'
  });
  
  let supabaseResponse = NextResponse.next({
    request,
  });

  // If the env vars are not set, skip middleware check. You can remove this
  // once you setup the project.
  if (!hasEnvVars) {
    logger.warn('Variáveis de ambiente do Supabase não encontradas, pulando middleware de autenticação');
    return supabaseResponse;
  }

  // With Fluid compute, don't put this client in a global environment
  // variable. Always create a new one on each request.
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value),
          );
          supabaseResponse = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options),
          );
        },
      },
    },
  );

  // Do not run code between createServerClient and
  // supabase.auth.getClaims(). A simple mistake could make it very hard to debug
  // issues with users being randomly logged out.

  // IMPORTANT: If you remove getClaims() and you use server-side rendering
  // with the Supabase client, your users may be randomly logged out.
  const { data } = await supabase.auth.getClaims();
  const user = data?.claims;

  const pathname = request.nextUrl.pathname;

  // Public routes that don't require authentication
  const publicRoutes = [
    "/",
    "/auth/login",
    "/auth/sign-up",
    "/auth/forgot-password",
    "/auth/update-password",
    "/auth/sign-up-success",
    "/auth/error",
    "/auth/confirm",
    "/error",
    "/access-denied"
  ];

  const isPublicRoute = publicRoutes.some(route => pathname.startsWith(route));

  // If no user and trying to access protected route, redirect to login
  if (!user && !isPublicRoute) {
    const url = request.nextUrl.clone();
    url.pathname = "/auth/login";
    return NextResponse.redirect(url);
  }

  // If user is authenticated, check role-based access
  if (user) {
    // Get user profile with role
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.sub)
      .single();

    if (profile) {
      const userRole = profile.role as UserRole;

      // Check role-based access for protected routes
      if (pathname.startsWith('/master') && userRole !== 'master') {
        logger.warn('Tentativa de acesso não autorizado à área master', {
          userId: user.sub,
          userRole,
          attemptedPath: pathname,
          ip: request.headers.get('x-forwarded-for') || 'unknown'
        });
        const url = request.nextUrl.clone();
        url.pathname = "/access-denied";
        return NextResponse.redirect(url);
      }

      if (pathname.startsWith('/admin') && userRole !== 'master' && userRole !== 'admin') {
        logger.warn('Tentativa de acesso não autorizado à área admin', {
          userId: user.sub,
          userRole,
          attemptedPath: pathname,
          ip: request.headers.get('x-forwarded-for') || 'unknown'
        });
        const url = request.nextUrl.clone();
        url.pathname = "/access-denied";
        return NextResponse.redirect(url);
      }

      if (pathname.startsWith('/tipster') && userRole === 'cliente') {
        logger.warn('Tentativa de acesso não autorizado à área tipster', {
          userId: user.sub,
          userRole,
          attemptedPath: pathname,
          ip: request.headers.get('x-forwarded-for') || 'unknown'
        });
        const url = request.nextUrl.clone();
        url.pathname = "/access-denied";
        return NextResponse.redirect(url);
      }

      // Check access to client area - only cliente, admin and master allowed
      if (pathname.startsWith('/cliente') && userRole === 'tipster') {
        logger.warn('Tentativa de acesso não autorizado à área cliente', {
          userId: user.sub,
          userRole,
          attemptedPath: pathname,
          ip: request.headers.get('x-forwarded-for') || 'unknown'
        });
        const url = request.nextUrl.clone();
        url.pathname = "/access-denied";
        return NextResponse.redirect(url);
      }
    }
  }

  // IMPORTANT: You *must* return the supabaseResponse object as it is.
  // If you're creating a new response object with NextResponse.next() make sure to:
  // 1. Pass the request in it, like so:
  //    const myNewResponse = NextResponse.next({ request })
  // 2. Copy over the cookies, like so:
  //    myNewResponse.cookies.setAll(supabaseResponse.cookies.getAll())
  // 3. Change the myNewResponse object to fit your needs, but avoid changing
  //    the cookies!
  // 4. Finally:
  //    return myNewResponse
  // If this is not done, you may be causing the browser and server to go out
  // of sync and terminate the user's session prematurely!

  return supabaseResponse;
}
