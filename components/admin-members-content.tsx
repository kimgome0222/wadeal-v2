"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import {
  getAdminMemberAccountStatusLabel,
  getAdminMemberRoleLabel,
  type AdminMemberRow,
} from "@/lib/data/admin-members";
import { ui } from "@/lib/ui";

type AdminMembersContentProps = {
  members: AdminMemberRow[];
  initialQuery: string;
};

export function AdminMembersContent({ members, initialQuery }: AdminMembersContentProps) {
  const router = useRouter();
  const [query, setQuery] = useState(initialQuery);

  function handleSearch(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const trimmed = query.trim();
    router.push(trimmed ? `/admin/members?q=${encodeURIComponent(trimmed)}` : "/admin/members");
  }

  return (
    <div className="space-y-4">
      <form className="flex gap-2" onSubmit={handleSearch}>
        <input
          className={`${ui.input} h-10 flex-1 text-xs`}
          name="q"
          onChange={(event) => setQuery(event.target.value)}
          placeholder="이메일 · 닉네임 · 휴대폰 검색"
          value={query}
        />
        <button className={`${ui.btnPrimary} h-10 px-4 text-xs`} type="submit">
          검색
        </button>
      </form>

      {members.length === 0 ?
        <p className={`${ui.panel} py-10 text-center text-sm font-bold text-wadeal-muted`}>
          표시할 회원이 없어요.
        </p>
      : <div className="overflow-x-auto rounded-xl border border-wadeal-line bg-white">
          <table className="min-w-full text-left text-xs">
            <thead className="border-b border-wadeal-line bg-wadeal-surface text-[11px] font-black text-wadeal-muted">
              <tr>
                <th className="px-3 py-2">닉네임</th>
                <th className="px-3 py-2">이메일</th>
                <th className="px-3 py-2">역할</th>
                <th className="px-3 py-2">계정</th>
                <th className="px-3 py-2">가입일</th>
              </tr>
            </thead>
            <tbody>
              {members.map((member) => (
                <tr className="border-b border-wadeal-line/60 last:border-0" key={member.id}>
                  <td className="px-3 py-2 font-black text-wadeal-ink">
                    {member.nickname ?? "—"}
                  </td>
                  <td className="px-3 py-2 font-bold text-wadeal-muted">{member.email ?? "—"}</td>
                  <td className="px-3 py-2 font-bold text-wadeal-ink">
                    {getAdminMemberRoleLabel(member.role)}
                  </td>
                  <td className="px-3 py-2 font-bold text-wadeal-muted">
                    {getAdminMemberAccountStatusLabel(member.accountStatus)}
                  </td>
                  <td className="px-3 py-2 font-bold text-wadeal-muted">{member.createdAtLabel}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      }
    </div>
  );
}
