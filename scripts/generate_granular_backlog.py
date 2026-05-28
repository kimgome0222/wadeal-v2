#!/usr/bin/env python3
"""Generate granular backlog items for docs/work-queue.json from codebase globs."""

from __future__ import annotations

import json
import re
from collections import Counter, defaultdict
from datetime import date
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
WORK_QUEUE_PATH = ROOT / "docs" / "work-queue.json"
BACKLOG_MD_PATH = ROOT / "docs" / "BACKLOG_INCOMPLETE.md"
MASTER_MD_PATH = ROOT / "docs" / "WORK_QUEUE_MASTER.md"
START_MD_PATH = ROOT / "docs" / "START.md"

# Known partial/failed paths from current build/git state
PARTIAL_PATHS = {
    "lib/data/admin-products.ts",
    "lib/data/payments.ts",
    "lib/data/seller-billings.ts",
    "lib/data/seller-settlement-records.ts",
    "lib/payments/toss/apply-confirm-result.ts",
}

MIGRATION_REMOTE_PENDING_FROM = 4  # 004+ not applied remotely (E006)

GRANULAR_PREFIXES = (
    "MG",
    "AP",
    "SP",
    "CP",
    "AC",
    "LD",
    "API",
    "NT",
    "RLS",
    "PAY",
    "LP",
    "LN",
    "LA",
)


def is_granular_id(item_id: str) -> bool:
    return any(item_id.startswith(p) for p in GRANULAR_PREFIXES)


def glob_sorted(pattern: str) -> list[Path]:
    return sorted(ROOT.glob(pattern), key=lambda p: p.as_posix())


def rel(path: Path) -> str:
    return path.relative_to(ROOT).as_posix()


def make_item(
    item_id: str,
    *,
    area: str,
    title: str,
    detail: str,
    path: str | None = None,
    priority: str = "medium",
    status: str = "pending",
    source: str = "granular",
) -> dict:
    prompt_parts = [detail]
    if path:
        prompt_parts.append(f"경로: `{path}`")
    prompt = "\n\n".join(prompt_parts)
    resume_command = (
        f"{item_id} 실행: {title}\n\n{prompt}\n\nnpm run build 통과. 디자인 유지."
    )
    item: dict = {
        "id": item_id,
        "source": source,
        "area": area,
        "status": status,
        "priority": priority,
        "title": title,
        "detail": detail,
        "prompt": prompt,
        "resume_command": resume_command,
    }
    if path:
        item["path"] = path
    return item


def parse_notification_types() -> list[tuple[str, str]]:
    types_path = ROOT / "lib" / "notifications" / "types.ts"
    text = types_path.read_text(encoding="utf-8")
    types: list[tuple[str, str]] = []
    role = "user"
    for block_name, role_name in [
        ("USER_NOTIFICATION_TYPES", "user"),
        ("SELLER_NOTIFICATION_TYPES", "seller"),
        ("ADMIN_NOTIFICATION_TYPES", "admin"),
    ]:
        match = re.search(
            rf"export const {block_name} = \[([\s\S]*?)\] as const;",
            text,
        )
        if not match:
            continue
        for t in re.findall(r'"([^"]+)"', match.group(1)):
            types.append((t, role_name))
    return types


def migration_number(path: Path) -> int:
    m = re.match(r"(\d+)_", path.name)
    return int(m.group(1)) if m else 0


def migration_status(path: Path) -> str:
    num = migration_number(path)
    if num >= MIGRATION_REMOTE_PENDING_FROM:
        return "partial"
    return "pending"


def ld_status(path: Path) -> str:
    if rel(path) in PARTIAL_PATHS:
        return "partial"
    return "pending"


def generate_migration_items() -> list[dict]:
    items: list[dict] = []
    migrations = glob_sorted("supabase/migrations/*.sql")
    for i, path in enumerate(migrations, start=1):
        r = rel(path)
        num = migration_number(path)
        name = path.stem
        status = migration_status(path)
        items.append(
            make_item(
                f"MG{i:03d}",
                area="database",
                title=f"Migration 적용·검증: {name}",
                detail=(
                    f"`{r}` SQL을 Supabase SQL Editor에 적용하고, "
                    f"테이블·RLS·인덱스·시드가 의도대로 생성됐는지 검증."
                ),
                path=r,
                priority="high" if num >= 19 else "medium",
                status=status,
            )
        )
    return items


