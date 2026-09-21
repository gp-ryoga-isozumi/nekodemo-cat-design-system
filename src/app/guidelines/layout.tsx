import type { ReactNode } from "react";
import { GuidelinesNav, type NavGroup } from "./_components/guidelines-nav";
import { FOUNDATIONS, listComponents, PATTERNS, THEMES } from "./_lib/content";

export default function GuidelinesLayout({ children }: { children: ReactNode }) {
  const groups: NavGroup[] = [
    {
      label: "Foundations",
      icon: "category",
      index: { href: "/guidelines/foundations/", label: "Foundations" },
      items: FOUNDATIONS.map((p) => ({
        href: `/guidelines/foundations/${p.slug}/`,
        label: p.title,
      })),
    },
    {
      label: "Themes",
      icon: "palette",
      index: { href: "/guidelines/themes/", label: "Themes" },
      items: THEMES.map((p) => ({ href: `/guidelines/themes/${p.slug}/`, label: p.title })),
    },
    {
      label: "Components",
      icon: "widgets",
      index: { href: "/guidelines/components/", label: "Components" },
      items: listComponents().map((c) => ({
        href: `/guidelines/components/${c.slug}/`,
        label: c.title,
      })),
    },
    {
      label: "Patterns",
      icon: "view_list",
      index: { href: "/guidelines/patterns/", label: "Patterns" },
      items: PATTERNS.map((p) => ({ href: `/guidelines/patterns/${p.slug}/`, label: p.title })),
    },
  ];
  return (
    <div className="flex min-h-[calc(100vh-57px)]">
      <GuidelinesNav groups={groups} />
      <main className="min-w-0 flex-1 bg-surface-page">
        <div className="mx-auto max-w-[960px] p-6">{children}</div>
      </main>
    </div>
  );
}
