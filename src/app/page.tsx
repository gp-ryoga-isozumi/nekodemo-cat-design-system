import Link from "next/link";

const PAGES: { href: string; title: string; description: string }[] = [
  {
    href: "/tokens/",
    title: "トークン",
    description: "セマンティック層・役割層・タイポグラフィ・角丸・影の一覧（Phase 1）",
  },
];

export default function HomePage() {
  return (
    <main className="mx-auto flex max-w-4xl flex-col gap-6 p-6">
      <header className="flex flex-col gap-1">
        <h1 className="text-6 font-bold">nekodemo</h1>
        <p className="text-2 text-text-low">
          猫がテーマのプロトタイプ用デザインシステム。デモサイト（開発中）。
        </p>
      </header>
      <ul className="flex flex-col gap-2">
        {PAGES.map((p) => (
          <li key={p.href}>
            <Link
              href={p.href}
              className="flex flex-col gap-1 rounded-container border border-border-low bg-surface-card p-4 shadow-raise hover:bg-surface-well"
            >
              <span className="font-bold text-text-link">{p.title}</span>
              <span className="text-2 text-text-low">{p.description}</span>
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
}