def page_title_from_path(path: Path) -> str:
    parts = path.parts
    if "page.tsx" in parts:
        idx = parts.index("page.tsx")
        route_parts = list(parts[1:idx])  # skip 'app'
        if not route_parts:
            return "홈"
        return "/" + "/".join(route_parts)


def generate_page_items(prefix: str, area: str, glob_pattern: str) -> list[dict]:
    items: list[dict] = []
    pages = glob_sorted(glob_pattern)
    for i, path in enumerate(pages, start=1):
        r = rel(path)
        route = page_title_from_path(path)
        items.append(
            make_item(
                f"{prefix}{i:03d}",
                area=area,
                title=f"페이지 검증: {route}",
                detail=(
                    f"`{route}` 페이지가 SSR/CSR 로드, 인증 가드, 데이터 바인딩, "
                    f"에러·빈 상태 UI가 정상인지 브라우저·build로 검증."
                ),
                path=r,
                priority="high" if area in ("admin", "seller") else "medium",
            )
        )
    return items


def generate_customer_pages() -> list[dict]:
    all_pages = glob_sorted("app/**/page.tsx")
    admin_prefix = "app/admin/"
    seller_prefix = "app/seller/"
    customer_pages = [
        p
        for p in all_pages
        if not rel(p).startswith(admin_prefix)
        and not rel(p).startswith(seller_prefix)
    ]
    items: list[dict] = []
    for i, path in enumerate(customer_pages, start=1):
        r = rel(path)
        route = page_title_from_path(path)
        items.append(
            make_item(
                f"CP{i:03d}",
                area="mypage" if "/mypage/" in r else "verification",
                title=f"고객 페이지 검증: {route}",
                detail=(
                    f"`{route}` 고객-facing 페이지 렌더링, Supabase/mock 데이터, "
                    f"로그인·결제·알림 연동 상태를 검증."
                ),
                path=r,
                priority="high" if route.startswith("/checkout") or route.startswith("/payment") else "medium",
            )
        )
    return items


def action_title_from_path(path: Path) -> str:
    return path.stem.replace("-", " ")


def generate_action_items() -> list[dict]:
    items: list[dict] = []
    files = glob_sorted("app/actions/**/*.ts")
    for i, path in enumerate(files, start=1):
        r = rel(path)
        items.append(
            make_item(
                f"AC{i:03d}",
                area="verification",
                title=f"Server Action 검증: {path.stem}",
                detail=(
                    f"`{r}`의 export server action들이 Zod 검증, auth, "
                    f"lib/data 호출, revalidatePath, 에러 메시지가 올바른지 검증."
                ),
                path=r,
                priority="high" if path.stem.startswith("admin") else "medium",
            )
        )
    return items


def generate_lib_data_items() -> list[dict]:
    items: list[dict] = []
    files = glob_sorted("lib/data/**/*.ts")
    for i, path in enumerate(files, start=1):
        r = rel(path)
        items.append(
            make_item(
                f"LD{i:03d}",
                area="verification",
                title=f"lib/data 모듈 검증: {path.stem}",
                detail=(
                    f"`{r}` Supabase 쿼리·타입·mock fallback·에러 처리가 "
                    f"database types와 일치하는지 검증."
                ),
                path=r,
                priority="high" if path.stem in ("admin-products", "payments") else "medium",
                status=ld_status(path),
            )
        )
    return items


def generate_api_items() -> list[dict]:
    items: list[dict] = []
    routes = glob_sorted("app/api/**/route.ts")
    for i, path in enumerate(routes, start=1):
        r = rel(path)
        route_path = "/api/" + "/".join(
            part for part in path.parts[1:-1] if part not in ("api", "route.ts")
        )
        items.append(
            make_item(
                f"API{i:03d}",
                area="payment" if "payment" in r else "verification",
                title=f"API Route 검증: {route_path}",
                detail=(
                    f"`{r}` HTTP method, auth/secret 검증, request/response, "
                    f"에러 코드·로깅이 스펙대로 동작하는지 검증."
                ),
                path=r,
                priority="high",
                status="partial" if "payment" in r else "pending",
            )
        )
    return items


