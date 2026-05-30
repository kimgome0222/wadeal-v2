import type { PolicyDocument } from "@/lib/policies/content";
import { ui } from "@/lib/ui";

type PolicyPageContentProps = {
  document: PolicyDocument;
};

export function PolicyPageContent({ document }: PolicyPageContentProps) {
  return (
    <div className={`${ui.afterChromeBody} space-y-5 bg-white`}>
      <div className="rounded-2xl border border-wadeal-line bg-wadeal-cream px-4 py-3 shadow-sm">
        <p className="text-xs font-black text-wadeal-coral">법률 검토 필요</p>
        <p className="mt-1 text-[11px] font-bold leading-[1.6] text-wadeal-muted">
          {document.legalNotice}
        </p>
      </div>

      <div className="rounded-2xl border border-wadeal-line bg-white px-4 py-3 shadow-card">
        <p className="text-xs font-bold uppercase tracking-wide text-wadeal-coral">celloh</p>
        <p className="mt-1 text-sm font-black text-wadeal-ink">{document.title}</p>
        <p className="mt-1 text-xs font-bold text-wadeal-muted">{document.subtitle}</p>
        {document.lastUpdated ?
          <p className="mt-2 text-[11px] font-medium text-wadeal-muted">
            최종 수정: {document.lastUpdated}
          </p>
        : null}
      </div>

      <div className="space-y-5">
        {document.sections.map((section) => (
          <section
            className="overflow-hidden rounded-2xl border border-wadeal-line bg-white shadow-card"
            key={section.title}
          >
            <div className="border-b border-wadeal-line bg-wadeal-surface/60 px-4 py-3">
              <h2 className="text-sm font-black text-wadeal-red">{section.title}</h2>
            </div>
            <div className="space-y-2.5 p-4">
              {section.paragraphs.map((paragraph) => (
                <p
                  className="text-xs font-medium leading-[1.6] text-wadeal-muted"
                  key={paragraph}
                >
                  {paragraph}
                </p>
              ))}
              {section.bullets?.length ?
                <ul className="list-disc space-y-1.5 pl-4">
                  {section.bullets.map((bullet) => (
                    <li
                      className="text-xs font-medium leading-relaxed text-wadeal-muted"
                      key={bullet}
                    >
                      {bullet}
                    </li>
                  ))}
                </ul>
              : null}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
