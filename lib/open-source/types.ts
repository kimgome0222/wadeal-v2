export type OpenSourceStatus = "referenced" | "integrated";

export type OpenSourceEntry = {
  /** 표시 이름 */
  name: string;
  /** 한 줄 설명 */
  description: string;
  status: OpenSourceStatus;
  /** GitHub 또는 공식 저장소 URL */
  githubUrl?: string;
  /** 참고·도입 목적 */
  referencePurpose?: string;
  /** 적용 화면 (CELLOH route 또는 영역) */
  appliedScreens?: string[];
  /** package.json 키 (integrated 전용) */
  npmPackage?: string;
  /** npm devDependency 여부 */
  isDevDependency?: boolean;
};

export type OpenSourcePageData = {
  uiReferences: OpenSourceEntry[];
  integratedPackages: OpenSourceEntry[];
  updatedAt: string;
};
