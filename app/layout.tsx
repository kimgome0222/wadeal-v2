import type { Viewport } from "next";

import { AuthProvider } from "@/components/auth-provider";
import { AppSplash } from "@/components/app-splash";
import { DevDataSourceLogger } from "@/components/dev-data-source-logger";
import { probeWadealDataSource } from "@/lib/data/source";
import { rootMetadata, siteConfig } from "@/lib/seo/site";

import "./globals.css";

export const metadata = rootMetadata;

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: siteConfig.themeColor },
    { media: "(prefers-color-scheme: dark)", color: siteConfig.themeColor },
  ],
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const dataSource =
    process.env.NODE_ENV === "development" ?
      await probeWadealDataSource()
    : null;

  return (
    <html lang="ko">
      <body>
        <AuthProvider>
          <AppSplash />
          {dataSource ?
            <DevDataSourceLogger source={dataSource} />
          : null}
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
