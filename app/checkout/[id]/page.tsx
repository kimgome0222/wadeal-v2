import { notFound, redirect } from "next/navigation";
import { CheckoutOrderShell } from "@/components/checkout-order-shell";
import { PageShell } from "@/components/page-shell";
import { SiteFooter } from "@/components/site-footer";
import { SubHeader } from "@/components/sub-header";
import { getServerAuthUser } from "@/lib/auth/server-session";
import { getDealById, getPriceTiersByDealId } from "@/lib/data";
import { getUserOrderedQuantityForProduct } from "@/lib/data/inventory";
import { getDefaultAddress, getUserAddresses, userHasAnyAddress } from "@/lib/data/addresses";
import { getProductShippingBySlug } from "@/lib/data/product-shipping";
import { listSavedPaymentMethodsForUser } from "@/lib/data/saved-payment-methods";
import { getDefaultPaymentForUser } from "@/lib/data/user-payment";
import { getUserProfile } from "@/lib/data/profile";
import { hasRequiredConsents } from "@/lib/data/user-consents";
import { isDealClosed, isDealSoldOut } from "@/lib/deals";
import {
  getCheckoutIdentityBlockReason,
  isPhoneVerificationRequiredForCheckout,
} from "@/lib/auth/identity-guards";
import { getTierProgress } from "@/lib/pricing/tiers";
import {
  clampOrderQuantity,
  formatRemainingStockLabel,
  inventoryFromDeal,
} from "@/lib/products/inventory";
import { isNormalProduct, normalizeProductType } from "@/lib/products/product-type";
import { ui } from "@/lib/ui";

type CheckoutPageProps = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ qty?: string }>;
};

function parseCartQuantity(value: string | undefined): number {
  const parsed = Number(value);
  if (!Number.isFinite(parsed) || parsed < 1) {
    return 1;
  }
  return Math.min(99, Math.round(parsed));
}

export default async function CheckoutPage({ params, searchParams }: CheckoutPageProps) {
  const user = await getServerAuthUser();
  if (!user) {
    const { id } = await params;
    redirect(`/login?redirect=${encodeURIComponent(`/checkout/${id}`)}&next=${encodeURIComponent(`/checkout/${id}`)}`);
  }

  const { id } = await params;
  const { qty: qtyParam } = await searchParams;
  const [deal, tiers] = await Promise.all([getDealById(id), getPriceTiersByDealId(id)]);

  if (!deal) {
    notFound();
  }

  if (isDealClosed(deal) || isDealSoldOut(deal)) {
    redirect(`/product/${deal.slug}`);
  }

  const productType = normalizeProductType(deal.productType);
  const isNormal = isNormalProduct(productType);
  const inventory = inventoryFromDeal({ ...deal, productType });
  const userExistingQty = await getUserOrderedQuantityForProduct(user.id, deal.slug);
  const quantity = clampOrderQuantity(
    inventory,
    parseCartQuantity(qtyParam),
    userExistingQty,
  );

  if (quantity < inventory.minOrderQuantity) {
    redirect(`/product/${deal.slug}`);
  }
  const { applicablePrice, lowestPrice, allTiersAchieved } = getTierProgress(deal, tiers);
  const unitPrice = isNormal ? deal.groupPrice : applicablePrice;
  const expectedTotal = unitPrice * quantity;

  const checkoutPath = `/checkout/${deal.slug}${quantity > 1 ? `?qty=${quantity}` : ""}`;
  const paymentHref = `/mypage/payment/new?return=${encodeURIComponent(checkoutPath)}`;
  const profileHref = `/mypage/profile/edit?return=${encodeURIComponent(checkoutPath)}`;

  const [
    addresses,
    defaultAddress,
    productShipping,
    payment,
    savedCards,
    missingAddress,
    userHasConsents,
    ordererProfile,
  ] = await Promise.all([
    getUserAddresses(user.id),
    getDefaultAddress(user.id),
    getProductShippingBySlug(deal.slug),
    getDefaultPaymentForUser(user.id),
    isNormal ? Promise.resolve([]) : listSavedPaymentMethodsForUser(user.id),
    userHasAnyAddress(user.id).then((value) => !value),
    hasRequiredConsents(user.id),
    getUserProfile(user.id, user),
  ]);

  const identityBlockReason = getCheckoutIdentityBlockReason({
    realName: ordererProfile?.realName,
    phone: ordererProfile?.phone,
    phoneVerifiedAt: ordererProfile?.phoneVerifiedAt,
    hasDefaultAddress: !missingAddress,
  });
  const missingOrdererInfo = identityBlockReason != null;
  const missingPhoneVerification = identityBlockReason === "phone_not_verified";
  const phoneVerificationRequired = isPhoneVerificationRequiredForCheckout();

  const backHref =
    isNormal ?
      `/product/${deal.slug}`
    : quantity > 1 ?
      `/join/${deal.slug}?qty=${quantity}`
    : `/join/${deal.slug}`;

  return (
    <PageShell className="pb-36">
      <SubHeader backHref={backHref} title={isNormal ? "주문·결제" : "주문 확인"} />
      <div className={`${ui.pageBody} space-y-3`}>
        <article className="rounded-xl border border-wadeal-line bg-white p-4">
          <h2 className={ui.sectionTitle}>상품 정보</h2>
          <dl className="mt-3 space-y-2 text-xs font-bold text-wadeal-muted">
            <div className="flex justify-between gap-3">
              <dt>상품명</dt>
              <dd className="text-right font-black text-wadeal-ink">{deal.title}</dd>
            </div>
            {!isNormal ?
              <div className="flex justify-between gap-3">
                <dt>현재 참여 수량</dt>
                <dd className="font-black text-wadeal-ink">{deal.participants}개</dd>
              </div>
            : null}
            <div className="flex justify-between gap-3">
              <dt>주문 수량</dt>
              <dd className="font-black text-wadeal-ink">{quantity}개</dd>
            </div>
            {formatRemainingStockLabel(inventory) ?
              <div className="flex justify-between gap-3">
                <dt>남은 수량</dt>
                <dd className="font-black text-wadeal-ink">
                  {formatRemainingStockLabel(inventory)}
                </dd>
              </div>
            : null}
            {inventory.perUserLimit != null ?
              <div className="flex justify-between gap-3">
                <dt>1인 구매 한도</dt>
                <dd className="font-black text-wadeal-ink">{inventory.perUserLimit}개</dd>
              </div>
            : null}
          </dl>
        </article>

        <CheckoutOrderShell
          addresses={addresses}
          allTiersAchieved={allTiersAchieved}
          applicablePrice={applicablePrice}
          currentMembers={deal.participants}
          dealSlug={deal.slug}
          defaultAddressId={defaultAddress?.id ?? null}
          initialHasConsents={userHasConsents}
          isNormal={isNormal}
          lowestPrice={lowestPrice}
          missingAddress={missingAddress}
          missingOrdererInfo={missingOrdererInfo}
          missingPhoneVerification={missingPhoneVerification}
          ordererProfile={ordererProfile}
          participants={deal.participants}
          payment={payment}
          paymentHref={paymentHref}
          phoneVerificationRequired={phoneVerificationRequired}
          productName={deal.title}
          productShipping={productShipping}
          productType={productType}
          profileHref={profileHref}
          quantity={quantity}
          savedCards={savedCards}
          subtotalAmount={expectedTotal}
          targetMembers={deal.targetParticipants}
          unitPrice={unitPrice}
        />
      </div>
      <SiteFooter className="mb-24" />
    </PageShell>
  );
}
