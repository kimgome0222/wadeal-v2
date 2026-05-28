import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

import { isAdminUserId } from "@/lib/auth/admin-access";
import { hasPrototypeSessionFromRequest } from "@/lib/auth/prototype-session";
import { PROTOTYPE_USER_ID } from "@/lib/database/types";
import { isPrototypeAuthEnabled } from "@/lib/env/runtime";
import { getSupabaseEnv } from "@/lib/supabase/config";

function isProtectedPath(pathname: string): boolean {
  return (
    pathname.startsWith("/checkout/") ||
    pathname.startsWith("/mypage/") ||
    pathname.startsWith("/support") ||
    pathname.startsWith("/admin/") ||
    pathname.startsWith("/seller") ||
    pathname === "/notifications" ||
    pathname === "/join-cart"
  );
}

function isAdminPath(pathname: string): boolean {
  return pathname.startsWith("/admin/");
}

function redirectUnauthorized(request: NextRequest, nextPath: string) {
  const unauthorizedUrl = request.nextUrl.clone();
  unauthorizedUrl.pathname = "/unauthorized";
  unauthorizedUrl.search = "";
  unauthorizedUrl.searchParams.set("next", nextPath);
  return NextResponse.redirect(unauthorizedUrl);
}

function withPathnameHeader(request: NextRequest, response: NextResponse) {
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-pathname", request.nextUrl.pathname);
  const nextResponse = NextResponse.next({
    request: { headers: requestHeaders },
  });

  response.cookies.getAll().forEach((cookie) => {
    nextResponse.cookies.set(cookie);
  });

  return nextResponse;
}

function isAuthenticated(
  user: { id: string } | null,
  request: NextRequest,
): boolean {
  if (user) {
    return true;
  }

  if (isPrototypeAuthEnabled()) {
    return hasPrototypeSessionFromRequest(request.cookies);
  }

  return false;
}

export async function middleware(request: NextRequest) {
  const env = getSupabaseEnv();
  const pathname = request.nextUrl.pathname;

  if (!env) {
    if (isProtectedPath(pathname) && !isAuthenticated(null, request)) {
      const loginUrl = request.nextUrl.clone();
      loginUrl.pathname = "/login";
      loginUrl.search = "";
      loginUrl.searchParams.set("next", pathname);
      return NextResponse.redirect(loginUrl);
    }

    if (isAdminPath(pathname)) {
      let adminUserId: string | null = null;
      if (
        isPrototypeAuthEnabled() &&
        hasPrototypeSessionFromRequest(request.cookies)
      ) {
        adminUserId = PROTOTYPE_USER_ID;
      }

      const isAdmin = await isAdminUserId(null, adminUserId);
      if (!isAdmin) {
        return redirectUnauthorized(request, pathname);
      }
    }

    const response = NextResponse.next({ request });
    return withPathnameHeader(request, response);
  }

  let response = NextResponse.next({ request });

  const supabase = createServerClient(env.url, env.publishableKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => {
          request.cookies.set(name, value);
        });
        response = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) => {
          response.cookies.set(name, value, options);
        });
      },
    },
  });

  await supabase.auth.getSession();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (isProtectedPath(pathname) && !isAuthenticated(user, request)) {
    const loginUrl = request.nextUrl.clone();
    loginUrl.pathname = "/login";
    loginUrl.search = "";
    loginUrl.searchParams.set("next", pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (isAdminPath(pathname) && isAuthenticated(user, request)) {
    let adminUserId = user?.id ?? null;
    if (
      !adminUserId &&
      isPrototypeAuthEnabled() &&
      hasPrototypeSessionFromRequest(request.cookies)
    ) {
      adminUserId = PROTOTYPE_USER_ID;
    }

    const isAdmin = await isAdminUserId(supabase, adminUserId);
    if (!isAdmin) {
      return redirectUnauthorized(request, pathname);
    }
  }

  return withPathnameHeader(request, response);
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
