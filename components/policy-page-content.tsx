import type { PolicyDocument } from "@/lib/policies/content";
import { ui } from "@/lib/ui";

type PolicyPageContentProps = {
  document: PolicyDocument;
};

export function PolicyPageContent({ document }: PolicyPageContentProps) {
  return (
    <div className={`${ui.pageBody} space-y-4`}>
      <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3">
        <p className="text-xs font-black text-amber-800">법률 검토 필요</p>
        <p className="mt-1 text-[11px] font-bold leading-relaxed text-amber-700">
          {document.legalNotice}
        </p>
      </div>

      <div>
        <p className="text-xs font-bold text-wadeal-muted">{document.subtitle}</p>
      </div>

      <div className="space-y-5">
        {document.sections.map((section) => (
          <section className="rounded-xl border border-wadeal-line bg-white p-4" key={section.title}>
            <h2 className="text-sm font-black text-wadeal-ink">{section.title}</h2>
            <div className="mt-3 space-y-2">
              {section.paragraphs.map((paragraph) => (
                <p
                  className="text-xs font-bold leading-relaxed text-wadeal-muted"
                  key={paragraph}
                >
                  {paragraph}
                </p>
              ))}
              {section.bullets?.length ?
                <ul className="list-disc space-y-1.5 pl-4">
                  {section.bullets.map((bullet) => (
                    <li
                      className="text-xs font-bold leading-relaxed text-wadeal-muted"
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
