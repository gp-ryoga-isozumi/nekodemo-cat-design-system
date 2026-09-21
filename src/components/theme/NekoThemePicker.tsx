"use client";

import { useId } from "react";
import { cn } from "../../lib/utils";
import { isNekoThemeId } from "../../themes/registry";
import { Mascot } from "../mascot";
import { useNekoTheme } from "./NekoThemeProvider";

/**
 * NekoThemePicker
 *
 * 概要: テーマ切替 UI。`faces`（既定）は 3 匹の顔を並べたトグル、`menu` はドロップダウン。
 * 画面を見る人（被験者・レビュアー）が触る想定なので、ヘッダー右上に 1 つ置く（設計書 §7.5、§10.6）。
 *
 * アンチパターン:
 * - 複数置く（状態は 1 つなので混乱する）
 * - 業務画面の本文内に置く
 *
 * 使用例:
 * ```tsx
 * <NekoThemePicker />                 // faces
 * <NekoThemePicker variant="menu" />  // ドロップダウン
 * ```
 */
export function NekoThemePicker({
  variant = "faces",
  className,
}: {
  variant?: "faces" | "menu";
  className?: string;
}) {
  const { theme, setTheme, themes } = useNekoTheme();
  const id = useId();

  if (variant === "menu") {
    return (
      <label className={cn("inline-flex items-center gap-2 text-2 text-text-middle", className)}>
        <span className="sr-only">テーマ</span>
        <select
          id={id}
          value={theme}
          onChange={(e) => {
            if (isNekoThemeId(e.target.value)) setTheme(e.target.value);
          }}
          className="h-8 rounded-action border border-border-high bg-surface-input px-2 text-2 text-text-high focus-visible:outline-2 focus-visible:outline-border-focus"
        >
          {themes.map((t) => (
            <option key={t.id} value={t.id}>
              {t.label.ja}
            </option>
          ))}
        </select>
      </label>
    );
  }

  return (
    <fieldset
      className={cn("m-0 inline-flex gap-1 rounded-round border-0 bg-surface-well p-1", className)}
    >
      <legend className="sr-only">テーマ切替</legend>
      {themes.map((t) => {
        const selected = t.id === theme;
        return (
          <button
            key={t.id}
            type="button"
            aria-pressed={selected}
            onClick={() => setTheme(t.id)}
            className={cn(
              "inline-flex h-9 items-center gap-2 rounded-round border-2 border-transparent py-0 pr-3 pl-1 text-2 text-text-middle",
              "hover:bg-surface-card focus-visible:outline-2 focus-visible:outline-border-focus",
              selected &&
                "border-border-focus bg-surface-card font-bold text-text-high shadow-raise",
            )}
          >
            <Mascot theme={t.id} size={28} />
            <span>{t.label.ja}</span>
          </button>
        );
      })}
    </fieldset>
  );
}
