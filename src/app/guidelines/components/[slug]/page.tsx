// nekodemo-check-ignore-file NK010 — 静的なガイドライン
import NextLink from "next/link";
import { notFound } from "next/navigation";
import type { ReactNode } from "react";
import { Link } from "@/components/ui/link";
import { Tag } from "@/components/ui/tag";
import { MarkdownContent } from "../../_components/markdown";
import { PageHeader } from "../../_components/page-header";
import {
  BASE_PATH,
  type ComponentDoc,
  findComponent,
  listComponents,
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

function sectionBody(key: SectionKey, doc: ComponentDoc): ReactNode {
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
      return (
        <Todo>
          解剖図（構成要素の名前と配置）は未整備です。構造は{" "}
          <Link href={doc.storybookUrl} external>
            Storybook の Docs
          </Link>{" "}
          で確認できます。
        </Todo>
      );
    case "options":
      return doc.stories.length ? (
        <>
          <p className="text-2 text-text-middle">
            variant・size などの選択肢は Storybook
            のストーリーで確認できます（文章での定義は未整備）。
          </p>
          <ul className="list-disc space-y-1 pl-6 text-3">
            {doc.stories.map((s) => (
              <li key={s.id}>{storyLink(s)}</li>
            ))}
          </ul>
        </>
      ) : (
        <Todo>選択肢の定義は未整備です。</Todo>
      );
    case "states": {
      const states = stateStories(doc);
      return states.length ? (
        <>
          <p className="text-2 text-text-middle">
            状態の一覧表は未整備です。状態を扱うストーリーで確認できます（実装はテストの「表示・操作・disabled・アクセシブルネーム」で担保）。
          </p>
          <ul className="list-disc space-y-1 pl-6 text-3">
            {states.map((s) => (
              <li key={s.id}>{storyLink(s)}</li>
            ))}
          </ul>
        </>
      ) : (
        <Todo>
          状態（hover / focus / disabled / loading など）の一覧は未整備です。実装は Storybook
          の各ストーリーとテスト（表示・操作・disabled・アクセシブルネーム）で担保しています。
        </Todo>
      );
    }
    case "behaviors":
      return <Todo>振る舞い（幅の固定、最小幅、遅延処理など）の定義は未整備です。</Todo>;
    case "metrics":
      return (
        <Todo>
          寸法の表は未整備です。サイズは概要に書かれた値（sm / md / lg の高さなど）と Storybook
          を参照してください。
        </Todo>
      );
    case "usage":
      return (
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="flex flex-col gap-2 rounded-container border border-border-low bg-surface-card p-4">
            <h3 className="font-bold text-3 text-text-success">Do</h3>
            <Todo>推奨例は未整備です。使い方は使用例とサンプル画面を参照してください。</Todo>
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
    case "contents":
      return (
        <p className="text-3 text-text-middle">
          部品固有の文言ルールは未整備です。共通の{" "}
          <Link asChild>
            <NextLink href="/guidelines/foundations/writing/">文言のガイドライン</NextLink>
          </Link>
          （です・ます、ボタンは「〜する」、エラー文の形）に従ってください。
        </p>
      );
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
    case "references":
      return <Todo>参考文献は未整備です。</Todo>;
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
            {sectionBody(s.key, doc)}
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