def generate_notification_type_items() -> list[dict]:
    items: list[dict] = []
    types = parse_notification_types()
    for i, (ntype, role) in enumerate(types, start=1):
        items.append(
            make_item(
                f"NT{i:03d}",
                area="notifications",
                title=f"알림 타입 연동: {ntype}",
                detail=(
                    f"`{ntype}` ({role}) 알림이 트리거 이벤트→insert→"
                    f"in_app UI 표시→read_at까지 end-to-end 연결됐는지 검증."
                ),
                path="lib/notifications/types.ts",
                priority="high",
            )
        )
    return items


RLS_BUCKETS: list[tuple[str, str, list[str]]] = [
    (
        "catalog",
        "카탈로그 RLS",
        ["products", "group_buy_deals", "price_tiers", "categories"],
    ),
    (
        "participants",
        "참여·알림 RLS",
        ["group_buy_participants", "price_alerts", "alerts"],
    ),
    (
        "orders",
        "주문 RLS",
        ["orders", "order_items"],
    ),
    (
        "payments",
        "결제 RLS",
        ["payments", "saved_payment_methods"],
    ),
    (
        "reviews",
        "리뷰 RLS",
        ["reviews", "review_likes", "review_reports", "review_replies"],
    ),
    (
        "wishlist",
        "찜·최근본·장바구니 RLS",
        ["saved_deals", "recent_views", "join_cart"],
    ),
    (
        "addresses",
        "배송지 RLS",
        ["addresses"],
    ),
    (
        "users",
        "사용자·프로필 RLS",
        ["users", "user_consents", "notification_settings"],
    ),
    (
        "coupons",
        "쿠폰·포인트 RLS",
        ["coupons", "coupon_usages", "user_points", "point_transactions"],
    ),
    (
        "support",
        "고객센터 RLS",
        ["support_tickets"],
    ),
    (
        "sellers",
        "판매자 RLS",
        ["sellers"],
    ),
    (
        "suppliers",
        "공급사·정산 RLS",
        ["suppliers", "settlements"],
    ),
    (
        "settlement_records",
        "판매자 정산기록 RLS",
        ["settlement_records", "settlement_record_items", "seller_billings"],
    ),
    (
        "notifications",
        "알림 RLS",
        ["notifications"],
    ),
    (
        "admin_logs",
        "관리자 로그 RLS",
        ["admin_activity_logs", "error_logs", "webhook_logs"],
    ),
    (
        "business",
        "사업자 설정 RLS",
        ["business_settings"],
    ),
    (
        "share",
        "공유·추천 RLS",
        ["share_logs", "referral_visits"],
    ),
    (
        "search",
        "검색 RLS",
        ["search_logs"],
    ),
    (
        "storage_products",
        "상품 이미지 Storage RLS",
        ["storage.objects (product-images)"],
    ),
    (
        "storage_reviews",
        "리뷰 이미지 Storage RLS",
        ["storage.objects (review-images)"],
    ),
    (
        "019_hardening",
        "019 security hardening 전체",
        ["019_security_rls_hardening.sql policies"],
    ),
    (
        "009_production",
        "009 production RLS",
        ["009_production_rls.sql policies"],
    ),
    (
        "service_role",
        "service_role 우회 경로",
        ["server actions using service role"],
    ),
    (
        "anon_public",
        "anon public SELECT 정책",
        ["active products/deals public read"],
    ),
    (
        "cross_role",
        "역할 간 데이터 격리",
        ["user/seller/admin cross-access denial"],
    ),
]


def generate_rls_items() -> list[dict]:
    items: list[dict] = []
    for i, (slug, title_ko, tables) in enumerate(RLS_BUCKETS, start=1):
        table_list = ", ".join(f"`{t}`" for t in tables)
        items.append(
            make_item(
                f"RLS{i:03d}",
                area="security",
                title=f"RLS 검증: {title_ko}",
                detail=(
                    f"{table_list} 테이블(영역)의 SELECT/INSERT/UPDATE/DELETE "
                    f"정책이 역할별로 올바르게 동작하는지 Supabase에서 검증."
                ),
                path="supabase/migrations/019_security_rls_hardening.sql",
                priority="high",
                status="partial",
            )
        )
    return items


