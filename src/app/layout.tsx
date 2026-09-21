import type { Metadata } from "next";
import type { ReactNode } from "react";
import "../styles/globals.css";

export const metadata: Metadata = {
  title: "nekodemo",
  description: "猫がテーマのプロトタイプ用デザインシステム",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ja" data-neko-theme="calico">
      <body>{children}</body>
    </html>
  );
}
