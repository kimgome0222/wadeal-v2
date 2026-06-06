export function isSellerStatusPath(pathname: string): boolean {
  return (
    pathname === "/seller/pending" ||
    pathname === "/seller/rejected" ||
    pathname === "/seller/suspended"
  );
}

export function isSellerGateExemptPath(pathname: string): boolean {
  return (
    pathname === "/seller" ||
    pathname === "/seller/login" ||
    pathname === "/seller/apply" ||
    pathname === "/seller/register" ||
    pathname.startsWith("/seller/settings") ||
    isSellerStatusPath(pathname)
  );
}
