/** 로그인 redirect URL — area별 일관성 */

export function buyerLoginPath(nextPath?: string): string {
  if (!nextPath) {
    return "/login";
  }
  return `/login?next=${encodeURIComponent(nextPath)}&redirect=${encodeURIComponent(nextPath)}`;
}

export function adminLoginPath(nextPath = "/admin/dashboard"): string {
  return `/admin/login?redirect=${encodeURIComponent(nextPath)}&next=${encodeURIComponent(nextPath)}`;
}

export function sellerLoginPath(nextPath = "/seller/dashboard"): string {
  return `/seller/login?redirect=${encodeURIComponent(nextPath)}&next=${encodeURIComponent(nextPath)}`;
}
