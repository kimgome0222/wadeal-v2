import { redirect } from "next/navigation";

export default function SellerProfileRedirectPage() {
  redirect("/seller/settings");
}
