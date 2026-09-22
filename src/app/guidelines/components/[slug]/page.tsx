// nekodemo-check-ignore-file NK010 — 静的なガイドライン
import NextLink from "next/link";
import { notFound } from "next/navigation";
import type { ReactNode } from "react";
import { Link } from "@/components/ui/link";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tag } from "@/components/ui/tag";
import { AnatomyFigure } from "../../_components/anatomy";
import { MarkdownContent } from "../../_components/markdown";
import { PageHeader } from "../../_components/page-header";
import {
  BASE_PATH,
  type ComponentDoc,
  findComponent,
  listComponents,
  note,
  REPO_URL,
  SECTION_LABELS,
  type SectionKey,
  type SectionStatus,
  sectionStatus,
  stateStories,
} from "../../_lib/content";

export const dynamicParams = false;

export function generateStaticParams() {
  return listComponents().map((c) => ({ slug: c.slug }));
}

const STATUS_LABEL: Record<SectionStatus, string> = {
  done: "整備済み",
  partial: "一部",
  todo: "未整備",
};

/** 実装が持つ状態（クラスの接頭辞から抽出）の説明 */
const STATE_HOW: Record<string, string> = {
  hover: "マウスオーバー。面か枠の色が 1 段変わる",
  focus: "キーボードフォーカス（focus-visible）。border-focus のリング。マウスのクリックでは出ない",
  active: "押下中。面の色がさらに 1 段変わる",
  disabled:
    "disabled 属性。面が surface-disabled、文字が text-disabled になり、操作もフォーカスもできない（opacity では薄くしない）",
  invalid: "aria-invalid。枠が negative になり、エラー文を aria-describedby で結ぶ",
  selected: "選択中（aria-pressed / aria-selected / data-state=on）。primary の面か枠",
  checked: "チェック済み（data-state=checked）。primary の面に猫の顔（cat_face）",
  indeterminate: "一部チェック（data-state=indeterminate）。全選択の一部だけが選ばれている",
  open: "開いている（data-state=open）。矢印が回転し、内容が出る",
  closed: "閉じている（data-state=closed）",
  "active-tab": "選択中のタブ（data-state=active）。text-text-high と primary の下線",
  dragging: "ドラッグ中",
  placeholder: "未入力（placeholder）。text-text-placeholder で入力例を示す",
  loading: "処理中（loading / aria-busy）。Spinner を出し、操作を止める",
};

const OPTION_HOW: Record<string, string> = {
  variant: "見た目の強さ。画面に primary は 1 つ",
  size: "高さと文字の段階。同じ行に並べる部品は同じ size にする",
  density: "行の高さ。一覧の情報量で選ぶ",
  status: "意味の色。info / success / warning / negative / neutral",
  side: "出てくる方向。右が既定、左はナビゲーション、下はスマートフォン幅の補助操作",
  orientation: "並ぶ向き",
  layout: "項目名と値の並び",
  columns: "列数",
  sort: "並び順（TableHead のソート表示）",
  type: "選択の仕方",
};

/** 選択肢の意味。同じ prop 名でも中身で変わるもの（status = 色 / データの状態）はここで分ける */
function optionHow(name: string, options: string[]): string {
  if (name === "status" && options.includes("loading"))
    return "データの状態。loading は Skeleton、error は InlineMessage ＋ 再試行、ready は表";
  return OPTION_HOW[name] ?? "";
}

function kebab(id: string): string {
  return id
    .replace(/([a-z0-9])([A-Z])/g, "$1-$2")
    .replace(/([A-Z])([A-Z][a-z])/g, "$1-$2")
    .toLowerCase();
}

function Section({
  label,
  en,
  status,
  children,
}: {
  label: string;
  en: string;
  status: SectionStatus;
  children: ReactNode;
}) {
  return (
    <section className="flex flex-col gap-3">
      <h2 className="flex items-center gap-2 border-border-low border-b pb-2 font-bold text-5 text-text-high">
        {label}
        <span className="font-normal text-2 text-text-low">{en}</span>
        <Tag className="ml-auto" variant={status === "done" ? "selected" : "default"}>
          {STATUS_LABEL[status]}
        </Tag>
      </h2>
      {children}
    </section>
  );
}

