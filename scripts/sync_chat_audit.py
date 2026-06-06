#!/usr/bin/env python3
"""Audit chat transcript vs work-queue.json; add missing W-items; update docs."""

from __future__ import annotations

import json
import re
from collections import Counter
from datetime import date
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
TRANSCRIPT = Path(
    "/Users/kimgana/.cursor/projects/Users-kimgana-Documents-wadeal-v2/"
    "agent-transcripts/35f2dd69-dff7-4b75-b2fa-ab9770984b7c/"
    "35f2dd69-dff7-4b75-b2fa-ab9770984b7c.jsonl"
)
WORK_QUEUE_PATH = ROOT / "docs" / "work-queue.json"
AUDIT_PATH = ROOT / "docs" / "CHAT_REQUEST_AUDIT.md"
PROMPTS_DIR = ROOT / "docs" / "work-queue-prompts"
MASTER_PATH = ROOT / "docs" / "WORK_QUEUE_MASTER.md"
START_PATH = ROOT / "docs" / "START.md"
REBOOT_PATH = ROOT / "docs" / "REBOOT_CHECKPOINT.md"

SKIP_PATTERNS = [
    r"DO NOT reiterate",
    r"subagent result is already visible",
    r"^Implement the plan",
    r"^You are working in",
    r"^## User requirement",
    r"If the available MCP tools do not fully support",
    r"^Start multitasking$",
    r"Briefly inform the user about the task result",
]

# Corrections and new items (applied after base load)
LINE_FIXES = {
    "W185": 1314,
}

CORRECTED_ITEMS = {
    "W181": {
        "line": 1319,
        "category": "meta",
        "priority": "high",
        "status": "pending",
        "title": "100+ 미완료·신규 작업 저장 확인",
        "prompt": (
            "작업 요청한것들 미완료된것들 새로운 작업들만해도 가각 100개가 넘는데 "
            "그거도 다 저장햇어?"
        ),
    },
    "W182": {
        "line": 1323,
        "category": "meta",
        "priority": "high",
        "status": "done",
        "title": "승인(응): backlog_incomplete 2차 저장",
        "prompt": "응",
        "context": (
            "사용자가 assistant의 2차 저장 제안(채팅 185건 + backlog_incomplete 120건 기능/모듈 "
            "미완료 백로그 추가)에 대해 승인함."
        ),
    },
    "W183": {
        "line": 1325,
        "category": "meta",
        "priority": "high",
        "status": "done",
        "title": "승인(응): backlog 500+ 세분화 확장",
        "prompt": "응",
        "context": (
            "사용자가 backlog_incomplete를 500건 이상으로 세분화(MG/AP/SP/CP/AC/LD/API/NT/RLS/PAY "
            "등 파일·모듈 단위) 확장하는 작업에 승인함."
        ),
    },
    "W184": {
        "line": 1331,
        "category": "meta",
        "priority": "high",
        "status": "done",
        "title": "승인(응): 500+ 백로그 확장 재개",
        "prompt": "응",
        "context": "중단된 500+ 백로그 세분화 작업 재개·완료에 대한 승인.",
    },
}

NEW_ITEMS = [
    {
        "line": 57,
        "category": "meta",
        "priority": "low",
        "status": "unknown",
        "title": "완료 확인(됫어)",
        "prompt": "됫어",
    },
    {
        "line": 227,
        "category": "meta",
        "priority": "low",
        "status": "unknown",
        "title": "작업 완료 보고(만들엇어)",
        "prompt": "만들엇어",
    },
    {
        "line": 1341,
        "category": "meta",
        "priority": "critical",
        "status": "pending",
        "title": "채팅 요청 전수 저장(빠짐없이)",
        "prompt": "채팅내용 내가 요구한 작업 내용 그대로 다 저장해야해/ 빠짐없이 .",
    },
]

PUSH_FAILED_IDS = {"W007", "W170", "W173", "W175", "W176", "W177"}


