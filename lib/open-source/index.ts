import packageJson from "@/package.json";

import { npmPackageToEntry } from "@/lib/open-source/npm-packages";
import type { OpenSourcePageData } from "@/lib/open-source/types";
import { UI_UX_OPEN_SOURCE_REFERENCES } from "@/lib/open-source/ui-references";

export type { OpenSourceEntry, OpenSourcePageData, OpenSourceStatus } from "@/lib/open-source/types";
export { UI_UX_OPEN_SOURCE_REFERENCES } from "@/lib/open-source/ui-references";
export { NPM_PACKAGE_REGISTRY } from "@/lib/open-source/npm-packages";

/** package.json dependencies + devDependencies → integrated 목록 */
export function getIntegratedPackagesFromPackageJson() {
  const runtime = Object.keys(packageJson.dependencies ?? {}).sort();
  const dev = Object.keys(packageJson.devDependencies ?? {}).sort();

  return [
    ...runtime.map((name) => npmPackageToEntry(name, false)),
    ...dev.map((name) => npmPackageToEntry(name, true)),
  ];
}

export function getOpenSourcePageData(): OpenSourcePageData {
  return {
    uiReferences: UI_UX_OPEN_SOURCE_REFERENCES,
    integratedPackages: getIntegratedPackagesFromPackageJson(),
    updatedAt: new Date().toISOString().slice(0, 10),
  };
}
