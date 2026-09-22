// ガイドラインサイトの内容をリポジトリのファイルから読む（ビルド時にサーバー側で実行。静的書き出し）。
// 正は docs/guidelines/*.md、部品の README.md（JSDoc から生成）、item.json、stories。ここでは変換だけを行う。
import { existsSync, readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { type ComponentSpec, specFor } from "../../../../scripts/component-spec.mjs";
import { ANATOMY_SLUGS } from "../_components/anatomy";

const ROOT = process.cwd();
export const REPO_URL = "https://github.com/gp-ryoga-isozumi/nekodemo-cat-design-system";
/** GitHub Pages の basePath。next/link は自動で付けるが、Storybook など Next の外へのリンク（素の <a>）には手で付ける */
export const BASE_PATH = process.env.NEXT_BASE_PATH ?? "";

export type DocPage = {
  slug: string;
  title: string;
  description: string;
  /** docs/ 配下の相対パス */
  file: string;
};

export const FOUNDATIONS: DocPage[] = [
  {
    slug: "accessibility",
    title: "アクセシビリティ",
    description: "コントラスト、フォーカス、ラベル、キーボード操作の最低ライン",
    file: "docs/guidelines/07-accessibility.md",
  },
  {
    slug: "writing",
    title: "文言",
    description: "です・ます、ボタンは「〜する」、エラー文、数値と日付の書式",
    file: "docs/guidelines/04-writing.md",
  },
  {
    slug: "spacing-and-color",
    title: "余白と色",
    description: "4px グリッド、役割トークンだけで書く、ステータス色の使いどころ",
    file: "docs/guidelines/05-spacing-and-color.md",
  },
  {
    slug: "layout",
    title: "レイアウトと画面幅",
    description: "外枠 3 領域、1 / 2 / 3 カラム、md・sm の境目、固定フッター、表だけ横スクロール",
    file: "docs/guidelines/09-layout.md",
  },
  {
    slug: "navigation",
    title: "ナビゲーションの構造",
    description: "階層は 2 段まで、現在地の示し方、Breadcrumb は 3 階層目から、戻り先を用意する",
    file: "docs/guidelines/13-navigation.md",
  },
  {
    slug: "cat-flavor",
    title: "猫要素の使いどころ",
    description: "常に出るのは耳付きアイコンだけ。マスコットは 4 か所、業務データに猫を入れない",
    file: "docs/guidelines/06-cat-flavor.md",
  },
];

export const THEMES: DocPage[] = [
  {
    slug: "color",
    title: "Color",
    description: "3 層のカラートークン（プリミティブ → セマンティック → 役割）と 3 テーマ",
    file: "docs/guidelines/themes/color.md",
  },
  {
    slug: "typography",
    title: "Typography",
    description: "Zen Maru Gothic / Noto Sans Mono、12 段階の文字サイズ、ウェイトは 400 / 700",
    file: "docs/guidelines/themes/typography.md",
  },
  {
    slug: "shape",
    title: "Shape",
    description: "角丸 5 用途と影 3 段階。テーマごとに値が変わる",
    file: "docs/guidelines/themes/shape.md",
  },
  {
    slug: "icons",
    title: "Icons",
    description:
      "Material Symbols の名前で指定する猫耳アイコン。耳を付けない規約と猫版が無いときの挙動",
    file: "docs/guidelines/themes/icons.md",
  },
  {
    slug: "motion",
    title: "Motion",
    description: "出入りの時間、動かすもの、hover は色だけ、prefers-reduced-motion",
    file: "docs/guidelines/themes/motion.md",
  },
];

export const PATTERNS: DocPage[] = [
  {
    slug: "screen-patterns",
    title: "画面の型",
    description: "一覧・詳細・作成/編集フォーム・設定の 4 型と共通の枠",
    file: "docs/guidelines/01-screen-patterns.md",
  },
  {
    slug: "states",
    title: "状態の必須セット",
    description: "読み込み中・0 件・エラー・成功。プロトタイプでも省略しない",
    file: "docs/guidelines/02-states.md",
  },
  {
    slug: "actions",
    title: "操作の原則",
    description:
      "主アクションは 1 つ、取り消し不可は Dialog、送信ボタンの初期状態、モーダルとモードレス",
    file: "docs/guidelines/03-actions.md",
  },
  {
    slug: "side-panel",
    title: "サイドパネル",
    description:
      "一覧を見たまま 1 件を確認・短く編集する Drawer。詳細ページへ遷移する場合との使い分け",
    file: "docs/guidelines/08-side-panel.md",
  },
  {
    slug: "forms",
    title: "フォームの組み方",
    description:
      "ラベルは上、入力幅は値の長さ、必須は FormLabel required、検証は送信時、エラーは項目の下",
    file: "docs/guidelines/10-forms.md",
  },
  {
    slug: "notifications",
    title: "知らせ方の選び方",
    description:
      "Toast / InlineMessage / FormMessage / Dialog の使い分け。エラーを Toast だけにしない",
    file: "docs/guidelines/11-notifications.md",
  },
  {
    slug: "list-and-filters",
    title: "一覧の絞り込みと一括操作",
    description: "絞り込み行の並び、効いている条件の見せ方、選択ツールバー、一括削除の確認と結果",
    file: "docs/guidelines/12-list-and-filters.md",
  },
  {
    slug: "choosing-components",
    title: "部品の選び方",
    description:
      "Dialog / Modal / Drawer、Table / DataGrid、Tag / Badge / StatusTag など迷いやすい部品の決定表",
    file: "docs/guidelines/14-choosing-components.md",
  },
];

/** docs/guidelines のファイル名 → サイトの URL（Markdown 内の相対リンクの変換に使う） */
export function guidelineUrlByFile(fileName: string): string | undefined {
  const all = [
    ...FOUNDATIONS.map((p) => ({ p, section: "foundations" })),
    ...THEMES.map((p) => ({ p, section: "themes" })),
    ...PATTERNS.map((p) => ({ p, section: "patterns" })),
  ];
  const hit = all.find(({ p }) => p.file.endsWith(`/${fileName}`));
  return hit ? `/guidelines/${hit.section}/${hit.p.slug}/` : undefined;
}

export function readDoc(page: DocPage): string {
  return readFileSync(join(ROOT, page.file), "utf8");
}

export function findDoc(pages: DocPage[], slug: string): DocPage | undefined {
  return pages.find((p) => p.slug === slug);
}

// ---------- 部品 ----------

export type ComponentItem = {
  name: string;
  title: string;
  description: string;
  registryDependencies: string[];
};

export type ComponentDoc = {
  slug: string;
  title: string;
  description: string;
  /** README の「概要」本文（Markdown） */
  overview: string;
  /** README の「アンチパターン」（箇条書き。Don't） */
  antiPatterns: string[];
  /** README の「推奨例」（箇条書き。Do） */
  recommended: string[];
  /** 実装（index.tsx）から機械的に読んだ選択肢・寸法・状態 */
  spec: ComponentSpec;
  /** docs/guidelines/components/<slug>.md の手書きの節（振る舞い / 内容 / 参考文献 など） */
  notes: Record<string, string>;
  /** README の「使用例」（コード） */
  example: string;
  /** ストーリー名（Storybook で確認できる選択肢と状態） */
  stories: { id: string; name: string }[];
  /** 依存する部品（registry） */
  dependsOn: string[];
  /** この部品を使っている部品 */
  usedBy: string[];
  /** 追加されたフェーズ（変更履歴） */
  phase: string;
  /** Storybook の docs ページ */
  storybookUrl: string;
};

const UI_DIR = join(ROOT, "src", "components", "ui");
const NOTES_DIR = join(ROOT, "docs", "guidelines", "components");
const EMPTY_SPEC: ComponentSpec = { options: {}, metrics: [], states: [], props: [] };

/** 箇条書き（- で始まる行）だけを取り出す */
function bullets(markdown: string): string[] {
  return markdown
    .split("\n")
    .map((l) => l.trim())
    .filter((l) => l.startsWith("- "))
    .map((l) => l.slice(2));
}

/** 節（## 見出し）ごとに本文を分ける */
function sections(markdown: string): Record<string, string> {
  const out: Record<string, string> = {};
  let current = "";
  for (const line of markdown.split("\n")) {
    const m = /^## (.+)$/.exec(line);
    if (m) {
      current = m[1].trim();
      out[current] = "";
      continue;
    }
    if (current) out[current] += `${line}\n`;
  }
  return out;
}

/** `export const X: Story = { ... }` を波括弧の対応で切り出す（正規表現だと 1 行のオブジェクトや空オブジェクトで次のストーリーを飲み込む） */
function storyNames(source: string): { id: string; name: string }[] {
  const out: { id: string; name: string }[] = [];
  const head = /export const (\w+): Story = \{/g;
  for (const m of source.matchAll(head)) {
    const id = m[1];
    const start = m.index + m[0].length - 1; // "{" の位置
    let depth = 0;
    let quote: string | null = null;
    let end = -1;
    for (let i = start; i < source.length; i++) {
      const ch = source[i];
      if (quote) {
        if (ch === "\\") i++;
        else if (ch === quote) quote = null;
        continue;
      }
      if (ch === '"' || ch === "'" || ch === "`") quote = ch;
      else if (ch === "{") depth++;
      else if (ch === "}") {
        depth--;
        if (depth === 0) {
          end = i;
          break;
        }
      }
    }
    const body = end === -1 ? "" : source.slice(start, end + 1);
    const name = /\bname:\s*"([^"]+)"/.exec(body)?.[1] ?? id;
    out.push({ id, name });
  }
  return out;
}

