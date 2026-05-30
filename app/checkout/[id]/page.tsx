import { notFound, redirect } from "next/navigation";
import { CheckoutGuestPreview } from "@/components/checkout-guest-preview";
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
import { currency, isDealClosed, isDealSoldOut } from "@/lib/deals";
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
  const { id } = await params;
  const { qty: qtyParam } = await searchParams;
  const cartQuantity = parseCartQuantity(qtyParam);

  const [deal, tiers, user] = await Promise.all([
    getDealById(id),
    getPriceTiersByDealId(id),
    getServerAuthUser(),
  ]);

  if (!deal) {
    notFound();
  }

  if (isDealClosed(deal) || isDealSoldOut(deal)) {
    redirect(`/product/${deal.slug}`);
  }

  const productType = normalizeProductType(deal.productType);
  const isNormal = isNormalProduct(productType);
  const { applicablePrice, lowestPrice, allTiersAchieved } = getTierProgress(deal, tiers);
  const unitPrice = isNormal ? deal.groupPrice : applicablePrice;
  const expectedTotal = unitPrice * cartQuantity;
  const checkoutPath = `/checkout/${deal.slug}${cartQuantity > 1 ? `?qty=${cartQuantity}` : ""}`;
  const backHref =
    isNormal ?
      `/product/${deal.slug}`
    : cartQuantity > 1 ?
      `/join/${deal.slug}?qty=${cartQuantity}`
    : `/join/${deal.slug}`;

  if (!user) {
    return (
      <CheckoutGuestPreview
        backHref={backHref}
        deal={deal}
        isNormal={isNormal}
        loginHref={`/login?next=${encodeURIComponent(checkoutPath)}`}
        quantity={cartQuantity}
        subtotalAmount={expectedTotal}
        unitPrice={unitPrice}
      />
    );
  }

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
  const unitPriceLoggedIn = isNormal ? deal.groupPrice : applicablePrice;
  const expectedTotalLoggedIn = unitPriceLoggedIn * quantity;

  const checkoutPathLoggedIn = `/checkout/${deal.slug}${quantity > 1 ? `?qty=${quantity}` : ""}`;
  const paymentHref = `/mypage/payment/new?return=${encodeURIComponent(checkoutPathLoggedIn)}`;
  const profileHref = `/mypage/profile/edit?return=${encodeURIComponent(checkoutPathLoggedIn)}`;

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

  const backHrefLoggedIn = backHref;

  return (
    <PageShell className="pb-12">
      <SubHeader backHref={backHrefLoggedIn} title={isNormal ? "주문·결제" : "주문·결제"} />
      <div className={`${ui.pageBody} space-y-10 pb-12`}>
        <section className="space-y-4">
          <h2 className="text-[18px] font-bold text-[#111111]">주문상품</h2>
          <article className="rounded-[20px] border border-[#E8ECEA] bg-white p-4">
            <p className="text-[13px] font-medium text-[#666666]">
              {deal.brandName?.trim() || "celloh 셀러"}
            </p>
            <p className="mt-2 text-[15px] font-semibold text-[#111111]">{deal.title}</p>
            <dl className="mt-3 space-y-2 text-[13px] text-[#666666]">
              <div className="flex justify-between gap-3">
                <dt>수량</dt>
                <dd className="font-semibold text-[#111111]">{quantity}개</dd>
              </div>
              <div className="flex justify-between gap-3">
                <dt>{isNormal ? "상품금액" : "예상 단가"}</dt>
                <dd className="font-bold text-[#111111]">{currency.format(unitPriceLoggedIn)}원</dd>
              </div>
              {formatRemainingStockLabel(inventory) ?
                <div className="flex justify-between gap-3">
                  <dt>남은 수량</dt>
                  <dd className="font-semibold text-[#111111]">
                    {formatRemainingStockLabel(inventory)}
                  </dd>
                </div>
              : null}
            </dl>
          </article>
        </section>

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
          subtotalAmount={expectedTotalLoggedIn}
          targetMembers={deal.targetParticipants}
          unitPrice={unitPriceLoggedIn}
        />
      </div>
      <SiteFooter className="mb-24" />
    </PageShell>
  );
}
