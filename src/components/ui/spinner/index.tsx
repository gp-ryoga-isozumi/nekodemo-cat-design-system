import { cn } from "../../../lib/utils";

const SIZES = { sm: 16, md: 20, lg: 40 } as const;

export type SpinnerProps = {
  /** sm 16 / md 20 / lg 40px */
  size?: keyof typeof SIZES;
  /** 読み上げ用の説明。既定「読み込み中」 */
  label?: string;
  /** 色は text-object-* で指定する（既定は currentColor） */
  className?: string;
};

/**
 * Spinner
 *
 * 概要: 読み込み中を表す毛糸玉のアニメーション（設計書 §8.6）。Button の loading 状態でも使う。
 * `role="status"` と `aria-label` を持つので、単独で置いても読み上げられる。
 *
 * アンチパターン:
 * - 一覧やカード群の読み込みに使う（そこは Skeleton。Spinner はボタン内や小さな領域向け）
 * - 装飾として常時回す
 *
 * 使用例:
 * ```tsx
 * <Spinner />
 * <Spinner size="lg" label="案件を読み込み中" className="text-object-primary" />
 * ```
 */
export function Spinner({ size = "md", label = "読み込み中", className }: SpinnerProps) {
  const px = SIZES[size];
  return (
    <svg
      role="status"
      aria-label={label}
      viewBox="0 0 24 24"
      width={px}
      height={px}
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      className={cn("inline-block shrink-0 animate-spin motion-reduce:animate-none", className)}
      data-slot="spinner"
    >
      <title>{label}</title>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M4.6 9.5c4.5-2.2 9.5-2 15 1M4 14.2c5.5-3 10.5-3 16 0M9.2 4.2c-2.2 4.5-2 9.5 1 15" />
    </svg>
  );
}
