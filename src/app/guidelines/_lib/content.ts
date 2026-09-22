// ガイドラインサイトの内容をリポジトリのファイルから読む（ビルド時にサーバー側で実行。静的書き出し）。
// 正は docs/guidelines/*.md、部品の README.md（JSDoc から生成）、item.json、stories。ここでは変換だけを行う。
import { existsSync, readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";

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
];

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

function storyNames(source: string): { id: string; name: string }[] {
  const out: { id: string; name: string }[] = [];
  // 空のストーリー（`Story = {}`）を先に試す。後ろの分岐は「行頭の `}` まで」なので、空のストーリーに当てると次のストーリーを飲み込む
  const re = /export const (\w+): Story = (\{\}|\{[\s\S]*?\n\});?/g;
  for (const m of source.matchAll(re)) {
    const id = m[1];
    const body = m[2] ?? "";
    const name = /\n\s*name: "([^"]+)"/.exec(body)?.[1] ?? id;
    if (id) out.push({ id, name });
  }
  return out;
}

const PHASE_BY_COMPONENT: Record<string, string> = {
  "data-grid": "v1.1（Phase 6、2026-09-22）",
  "search-combobox": "v1.1（Phase 6、2026-09-22）",
  icon: "v1（Phase 3a、2026-09-21）",
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
      const anti = (sec.アンチパターン ?? "")
        .split("\n")
        .map((l) => l.trim())
        .filter((l) => l.startsWith("- "))
        .map((l) => l.slice(2));
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

const STATE_WORDS = /状態|disabled|loading|error|読み込み|無効|エラー|0 件|選択|checked|open/i;
const OPTION_WORDS = /variant|size|サイズ|種類|バリエーション|色|向き|orientation|密度|density/i;

export function sectionStatus(doc: ComponentDoc): Record<SectionKey, SectionStatus> {
  return {
    overview: doc.overview ? "done" : "todo",
    anatomy: "todo",
    options: doc.stories.some((s) => OPTION_WORDS.test(`${s.id} ${s.name}`)) ? "partial" : "todo",
    states: doc.stories.some((s) => STATE_WORDS.test(`${s.id} ${s.name}`)) ? "partial" : "todo",
    behaviors: "todo",
    metrics: /px|サイズ|size/.test(doc.overview) ? "partial" : "todo",
    usage: doc.antiPatterns.length > 0 ? "partial" : "todo",
    contents: "partial",
    related: doc.dependsOn.length + doc.usedBy.length > 0 ? "done" : "partial",
    references: "todo",
    changelog: "partial",
  };
}
