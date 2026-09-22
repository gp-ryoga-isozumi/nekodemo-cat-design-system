// nekodemo-check-ignore-file NK010 — 静的なガイドライン
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { notFound } from "next/navigation";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { nekoThemes } from "@/themes/registry";
import { MarkdownContent } from "../../_components/markdown";
import { PageHeader } from "../../_components/page-header";
import { findDoc, readDoc, THEMES } from "../../_lib/content";

export const dynamicParams = false;

export function generateStaticParams() {
  return THEMES.map((p) => ({ slug: p.slug }));
}

type Primitives = {
  typography: { scale: { step: number; px: number; size: string; lineHeight: string }[] };
  radius: Record<string, string>;
  shadow: Record<string, string>;
};
type SemanticMap = { light: Record<string, string>; dark: Record<string, string> };
type ThemeJson = { id: string; radius: Record<string, string> };
type IconStatus = {
  counts: Record<string, number>;
  earless: string[];
};

function readJson<T>(path: string): T {
  return JSON.parse(readFileSync(join(process.cwd(), path), "utf8")) as T;
}

function TypographyTable() {
  const { typography } = readJson<Primitives>("tokens/primitives.json");
  const roles: Record<number, string> = {
    1: "注記・カウンタ（text-1）",
    2: "補足・表・ラベル（text-2）",
    3: "本文（text-3）",
    4: "小見出し（text-4）",
    5: "見出し（text-5）",
    6: "ページ見出し（text-6）",
    7: "大見出し（text-7）",
  };
  return (
    <Table density="xs">
      <TableHeader>
        <TableRow>
          <TableHead>段階</TableHead>
          <TableHead numeric>px</TableHead>
          <TableHead>size / line-height</TableHead>
          <TableHead>主な用途</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {typography.scale.map((s) => (
          <TableRow key={s.step}>
            <TableCell>
              <code className="font-mono">text-{s.step}</code>
            </TableCell>
            <TableCell numeric>{s.px}</TableCell>
            <TableCell>
              <code className="font-mono">
                {s.size} / {s.lineHeight}
              </code>
            </TableCell>
            <TableCell>{roles[s.step] ?? "大型の見出し・数値の強調"}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

function RolesTable() {
  const map = readJson<SemanticMap>("tokens/semantic.map.json");
  const roles = Object.keys(map.light).filter((k) => !k.startsWith("$"));
  const groups = ["text", "surface", "border", "object"];
  return (
    <div className="flex flex-col gap-6">
      {groups.map((g) => (
        <div key={g} className="flex flex-col gap-2">
          <h3 className="font-bold text-4 text-text-high">
            {g}-*（{roles.filter((r) => r.startsWith(`${g}-`)).length} 個）
          </h3>
          <Table density="xs">
            <TableHeader>
              <TableRow>
                <TableHead>役割トークン</TableHead>
                <TableHead>ライト（三毛・アメショ）</TableHead>
                <TableHead>ダーク（ロシアンブルー）</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {roles
                .filter((r) => r.startsWith(`${g}-`))
                .map((r) => (
                  <TableRow key={r}>
                    <TableCell>
                      <code className="font-mono">{r}</code>
                    </TableCell>
                    <TableCell>
                      <code className="font-mono text-text-middle">{map.light[r]}</code>
                    </TableCell>
                    <TableCell>
                      <code className="font-mono text-text-middle">{map.dark[r]}</code>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </div>
      ))}
    </div>
  );
}

function ShapeTables() {
  const { radius, shadow } = readJson<Primitives>("tokens/primitives.json");
  const themes = nekoThemes.map((t) => readJson<ThemeJson>(`themes/${t.id}.json`));
  const uses = ["action", "container", "modal", "notice"];
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <h3 className="font-bold text-4 text-text-high">角丸（用途 × テーマ）</h3>
        <Table density="xs">
          <TableHeader>
            <TableRow>
              <TableHead>用途</TableHead>
              {nekoThemes.map((t) => (
                <TableHead key={t.id}>{t.label.ja}</TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {uses.map((u) => (
              <TableRow key={u}>
                <TableCell>
                  <code className="font-mono">rounded-{u}</code>
                </TableCell>
                {themes.map((t) => (
                  <TableCell key={t.id}>
                    {t.radius[u]}（{radius[t.radius[u]]}）
                  </TableCell>
                ))}
              </TableRow>
            ))}
            <TableRow>
              <TableCell>
                <code className="font-mono">rounded-round</code>
              </TableCell>
              <TableCell colSpan={3}>9999px（円・ピル。全テーマ共通）</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
      <div className="flex flex-col gap-2">
        <h3 className="font-bold text-4 text-text-high">影</h3>
        <Table density="xs">
          <TableHeader>
            <TableRow>
              <TableHead>トークン</TableHead>
              <TableHead>用途</TableHead>
              <TableHead>値</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {(
              [
                ["raise", "カード・ヘッダーのわずかな浮き"],
                ["float", "Popover・Menu・Drawer"],
                ["popout", "Modal・Dialog・候補パネル"],
              ] as const
            ).map(([k, use]) => (
              <TableRow key={k}>
                <TableCell>
                  <code className="font-mono">shadow-{k}</code>
                </TableCell>
                <TableCell>{use}</TableCell>
                <TableCell>
                  <code className="font-mono text-1 text-text-middle">{shadow[k]}</code>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

function IconStats() {
  const s = readJson<IconStatus>("icons/status.json");
  const rows: [string, number | undefined][] = [
    ["対象の名前", s.counts.total],
    ["T1（専用に描いた耳）", s.counts.bespoke],
    ["T2（自動耳）", s.counts.autoEar],
    ["T2（手動耳）", s.counts.manualEar],
    ["耳なし規約", s.counts.earless],
    ["耳を置けず（本体のみ）", s.counts.noEar],
  ];
  return (
    <Table density="xs">
      <TableHeader>
        <TableRow>
          <TableHead>区分</TableHead>
          <TableHead numeric>件数</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {rows.map(([label, n]) => (
          <TableRow key={label}>
            <TableCell>{label}</TableCell>
            <TableCell numeric>{n ?? 0}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

export default async function ThemePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const page = findDoc(THEMES, slug);
  if (!page) notFound();
  return (
    <>
      <PageHeader
        crumbs={[{ href: "/guidelines/themes/", label: "Themes" }, { label: page.title }]}
        title={page.title}
        description={page.description}
      />
      <MarkdownContent source={readDoc(page)} base="docs/guidelines/themes" />
      <section className="mt-8 flex flex-col gap-3">
        <h2 className="border-border-low border-b pb-2 font-bold text-5 text-text-high">
          {slug === "color" && "役割トークンの一覧（tokens/semantic.map.json から生成）"}
          {slug === "typography" && "文字サイズの段階（tokens/primitives.json から生成）"}
          {slug === "shape" && "値（themes/*.json と tokens/primitives.json から生成）"}
          {slug === "icons" && "整備状況（icons/status.json から生成）"}
        </h2>
        {slug === "color" ? <RolesTable /> : null}
        {slug === "typography" ? <TypographyTable /> : null}
        {slug === "shape" ? <ShapeTables /> : null}
        {slug === "icons" ? <IconStats /> : null}
      </section>
    </>
  );
}
