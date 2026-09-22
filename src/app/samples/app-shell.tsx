"use client";

// サンプル画面の共通枠: 左に SideNavigation（240 / 64px）、上にアプリ名。コンテンツ幅の最大は 1200px、ページ余白 24px（設計書 §10.1）。
import NextLink from "next/link";
import type { ReactNode } from "react";
import { Mascot } from "@/components/mascot";
import { useNekoTheme } from "@/components/theme/NekoThemeProvider";
import { SideNavGroup, SideNavItem, SideNavigation } from "@/components/ui/side-navigation";

const NAV = [
  { id: "dashboard", icon: "home", label: "ダッシュボード", href: "/samples/dashboard/" },
  { id: "projects", icon: "folder", label: "案件", href: "/samples/list/", badge: 3 },
  { id: "customers", icon: "person", label: "顧客", href: "/samples/detail/" },
  { id: "notifications", icon: "notifications", label: "通知", href: "/samples/list/" },
] as const;

export function AppShell({ current, children }: { current: string; children: ReactNode }) {
  const { theme } = useNekoTheme();
  return (
    <div className="flex min-h-[calc(100vh-57px)]">
      <SideNavigation
        className="hidden md:flex"
        logo={
          <>
            <Mascot theme={theme} size={32} />
            <span>案件管理</span>
          </>
        }
      >
        {NAV.map((n) => (
          <SideNavItem
            key={n.id}
            asChild
            icon={n.icon}
            active={n.id === current}
            badge={"badge" in n ? n.badge : undefined}
          >
            <NextLink href={n.href}>{n.label}</NextLink>
          </SideNavItem>
        ))}
        <SideNavGroup label="管理">
          <SideNavItem asChild icon="settings" active={current === "settings"}>
            <NextLink href="/samples/settings/">設定</NextLink>
          </SideNavItem>
        </SideNavGroup>
      </SideNavigation>
      <main className="min-w-0 flex-1 bg-surface-page">
        <div className="mx-auto max-w-[1200px] p-6">{children}</div>
      </main>
    </div>
  );
}
