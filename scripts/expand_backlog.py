#!/usr/bin/env python3
"""Idempotently expand docs/work-queue.json backlog_incomplete from codebase globs."""

from __future__ import annotations

import json
import re
import sys
from collections import Counter, defaultdict
from pathlib import Path

SCRIPT_DIR = Path(__file__).resolve().parent
ROOT = SCRIPT_DIR.parent
sys.path.insert(0, str(SCRIPT_DIR))

import generate_granular_backlog as gen  # noqa: E402

WORK_QUEUE_PATH = ROOT / "docs" / "work-queue.json"
BACKLOG_MD_PATH = ROOT / "docs" / "BACKLOG_INCOMPLETE.md"
MASTER_MD_PATH = ROOT / "docs" / "WORK_QUEUE_MASTER.md"
START_MD_PATH = ROOT / "docs" / "START.md"

GENERATED_AT = "2026-05-27"

PREFIX_DESC = {
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

PREFIX_ORDER = [
    "B", "E", "PF", "N", "S", "A", "P", "M", "D", "V", "G",
    "MG", "AP", "SP", "CP", "AC", "LD", "API", "NT", "RLS", "PAY", "LP", "LN", "LA",
]


def all_generated_items() -> list[dict]:
    batches = [
        gen.generate_migration_items(),
        gen.generate_page_items("AP", "admin", "app/admin/**/page.tsx"),
        gen.generate_page_items("SP", "seller", "app/seller/**/page.tsx"),
        gen.generate_customer_pages(),
        gen.generate_action_items(),
        gen.generate_lib_data_items(),
        gen.generate_api_items(),
        gen.generate_notification_type_items(),
        gen.generate_rls_items(),
        gen.generate_pay_items(),
        gen.generate_lib_payments_items(),
        gen.generate_lib_notifications_items(),
        gen.generate_lib_auth_items(),
    ]
    items: list[dict] = []
    for batch in batches:
        items.extend(batch)
    return items


def generate_backlog_md(all_items: list[dict], user_count: int) -> str:
    backlog_count = len(all_items)
    total = user_count + backlog_count
    area_counts = Counter(item["area"] for item in all_items)
    prefix_counts = Counter(gen.prefix_of(item["id"]) for item in all_items)

    lines = [
        f"# BACKLOG INCOMPLETE ({backlog_count} items)",
        "",
        f"> {GENERATED_AT} · `docs/work-queue.json` → `backlog_incomplete[]`",
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
    for pref in PREFIX_ORDER:
        if pref in prefix_counts:
            lines.append(f"| {pref} | {prefix_counts[pref]} | {PREFIX_DESC.get(pref, '')} |")
    for pref in sorted(prefix_counts.keys()):
        if pref not in PREFIX_ORDER:
            lines.append(f"| {pref} | {prefix_counts[pref]} | {PREFIX_DESC.get(pref, '')} |")

    lines.extend(["", "## 영역별 (area)", "", "| area | count |", "|---|---|"])
    for area, count in sorted(area_counts.items(), key=lambda x: (-x[1], x[0])):
        lines.append(f"| {area} | {count} |")

    by_prefix: dict[str, list[dict]] = defaultdict(list)
    for item in all_items:
        by_prefix[gen.prefix_of(item["id"])].append(item)

    lines.extend(["", "## 접두사별 목록 (lookup)", ""])
    for pref in PREFIX_ORDER + sorted(k for k in by_prefix if k not in PREFIX_ORDER):
        if pref not in by_prefix:
            continue
        section_items = by_prefix[pref]
        lines.append(f"### {pref} ({len(section_items)})")
        lines.append("")
        lines.append("| ID | Status | Area | Title |")
        lines.append("|---|---|---|---|")
        for item in section_items:
            title = item["title"].replace("|", "\\|")
            lines.append(
                f"| {item['id']} | {item['status']} | {item['area']} | {title} |"
            )
        lines.append("")

    return "\n".join(lines)


def update_master_md(content: str, backlog_count: int, user_count: int) -> str:
    total = user_count + backlog_count
    header = f"# WORK QUEUE MASTER ({user_count} requests · {backlog_count} backlog)\n"
    header += f"> {GENERATED_AT} · `docs/work-queue.json`이 정본\n"
    header += f"> **추적 가능 합계: {total}건** (W001~ + backlog_incomplete)\n"

    backlog_section = (
        "\n## 재개\n\n"
        "`시작` 입력 → `docs/START.md` 우선순위 (B001–B006 블로커 → 백로그 priority → W001~)\n\n"
        "## 백로그 요약\n\n"
        f"| 항목 | 개수 |\n|---|---|\n"
        f"| work_items (W001~) | {user_count} |\n"
        f"| backlog_incomplete | {backlog_count} |\n"
        f"| **합계** | **{total}** |\n\n"
        "세부 ID 접두사: MG, AP, SP, CP, AC, LD, API, NT, RLS, PAY, LP, LN, LA — `docs/BACKLOG_INCOMPLETE.md`\n"
    )

    if "## 알려진 에러" in content:
        body = "## 알려진 에러" + content.split("## 알려진 에러", 1)[1]
    else:
        body = content

    return header + backlog_section + "\n" + body.lstrip("\n")


def build_start_md(backlog_count: int, user_count: int) -> str:
    total = user_count + backlog_count
    git_block = START_MD_PATH.read_text(encoding="utf-8")
    git_match = re.search(
        r"## Git \(저장 시점\)([\s\S]*?)(?=\n## 추가 저장 \(2차\)|\Z)",
        git_block,
    )
    git_section = git_match.group(0).rstrip() if git_match else ""

    return f"""# 와딜 재개 명령 (`시작`)

> 생성: {GENERATED_AT} · 총 **{user_count}**개 사용자 요청 저장됨

## 한 줄 재개

채팅에 아래만 입력:

```
시작
```

또는:

```
시작 — docs/START.md 우선순위대로. 각 작업 끝 npm run build. push/vercel은 빌드 통과 후.
```

## 우선순위 (재부팅 직후)

1. **Q-BUILD** — `npm run build` 통과 (E001~E002, **B001**)
2. **Q-BLOCKERS** — **B001–B006** 백로그 블로커 (build, git, push, vercel, migration, duplicate export)
3. **Q-COMMIT** — checkpoint docs + build fix 커밋 (**B002**)
4. **Q-PUSH** — `git push origin main` (**B003**, E003)
5. **Q-VERCEL** — `npx vercel --prod` (**B004**, E004)
6. **Q-BACKLOG** — `backlog_incomplete[]` 나머지: **priority high → medium → low**, 동순위는 ID 순 (MG/AP/SP/CP/AC/LD/API/NT/RLS/PAY/LP/LN/LA)
7. **W001~W185** — 저장된 채팅 요청 순차 실행

## 세분화 백로그 ID 접두사

| 접두사 | 범위 |
|---|---|
| MG | `supabase/migrations/*.sql` 원격 적용·스키마 검증 |
| AP | `app/admin/**/page.tsx` |
| SP | `app/seller/**/page.tsx` |
| CP | 고객·마이페이지·결제 등 `app/**/page.tsx` (admin/seller 제외) |
| AC | `app/actions/*.ts` |
| LD | `lib/data/*.ts` |
| API | `app/api/**/route.ts` |
| NT | `lib/notifications/types.ts` 알림 타입별 E2E |
| RLS | 테이블·Storage RLS 검증 버킷 |
| PAY | Toss webhook·confirm·billing·환불 등 결제 단계 |
| LP / LN / LA | `lib/payments`, `lib/notifications`, `lib/auth` 모듈 |

레거시 백로그: **B**, **N**, **S**, **A**, **P**, **M**, **D**, **V**, **G**, **PF**, **E**

## 파일

| 파일 | 용도 |
|------|------|
| `docs/work-queue.json` | W001~ + `backlog_incomplete[]` + resume_command |
| `docs/BACKLOG_INCOMPLETE.md` | 백로그 접두사별 목록 |
| `docs/WORK_QUEUE_MASTER.md` | 인덱스·카테고리·에러·push 실패 |
| `docs/REBOOT_CHECKPOINT.md` | Git/빌드/완료·미완료 요약 |
| `docs/COMMIT_PUSH_QUEUE.md` | Commit&Push 탭 실패 항목 |

{git_section}

## 추가 저장 (2차)

- **채팅 요청 W001~W185**: `work_items[]`
- **기능/미완료 백로그 {backlog_count}건**: `backlog_incomplete[]`
- **합계 {total}건** 추적 가능
- 상세: `docs/BACKLOG_INCOMPLETE.md`
- 생성 스크립트: `scripts/expand_backlog.py`
"""


def main() -> None:
    data = json.loads(WORK_QUEUE_PATH.read_text(encoding="utf-8"))
    existing: list[dict] = list(data["backlog_incomplete"])
    existing_ids = {item["id"] for item in existing}

    new_items: list[dict] = []
    for item in all_generated_items():
        if item["id"] in existing_ids:
            continue
        item = dict(item)
        item["source"] = "backlog"
        new_items.append(item)
        existing_ids.add(item["id"])

    merged = existing + new_items
    user_count = len(data.get("work_items", []))
    backlog_count = len(merged)

    data["backlog_incomplete"] = merged
    data["generated_at"] = GENERATED_AT
    data["backlog_incomplete_count"] = backlog_count
    data["user_request_count"] = user_count
    data["total_trackable_items"] = user_count + backlog_count
    data["total_backlog_incomplete"] = backlog_count
    data["note"] = (
        "work_items=185 chat user_query from transcript. backlog_incomplete=decomposed "
        "feature/module/error tasks. ID prefixes: B/N/S/A/P/M/D/V/G + MG/AP/SP/CP/AC/LD/"
        "API/NT/RLS/PAY/LP/LN/LA. On START: B001-B006 blockers first, then backlog by "
        "priority (high→medium→low)."
    )

    WORK_QUEUE_PATH.write_text(
        json.dumps(data, ensure_ascii=False, indent=2) + "\n",
        encoding="utf-8",
    )

    BACKLOG_MD_PATH.write_text(
        generate_backlog_md(merged, user_count),
        encoding="utf-8",
    )

    master = MASTER_MD_PATH.read_text(encoding="utf-8")
    MASTER_MD_PATH.write_text(
        update_master_md(master, backlog_count, user_count),
        encoding="utf-8",
    )

    START_MD_PATH.write_text(
        build_start_md(backlog_count, user_count),
        encoding="utf-8",
    )

    prefix_counts = Counter(gen.prefix_of(item["id"]) for item in merged)
    print(f"Existing kept: {len(existing)}")
    print(f"Appended: {len(new_items)}")
    print(f"Total backlog_incomplete: {backlog_count}")
    print(f"Total trackable: {user_count + backlog_count}")
    print("\nBreakdown by prefix:")
    for pref, count in sorted(prefix_counts.items()):
        print(f"  {pref}: {count}")

    if backlog_count < 500:
        raise SystemExit(f"ERROR: backlog_incomplete_count {backlog_count} < 500")


if __name__ == "__main__":
    main()
