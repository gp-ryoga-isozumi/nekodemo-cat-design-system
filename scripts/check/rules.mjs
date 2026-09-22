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
  for (const m of line.matchAll(re)) {
    const r = make(m, m.index + 1, lineNo);
    if (r) out.push(r);
  }
  return out;
}

/** ソース全体に正規表現を当て、行番号と列を復元する（Biome が整形した複数行の JSX を拾うため）。除外行・コメント行は飛ばす */
function eachSourceMatch(ctx, re, make) {
  const out = [];
  const starts = [];
  let pos = 0;
  for (const l of ctx.lines) {
    starts.push(pos);
    pos += l.length + 1;
  }
  const lineOf = (idx) => {
    let lo = 0;
    let hi = starts.length - 1;
    while (lo < hi) {
      const mid = (lo + hi + 1) >> 1;
      if (starts[mid] <= idx) lo = mid;
      else hi = mid - 1;
    }
    return lo;
  };
  for (const m of ctx.source.matchAll(re)) {
    const li = lineOf(m.index);
    if (ctx.ignoredLines.has(li) || isCommentLine(ctx.lines[li])) continue;
    const r = make(m, m.index - starts[li] + 1, li + 1);
    if (r) out.push(r);
  }
  return out;
}

/** `href="#abc"` や `url(#grad)` のような URL・参照の文脈（色ではない） */
const isReferenceContext = (before) =>
  // fill / stroke などの塗りは含めない（`fill="#ff0000"` は色の直書き。`fill="url(#grad)"` は url( 側で除外する）
  /(?:href|to|src|id|name|for|htmlFor|hash)\s*[=:]\s*["'`{]*$/.test(before) ||
  /url\(\s*["']?$/.test(before);

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
          (m, col) => {
            // `href="#abc"` のようなアンカーや `url(#id)` は色ではない
            if (m[1].startsWith("#") && isReferenceContext(line.slice(0, m.index))) return null;
            return {
              line: n,
              col,
              message: `色の直書き "${m[1]}"。役割トークン名（bg-surface-card / text-text-low 等）を使ってください`,
              fix: "themes/*.json の変更が必要なら PR を出す",
            };
          },
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
    // 複数行に整形された style={{ … }} も拾うため、ソース全体に当てる
    test: (ctx) =>
      eachSourceMatch(ctx, /style=\{\{([\s\S]*?)\}\}/g, (m, col, n) => {
        const p =
          /\b(color|background|backgroundColor|borderColor|fill|stroke|outlineColor)\s*:/.exec(
            m[1],
          );
        if (!p) return null;
        return {
          line: n,
          col,
          message: `style で "${p[1]}" を指定しています。className の役割トークンを使ってください`,
        };
      }),
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
      // `<button\n  type="button"\n>` のように整形された複数行のタグも拾う（行末でも一致させる）
      return eachSourceMatch(
        ctx,
        /<(table|button|input|select|textarea)(?=[\s>/]|$)/gm,
        (m, col, n) => ({
          line: n,
          col,
          message: `生の <${m[1]}> の代わりに nekodemo の ${{ table: "Table", button: "Button / IconButton", input: "Input", select: "Select", textarea: "Textarea" }[m[1]]} を使ってください`,
        }),
      );
    },
  },
  {
    id: "NK010",
    severity: "info",
    description: "一覧を描画しているのに 4 状態（読み込み中 / 0 件 / エラー）のどれかが無い",
    test: (ctx) => {
      // 画面（page.tsx / pages/*.tsx）と、一覧らしい名前の部品（*-list.tsx / *-table.tsx / *-grid.tsx 等）を対象にする
      // （ナビや切替スイッチの .map は一覧ではないので対象外。nekodemo の部品実装・ストーリーも対象外）
      const isScreen = /(^|\/)(page\.tsx|pages\/[^/]+\.tsx)$/.test(ctx.path);
      const isListPart = /(list|table|grid|rows|results|items)[^/]*\.tsx$/i.test(ctx.path);
      if (!(isScreen || isListPart) || /components\/ui\/|\.stories\.tsx$/.test(ctx.path)) return [];
      // generateStaticParams 内の .map（データの変換）は対象外。JSX 式の中の .map（{items.map(...)}）だけを一覧の描画とみなす
      const source = ctx.source.replace(
        /export\s+(?:async\s+)?function\s+generateStaticParams[\s\S]*?\n\}/g,
        "",
      );
      if (!/\{[^{}\n]*\.map\(/.test(source)) return [];
      // DataGrid は 4 状態を内蔵している
      if (/<DataGrid\b/.test(source)) return [];
      const missing = [];
      if (!/Skeleton|SkeletonRows|Spinner|<Progress\b/.test(source))
        missing.push("読み込み中（Skeleton / Spinner）");
      if (!/EmptyState/.test(source)) missing.push("0 件（EmptyState）");
      if (!/InlineMessage|variant="negative"|toast\.error/.test(source))
        missing.push("エラー（InlineMessage negative）");
      if (missing.length === 0) return [];
      return [
        {
          line: 1,
          col: 1,
          message: `一覧を描画していますが ${missing.join("、")} の実装が見当たりません。4 状態を確認してください（docs/guidelines/02-states.md）`,
        },
      ];
    },
  },
];

export const _rulesTail = [
  {
    id: "NK012",
    severity: "error",
    description:
      "style 属性でのウェイト・文字サイズ・角丸・フォントの指定（NK003 / NK007 の抜け道）",
    test: (ctx) => {
      if (/components\/ui\//.test(ctx.path)) return []; // 部品の実装（Icon のフォールバック等）は除外
      return eachSourceMatch(ctx, /style=\{\{([\s\S]*?)\}\}/g, (m, col, n) => {
        const p = /\b(fontWeight|fontSize|borderRadius|fontFamily|lineHeight)\s*:/.exec(m[1]);
        if (!p) return null;
        return {
          line: n,
          col,
          message: `style で "${p[1]}" を指定しています。font-bold / text-3 / rounded-action のようなクラスを使ってください`,
        };
      });
    },
  },
  {
    id: "NK014",
    severity: "warn",
    description: "1 画面に primary の Button が 2 つ以上（主アクションは 1 画面 1 つ）",
    test: (ctx) => {
      if (!/(^|\/)(page\.tsx|pages\/[^/]+\.tsx)$/.test(ctx.path)) return [];
      const primaries = eachSourceMatch(
        ctx,
        /<Button\b((?:[^>{]|\{(?:[^{}]|\{[^{}]*\})*\})*)>/g,
        (m, col, n) => {
          const attrs = m[1];
          // EmptyState の action / DataGrid の emptyAction のように、その状態でだけ出る主ボタンは数えない
          const before = ctx.source.slice(Math.max(0, m.index - 80), m.index);
          if (/[aA]ction=\{\s*$/.test(before)) return null;
          const variant = /variant=\{?["']([a-z]+)["']/.exec(attrs)?.[1];
          if (variant && variant !== "primary") return null;
          if (/variant=\{[^"']/.test(attrs)) return null; // 動的な variant は判定しない
          return { line: n, col };
        },
      );
      if (primaries.length < 2) return [];
      return [
        {
          line: primaries[1].line,
          col: primaries[1].col,
          message: `primary の Button が ${primaries.length} 個あります。主アクションは 1 画面 1 つにし、他は variant="secondary" / "outline" / "ghost" にしてください（docs/guidelines/03-actions.md）`,
        },
      ];
    },
  },
  {
    id: "NK018",
    severity: "warn",
    description: "送信ボタンを初期状態で disabled にしている（送信して検証する）",
    test: (ctx) =>
      eachSourceMatch(ctx, /<Button\b((?:[^>{]|\{(?:[^{}]|\{[^{}]*\})*\})*)>/g, (m, col, n) => {
        const attrs = m[1];
        if (!/type=["']submit["']/.test(attrs)) return null;
        // 真偽値の省略形（<Button type="submit" disabled>）も拾う。送信中の loading / isSubmitting / isPending 等は可（大文字小文字を問わない）
        if (!/\bdisabled\b/.test(attrs)) return null;
        if (/disabled=\{[^}]*(loading|submitting|pending)[^}]*\}/i.test(attrs)) return null;
        return {
          line: n,
          col,
          message:
            "送信ボタンを disabled にしています。初期状態から押せるようにし、押したときに検証してエラーを出してください（docs/guidelines/03-actions.md の 3）。送信中だけ loading にします",
        };
      }),
  },
  {
    id: "NK020",
    severity: "info",
    description: "画面の見出し（h1）が無い、または 2 つ以上ある",
    test: (ctx) => {
      if (!/(^|\/)(page\.tsx|pages\/[^/]+\.tsx)$/.test(ctx.path)) return [];
      if (/\/(layout|loading|error|not-found)\.tsx$/.test(ctx.path)) return [];
      const h1 = (ctx.source.match(/<h1\b/g) ?? []).length;
      const pageHeader = /<PageHeader\b/.test(ctx.source);
      if (h1 === 0 && !pageHeader) {
        return [
          {
            line: 1,
            col: 1,
            message:
              "画面の見出し（h1）がありません。PageHeader の title か <h1> を 1 つ置いてください（1 画面に 1 つ）",
          },
        ];
      }
      if (h1 + (pageHeader ? 1 : 0) >= 2) {
        return [
          {
            line: 1,
            col: 1,
            message: "見出し（h1 / PageHeader）が 2 つ以上あります。1 画面に 1 つにしてください",
          },
        ];
      }
      return [];
    },
  },
  {
    id: "NK011",
    severity: "error",
    description: '空の読み上げ名（label="" / aria-label=""）。名前が無いのと同じ',
    test: (ctx) =>
      eachLine(ctx, (line, n) =>
        matchAll(
          line,
          /\b(label|aria-label|title)=(?:""|''|\{\s*(?:""|''|``)\s*\})/g,
          n,
          (m, col) => ({
            line: n,
            col,
            message: `${m[1]} が空です。読み上げ名（「削除する」「案件を検索」のような語）を入れてください`,
          }),
        ),
      ),
  },
];
rules.push(..._rulesTail);

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
