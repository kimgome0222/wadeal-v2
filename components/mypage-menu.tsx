import { CoupangMenuSection } from "@/components/coupang-menu-list";
import { MypageLogoutButton } from "@/components/mypage-logout-button";
import type { RoleNavLink } from "@/lib/auth/role-nav";
import { ui } from "@/lib/ui";

type MypageMenuProps = {
  unreadNotificationCount?: number;
  roleLinks?: RoleNavLink[];
};

export function MypageMenu({
  unreadNotificationCount = 0,
  roleLinks = [],
}: MypageMenuProps) {
  return (
    <div className="space-y-3">
      {roleLinks.length > 1 ?
        <CoupangMenuSection
          items={roleLinks.map((link) => ({ label: link.label, href: link.href }))}
          title="센터 바로가기"
        />
      : null}

      <CoupangMenuSection
        items={[
          { label: "주문 내역", href: "/mypage/orders" },
          { label: "구매 내역", href: "/mypage/groupbuys" },
          { label: "관심 상품", href: "/saved" },
          { label: "팔로우한 판매자", href: "/mypage/following-sellers" },
          { label: "최근 본 상품", href: "/mypage/recent" },
          { label: "리뷰 관리", href: "/mypage/reviews" },
        ]}
        title="내 쇼핑"
      />

      <CoupangMenuSection
        items={[
          { label: "쿠폰·포인트", href: "/mypage/benefits" },
          {
            label: "알림",
            href: "/notifications",
            badge:
              unreadNotificationCount > 0 ?
                <span className="rounded-full bg-wadeal-red px-2 py-0.5 text-[10px] font-bold text-white">
                  {unreadNotificationCount > 99 ? "99+" : unreadNotificationCount}
                </span>
              : undefined,
          },
          { label: "관심 상품 알림", href: "/mypage/alerts" },
          { label: "알림 설정", href: "/mypage/notification-settings" },
        ]}
        title="혜택·알림"
      />

      <CoupangMenuSection
        items={[
          { label: "배송지 관리", href: "/mypage/addresses" },
          { label: "결제수단 관리", href: "/mypage/payment" },
          { label: "문의 내역", href: "/mypage/support" },
          { label: "고객센터", href: "/support" },
          { label: "회원정보", href: "/mypage/account" },
        ]}
        title="계정·고객지원"
      />

      <ul className={`overflow-hidden rounded-xl border border-wadeal-line bg-white ${ui.listDivider}`}>
        <li>
          <MypageLogoutButton />
        </li>
      </ul>
    </div>
  );
}
