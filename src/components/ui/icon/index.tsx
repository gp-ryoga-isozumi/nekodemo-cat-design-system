// nekodemo-check-ignore-file NK005 — T3 フォールバック（material-symbols クラス）はこの部品だけが使う
import { cn } from "../../../lib/utils";
import { icons } from "./icons.generated";

/** 12 段階のサイズ（px）。タイポグラフィ段階と同じ（設計書 §6.4 / §8.2） */
export const ICON_SIZES = [12, 14, 16, 18, 20, 24, 28, 32, 36, 42, 48, 54] as const;
export type IconSize = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;

export type IconProps = {
  /** Material Symbols の名前（snake_case）。例: "search", "delete", "settings" */
  icon: string;
  /** 1〜12（12 / 14 / 16 / 18 / 20 / 24 / 28 / 32 / 36 / 42 / 48 / 54px）。既定 3 = 16px */
  size?: IconSize;
  /** 塗りつぶし版 */
  fill?: boolean;
  /** 指定時は role="img" と aria-label。未指定は装飾扱い（aria-hidden） */
  label?: string;
  /** 色は text-object-* で指定する（fill=currentColor） */
  className?: string;
};

const warned = new Set<string>();

/**
 * Icon
 *
 * 概要: 猫耳アイコン。Material Symbols と同じ名前で指定する。猫版（T1 専用 / T2 自動耳）があれば inline SVG、
 * 無ければ Material Symbols Rounded のフォント（T3）にフォールバックして表示が壊れない（開発時は console.warn）。
 * 色は `text-object-high` などの役割トークンで指定する。
 *
 * アンチパターン:
 * - `lucide-react` など別のアイコンライブラリを混ぜる
 * - 意味を持つアイコンに `label` を付けない（IconButton では必須）
 * - `style={{ color }}` や `#hex` で色を付ける
 *
 * 使用例:
 * ```tsx
 * <Icon icon="search" />
 * <Icon icon="delete" size={5} className="text-object-negative" label="削除" />
 * <Icon icon="favorite" fill />
 * ```
 */
export function Icon({ icon, size = 3, fill = false, label, className }: IconProps) {
  const px = ICON_SIZES[size - 1] ?? 16;
  const def = icons[icon];
  const a11y = label
    ? { role: "img" as const, "aria-label": label }
    : { "aria-hidden": true as const };

  if (!def) {
    if (process.env.NODE_ENV !== "production" && !warned.has(icon)) {
      warned.add(icon);
      console.warn(
        `[nekodemo] アイコン "${icon}" の猫版がありません。Material Symbols フォント（T3）で表示します。icons/wanted.txt への追加を検討してください（nekodemo check NK006）。`,
      );
    }
    return (
      <span
        className={cn(
          "material-symbols-rounded inline-block shrink-0 select-none align-middle leading-none",
          className,
        )}
        style={{
          fontSize: px,
          width: px,
          height: px,
          fontVariationSettings: `'FILL' ${fill ? 1 : 0}, 'wght' 500, 'GRAD' 0, 'opsz' ${Math.min(48, Math.max(20, px))}`,
        }}
        data-icon={icon}
        data-icon-tier="fallback"
        {...a11y}
      >
        {icon}
      </span>
    );
  }

  const d = fill && def.fill ? def.fill : def.d;
  const ears = fill && def.fill ? def.fillEars : def.ears;
  return (
    // biome-ignore lint/a11y/noSvgWithoutTitle: label があれば <title> と aria-label、無ければ aria-hidden を付ける（{...a11y}）
    <svg
      viewBox="0 0 24 24"
      width={px}
      height={px}
      className={cn("inline-block shrink-0 fill-current align-middle", className)}
      data-icon={icon}
      data-icon-tier={def.tier}
      {...a11y}
    >
      {label ? <title>{label}</title> : null}
      <path d={d} />
      {ears ? (
        <path
          d={ears}
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      ) : null}
    </svg>
  );
}