PAY_STEPS: list[tuple[str, str, str | None, str]] = [
    ("Toss webhook 서명 검증", "lib/payments/toss/webhook/verify-signature.ts", "high"),
    ("Webhook 이벤트 파싱", "lib/payments/toss/webhook/parse-event.ts", "high"),
    ("Webhook process-webhook", "lib/payments/toss/webhook/process-webhook.ts", "high"),
    ("Handler: payment-approved", "lib/payments/toss/webhook/handlers/payment-approved.ts", "high"),
    ("Handler: payment-failed", "lib/payments/toss/webhook/handlers/payment-failed.ts", "high"),
    ("Handler: payment-cancelled", "lib/payments/toss/webhook/handlers/payment-cancelled.ts", "high"),
    ("Handler: deposit-completed", "lib/payments/toss/webhook/handlers/deposit-completed.ts", "high"),
    ("Handler: refund-completed", "lib/payments/toss/webhook/handlers/refund-completed.ts", "high"),
    ("Webhook 로그 기록", "lib/payments/toss/webhook/webhook-logs.ts", "medium"),
    ("API POST /api/payments/toss/webhook", "app/api/payments/toss/webhook/route.ts", "high"),
    ("API POST /api/payments/toss/confirm", "app/api/payments/toss/confirm/route.ts", "high"),
    ("apply-confirm-result", "lib/payments/toss/apply-confirm-result.ts", "high"),
    ("Toss client 요청", "lib/payments/toss/client.ts", "medium"),
    ("Toss env 설정", "lib/payments/toss/env.ts", "medium"),
    ("validate-order-payment", "lib/payments/toss/validate-order-payment.ts", "high"),
    ("create-pending-payment", "lib/payments/create-pending-payment.ts", "high"),
    ("process-instant-payment", "lib/payments/process-instant-payment.ts", "high"),
    ("prepare-payment-after-finalize", "lib/payments/prepare-payment-after-finalize.ts", "high"),
    ("sync-order-payment-status", "lib/payments/sync-order-payment-status.ts", "high"),
    ("update-payment-status", "lib/payments/update-payment-status.ts", "high"),
    ("can-pay-order 가드", "lib/payments/can-pay-order.ts", "high"),
    ("payment-status 라벨", "lib/payments/payment-status.ts", "medium"),
    ("payment-methods 매핑", "lib/payments/payment-methods.ts", "medium"),
    ("payment-flow instant", "lib/payments/payment-flow.ts", "high"),
    ("payment-flow post_deadline_manual", "lib/payments/payment-flow.ts", "high"),
    ("payment-flow post_deadline_auto", "lib/payments/payment-flow.ts", "high"),
    ("auto-charge 자동결제", "lib/payments/auto-charge.ts", "high"),
    ("Toss billing issue", "lib/payments/toss/billing.ts", "high"),
    ("API POST /api/payments/billing/issue", "app/api/payments/billing/issue/route.ts", "high"),
    ("API POST /api/payments/billing/charge", "app/api/payments/billing/charge/route.ts", "high"),
    ("API /api/payments/billing/[id]", "app/api/payments/billing/[id]/route.ts", "high"),
    ("saved payment methods", "lib/data/saved-payment-methods.ts", "medium"),
    ("E2E 즉시결제 checkout", "app/checkout/[id]/page.tsx", "high"),
    ("E2E 결제 success/fail", "app/payment/success/page.tsx", "high"),
    ("E2E 가상계좌 입금", "lib/payments/toss/webhook/handlers/deposit-completed.ts", "high"),
    ("E2E 공동구매 마감 후 결제", "app/payment/request/[orderId]/page.tsx", "high"),
    ("E2E billing key 등록", "app/mypage/payment/new/page.tsx", "high"),
    ("payment_webhook_failed 알림", "lib/notifications/types.ts", "high"),
    ("Query API PAYMENT_STATUS_CHANGED", "lib/payments/toss/client.ts", "high"),
    ("환불·부분환불 webhook", "lib/payments/toss/webhook/handlers/refund-completed.ts", "high"),
    ("admin payments UI", "app/admin/payments/page.tsx", "medium"),
    ("display 금액 포맷", "lib/payments/display.ts", "low"),
    ("toss amount 계산", "lib/payments/toss/amount.ts", "medium"),
    ("toss map-method", "lib/payments/toss/map-method.ts", "medium"),
    ("server action payments.ts", "app/actions/payments.ts", "high"),
    ("server action saved-payment-methods", "app/actions/saved-payment-methods.ts", "medium"),
]


