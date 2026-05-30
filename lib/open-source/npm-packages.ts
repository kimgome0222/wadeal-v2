import type { OpenSourceEntry } from "@/lib/open-source/types";

type NpmPackageMeta = Pick<
  OpenSourceEntry,
  "name" | "description" | "githubUrl" | "referencePurpose" | "appliedScreens"
>;

/** package.json 키 → 표시 메타. 신규 패키지 추가 시 여기와 docs/OPEN_SOURCE_REFERENCE.md 갱신 */
export const NPM_PACKAGE_REGISTRY: Record<string, NpmPackageMeta> = {
  next: {
    name: "Next.js",
    description: "React 앱 프레임워크",
    githubUrl: "https://github.com/vercel/next.js",
    referencePurpose: "App Router, SSR, 라우팅",
    appliedScreens: ["앱 전반"],
  },
  react: {
    name: "React",
    description: "UI 라이브러리",
    githubUrl: "https://github.com/facebook/react",
    referencePurpose: "컴포넌트 기반 UI",
    appliedScreens: ["앱 전반"],
  },
  "react-dom": {
    name: "React DOM",
    description: "React DOM 렌더러",
    githubUrl: "https://github.com/facebook/react",
    referencePurpose: "클라이언트 렌더링",
    appliedScreens: ["앱 전반"],
  },
  "@supabase/ssr": {
    name: "Supabase SSR",
    description: "Supabase 서버·클라이언트 세션",
    githubUrl: "https://github.com/supabase/ssr",
    referencePurpose: "로그인 세션, 쿠키 기반 auth",
    appliedScreens: ["로그인", "회원가입", "마이셀로"],
  },
  "@supabase/supabase-js": {
    name: "Supabase JS",
    description: "Supabase 클라이언트 SDK",
    githubUrl: "https://github.com/supabase/supabase-js",
    referencePurpose: "인증·DB·스토리지 API",
    appliedScreens: ["로그인", "마이셀로", "알림"],
  },
  "@tosspayments/tosspayments-sdk": {
    name: "Toss Payments SDK",
    description: "토스페이먼츠 결제 SDK",
    githubUrl: "https://docs.tosspayments.com/",
    referencePurpose: "결제·빌링 연동",
    appliedScreens: ["결제", "장바구니"],
  },
  tailwindcss: {
    name: "Tailwind CSS",
    description: "유틸리티 CSS 프레임워크",
    githubUrl: "https://github.com/tailwindlabs/tailwindcss",
    referencePurpose: "디자인 토큰, spacing·typography",
    appliedScreens: ["앱 전반 UI"],
  },
  typescript: {
    name: "TypeScript",
    description: "정적 타입 JavaScript",
    githubUrl: "https://github.com/microsoft/TypeScript",
    referencePurpose: "타입 안전성",
    appliedScreens: ["코드베이스 전반"],
  },
  autoprefixer: {
    name: "Autoprefixer",
    description: "CSS vendor prefix",
    githubUrl: "https://github.com/postcss/autoprefixer",
    referencePurpose: "브라우저 호환 CSS",
    appliedScreens: ["빌드"],
  },
  postcss: {
    name: "PostCSS",
    description: "CSS 변환 도구",
    githubUrl: "https://github.com/postcss/postcss",
    referencePurpose: "Tailwind 파이프라인",
    appliedScreens: ["빌드"],
  },
  "@types/node": {
    name: "@types/node",
    description: "Node.js 타입 정의",
    githubUrl: "https://github.com/DefinitelyTyped/DefinitelyTyped",
    referencePurpose: "Node API 타입",
    appliedScreens: ["개발"],
  },
  "@types/react": {
    name: "@types/react",
    description: "React 타입 정의",
    githubUrl: "https://github.com/DefinitelyTyped/DefinitelyTyped",
    referencePurpose: "React 컴포넌트 타입",
    appliedScreens: ["개발"],
  },
  "@types/react-dom": {
    name: "@types/react-dom",
    description: "React DOM 타입 정의",
    githubUrl: "https://github.com/DefinitelyTyped/DefinitelyTyped",
    referencePurpose: "DOM 렌더 타입",
    appliedScreens: ["개발"],
  },
};

function fallbackMeta(packageName: string): NpmPackageMeta {
  return {
    name: packageName,
    description: "프로젝트 의존성",
    referencePurpose: "package.json에 등록된 패키지",
    appliedScreens: ["앱"],
  };
}

export function npmPackageToEntry(
  packageName: string,
  isDevDependency: boolean,
): OpenSourceEntry {
  const meta = NPM_PACKAGE_REGISTRY[packageName] ?? fallbackMeta(packageName);

  return {
    ...meta,
    status: "integrated",
    npmPackage: packageName,
    isDevDependency,
  };
}