const V12 = "v1.2（2026-09-22）";
const PHASE_BY_COMPONENT: Record<string, string> = {
  "data-grid": "v1.1（Phase 6、2026-09-22）",
  "search-combobox": "v1.1（Phase 6、2026-09-22）",
  icon: "v1（Phase 3a、2026-09-21）",
  accordion: V12,
  "description-list": V12,
  "filter-chip": V12,
  "input-date": V12,
  "input-file": V12,
  "input-number": V12,
  "input-time": V12,
  "page-header": V12,
  progress: V12,
  "segmented-control": V12,
  stepper: V12,
};

export function listComponents(): ComponentDoc[] {
  const items = readdirSync(UI_DIR)
    .filter((d) => existsSync(join(UI_DIR, d, "item.json")))
    .map((d) => ({
      slug: d,
      item: JSON.parse(readFileSync(join(UI_DIR, d, "item.json"), "utf8")) as ComponentItem,
    }));
  const uiSlugs = new Set(items.map((i) => i.slug));
  const usedBy = new Map<string, string[]>();
  for (const { slug, item } of items) {
    for (const dep of item.registryDependencies ?? []) {
      usedBy.set(dep, [...(usedBy.get(dep) ?? []), slug]);
    }
  }
  return items
    .map(({ slug, item }) => {
      const readmePath = join(UI_DIR, slug, "README.md");
      const readme = existsSync(readmePath) ? readFileSync(readmePath, "utf8") : "";
      const sec = sections(readme);
      const anti = bullets(sec.アンチパターン ?? "");
      const recommended = bullets(sec.推奨例 ?? "");
      const notesPath = join(NOTES_DIR, `${slug}.md`);
      const notes = existsSync(notesPath) ? sections(readFileSync(notesPath, "utf8")) : {};
      const exampleMatch = /```tsx\n([\s\S]*?)```/.exec(sec.使用例 ?? "");
      const storiesPath = join(UI_DIR, slug, "index.stories.tsx");
      const stories = existsSync(storiesPath) ? storyNames(readFileSync(storiesPath, "utf8")) : [];
      const storyTitle = /title: "([^"]+)"/.exec(
        existsSync(storiesPath) ? readFileSync(storiesPath, "utf8") : "",
      )?.[1];
      const storybookId = (storyTitle ?? `UI/${item.title}`)
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "");
      return {
        slug,
        title: item.title,
        description: item.description,
        overview: (sec.概要 ?? "").trim(),
        antiPatterns: anti,
        recommended,
        spec: specFor(slug, ROOT) ?? EMPTY_SPEC,
        notes,
        example: exampleMatch?.[1]?.trimEnd() ?? "",
        stories,
        // 関連部品はページがある UI 部品だけ（lib / mascot / theme は registry の項目だがページは無い）
        dependsOn: (item.registryDependencies ?? []).filter((d) => uiSlugs.has(d)),
        usedBy: usedBy.get(slug) ?? [],
        phase: PHASE_BY_COMPONENT[slug] ?? "v1（Phase 4、2026-09-21）",
        storybookUrl: `${BASE_PATH}/storybook/?path=/docs/${storybookId}--docs`,
      };
    })
    .sort((a, b) => a.title.localeCompare(b.title, "en"));
}

