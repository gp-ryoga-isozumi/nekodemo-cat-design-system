import type { SVGProps } from "react";
import { cn } from "../../lib/utils";
import type { NekoThemeId } from "../../themes/registry";

/**
 * Mascot
 *
 * 概要: テーマごとのマスコット（猫の顔）。色は役割トークン・アクセント（`fill-accent-1` 等）だけで描き、
 * `data-neko-theme` を自分自身に付けるので、現在のテーマに関係なく「その猫の色」で表示される（テーマ切替 UI 用）。
 * 用途は空状態・初回ローディング・404・ログイン・テーマ切替の顔に限る（設計書 §8.6）。
 *
 * アンチパターン:
 * - 表・フォーム・詳細など業務データの領域に置く（§10.6）
 * - 装飾として複数並べる
 *
 * 使用例:
 * ```tsx
 * <Mascot theme="calico" size={96} label="三毛" />
 * ```
 */
export function Mascot({
  theme,
  size = 40,
  label,
  className,
  ...props
}: { theme: NekoThemeId; size?: number; label?: string } & Omit<
  SVGProps<SVGSVGElement>,
  "width" | "height"
>) {
  const a11y = label
    ? { role: "img" as const, "aria-label": label }
    : { "aria-hidden": true as const };
  return (
    <svg
      data-neko-theme={theme}
      data-slot="mascot"
      viewBox="0 0 96 96"
      width={size}
      height={size}
      className={cn("shrink-0", className)}
      {...a11y}
      {...props}
    >
      <title>{label ?? ""}</title>
      {theme === "calico" && <CalicoFace />}
      {theme === "american-shorthair" && <AmericanShorthairFace />}
      {theme === "russian-blue" && <RussianBlueFace />}
    </svg>
  );
}

/* 耳・顔・鼻・口ひげは 3 匹共通の形。毛色（塗り）だけが違う */
const EARS = "M20 44 16 12l28 18z M76 44 80 12 52 30z";
const EAR_INNER_L = "M24 39 21 21l16 12z";
const EAR_INNER_R = "M72 39 75 21 59 33z";
const NOSE = "M45 67h6l-3 3z";
const MOUTH_WHISKERS = "M43 72q5 3 10 0M24 66l10-1M24 72l10 1M72 66l-10-1M72 72l-10 1";

function CalicoFace() {
  return (
    <>
      <path d={EARS} className="fill-accent-2" />
      <path d={EAR_INNER_L} className="fill-accent-3 opacity-60" />
      <path d={EAR_INNER_R} className="fill-accent-3 opacity-60" />
      <circle cx="48" cy="56" r="31" className="fill-accent-2" />
      <path d="M22 44q9-13 26-8L40 60z" className="fill-primary-500" />
      <path d="M58 30q16 2 19 20L60 50z" className="fill-accent-1" />
      <ellipse cx="38" cy="58" rx="4" ry="5" className="fill-accent-1" />
      <ellipse cx="58" cy="58" rx="4" ry="5" className="fill-accent-1" />
      <circle cx="39.5" cy="56" r="1.3" className="fill-white" />
      <circle cx="59.5" cy="56" r="1.3" className="fill-white" />
      <path d={NOSE} className="fill-accent-3" />
      <path
        d={MOUTH_WHISKERS}
        fill="none"
        strokeWidth="2"
        strokeLinecap="round"
        className="stroke-accent-1"
      />
    </>
  );
}

function AmericanShorthairFace() {
  return (
    <>
      <path d={EARS} className="fill-neutral-300" />
      <path d={EAR_INNER_L} className="fill-accent-3 opacity-50" />
      <path d={EAR_INNER_R} className="fill-accent-3 opacity-50" />
      <circle cx="48" cy="56" r="31" className="fill-neutral-300" />
      <path
        d="M40 27v10M48 25v13M56 27v10M22 52h8M66 52h8"
        fill="none"
        strokeWidth="4"
        strokeLinecap="round"
        className="stroke-accent-2"
      />
      <ellipse cx="38" cy="58" rx="4.5" ry="5" className="fill-accent-1" />
      <ellipse cx="58" cy="58" rx="4.5" ry="5" className="fill-accent-1" />
      <ellipse cx="38" cy="58" rx="1.6" ry="4" className="fill-accent-2" />
      <ellipse cx="58" cy="58" rx="1.6" ry="4" className="fill-accent-2" />
      <path d={NOSE} className="fill-accent-3" />
      <path
        d={MOUTH_WHISKERS}
        fill="none"
        strokeWidth="2"
        strokeLinecap="round"
        className="stroke-accent-2"
      />
    </>
  );
}

function RussianBlueFace() {
  return (
    <>
      <path d={EARS} className="fill-primary-500" />
      <path d={EAR_INNER_L} className="fill-accent-3 opacity-50" />
      <path d={EAR_INNER_R} className="fill-accent-3 opacity-50" />
      <circle cx="48" cy="56" r="31" className="fill-primary-500" />
      <ellipse cx="48" cy="76" rx="16" ry="9" className="fill-accent-2 opacity-60" />
      <ellipse cx="38" cy="58" rx="4.5" ry="5" className="fill-accent-1" />
      <ellipse cx="58" cy="58" rx="4.5" ry="5" className="fill-accent-1" />
      <ellipse cx="38" cy="58" rx="1.6" ry="4" className="fill-primary-900" />
      <ellipse cx="58" cy="58" rx="1.6" ry="4" className="fill-primary-900" />
      <path d={NOSE} className="fill-accent-3" />
      <path
        d={MOUTH_WHISKERS}
        fill="none"
        strokeWidth="2"
        strokeLinecap="round"
        className="stroke-primary-900"
      />
    </>
  );
}
