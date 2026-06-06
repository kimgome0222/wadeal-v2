import Link from "next/link";

import {
  InfoPageBody,
  InfoPageIntro,
  InfoPageList,
  InfoPageListItem,
  InfoPageSection,
} from "@/components/info-page-layout";
import type { OpenSourceEntry, OpenSourcePageData } from "@/lib/open-source/types";
import { ds } from "@/lib/design-system";

type OpenSourcePageContentProps = {
  data: OpenSourcePageData;
};

function StatusBadge({ status }: { status: OpenSourceEntry["status"] }) {
  const isIntegrated = status === "integrated";

  return (
    <span
      className={`inline-flex shrink-0 items-center rounded-full px-2.5 py-1 text-[11px] font-medium leading-none ${
        isIntegrated ?
          "bg-[#2E5E4E] text-white"
        : "border border-[#DDE8E2] bg-white text-wadeal-muted"
      }`}
    >
      {isIntegrated ? "Integrated" : "Referenced"}
    </span>
  );
}

function OpenSourceListRow({ entry }: { entry: OpenSourceEntry }) {
  const titleContent =
    entry.githubUrl ?
      <Link
        className={`${ds.type.h3} text-wadeal-ink underline-offset-2 transition-colors hover:text-[#2E5E4E] hover:underline`}
        href={entry.githubUrl}
        rel="noopener noreferrer"
        target="_blank"
      >
        {entry.name}
      </Link>
    : <h3 className={ds.type.h3}>{entry.name}</h3>;

  return (
    <article className="space-y-2.5">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 space-y-1">
          {titleContent}
          <p className={`${ds.type.body} leading-[1.65] text-wadeal-muted`}>{entry.description}</p>
        </div>
        <StatusBadge status={entry.status} />
      </div>

      {entry.referencePurpose ?
        <p className={`${ds.type.bodySm} leading-[1.65] text-wadeal-ink`}>
          {entry.referencePurpose}
        </p>
      : null}

      {entry.appliedScreens?.length ?
        <p className={`${ds.type.meta} leading-relaxed text-wadeal-muted`}>
          적용: {entry.appliedScreens.join(" · ")}
        </p>
      : null}

      {entry.npmPackage ?
        <p className={`${ds.type.meta} font-mono text-wadeal-muted`}>
          {entry.npmPackage}
          {entry.isDevDependency ? " (dev)" : ""}
        </p>
      : null}
    </article>
  );
}

export function OpenSourcePageContent({ data }: OpenSourcePageContentProps) {
  const runtimePackages = data.integratedPackages.filter((item) => !item.isDevDependency);
  const devPackages = data.integratedPackages.filter((item) => item.isDevDependency);

  return (
    <InfoPageBody>
      <InfoPageIntro
        description="CELLOH는 마켓컬리 오픈소스 공개 페이지처럼, 참고한 UI/UX 철학과 실제 사용 중인 오픈소스를 구분해 안내합니다. 넓은 여백과 읽기 쉬운 리스트로 정보를 전달합니다."
        meta={`기준일 ${data.updatedAt} · package.json 자동 수집`}
        title="오픈소스 고지"
      />

      <InfoPageSection
        description="iOS·서비스 앱 UI 구성·가독성 참고 목록입니다. CELLOH 웹앱에 해당 라이브러리를 설치하지 않으며, 정보 페이지 레이아웃·리스트 UX 설계에 활용합니다."
        title="UI/UX 참고"
      >
        <InfoPageList>
          {data.uiReferences.map((entry) => (
            <InfoPageListItem key={entry.name}>
              <OpenSourceListRow entry={entry} />
            </InfoPageListItem>
          ))}
        </InfoPageList>
      </InfoPageSection>

      <InfoPageSection
        description="package.json dependencies 기준으로 자동 수집됩니다. 신규 패키지 설치 시 lib/open-source/npm-packages.ts와 docs/OPEN_SOURCE_REFERENCE.md를 함께 갱신하세요."
        title="프로젝트 사용 패키지"
      >
        <InfoPageList>
          {runtimePackages.map((entry) => (
            <InfoPageListItem key={entry.npmPackage ?? entry.name}>
              <OpenSourceListRow entry={entry} />
            </InfoPageListItem>
          ))}
        </InfoPageList>
      </InfoPageSection>

      {devPackages.length > 0 ?
        <InfoPageSection
          description="개발·빌드 도구 의존성입니다."
          title="개발 도구"
        >
          <InfoPageList>
            {devPackages.map((entry) => (
              <InfoPageListItem key={entry.npmPackage ?? entry.name}>
                <OpenSourceListRow entry={entry} />
              </InfoPageListItem>
            ))}
          </InfoPageList>
        </InfoPageSection>
      : null}

      <footer className="border-t border-[#EEF3F0] pt-6">
        <p className={`${ds.type.bodySm} leading-[1.65] text-wadeal-muted`}>
          새 라이브러리를 참고하거나 도입할 때는{" "}
          <span className="font-medium text-wadeal-ink">docs/OPEN_SOURCE_REFERENCE.md</span>와
          본 페이지 데이터 소스(
          <span className="font-medium text-wadeal-ink">lib/open-source/</span>
          )를 함께 업데이트해 주세요.
        </p>
      </footer>
    </InfoPageBody>
  );
}
