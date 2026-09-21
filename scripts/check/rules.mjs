// nekodemo check のルール（設計書 §11.4）。v1 は正規表現ベースの軽量実装。
// 各ルールは { id, severity, description, test(ctx) → findings[] } を持つ。ctx は 1 ファイル分。

const TAILWIND_DEFAULT_PALETTE =
  "slate|gray|zinc|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose";
const COLOR_UTILS =
  "bg|text|border|border-[trblxy]|fill|stroke|ring|ring-offset|outline|from|via|to|shadow|accent|caret|decoration|divide|placeholder|inset-ring";

const isCommentLine = (line) => /^\s*(\/\/|\/\*|\*)/.test(line);

function eachLine(ctx, fn) {
  const findings = [];
  ctx.lines.forEach((line, i) => {
    if (ctx.ignoredLines.has(i)) return;
    const r = fn(line, i + 1);
    if (Array.isArray(r)) findings.push(...r);
    else if (r) findings.push(r);
  });
  return findings;
}

function matchAll(line, re, lineNo, make) {
  const out = [];
  for (const m of line.matchAll(re)) out.push(make(m, m.index + 1, lineNo));
  return out;
}

export const rules = [
  {
    id: "NK001",
    severity: "error",
    description:
      "色の直書き（#hex / rgb() / hsl() / oklch()）。役割トークン（bg-surface-card 等）を使う",
    test: (ctx) =>
      eachLine(ctx, (line, n) => {
        if (isCommentLine(line)) return null;
        return matchAll(
          line,
          /(#(?:[0-9a-fA-F]{3}|[0-9a-fA-F]{4}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})\b|\b(?:rgba?|hsla?|oklch|oklab)\()/g,
          n,
          (m, col) => ({
            line: n,
            col,
            message: `色の直書き "${m[1]}"。役割トークン名（bg-surface-card / text-text-low 等）を使ってください`,
            fix: "themes/*.json の変更が必要なら PR を出す",
          }),
        );
      }),
  },
  {
    id: "NK002",
    severity: "error",
    description: "Tailwind 既定パレットのクラス（bg-blue-500 等）。ビルドで存在しない",
    test: (ctx) =>
      eachLine(ctx, (line, n) =>
        matchAll(
          line,
          new RegExp(
            `(?<![\\w-])((?:${COLOR_UTILS})-(?:${TAILWIND_DEFAULT_PALETTE})-\\d{2,3}(?:/\\d+)?)(?![\\w-])`,
            "g",
          ),
          n,
          (m, col) => ({
            line: n,
            col,
            message: `Tailwind 既定パレット "${m[1]}" は存在しません。役割トークン（bg-surface-primary / text-text-low 等）か status 色（bg-info-50 等）を使ってください`,
          }),
        ),
      ),
  },
  {
    id: "NK003",
    severity: "error",
    description: "任意値の色・文字サイズ・角丸（bg-[#…] / text-[13px] / rounded-[…]）",
    test: (ctx) =>
      eachLine(ctx, (line, n) =>
        matchAll(
          line,
          /(?<![\w-])((?:[a-z-]+)-\[#[0-9a-fA-F]{3,8}\]|(?:text|leading)-\[[\d.]+(?:px|rem|em)\]|rounded(?:-[trblse]{1,2})?-\[[^\]]+\]|font-\[[^\]]+\])/g,
          n,
          (m, col) => ({
            line: n,
            col,
            message: `任意値 "${m[1]}" は使えません。text-1〜12 / rounded-action 等の段階を使ってください`,
          }),
        ),
      ),
  },
  {
    id: "NK004",
    severity: "error",
    description: "style 属性での色指定（style={{ color / background / borderColor }}）",
    test: (ctx) =>
      eachLine(ctx, (line, n) =>
        matchAll(
          line,
          /style=\{\{[^}]*?\b(color|background|backgroundColor|borderColor|fill|stroke|outlineColor)\s*:/g,
          n,
          (m, col) => ({
            line: n,
            col,
            message: `style で "${m[1]}" を指定しています。className の役割トークンを使ってください`,
          }),
        ),
      ),
  },
  {
    id: "NK005",
    severity: "error",
    description: "lucide-react の import、material-symbols クラスの直書き（Icon 部品を使う）",
    test: (ctx) =>
      eachLine(ctx, (line, n) => {
        const out = [];
        if (/from\s+["']lucide-react["']/.test(line))
          out.push({
            line: n,
            col: 1,
            message: 'lucide-react は使いません。<Icon icon="..." /> を使ってください',
          });
        if (/material-symbols-(rounded|outlined|sharp)/.test(line) && !isCommentLine(line))
          out.push({
            line: n,
            col: 1,
            message:
              'material-symbols クラスの直書きは使いません。<Icon icon="..." /> を使ってください',
          });
        return out;
      }),
  },
  {
    id: "NK006",
    severity: "warn",
    description: "猫版が無いアイコン名（T3 フォールバック）",
    test: (ctx) => {
      if (!ctx.iconNames) return [];
      return eachLine(ctx, (line, n) =>
        matchAll(line, /\bicon\s*[=:]\s*(?:\{\s*)?["']([a-z0-9_]+)["']/g, n, (m, col) => {
          if (ctx.iconNames.has(m[1])) return null;
          return {
            line: n,
            col,
            message: `アイコン "${m[1]}" の猫版がありません（Material Symbols フォントで表示されます）。icons/wanted.txt への追加を依頼してください（skill: request-cat-icon）`,
            icon: m[1],
          };
        }).filter(Boolean),
      );
    },
  },
  {
    id: "NK007",
    severity: "error",
    description: "400 / 700 以外のフォントウェイト（font-medium / semibold 等）",
    test: (ctx) =>
      eachLine(ctx, (line, n) =>
        matchAll(
          line,
          /(?<![\w-])(font-(?:thin|extralight|light|medium|semibold|extrabold|black))(?![\w-])/g,
          n,
          (m, col) => ({
            line: n,
            col,
            message: `"${m[1]}" は使えません（ウェイトは font-normal / font-bold のみ）`,
          }),
        ),
      ),
  },
  {
    id: "NK008",
    severity: "warn",
    description: "ルートレイアウトに data-neko-theme が無い",
    test: (ctx) => {
      const isRootLayout =
        /(^|\/)(src\/)?app\/layout\.tsx$/.test(ctx.path) || /(^|\/)index\.html$/.test(ctx.path);
      if (!isRootLayout) return [];
      if (/data-neko-theme/.test(ctx.source)) return [];
      return [
        {
          line: 1,
          col: 1,
          message: '<html> に data-neko-theme="…" を付けてください（docs/ai/SETUP.md）',
        },
      ];
    },
  },
  {
    id: "NK009",
    severity: "warn",
    description:
      "生の <table> / <button> / <input> / <select> / <textarea>（nekodemo の部品がある）",
    test: (ctx) => {
      if (!/\.(tsx|jsx)$/.test(ctx.path)) return [];
      if (/components\/ui\//.test(ctx.path)) return []; // 部品の実装自体は除外
      return eachLine(ctx, (line, n) =>
        matchAll(line, /<(table|button|input|select|textarea)(?=[\s>/])/g, n, (m, col) => ({
          line: n,
          col,
          message: `生の <${m[1]}> の代わりに nekodemo の ${{ table: "Table", button: "Button / IconButton", input: "Input", select: "Select", textarea: "Textarea" }[m[1]]} を使ってください`,
        })),
      );
    },
  },
  {
    id: "NK010",
    severity: "info",
    description: "一覧を描画しているのに Skeleton / EmptyState の参照が無い（4 状態の抜けの目安）",
    test: (ctx) => {
      // 画面（page.tsx / pages/*.tsx）だけを対象にする（ナビや部品内の .map は対象外）
      if (!/(^|\/)(page\.tsx|pages\/[^/]+\.tsx)$/.test(ctx.path)) return [];
      // generateStaticParams 内の .map（データの変換）は対象外。JSX 式の中の .map（{items.map(...)}）だけを一覧の描画とみなす
      const source = ctx.source.replace(
        /export\s+(?:async\s+)?function\s+generateStaticParams[\s\S]*?\n\}/g,
        "",
      );
      if (!/\{[^{}\n]*\.map\(/.test(source)) return [];
      if (/Skeleton|EmptyState/.test(source)) return [];
      return [
        {
          line: 1,
          col: 1,
          message:
            "一覧を描画していますが Skeleton / EmptyState の参照がありません。読み込み中 / 0 件 / エラー / 成功 の 4 状態を確認してください（docs/guidelines/02-states.md）",
        },
      ];
    },
  },
];

/** AI が最後に自己確認する項目（自動化できないもの。--format json の manualChecks） */
export const manualChecks = [
  "4 状態（読み込み中 / 0 件 / エラー / 成功）を実装した",
  "主ボタン（primary）は 1 画面 1 つ",
  "削除・取り消し不可の操作に確認 Dialog があり、ボタン文言が「削除する」のように動作を書いている",
  "NekoThemePicker で 3 テーマを切り替えても崩れない",
  "キーボードだけで主要操作（一覧 → 詳細 → 編集 → 保存）ができる",
  "文言が「です・ます」で、ボタンは「〜する」",
  "猫要素（マスコット・絵文字・装飾）を業務データの領域に入れていない",
];
