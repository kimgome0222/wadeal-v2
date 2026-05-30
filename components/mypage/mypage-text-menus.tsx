import { CoupangMenuSection } from "@/components/coupang-menu-list";

export function MypageTextMenus() {
  return (
    <div className="space-y-10 px-6 pt-10">
      <CoupangMenuSection
        items={[
          { label: "주문내역", href: "/mypage/orders" },
          { label: "찜 상품", href: "/saved" },
          { label: "최근 본 상품", href: "/mypage/recent" },
          { label: "자주 산 상품", href: "/mypage/recent", meta: "준비중" },
          { label: "취소/반품/교환", href: "/mypage/orders" },
          { label: "상품 리뷰", href: "/mypage/reviews" },
          { label: "선물함", href: "/mypage/benefits", meta: "준비중" },
        ]}
        title="쇼핑"
      />

      <CoupangMenuSection
        items={[
          { label: "셀로캐시", href: "/mypage/points" },
          { label: "쿠폰", href: "/mypage/benefits" },
          { label: "이벤트", href: "/events" },
          { label: "셀로 체험단", href: "/mypage/benefits", meta: "준비중" },
          { label: "친구초대", href: "/mypage/invite" },
        ]}
        title="결제 및 혜택"
      />

      <CoupangMenuSection
        items={[
          { label: "공지사항", href: "/support" },
          { label: "FAQ", href: "/support" },
          { label: "1:1 문의", href: "/support/new" },
          { label: "상품문의", href: "/mypage/support" },
          { label: "대량주문 문의", href: "/support/new", meta: "준비중" },
        ]}
        title="고객센터"
      />

      <CoupangMenuSection
        items={[
          { label: "내 정보 관리", href: "/mypage/settings" },
          { label: "주소록 관리", href: "/mypage/addresses" },
          { label: "알림 설정", href: "/mypage/notification-settings" },
          { label: "비밀번호 변경", href: "/mypage/security" },
          { label: "회원 탈퇴", href: "/mypage/withdrawal" },
        ]}
        title="설정"
      />
    </div>
  );
}