def generate_lib_payments_items() -> list[dict]:
    items: list[dict] = []
    files = glob_sorted("lib/payments/**/*.ts")
    for i, path in enumerate(files, start=1):
        r = rel(path)
        items.append(
            make_item(
                f"LP{i:03d}",
                area="payment",
                title=f"lib/payments 모듈 검증: {path.stem}",
                detail=(
                    f"`{r}` 결제 헬퍼·Toss 연동·상태 전이 로직이 "
                    f"타입·env·에러 처리와 일치하는지 검증."
                ),
                path=r,
                priority="high",
                status="partial" if r in PARTIAL_PATHS else "pending",
            )
        )
    return items


def generate_lib_notifications_items() -> list[dict]:
    items: list[dict] = []
    files = [
        p
        for p in glob_sorted("lib/notifications/**/*.ts")
        if p.name != "types.ts"
    ]
    for i, path in enumerate(files, start=1):
        r = rel(path)
        items.append(
            make_item(
                f"LN{i:03d}",
                area="notifications",
                title=f"lib/notifications 모듈 검증: {path.stem}",
                detail=(
                    f"`{r}` 알림 생성·이벤트 트리거·unified insert가 "
                    f"역할별 타입과 RLS와 일치하는지 검증."
                ),
                path=r,
                priority="high",
            )
        )
    return items


def generate_lib_auth_items() -> list[dict]:
    items: list[dict] = []
    files = glob_sorted("lib/auth/**/*.ts")
    for i, path in enumerate(files, start=1):
        r = rel(path)
        items.append(
            make_item(
                f"LA{i:03d}",
                area="security",
                title=f"lib/auth 모듈 검증: {path.stem}",
                detail=(
                    f"`{r}` 세션·역할 가드·OAuth·redirect 로직이 "
                    f"admin/seller/mypage 라우트 보호에 올바른지 검증."
                ),
                path=r,
                priority="high",
            )
        )
    return items


def generate_pay_items() -> list[dict]:
    items: list[dict] = []
    for i, (title, path, priority) in enumerate(PAY_STEPS, start=1):
        status = "partial" if path in PARTIAL_PATHS or "apply-confirm" in path else "pending"
        items.append(
            make_item(
                f"PAY{i:03d}",
                area="payment",
                title=f"결제 플로우: {title}",
                detail=f"결제 단계 `{title}` 구현·연동·E2E가 프로덕션 기준으로 동작하는지 검증.",
                path=path,
                priority=priority,
                status=status,
            )
        )
    return items


def prefix_of(item_id: str) -> str:
    m = re.match(r"^([A-Z]+)", item_id)
    return m.group(1) if m else "OTHER"