function Todo({ children }: { children: ReactNode }) {
  return (
    <p className="rounded-action border border-border-low border-dashed bg-surface-well px-4 py-3 text-2 text-text-middle">
      {children}
    </p>
  );
}

function ComponentLinks({ slugs }: { slugs: string[] }) {
  const all = listComponents();
  return (
    <ul className="flex flex-wrap gap-2">
      {slugs.map((s) => {
        const c = all.find((x) => x.slug === s);
        return (
          <li key={s}>
            <Link asChild>
              <NextLink href={`/guidelines/components/${s}/`}>{c?.title ?? s}</NextLink>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}

function sectionBody(
  key: SectionKey,
  doc: ComponentDoc,
  status: Record<SectionKey, SectionStatus>,
): ReactNode {
  const storyTitleId = doc.storybookUrl.replace(/^.*\/docs\/(.+)--docs$/, "$1");
  const storyLink = (s: { id: string; name: string }) => (
    <Link href={`${BASE_PATH}/storybook/?path=/story/${storyTitleId}--${kebab(s.id)}`} external>
      {s.name}
    </Link>
  );
  switch (key) {
    case "overview":
      return doc.overview ? (
        <MarkdownContent
          source={doc.overview}
          base={`src/components/ui/${doc.slug}`}
          skipTitle={false}
        />
      ) : (
        <Todo>概要は未整備です。</Todo>
      );
    case "anatomy":
      return status.anatomy === "done" ? (
        <AnatomyFigure slug={doc.slug} />
      ) : (
        <Todo>
          解剖図（構成要素の名前と配置）は未整備です。構造は{" "}
          <Link href={doc.storybookUrl} external>
            Storybook の Docs
          </Link>{" "}
          で確認できます。
        </Todo>
      );
    case "options": {
      const entries = Object.entries(doc.spec.options);
      return (
        <>
          {entries.length ? (
            <Table density="xs" aria-label={`${doc.title} の選択肢`}>
              <TableHeader>
                <TableRow>
                  <TableHead>prop</TableHead>
                  <TableHead>選択肢</TableHead>
                  <TableHead>既定</TableHead>
                  <TableHead>意味</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {entries.map(([name, o]) => (
                  <TableRow key={name}>
                    <TableCell className="font-mono">{name}</TableCell>
                    <TableCell>
                      <span className="flex flex-wrap gap-1">
                        {o.options.map((v) => (
                          <code
                            key={v}
                            className="rounded-notice bg-surface-well px-1 font-mono text-2"
                          >
                            {v}
                          </code>
                        ))}
                      </span>
                    </TableCell>
                    <TableCell className="font-mono">{o.default ?? "—"}</TableCell>
                    <TableCell className="text-text-middle">{optionHow(name, o.options)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <p className="text-2 text-text-middle">
              variant / size のような選択肢を持たない部品です（構成部品や props で組み立てます）。
            </p>
          )}
          {entries.length ? (
            <p className="text-2 text-text-low">
              実装（index.tsx）の cva / 型 / size 表から機械的に抽出。既定は defaultVariants
              と分割代入の既定値
            </p>
          ) : null}
          {doc.spec.props.length ? (
            <div className="flex flex-col gap-2">
              <h3 className="font-bold text-3 text-text-high">props</h3>
              <Table density="xs" aria-label={`${doc.title} の props`}>
                <TableHeader>
                  <TableRow>
                    <TableHead>prop</TableHead>
                    <TableHead>型</TableHead>
                    <TableHead>既定</TableHead>
                    <TableHead>説明</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {doc.spec.props.map((p) => (
                    <TableRow key={`${p.owner}-${p.name}`}>
                      <TableCell className="whitespace-nowrap font-mono">
                        {p.name}
                        {p.required ? (
                          <span className="ml-1 font-sans text-1 text-text-negative">必須</span>
                        ) : null}
                      </TableCell>
                      <TableCell>
                        <code className="break-all font-mono text-1 text-text-middle">
                          {p.type}
                        </code>
                      </TableCell>
                      <TableCell className="whitespace-nowrap font-mono">
                        {p.default ?? "—"}
                      </TableCell>
                      <TableCell className="text-text-middle">{p.description}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <p className="text-2 text-text-low">
                export type XxxProps の型リテラルと JSDoc から機械的に抽出（HTML 属性や Radix
                から継承する props は含まない）。既定は分割代入の既定値
              </p>
            </div>
          ) : null}
          {doc.stories.length ? (
            <details className="text-2">
              <summary className="cursor-pointer text-text-middle">
                Storybook のストーリー（{doc.stories.length}）
              </summary>
              <ul className="mt-2 list-disc space-y-1 pl-6 text-3">
                {doc.stories.map((s) => (
                  <li key={s.id}>{storyLink(s)}</li>
                ))}
              </ul>
            </details>
          ) : null}
        </>
      );
    }
    case "states": {
      const states = stateStories(doc);
      const impl = doc.spec.states;
      return impl.length || states.length ? (
        <>
          {impl.length ? (
            <Table density="xs" aria-label={`${doc.title} の状態`}>
              <TableHeader>
                <TableRow>
                  <TableHead>状態</TableHead>
                  <TableHead>見た目と条件</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {impl.map((st) => (
                  <TableRow key={st.key}>
                    <TableCell className="whitespace-nowrap">{st.label}</TableCell>
                    <TableCell className="text-text-middle">{STATE_HOW[st.key] ?? ""}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : null}
          <p className="text-2 text-text-low">
            実装（index.tsx）のクラス接頭辞から抽出。テストは「表示・操作・disabled・アクセシブルネーム」の
            4 観点で担保しています。
          </p>
          {states.length ? (
            <details className="text-2">
              <summary className="cursor-pointer text-text-middle">
                状態を扱うストーリー（{states.length}）
              </summary>
              <ul className="mt-2 list-disc space-y-1 pl-6 text-3">
                {states.map((s) => (
                  <li key={s.id}>{storyLink(s)}</li>
                ))}
              </ul>
            </details>
          ) : null}
        </>
      ) : (
        <Todo>
          実装のクラス接頭辞からは状態を検出できませんでした（未整備）。JS で状態を持つ部品は
          Storybook のストーリーで確認してください。
        </Todo>
      );
    }
    case "behaviors": {
      const body = note(doc, "振る舞い");
      return body ? (
        <MarkdownContent source={body} skipTitle={false} />
      ) : (
        <Todo>振る舞い（幅の固定、最小幅、遅延処理など）の定義は未整備です。</Todo>
      );
    }
    case "metrics": {
      const rows = doc.spec.metrics.filter((m) => m.height !== null);
      return rows.length ? (
        <>
          <Table density="xs" aria-label={`${doc.title} の寸法`}>
            <TableHeader>
              <TableRow>
                <TableHead>size</TableHead>
                <TableHead numeric>高さ</TableHead>
                <TableHead numeric>横の余白</TableHead>
                <TableHead numeric>文字</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((m) => (
                <TableRow key={m.name}>
                  <TableCell className="font-mono">{m.name}</TableCell>
                  <TableCell numeric>{m.height}px</TableCell>
                  <TableCell numeric>{m.paddingX !== null ? `${m.paddingX}px` : "—"}</TableCell>
                  <TableCell numeric>
                    {m.text ? `text-${m.text.step}（${m.text.px ?? "?"}px）` : "—"}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <p className="text-2 text-text-low">
            実装（index.tsx）の h- / px- / text-
            クラスから機械的に抽出した値（仕様値ではなく実装が書いている高さ）。余白は 4px
            グリッド。角丸と影は{" "}
            <Link asChild>
              <NextLink href="/guidelines/themes/shape/">Shape</NextLink>
            </Link>{" "}
            を参照。
          </p>
        </>
      ) : (
        <Todo>
          高さの段階（size）を持たない部品です。余白は 4px グリッド、角丸と影は{" "}
          <Link asChild>
            <NextLink href="/guidelines/themes/shape/">Shape</NextLink>
          </Link>{" "}
          を参照してください。
        </Todo>
      );
    }
    case "usage":
      return (
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="flex flex-col gap-2 rounded-container border border-border-low bg-surface-card p-4">
            <h3 className="font-bold text-3 text-text-success">Do（推奨例）</h3>
            {doc.recommended.length ? (
              <ul className="list-disc space-y-1 pl-6 text-3">
                {doc.recommended.map((a) => (
                  <li key={a}>
                    <MarkdownContent source={a} skipTitle={false} />
                  </li>
                ))}
              </ul>
            ) : (
              <Todo>推奨例は未整備です。使い方は使用例とサンプル画面を参照してください。</Todo>
            )}
          </div>
          <div className="flex flex-col gap-2 rounded-container border border-border-low bg-surface-card p-4">
            <h3 className="font-bold text-3 text-text-negative">Don't（アンチパターン）</h3>
            {doc.antiPatterns.length ? (
              <ul className="list-disc space-y-1 pl-6 text-3">
                {doc.antiPatterns.map((a) => (
                  <li key={a}>
                    <MarkdownContent source={a} skipTitle={false} />
                  </li>
                ))}
              </ul>
            ) : (
              <Todo>未整備</Todo>
            )}
          </div>
        </div>
      );
    case "contents": {
      const body = note(doc, "内容");
      return (
        <>
          {body ? <MarkdownContent source={body} skipTitle={false} /> : null}
          <p className="text-2 text-text-middle">
            {body ? "共通の" : "部品固有の文言ルールは未整備です。共通の"}{" "}
            <Link asChild>
              <NextLink href="/guidelines/foundations/writing/">文言のガイドライン</NextLink>
            </Link>
            （です・ます、ボタンは「〜する」、エラー文の形）に従ってください。
          </p>
        </>
      );
    }
    case "related":
      return doc.dependsOn.length + doc.usedBy.length ? (
        <div className="flex flex-col gap-3 text-3">
          {doc.dependsOn.length ? (
            <div>
              <h3 className="mb-1 font-bold text-2 text-text-low">この部品が使う部品</h3>
              <ComponentLinks slugs={doc.dependsOn} />
            </div>
          ) : null}
          {doc.usedBy.length ? (
            <div>
              <h3 className="mb-1 font-bold text-2 text-text-low">この部品を使う部品</h3>
              <ComponentLinks slugs={doc.usedBy} />
            </div>
          ) : null}
        </div>
      ) : (
        <p className="text-3 text-text-middle">依存関係のある部品はありません。</p>
      );
    case "references": {
      const body = note(doc, "参考文献");
      return body ? (
        <MarkdownContent source={body} skipTitle={false} />
      ) : (
        <Todo>参考文献は未整備です。</Todo>
      );
    }
    case "changelog":
      return (
        <ul className="list-disc pl-6 text-3">
          <li>{doc.phase}: 追加</li>
        </ul>
      );
    default:
      return null;
  }
}

export default async function ComponentPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const doc = findComponent(slug);
  if (!doc) notFound();
  const status = sectionStatus(doc);
  return (
    <>
      <PageHeader
        crumbs={[{ href: "/guidelines/components/", label: "Components" }, { label: doc.title }]}
        title={doc.title}
        description={doc.description}
        aside={
          <ul className="flex flex-wrap gap-3 text-2">
            <li>
              <Link href={doc.storybookUrl} external>
                Storybook
              </Link>
            </li>
            <li>
              <Link href={`${REPO_URL}/blob/main/src/components/ui/${doc.slug}/index.tsx`} external>
                ソース
              </Link>
            </li>
          </ul>
        }
      />
      <div className="mb-6 rounded-container border border-border-low bg-surface-card p-4 text-2">
        <p className="text-text-middle">
          import:{" "}
          <code className="rounded-notice bg-surface-well px-1 font-mono">
            import {"{ "}
            {doc.title}
            {" }"} from "nekodemo"
          </code>
          　registry:{" "}
          <code className="rounded-notice bg-surface-well px-1 font-mono">
            npx shadcn@latest add @nekodemo/{doc.slug}
          </code>
        </p>
      </div>
      <div className="flex flex-col gap-10">
        {SECTION_LABELS.map((s) => (
          <Section key={s.key} label={s.label} en={s.en} status={status[s.key]}>
            {sectionBody(s.key, doc, status)}
            {s.key === "usage" && doc.example ? (
              <div className="flex flex-col gap-2">
                <h3 className="font-bold text-3 text-text-high">使用例（コード）</h3>
                <pre className="overflow-x-auto rounded-action border border-border-low bg-surface-well p-4 font-mono text-2 leading-6">
                  <code>{doc.example}</code>
                </pre>
              </div>
            ) : null}
          </Section>
        ))}
      </div>
    </>
  );
}
