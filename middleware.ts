import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

import { isAdminUserId } from "@/lib/auth/admin-access";
import { hasPrototypeSessionFromRequest } from "@/lib/auth/prototype-session";
import { PROTOTYPE_USER_ID } from "@/lib/database/types";
import { isPrototypeAuthEnabled } from "@/lib/env/runtime";
import { getSupabaseEnv } from "@/lib/supabase/config";

function isLoginPath(pathname: string): boolean {
  return (
    pathname === "/login" ||
    pathname === "/seller/login" ||
    pathname === "/admin/login"
  );
}

function isAdminArea(pathname: string): boolean {
  return pathname === "/admin" || pathname.startsWith("/admin/");
}

function isSellerArea(pathname: string): boolean {
  return pathname === "/seller" || pathname.startsWith("/seller/");
}

function isProtectedPath(pathname: string): boolean {
  if (isLoginPath(pathname)) {
    return false;
  }

  return (
    pathname.startsWith("/checkout/") ||
    pathname === "/mypage" ||
    pathname.startsWith("/mypage/") ||
    pathname.startsWith("/support") ||
    isAdminArea(pathname) ||
    isSellerArea(pathname) ||
    pathname === "/notifications" ||
    pathname === "/join-cart"
  );
}

function isAdminPath(pathname: string): boolean {
  return isAdminArea(pathname) && !isLoginPath(pathname);
}

function getLoginPathForArea(pathname: string): string {
  if (isAdminArea(pathname)) {
    return "/admin/login";
  }

  if (isSellerArea(pathname)) {
    return "/seller/login";
  }

  return "/login";
}

function redirectToLogin(request: NextRequest, pathname: string) {
  const loginUrl = request.nextUrl.clone();
  loginUrl.pathname = getLoginPathForArea(pathname);
  loginUrl.search = "";
  loginUrl.searchParams.set("redirect", pathname);
  loginUrl.searchParams.set("next", pathname);
  return NextResponse.redirect(loginUrl);
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
      return redirectToLogin(request, pathname);
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
    return redirectToLogin(request, pathname);
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