def generate_backlog_md(all_items: list[dict], user_count: int) -> str:
    backlog_count = len(all_items)
    total = user_count + backlog_count

    area_counts = Counter(item["area"] for item in all_items)
    prefix_counts = Counter(prefix_of(item["id"]) for item in all_items)

    lines = [
        f"# BACKLOG INCOMPLETE ({backlog_count} items)",
        "",
        f"> {date.today().isoformat()} · `docs/work-queue.json` → `backlog_incomplete[]`",
        "",
        "| 구분 | 개수 |",
        "|---|---|",
        f"| 채팅 user_query (W001~) | {user_count} |",
        f"| 기능/모듈 백로그 | {backlog_count} |",
        f"| **합계 추적 가능** | **{total}** |",
        "",
        "## ID 접두사별",
        "",
        "| prefix | count | 설명 |",
        "|---|---|---|",
    ]

    prefix_desc = {
        "B": "인프라·git·deploy·database 블로커",
        "N": "알림 기능 백로그",
        "S": "판매자 기능 백로그",
        "A": "관리자 기능 백로그",
        "P": "결제 기능 백로그 (레거시 P00x)",
        "M": "마이페이지 백로그",
        "D": "문서·프로덕션 백로그",
        "V": "모듈 검증 (레거시)",
        "G": "서브에이전트 작업",
        "PF": "Push 실패 복구",
        "E": "알려진 에러",
        "MG": "Migration 적용·검증 (파일별)",
        "AP": "Admin 페이지 검증",
        "SP": "Seller 페이지 검증",
        "CP": "고객 페이지 검증",
        "AC": "Server Action 검증",
        "LD": "lib/data 모듈 검증",
        "API": "API Route 검증",
        "NT": "알림 타입 연동",
        "RLS": "RLS 정책 검증",
        "PAY": "결제 플로우 단계",
        "LP": "lib/payments 모듈 검증",
        "LN": "lib/notifications 모듈 검증",
        "LA": "lib/auth 모듈 검증",
    }

    for pref in sorted(prefix_counts.keys()):
        desc = prefix_desc.get(pref, "")
        lines.append(f"| {pref} | {prefix_counts[pref]} | {desc} |")

    lines.extend(
        [
            "",
            "## 영역별 (area)",
            "",
            "| area | count |",
            "|---|---|",
        ]
    )
    for area, count in sorted(area_counts.items(), key=lambda x: (-x[1], x[0])):
        lines.append(f"| {area} | {count} |")

    lines.extend(["", "## 전체 목록", "", "| ID | Status | Area | Title |", "|---|---|---|---|"])
    for item in all_items:
        title = item["title"].replace("|", "\\|")
        lines.append(
            f"| {item['id']} | {item['status']} | {item['area']} | {title} |"
        )
    lines.append("")
    return "\n".join(lines)


def update_master_md(content: str, backlog_count: int, user_count: int) -> str:
    total = user_count + backlog_count
    header = f"# WORK QUEUE MASTER ({user_count} requests · {backlog_count} backlog)\n"
    header += f"> {date.today().isoformat()} · `docs/work-queue.json`이 정본\n"
    header += f"> **추적 가능 합계: {total}건** (W001~ + backlog_incomplete)\n"

    backlog_section = (
        "\n## 재개\n\n"
        "`시작` 입력 → W001부터 순차\n\n"
        "## 백로그 요약\n\n"
        f"| 항목 | 개수 |\n|---|---|\n"
        f"| work_items (W001~) | {user_count} |\n"
        f"| backlog_incomplete | {backlog_count} |\n"
        f"| **합계** | **{total}** |\n\n"
        "세부 ID 접두사: `docs/BACKLOG_INCOMPLETE.md` · MG/AP/SP/CP/AC/LD/API/NT/RLS/PAY/LP/LN/LA\n"
    )

    # Strip old header (up to ## 알려진 에러 or ## Commit)
    if "## 알려진 에러" in content:
        body = content.split("## 알려진 에러", 1)[1]
        body = "## 알려진 에러" + body
    elif content.startswith("# WORK QUEUE MASTER"):
        parts = content.split("\n", 4)
        body = parts[4] if len(parts) > 4 else content
    else:
        body = content

    return header + backlog_section + "\n" + body.lstrip("\n")


