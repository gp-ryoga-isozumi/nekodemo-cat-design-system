import type { ComponentProps } from "react";
import { cn } from "../../../lib/utils";

export type ProgressProps = Omit<ComponentProps<"div">, "children"> & {
  /** 0〜100。省略すると不確定（終わりが分からない処理） */
  value?: number;
  /** 読み上げ名（必須。「アップロード」「取り込み」など何の進み具合か） */
  label: string;
  /** 右に「42%」を出す */
  showValue?: boolean;
  /** 不確定（value 省略）のときの読み上げ文言。既定「処理中」 */
  indeterminateText?: string;
  size?: "sm" | "md";
  /** 100% になったら success 色にする（既定 true） */
  completeVariant?: boolean;
};

/**
 * Progress
 *
 * 概要: 処理の進み具合を示す横棒（v1.2）。`value` を渡すと確定（0〜100%）、省略すると不確定（全体が明滅）。
 * 100% で success 色になる。`role="progressbar"` と `aria-valuenow` を持ち、`label` が読み上げ名になる。
 * 回転する小さな待機表示は Spinner、一覧の読み込みは Skeleton を使う。
 *
 * アンチパターン:
 * - 何の処理かを示すラベルを付けない（`label` は必須。見出しやテキストも添える）
 * - 同じ処理に Spinner と Progress を両方出す
 * - 手順の進み具合に使う（Stepper）
 *
 * 推奨例:
 * - ファイルのアップロードや一括取り込みのように、割合が分かる処理に `value` を渡す
 * - 割合が分からない処理は `value` を省略し、文言で「取り込み中…」と添える
 * - 100% になったら Toast か InlineMessage で完了を伝え、バーは消すか success のまま残す
 *
 * 使用例:
 * ```tsx
 * <Progress label="アップロード" value={42} showValue />
 * <Progress label="取り込み" size="sm" />
 * ```
 */
export function Progress({
  className,
  value,
  label,
  showValue = false,
  indeterminateText = "処理中",
  size = "md",
  completeVariant = true,
  ...props
}: ProgressProps) {
  const determinate = value !== undefined;
  const pct = determinate ? Math.min(100, Math.max(0, value)) : undefined;
  const complete = completeVariant && pct === 100;
  return (
    <div
      data-slot="progress"
      data-size={size}
      data-state={complete ? "complete" : determinate ? "loading" : "indeterminate"}
      className={cn("flex items-center gap-3", className)}
      {...props}
    >
      <div
        role="progressbar"
        aria-label={label}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={pct}
        aria-valuetext={pct === undefined ? indeterminateText : `${Math.round(pct)}%`}
        className={cn(
          "relative w-full overflow-hidden rounded-round bg-surface-well",
          size === "sm" ? "h-1.5" : "h-2.5",
        )}
      >
        <div
          data-slot="progress-indicator"
          className={cn(
            "h-full rounded-round transition-[width] duration-300",
            complete ? "bg-success-600" : "bg-surface-primary",
            !determinate && "w-full animate-pulse bg-surface-primary/50",
          )}
          style={determinate ? { width: `${pct}%` } : undefined}
        />
      </div>
      {showValue && determinate ? (
        <span className="w-10 shrink-0 text-right font-mono text-2 text-text-middle tabular-nums">
          {Math.round(pct ?? 0)}%
        </span>
      ) : null}
    </div>
  );
}
