import type { AccessContext } from "@/lib/auth/access";

export type RoleNavLink = {
  href: string;
  label: string;
};

export function getRoleNavLinks(context: AccessContext | null): RoleNavLink[] {
  if (!context) {
    return [];
  }

  const links: RoleNavLink[] = [{ href: "/mypage", label: "마이페이지" }];

  if (context.canAccessSellerCenter) {
    links.push({ href: "/seller/dashboard", label: "판매자센터" });
  } else if (context.seller || context.role === "seller") {
    links.push({ href: getSellerCenterEntryHref(context), label: "판매자센터" });
  }

  if (context.canAccessAdminCenter) {
    links.push({ href: "/admin/dashboard", label: "관리자센터" });
  }

  return links;
}

function getSellerCenterEntryHref(context: AccessContext): string {
  if (!context.seller) {
    return "/seller/apply";
  }

  switch (context.seller.status) {
    case "approved":
      return "/seller/dashboard";
    case "rejected":
      return "/seller/rejected";
    case "suspended":
      return "/seller/suspended";
    case "under_review":
    case "pending_review":
    default:
      return "/seller/pending";
  }
}
