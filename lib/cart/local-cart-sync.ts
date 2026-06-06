/**
 * Server cart sync — mock/local cart 단계에서는 UI에 영향 없이 best-effort만.
 * DB/RLS 변경 없음. 실패해도 local cart 유지.
 */
import {
  addToJoinCartAction,
  setJoinCartQuantityBySlugAction,
} from "@/app/actions/join-cart";

function warnServerCartSync(context: string, result: unknown) {
  if (process.env.NODE_ENV !== "production") {
    console.warn(`[cart] ${context} server sync skipped`, result);
  }
}

export function trySyncCartAdd(productSlug: string, quantity = 1) {
  void addToJoinCartAction(productSlug, quantity).then((result) => {
    if ("error" in result && result.error === "login_required") {
      return;
    }

    if (!result.success) {
      warnServerCartSync("add", result);
    }
  });
}

export function trySyncCartQuantityBySlug(productSlug: string, quantity: number) {
  void setJoinCartQuantityBySlugAction(productSlug, quantity).then((result) => {
    if ("error" in result && result.error === "login_required") {
      return;
    }

    if (!result.success) {
      warnServerCartSync("set-quantity", result);
    }
  });
}
