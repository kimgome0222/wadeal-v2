import { getBusinessSettings } from "@/lib/data/business-settings";

import { SiteFooterContent } from "./site-footer-content";

type SiteFooterProps = {
  className?: string;
};

export async function SiteFooter({ className = "" }: SiteFooterProps) {
  const settings = await getBusinessSettings();
  return <SiteFooterContent className={className} settings={settings} />;
}
