import { redirect } from "next/navigation";

type MypageProfilePageProps = {
  searchParams: Promise<{ return?: string }>;
};

/** 이전 /mypage/profile 링크 호환 → 회원정보 허브 */
export default async function MypageProfilePage({ searchParams }: MypageProfilePageProps) {
  const { return: returnParam } = await searchParams;
  const query = returnParam ? `?return=${encodeURIComponent(returnParam)}` : "";
  redirect(`/mypage/account${query}`);
}