def extract_user_text(obj: dict) -> str:
    msg = obj.get("message", {})
    parts = [
        b.get("text", "")
        for b in msg.get("content", [])
        if isinstance(b, dict) and b.get("type") == "text"
    ]
    text = "\n".join(parts).strip()
    m = re.search(r"<user_query>\s*(.*?)\s*</user_query>", text, re.DOTALL)
    return m.group(1).strip() if m else text


def should_skip(text: str) -> bool:
    if len(text.strip()) < 2:
        return True
    for p in SKIP_PATTERNS:
        if re.search(p, text, re.I | re.DOTALL):
            return True
    return False


def categorize(prompt: str) -> str:
    pl = prompt.lower()
    if "execute the selected" in pl or "git " in pl or "commit" in pl or "push" in pl or "vercel" in pl:
        return "git_deploy"
    if any(k in prompt for k in ("카카오", "로그인", "oauth", "auth")):
        return "auth"
    if any(k in pl for k in ("결제", "toss", "payment", "webhook")):
        return "payment"
    if "알림" in prompt or "notification" in pl:
        return "notifications"
    if "저장" in prompt or "재부팅" in prompt or "시작" in prompt or prompt.strip() == "응":
        return "meta"
    if "npm run build" in pl or "build" in pl or "error" in pl or "fix" in pl:
        return "build_error"
    return "general"


def priority_for(category: str, prompt: str) -> str:
    if category == "meta" and ("빠짐" in prompt or "전수" in prompt or "100개" in prompt):
        return "critical"
    if category in ("build_error", "git_deploy") or "Execute the selected" in prompt:
        return "high"
    if category == "meta":
        return "high" if prompt.strip() == "응" else "low"
    return "medium"


def status_for(prompt: str, category: str) -> str:
    if "Execute the selected diff-tab push" in prompt:
        return "push_failed"
    if "commit-and-push" in prompt:
        return "push_failed"
    if category == "meta" and prompt.strip() == "응":
        return "done"
    return "unknown"


def make_resume_command(wid: str, prompt: str, context: str | None = None) -> str:
    body = prompt
    if context:
        body = f"{prompt}\n\n[맥락]\n{context}"
    return (
        f"{wid} 실행: 아래 요청을 완료해줘. npm run build 통과 확인. 디자인 유지.\n\n{body}"
    )


def make_work_item(
    wid: str,
    *,
    line: int,
    prompt: str,
    category: str | None = None,
    priority: str | None = None,
    status: str | None = None,
    title: str | None = None,
    context: str | None = None,
) -> dict:
    cat = category or categorize(prompt)
    pri = priority or priority_for(cat, prompt)
    st = status or status_for(prompt, cat)
    tit = title or (prompt[:60] + ("…" if len(prompt) > 60 else ""))
    item = {
        "id": wid,
        "source": "chat",
        "line": line,
        "category": cat,
        "priority": pri,
        "status": st,
        "title": tit,
        "prompt": prompt,
        "resume_command": make_resume_command(wid, prompt, context),
    }
    if context:
        item["context"] = context
    return item


def scan_transcript() -> tuple[int, int, list[tuple[int, str]]]:
    all_user = 0
    work_msgs: list[tuple[int, str]] = []
    with TRANSCRIPT.open(encoding="utf-8") as f:
        for line_no, line in enumerate(f, 1):
            obj = json.loads(line)
            if obj.get("role") != "user":
                continue
            all_user += 1
            text = extract_user_text(obj)
            if not should_skip(text):
                work_msgs.append((line_no, text))
    return all_user, len(work_msgs), work_msgs


