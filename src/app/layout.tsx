import type { Metadata } from "next";
import type { ReactNode } from "react";
import { NekoHead } from "@/components/theme/NekoHead";
import { NekoThemeProvider } from "@/components/theme/NekoThemeProvider";
import { SiteHeader } from "./site-header";
import "../styles/globals.css";

export const metadata: Metadata = {
  title: "nekodemo",
  description: "猫がテーマのプロトタイプ用デザインシステム",
};

// data-neko-theme は SSR 時から付ける（ちらつき防止）。persist 時は NekoHead の inline script が
// hydration 前に保存済みテーマへ書き換えるため suppressHydrationWarning を付ける。
export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ja" data-neko-theme="calico" suppressHydrationWarning>
      <head>
        <NekoHead />
      </head>
      <body className="min-h-screen bg-surface-page text-text-high">
        <NekoThemeProvider defaultTheme="calico" persist>
          <SiteHeader />
          {children}
        </NekoThemeProvider>
      </body>
    </html>
  );
}