def update_start_md(content: str, backlog_count: int, user_count: int) -> str:
    total = user_count + backlog_count
    content = re.sub(
        r"총 \*\*\d+\*\*개 사용자 요청",
        f"총 **{user_count}**개 사용자 요청",
        content,
    )
    content = re.sub(
        r"\*\*합계 \d+건\*\* 추적 가능",
        f"**합계 {total}건** 추적 가능",
        content,
    )
    content = re.sub(
        r"\*\*기능/미완료 백로그 \d+건\*\*",
        f"**기능/미완료 백로그 {backlog_count}건**",
        content,
    )

    if "MG/AP/SP" not in content:
        insert = (
            "\n- **세분화 백로그 ID**: MG(마이그레이션), AP(관리자 페이지), SP(판매자), "
            "CP(고객), AC(액션), LD(lib/data), API, NT(알림타입), RLS, PAY, LP/LN/LA\n"
        )
        content = content.replace(
            "- 상세: `docs/BACKLOG_INCOMPLETE.md`",
            insert + "- 상세: `docs/BACKLOG_INCOMPLETE.md`",
        )
    else:
        content = re.sub(
            r"- \*\*세분화 백로그 ID\*\*:.*\n",
            "- **세분화 백로그 ID**: MG(마이그레이션), AP(관리자 페이지), SP(판매자), "
            "CP(고객), AC(액션), LD(lib/data), API, NT(알림타입), RLS, PAY, LP/LN/LA\n",
            content,
            count=1,
        )

    # Update resume priority to mention granular backlog after blockers
    if "Q-GRANULAR" not in content:
        content = content.replace(
            "5. **W001~W185** — 저장된 요청 순차 실행",
            "5. **Q-GRANULAR** — MG/B001 블로커 후 세분화 백로그 (AP/SP/CP/AC/LD/…)\n"
            "6. **W001~W185** — 저장된 요청 순차 실행",
        )

    return content


def main() -> None:
    data = json.loads(WORK_QUEUE_PATH.read_text(encoding="utf-8"))
    existing: list[dict] = [
        item for item in data["backlog_incomplete"] if not is_granular_id(item["id"])
    ]
    existing_ids = {item["id"] for item in existing}

    new_generators = [
        generate_migration_items(),
        generate_page_items("AP", "admin", "app/admin/**/page.tsx"),
        generate_page_items("SP", "seller", "app/seller/**/page.tsx"),
        generate_customer_pages(),
        generate_action_items(),
        generate_lib_data_items(),
        generate_api_items(),
        generate_notification_type_items(),
        generate_rls_items(),
        generate_pay_items(),
        generate_lib_payments_items(),
        generate_lib_notifications_items(),
        generate_lib_auth_items(),
    ]

    new_items: list[dict] = []
    for batch in new_generators:
        for item in batch:
            if item["id"] in existing_ids:
                raise ValueError(f"Duplicate ID: {item['id']}")
            new_items.append(item)

    merged = existing + new_items
    data["backlog_incomplete"] = merged
    data["generated_at"] = date.today().isoformat()
    data["backlog_incomplete_count"] = len(merged)
    data["user_request_count"] = len(data.get("work_items", []))
    data["total_trackable_items"] = data["user_request_count"] + len(merged)
    data["total_backlog_incomplete"] = len(merged)
    data["note"] = (
        "work_items=185 chat user_query. backlog_incomplete=decomposed tasks incl. "
        "MG/AP/SP/CP/AC/LD/API/NT/RLS/PAY granular items. "
        "On START: B001-B006 blockers, then granular backlog by priority."
    )

    WORK_QUEUE_PATH.write_text(
        json.dumps(data, ensure_ascii=False, indent=2) + "\n",
        encoding="utf-8",
    )

    BACKLOG_MD_PATH.write_text(
        generate_backlog_md(merged, data["user_request_count"]),
        encoding="utf-8",
    )

    master = MASTER_MD_PATH.read_text(encoding="utf-8")
    MASTER_MD_PATH.write_text(
        update_master_md(master, len(merged), data["user_request_count"]),
        encoding="utf-8",
    )

    start = START_MD_PATH.read_text(encoding="utf-8")
    START_MD_PATH.write_text(
        update_start_md(start, len(merged), data["user_request_count"]),
        encoding="utf-8",
    )

    prefix_counts = Counter(prefix_of(item["id"]) for item in merged)
    print(f"Existing backlog: {len(existing)}")
    print(f"New items: {len(new_items)}")
    print(f"Total backlog_incomplete: {len(merged)}")
    print(f"Total trackable: {data['total_trackable_items']}")
    print("\nBreakdown by prefix:")
    for pref, count in sorted(prefix_counts.items()):
        print(f"  {pref}: {count}")


if __name__ == "__main__":
    main()