def regenerate_prompt_parts(items: list[dict]) -> None:
    PROMPTS_DIR.mkdir(parents=True, exist_ok=True)
    for old in PROMPTS_DIR.glob("part-*.md"):
        old.unlink()

    per_part = 25
    for part_idx in range(0, (len(items) + per_part - 1) // per_part):
        chunk = items[part_idx * per_part : (part_idx + 1) * per_part]
        part_num = part_idx + 1
        lines = [f"# Work Queue Prompts Part {part_num:02d}\n"]
        for w in chunk:
            lines.append(
                f"\n## {w['id']} (L{w.get('line', '?')}, {w['category']}, {w['status']})\n"
            )
            lines.append(f"\n{w['prompt']}\n")
            lines.append("\n---\n")
        (PROMPTS_DIR / f"part-{part_num:02d}.md").write_text(
            "".join(lines), encoding="utf-8"
        )


def update_master(items: list[dict], backlog_count: int) -> None:
    user_count = len(items)
    total = user_count + backlog_count
    header = (
        f"# WORK QUEUE MASTER ({user_count} requests · {backlog_count} backlog)\n"
        f"> {date.today().isoformat()} · `docs/work-queue.json`이 정본\n"
        f"> **추적 가능 합계: {total}건** (W001~ + backlog_incomplete)\n"
    )
    backlog_section = (
        "\n## 재개\n\n"
        "`시작` 입력 → `docs/START.md` 우선순위 (B001–B006 블로커 → 백로그 priority → W001~)\n\n"
        "## 백로그 요약\n\n"
        f"| 항목 | 개수 |\n|---|---|\n"
        f"| work_items (W001~) | {user_count} |\n"
        f"| backlog_incomplete | {backlog_count} |\n"
        f"| **합계** | **{total}** |\n\n"
        "세부 ID 접두사: MG, AP, SP, CP, AC, LD, API, NT, RLS, PAY, LP, LN, LA — "
        "`docs/BACKLOG_INCOMPLETE.md`\n"
    )

    push_lines = [
        "\n## Commit&Push 실패\n\n",
    ]
    for w in items:
        if w.get("status") == "push_failed":
            preview = w["prompt"][:60].replace("\n", " ")
            push_lines.append(
                f"- **{w['id']}** (L{w.get('line')}): `{preview}...`\n"
            )

    cat_counts = Counter(w["category"] for w in items)
    cat_table = "\n## 카테고리별 요청 수\n\n| 카테고리 | 개수 |\n|---|---|\n"
    for cat, cnt in sorted(cat_counts.items(), key=lambda x: (-x[1], x[0])):
        cat_table += f"| {cat} | {cnt} |\n"

    index = "\n## 전체 요청 인덱스 (W001~)\n\n"
    index += "| ID | Cat | Pri | Status | Preview |\n|---|---|---|---|---|\n"
    for w in items:
        preview = w["prompt"][:80].replace("\n", " ").replace("|", "\\|")
        index += (
            f"| {w['id']} | {w['category']} | {w['priority']} | {w['status']} | "
            f"{preview} |\n"
        )

    errors_section = ""
    if "## 알려진 에러" in (MASTER_PATH.read_text(encoding="utf-8") if MASTER_PATH.exists() else ""):
        old = MASTER_PATH.read_text(encoding="utf-8")
        if "## 알려진 에러" in old:
            errors_section = "\n" + old.split("## 알려진 에러", 1)[1]

    MASTER_PATH.write_text(
        header + backlog_section + "".join(push_lines) + cat_table + index + errors_section,
        encoding="utf-8",
    )


def update_start(user_count: int, backlog_count: int) -> None:
    total = user_count + backlog_count
    last_w = f"W{user_count:03d}"
    content = START_PATH.read_text(encoding="utf-8")
    content = re.sub(r"총 \*\*\d+\*\*개", f"총 **{user_count}**개", content)
    content = re.sub(r"W001~W\d+", f"W001~{last_w}", content)
    content = re.sub(r"\*\*합계 \d+건\*\*", f"**합계 {total}건**", content)
    content = re.sub(
        r"기능/미완료 백로그 \d+건",
        f"기능/미완료 백로그 {backlog_count}건",
        content,
    )
    # dedupe duplicate "## 추가 저장" sections
    parts = content.split("## 추가 저장 (2차)")
    if len(parts) > 2:
        content = parts[0] + "## 추가 저장 (2차)" + parts[1]
    audit_line = f"- **감사 리포트**: `docs/CHAT_REQUEST_AUDIT.md` ({date.today().isoformat()})\n"
    if "CHAT_REQUEST_AUDIT" not in content:
        content = content.replace(
            "- 상세: `docs/BACKLOG_INCOMPLETE.md`",
            audit_line + "- 상세: `docs/BACKLOG_INCOMPLETE.md`",
            1,
        )
    START_PATH.write_text(content, encoding="utf-8")


def update_reboot(user_count: int, backlog_count: int) -> None:
    last_w = f"W{user_count:03d}"
    REBOOT_PATH.write_text(
        f"""# REBOOT CHECKPOINT

> {date.today().isoformat()} · **{user_count}개** 작업 요청 저장 완료

## 재개: `시작`

## 정본 파일
- **`docs/work-queue.json`** — W001~{last_w} 전체 prompt + resume_command
- **`docs/WORK_QUEUE_MASTER.md`** — 인덱스·에러·카테고리
- **`docs/START.md`** — 재개 명령
- **`docs/COMMIT_PUSH_QUEUE.md`** — push 실패 (6건)
- **`docs/CHAT_REQUEST_AUDIT.md`** — 채팅 대조 감사 리포트

## 추적 합계
- work_items: **{user_count}**
- backlog_incomplete: **{backlog_count}**
- **합계: {user_count + backlog_count}**

## Git
- main, origin보다 **12커밋 ahead**
- push ❌ HTTPS 인증
- build ❌ (admin-products current_quantity 등)

## 우선 Q-BUILD → Q-COMMIT → Q-PUSH → Q-VERCEL → W001~
""",
        encoding="utf-8",
    )


def write_audit_report(
    *,
    all_user: int,
    work_msg_count: int,
    before_count: int,
    after_count: int,
    added_ids: list[str],
    corrected_ids: list[str],
    backlog_count: int,
) -> None:
    lines = [
        f"# CHAT REQUEST AUDIT\n",
        f"> {date.today().isoformat()} · transcript `35f2dd69-dff7-4b75-b2fa-ab9770984b7c`\n",
        "\n## Summary\n\n",
        f"| Metric | Value |\n|---|---|\n",
        f"| Total user messages scanned | {all_user} |\n",
        f"| Work-relevant user messages (after filter) | {work_msg_count} |\n",
        f"| work_items before | {before_count} |\n",
        f"| work_items after | {after_count} |\n",
        f"| backlog_incomplete | {backlog_count} |\n",
        f"| Total trackable | {after_count + backlog_count} |\n",
        "\n## Newly added IDs\n\n",
    ]
    if added_ids:
        for i in added_ids:
            lines.append(f"- `{i}`\n")
    else:
        lines.append("- (none)\n")

    lines.append("\n## Corrected IDs\n\n")
    if corrected_ids:
        for i in corrected_ids:
            lines.append(f"- `{i}`\n")
    else:
        lines.append("- (none)\n")

    lines.extend(
        [
            "\n## Meta-requests captured\n\n",
            "- 재부팅 전 전체 저장 (W178~W180, W185)\n",
            "- Commit&Push 탭 실패 6건 (W007, W170, W173, W175–W177)\n",
            "- 100+ 미완료·신규 저장 확인 (W181→L1319)\n",
            "- `응` 승인: 2차 백로그·500+ 확장 (W182–W184)\n",
            "- 채팅 전수 저장 빠짐없이 (W192)\n",
            "\n## Ambiguous (included as work items)\n\n",
            "- L57 `됫어`, L227 `만들엇어` — 짧은 완료/상태 확인\n",
            "\n## Notes\n\n",
            "- W184 was incorrectly mapped to phantom push at L1329; corrected to L1331 `응`.\n",
            "- backlog_incomplete 505건: user `응` 승인 반영 완료 (500+ 목표).\n",
        ]
    )
    AUDIT_PATH.write_text("".join(lines), encoding="utf-8")


def main() -> None:
    all_user, work_msg_count, _ = scan_transcript()
    data = json.loads(WORK_QUEUE_PATH.read_text(encoding="utf-8"))
    items: list[dict] = data["work_items"]
    before_count = len(items)
    corrected_ids: list[str] = []

    by_id = {w["id"]: w for w in items}

    for wid, line in LINE_FIXES.items():
        if wid in by_id:
            by_id[wid]["line"] = line
            corrected_ids.append(wid)

    for wid, patch in CORRECTED_ITEMS.items():
        if wid not in by_id:
            continue
        w = by_id[wid]
        corrected_ids.append(wid)
        for key, val in patch.items():
            if key == "context":
                continue
            w[key] = val
        ctx = patch.get("context")
        w["resume_command"] = make_resume_command(wid, w["prompt"], ctx)
        if ctx:
            w["context"] = ctx

    # Add new items W186+
    next_num = max(int(w["id"][1:]) for w in items) + 1
    added_ids: list[str] = []
    for spec in NEW_ITEMS:
        wid = f"W{next_num:03d}"
        next_num += 1
        item = make_work_item(
            wid,
            line=spec["line"],
            prompt=spec["prompt"],
            category=spec.get("category"),
            priority=spec.get("priority"),
            status=spec.get("status"),
            title=spec.get("title"),
        )
        items.append(item)
        by_id[wid] = item
        added_ids.append(wid)

    items.sort(key=lambda w: int(w["id"][1:]))

    # Fix push_failed_requests — remove erroneous W184 push
    data["push_failed_requests"] = [
        e
        for e in data.get("push_failed_requests", [])
        if e.get("id") in PUSH_FAILED_IDS
    ]

    user_count = len(items)
    backlog = data.get("backlog_incomplete", [])
    backlog_count = len(backlog)

    data["work_items"] = items
    data["generated_at"] = date.today().isoformat()
    data["total_user_requests"] = user_count
    data["user_request_count"] = user_count
    data["backlog_incomplete_count"] = backlog_count
    data["total_backlog_incomplete"] = backlog_count
    data["total_trackable_items"] = user_count + backlog_count
    data["note"] = (
        f"work_items={user_count} chat user_query from transcript. "
        f"backlog_incomplete={backlog_count} decomposed tasks. "
        "On START: B001-B006 blockers first, then backlog by priority."
    )

    WORK_QUEUE_PATH.write_text(
        json.dumps(data, ensure_ascii=False, indent=2) + "\n",
        encoding="utf-8",
    )

    regenerate_prompt_parts(items)
    update_master(items, backlog_count)
    update_start(user_count, backlog_count)
    update_reboot(user_count, backlog_count)
    write_audit_report(
        all_user=all_user,
        work_msg_count=work_msg_count,
        before_count=before_count,
        after_count=user_count,
        added_ids=added_ids,
        corrected_ids=sorted(set(corrected_ids)),
        backlog_count=backlog_count,
    )

    # Verification
    ids = [w["id"] for w in items]
    dups = [k for k, v in Counter(ids).items() if v > 1]
    print("=== Verification ===")
    print(f"work_items: {len(items)}")
    print(f"backlog_incomplete: {backlog_count}")
    print(f"total trackable: {user_count + backlog_count}")
    print(f"duplicate IDs: {dups or 'none'}")
    print(f"added: {added_ids}")
    print(f"corrected: {sorted(set(corrected_ids))}")


if __name__ == "__main__":
    main()
