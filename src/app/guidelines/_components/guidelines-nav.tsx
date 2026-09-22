"use client";

// ガイドラインの左ナビ（はじめに / Foundations / Themes / Components / Patterns）。現在地は usePathname で判定する。
import NextLink from "next/link";
import { usePathname } from "next/navigation";
import { Icon } from "@/components/ui/icon";
import { SideNavGroup, SideNavItem, SideNavigation } from "@/components/ui/side-navigation";

export type NavEntry = { href: string; label: string };
export type NavGroup = { label: string; icon: string; index: NavEntry; items: NavEntry[] };

export function GuidelinesNav({ groups }: { groups: NavGroup[] }) {
  const pathname = usePathname() ?? "";
  const is = (href: string) => pathname === href || pathname === href.replace(/\/$/, "");
  return (
    <SideNavigation
      aria-label="ガイドライン"
      className="hidden md:flex"
      logo={
        <>
          <Icon icon="description" size={4} />
          <span>ガイドライン</span>
        </>
      }
    >
      <SideNavItem asChild icon="home" active={is("/guidelines/")}>
        <NextLink href="/guidelines/">Overview</NextLink>
      </SideNavItem>
      {groups.map((g) => (
        <SideNavGroup key={g.label} label={g.label}>
          <SideNavItem asChild icon={g.icon} active={is(g.index.href)}>
            <NextLink href={g.index.href}>{g.label} の一覧</NextLink>
          </SideNavItem>
          {g.items.map((item) => (
            <SideNavItem
              key={item.href}
              asChild
              icon="subdirectory_arrow_right"
              active={is(item.href)}
            >
              <NextLink href={item.href}>{item.label}</NextLink>
            </SideNavItem>
          ))}
        </SideNavGroup>
      ))}
    </SideNavigation>
  );
}
