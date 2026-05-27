import type { Metadata, Viewport } from "next";

import { DevDataSourceLogger } from "@/components/dev-data-source-logger";
import { probeWadealDataSource } from "@/lib/data/source";

import "./globals.css";

export const metadata: Metadata = {
  title: "Wadeal | Korean Group Buying",
  description: "Premium mobile-first Korean group buying deals.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: "#ffffff",
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
        {dataSource ?
          <DevDataSourceLogger source={dataSource} />
        : null}
        {children}
      </body>
    </html>
  );
}
