import { redirect } from "next/navigation";

type AddressRedirectPageProps = {
  searchParams: Promise<{ return?: string }>;
};

export default async function AddressRedirectPage({ searchParams }: AddressRedirectPageProps) {
  const { return: returnParam } = await searchParams;
  const query = returnParam ? `?return=${encodeURIComponent(returnParam)}` : "";
  redirect(`/mypage/addresses${query}`);
}