export function findComponent(slug: string): ComponentDoc | undefined {
  return listComponents().find((c) => c.slug === slug);
}

/** 部品ページの節（一般的なデザインシステムのガイドラインと同じ節立て）と、nekodemo での整備状況 */
export type SectionStatus = "done" | "partial" | "todo";
export type SectionKey =
  | "overview"
  | "anatomy"
  | "options"
  | "states"
  | "behaviors"
  | "metrics"
  | "usage"
  | "contents"
  | "related"
  | "references"
  | "changelog";

export const SECTION_LABELS: { key: SectionKey; label: string; en: string }[] = [
  { key: "overview", label: "概要", en: "Overview" },
  { key: "anatomy", label: "解剖図", en: "Anatomy" },
  { key: "options", label: "選択肢", en: "Options" },
  { key: "states", label: "状態", en: "States" },
  { key: "behaviors", label: "振る舞い", en: "Behaviors" },
  { key: "metrics", label: "寸法", en: "Metrics" },
  { key: "usage", label: "使い方", en: "Usage" },
  { key: "contents", label: "内容（文言）", en: "Contents" },
  { key: "related", label: "関連部品", en: "Related" },
  { key: "references", label: "参考文献", en: "References" },
  { key: "changelog", label: "変更履歴", en: "Change log" },
];

