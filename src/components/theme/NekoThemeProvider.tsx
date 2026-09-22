"use client";

import {
  createContext,
  type ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  defaultNekoTheme,
  isNekoThemeId,
  NEKO_THEME_STORAGE_KEY,
  type NekoThemeId,
  nekoThemes,
} from "../../themes/registry";

export type NekoThemeContextValue = {
  /** 現在のテーマ ID */
  theme: NekoThemeId;
  /** テーマを切り替える。persist 時は localStorage にも保存する */
  setTheme: (id: NekoThemeId) => void;
  /** 利用できるテーマ一覧（themes/registry.ts） */
  themes: typeof nekoThemes;
};

const NekoThemeContext = createContext<NekoThemeContextValue | null>(null);

/**
 * NekoThemeProvider
 *
 * 概要: `<html data-neko-theme="…">` を書き換えてテーマをランタイム切替する（設計書 §7.4）。外部依存なし。
 * `persist` を付けると localStorage（キー `neko-theme`）に保存し、次回は `NekoHead` の inline script が
 * hydration 前に属性を付けるのでちらつかない。
 *
 * アンチパターン:
 * - ルートレイアウト以外に置く（`<html>` の属性を書き換えるため、1 つだけ置く）
 * - `<html>` に `data-neko-theme` を付けずに使う（SSR の初回表示が既定テーマになり、切替時にちらつく）
 * - persist 時に `<html suppressHydrationWarning>` を忘れる（inline script が属性を変えるため React が警告する）
 *
 * 使用例:
 * ```tsx
 * <html lang="ja" data-neko-theme="russian-blue" suppressHydrationWarning>
 *   <head><NekoHead /></head>
 *   <body>
 *     <NekoThemeProvider defaultTheme="russian-blue" persist>{children}</NekoThemeProvider>
 *   </body>
 * </html>
 * ```
 */
export function NekoThemeProvider({
  children,
  defaultTheme = defaultNekoTheme,
  persist = false,
  storageKey = NEKO_THEME_STORAGE_KEY,
}: {
  children: ReactNode;
  defaultTheme?: NekoThemeId;
  persist?: boolean;
  storageKey?: string;
}) {
  const [theme, setThemeState] = useState<NekoThemeId>(defaultTheme);

  // 初回: persist なら保存済みテーマを読む（NekoHead の inline script が既に属性を付けていても state を同期する）。
  // 保存値の読み取りと属性の書き込みを同じ effect で行い、初回に defaultTheme を一瞬書いてから戻す（フリッカー）を防ぐ
  const restored = useRef(false);
  useEffect(() => {
    let next = theme;
    if (persist && !restored.current) {
      try {
        const saved = localStorage.getItem(storageKey);
        if (isNekoThemeId(saved)) next = saved;
      } catch {
        // localStorage が使えない環境（プライベートモード等）では既定テーマのまま
      }
    }
    restored.current = true;
    document.documentElement.setAttribute("data-neko-theme", next);
    if (next !== theme) setThemeState(next);
  }, [theme, persist, storageKey]);

  const setTheme = useCallback(
    (id: NekoThemeId) => {
      if (!isNekoThemeId(id)) return;
      setThemeState(id);
      if (persist) {
        try {
          localStorage.setItem(storageKey, id);
        } catch {
          // 保存できなくても切替自体は動く
        }
      }
    },
    [persist, storageKey],
  );

  const value = useMemo<NekoThemeContextValue>(
    () => ({ theme, setTheme, themes: nekoThemes }),
    [theme, setTheme],
  );

  return <NekoThemeContext.Provider value={value}>{children}</NekoThemeContext.Provider>;
}

/**
 * useNekoTheme
 *
 * 概要: 現在のテーマと切替関数を返す。`NekoThemeProvider` の中でだけ使える。
 *
 * 使用例:
 * ```tsx
 * const { theme, setTheme, themes } = useNekoTheme();
 * ```
 */
export function useNekoTheme(): NekoThemeContextValue {
  const ctx = useContext(NekoThemeContext);
  if (!ctx) throw new Error("useNekoTheme は NekoThemeProvider の中で使ってください");
  return ctx;
}
