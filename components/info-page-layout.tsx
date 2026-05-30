import type { ReactNode } from "react";

import { ds } from "@/lib/design-system";
import { ui } from "@/lib/ui";

type InfoPageBodyProps = {
  children: ReactNode;
};

/** 마켓컬리형 정보 페이지 — 넓은 여백, 카드 남발 없음 */
export function InfoPageBody({ children }: InfoPageBodyProps) {
  return (
    <div className={`${ui.afterChromeBody} space-y-8 bg-white pb-8`}>{children}</div>
  );
}

type InfoPageIntroProps = {
  title: string;
  description: string;
  meta?: string;
};

export function InfoPageIntro({ title, description, meta }: InfoPageIntroProps) {
  return (
    <header className="space-y-3 border-b border-[#EEF3F0] pb-6">
      <p className="text-[11px] font-medium uppercase tracking-[0.08em] text-[#2E5E4E]">
        celloh
      </p>
      <h1 className={ds.type.h1}>{title}</h1>
      <p className={`${ds.type.body} max-w-prose leading-[1.65] text-wadeal-muted`}>
        {description}
      </p>
      {meta ?
        <p className={`${ds.type.meta} text-wadeal-muted`}>{meta}</p>
      : null}
    </header>
  );
}

type InfoPageSectionProps = {
  title: string;
  description?: string;
  children: ReactNode;
};

export function InfoPageSection({ title, description, children }: InfoPageSectionProps) {
  return (
    <section className="space-y-5">
      <div className="space-y-1.5">
        <h2 className={ds.type.h2}>{title}</h2>
        {description ?
          <p className={`${ds.type.bodySm} leading-[1.65] text-wadeal-muted`}>{description}</p>
        : null}
      </div>
      {children}
    </section>
  );
}

type InfoPageListProps = {
  children: ReactNode;
};

/** 리스트 간격 28px — 단순 구분선 구조 */
export function InfoPageList({ children }: InfoPageListProps) {
  return <ul className="divide-y divide-[#EEF3F0]">{children}</ul>;
}

type InfoPageListItemProps = {
  children: ReactNode;
};

export function InfoPageListItem({ children }: InfoPageListItemProps) {
  return <li className="py-7 first:pt-0 last:pb-0">{children}</li>;
}