export const STATE_WORDS =
  /状態|disabled|loading|error|読み込み|無効|エラー|0 件|選択|checked|open/i;

/** 「状態」節に載せるストーリー（disabled / loading / エラーなど状態を扱うもの）。バッジと本文は同じ判定を使う */
export function stateStories(doc: ComponentDoc): { id: string; name: string }[] {
  return doc.stories.filter((s) => STATE_WORDS.test(`${s.id} ${s.name}`));
}

/** 手書きの節（docs/guidelines/components/<slug>.md）があれば本文を返す */
export function note(doc: ComponentDoc, heading: string): string {
  return (doc.notes[heading] ?? "").trim();
}

export function sectionStatus(doc: ComponentDoc): Record<SectionKey, SectionStatus> {
  const hasOptions = Object.keys(doc.spec.options).length > 0;
  const hasMetrics = doc.spec.metrics.some((m) => m.height !== null);
  return {
    overview: doc.overview ? "done" : "todo",
    anatomy: ANATOMY_SLUGS.includes(doc.slug) ? "done" : "todo",
    // 選択肢: 実装の variant / size を表にできれば整備済み。無くてもストーリーがあれば Storybook で確認できる
    options: hasOptions ? "done" : doc.stories.length > 0 ? "partial" : "todo",
    // 状態: 実装がスタイルを持つ状態の表。ストーリーだけなら一部
    states: doc.spec.states.length > 0 ? "done" : stateStories(doc).length > 0 ? "partial" : "todo",
    behaviors: note(doc, "振る舞い") ? "done" : "todo",
    // 寸法: 実装から高さの段階が取れたときだけ整備済み（本文の語句で「一部」にしない）
    metrics: hasMetrics ? "done" : "todo",
    usage:
      doc.recommended.length > 0 && doc.antiPatterns.length > 0
        ? "done"
        : doc.recommended.length + doc.antiPatterns.length > 0
          ? "partial"
          : "todo",
    contents: note(doc, "内容") ? "done" : "partial",
    related: doc.dependsOn.length + doc.usedBy.length > 0 ? "done" : "partial",
    references: note(doc, "参考文献") ? "done" : "todo",
    // 変更履歴: 追加された版は全部品で分かる（CHANGELOG と対応）
    changelog: "done",
  };
}
