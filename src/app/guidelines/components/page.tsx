// nekodemo-check-ignore-file NK010 — 静的なガイドライン
import NextLink from "next/link";
import { Link } from "@/components/ui/link";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { PageHeader } from "../_components/page-header";
import { listComponents, SECTION_LABELS, type SectionStatus, sectionStatus } from "../_lib/content";

const MARK: Record<SectionStatus, { glyph: string; label: string; cls: string }> = {
  done: { glyph: "●", label: "整備済み", cls: "text-text-success" },
  partial: { glyph: "◐", label: "一部", cls: "text-text-warning" },
  todo: { glyph: "○", label: "未整備", cls: "text-text-low" },
};

export default function ComponentsIndexPage() {
  const components = listComponents();
  return (
    <>
      <PageHeader
        crumbs={[{ label: "Components" }]}
        title="Components"
        description={`画面を組むための ${components.length} 部品。各ページは概要・解剖図・選択肢・状態・振る舞い・寸法・使い方・内容・関連部品・参考文献・変更履歴の ${SECTION_LABELS.length} 節で構成し、未整備の節は明示しています。`}
      />
      <p className="mb-3 text-2 text-text-low">
        {Object.values(MARK).map((m) => (
          <span key={m.label} className="mr-4">
            <span className={m.cls} aria-hidden="true">
              {m.glyph}
            </span>{" "}
            {m.label}
          </span>
        ))}
      </p>
      <Table density="xs" aria-label="部品ごとの整備状況">
        <TableHeader>
          <TableRow>
            <TableHead>部品</TableHead>
            {SECTION_LABELS.map((s) => (
              <TableHead key={s.key} className="px-1 text-center" title={s.label}>
                <span className="text-1">{s.label}</span>
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {components.map((c) => {
            const st = sectionStatus(c);
            return (
              <TableRow key={c.slug}>
                <TableCell className="whitespace-nowrap">
                  <Link asChild>
                    <NextLink href={`/guidelines/components/${c.slug}/`}>{c.title}</NextLink>
                  </Link>
                </TableCell>
                {SECTION_LABELS.map((s) => (
                  <TableCell key={s.key} className={`px-1 text-center ${MARK[st[s.key]].cls}`}>
                    <span aria-hidden="true">{MARK[st[s.key]].glyph}</span>
                    <span className="sr-only">
                      {s.label}: {MARK[st[s.key]].label}
                    </span>
                  </TableCell>
                ))}
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </>
  );
}
