"use client";

import Link from "next/link";
import { Mascot } from "@/components/mascot";
import { NekoThemePicker } from "@/components/theme/NekoThemePicker";
import { useNekoTheme } from "@/components/theme/NekoThemeProvider";

const NAV: { href: string; label: string }[] = [
  { href: "/tokens/", label: "トークン" },
  { href: "/themes/", label: "テーマ" },
];

export function SiteHeader() {
  const { theme } = useNekoTheme();
  return (
    <header className="sticky top-0 z-10 flex flex-wrap items-center gap-x-6 gap-y-2 border-border-low border-b bg-surface-card px-6 py-2 shadow-raise">
      <Link href="/" className="flex items-center gap-2 font-bold text-text-high">
        <Mascot theme={theme} size={32} />
        nekodemo
      </Link>
      <nav aria-label="メイン" className="flex gap-4 text-2">
        {NAV.map((n) => (
          <Link key={n.href} href={n.href} className="text-text-middle hover:text-text-high">
            {n.label}
          </Link>
        ))}
      </nav>
      <div className="ml-auto">
        <NekoThemePicker />
      </div>
    </header>
  );
}
