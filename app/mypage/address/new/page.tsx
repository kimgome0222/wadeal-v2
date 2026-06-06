import { redirect } from "next/navigation";

type AddressNewRedirectPageProps = {
  searchParams: Promise<{ return?: string }>;
};

export default async function AddressNewRedirectPage({
  searchParams,
}: AddressNewRedirectPageProps) {
  const { return: returnParam } = await searchParams;
  const query = returnParam ? `?return=${encodeURIComponent(returnParam)}` : "";
  redirect(`/mypage/addresses/new${query}`);
}
