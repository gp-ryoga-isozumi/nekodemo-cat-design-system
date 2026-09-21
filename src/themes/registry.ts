// 生成物: scripts/build-themes.mjs が themes/*.json から生成する。手で編集しない（pnpm build:themes）。

export const nekoThemes = [
  {
    "id": "calico",
    "scheme": "light",
    "label": {
      "ja": "三毛",
      "en": "Calico"
    },
    "mood": {
      "ja": [
        "親しみやすい",
        "元気",
        "明るい"
      ],
      "keywords": [
        "toC",
        "コミュニティ",
        "学習",
        "子ども向け",
        "カジュアル",
        "あたたかい",
        "ポップ"
      ]
    },
    "fonts": {
      "pro": "Zen Maru Gothic",
      "mono": "Noto Sans Mono"
    },
    "mascot": "calico"
  },
  {
    "id": "american-shorthair",
    "scheme": "light",
    "label": {
      "ja": "アメショ",
      "en": "American Shorthair"
    },
    "mood": {
      "ja": [
        "中立",
        "落ち着き",
        "モノトーン"
      ],
      "keywords": [
        "業務システム",
        "管理画面",
        "ダッシュボード",
        "SaaS",
        "真面目",
        "シンプル",
        "バックオフィス"
      ]
    },
    "fonts": {
      "pro": "Zen Maru Gothic",
      "mono": "Noto Sans Mono"
    },
    "mascot": "american-shorthair"
  },
  {
    "id": "russian-blue",
    "scheme": "dark",
    "label": {
      "ja": "ロシアンブルー",
      "en": "Russian Blue"
    },
    "mood": {
      "ja": [
        "上品",
        "クール",
        "静か",
        "夜"
      ],
      "keywords": [
        "高級感",
        "落ち着き",
        "金融",
        "法務",
        "ヘルスケア",
        "フォーマル",
        "ダーク",
        "ダークモード"
      ]
    },
    "fonts": {
      "pro": "Zen Maru Gothic",
      "mono": "Noto Sans Mono"
    },
    "mascot": "russian-blue"
  }
] as const;

export type NekoTheme = (typeof nekoThemes)[number];
export type NekoThemeId = NekoTheme["id"];

export const nekoThemeIds = nekoThemes.map((t) => t.id) as NekoThemeId[];
export const defaultNekoTheme: NekoThemeId = "calico";
export const NEKO_THEME_STORAGE_KEY = "neko-theme";

export function isNekoThemeId(value: unknown): value is NekoThemeId {
  return typeof value === "string" && (nekoThemeIds as string[]).includes(value);
}
