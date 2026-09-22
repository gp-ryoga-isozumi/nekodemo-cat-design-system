import type { ComponentProps, ReactNode } from "react";
import { cn } from "../../../lib/utils";
import { Icon } from "../icon";

export type StepperStep = {
  /** 手順名（「基本情報」「担当者」「確認」） */
  /** 手順名（読み上げ名にも使うので文字列） */
  label: string;
  /** 補足（任意） */
  description?: ReactNode;
};

export type StepperProps = Omit<ComponentProps<"ol">, "children"> & {
  steps: StepperStep[];
  /** 現在の手順（0 始まり）。これより前は完了、後は未着手 */
  current: number;
  orientation?: "horizontal" | "vertical";
  /** 完了した手順を押して戻れるようにする */
  onStepClick?: (index: number) => void;
  /** 読み上げ名。既定「手順」 */
  "aria-label"?: string;
};

/**
 * Stepper
 *
 * 概要: 複数手順の進み具合（v1.2）。作成フォームを 3〜5 手順に分けるときに上（横）か左（縦）に置く。
 * 完了した手順はチェック、現在は primary の枠、未着手は薄い番号。現在の手順には `aria-current="step"` が付く。
 * `onStepClick` を渡すと完了した手順だけがボタンになり、戻れる（先の手順には飛べない）。
 *
 * アンチパターン:
 * - 2 手順以下、または 6 手順以上に使う（2 以下は 1 画面、6 以上は手順をまとめ直す）
 * - 手順名を「Step 1」だけにする（何を入力する手順か名詞で書く）
 * - 進捗バー（数値の割合）の代わりに使う
 *
 * 推奨例:
 * - 作成フォームを 3〜5 手順に分けるときに上（横）か左（縦）に置き、`current` を進める
 * - 手順名は「基本情報」「担当者」「確認」のように何を入力するかの名詞にする
 * - 完了した手順に戻れる場合は `onStepClick` を渡す（先の手順には飛ばない）
 *
 * 使用例:
 * ```tsx
 * <Stepper
 *   aria-label="案件の作成"
 *   current={1}
 *   steps={[{ label: "基本情報" }, { label: "担当者", description: "営業と技術" }, { label: "確認" }]}
 * />
 * ```
 */
export function Stepper({
  className,
  steps,
  current,
  orientation = "horizontal",
  onStepClick,
  "aria-label": ariaLabel = "手順",
  ...props
}: StepperProps) {
  const vertical = orientation === "vertical";
  return (
    <ol
      data-slot="stepper"
      data-orientation={orientation}
      aria-label={ariaLabel}
      className={cn("flex", vertical ? "flex-col gap-0" : "flex-row items-start", className)}
      {...props}
    >
      {steps.map((step, i) => {
        const status = i < current ? "done" : i === current ? "current" : "upcoming";
        const last = i === steps.length - 1;
        const clickable = status === "done" && onStepClick;
        const marker = (
          <span
            data-slot="stepper-marker"
            className={cn(
              "flex size-8 shrink-0 items-center justify-center rounded-round border-2 font-bold font-mono text-2 transition-colors",
              status === "done" && "border-surface-primary bg-surface-primary text-text-on-primary",
              status === "current" && "border-border-primary bg-surface-card text-text-primary",
              status === "upcoming" && "border-border-middle bg-surface-card text-text-low",
            )}
          >
            {status === "done" ? <Icon icon="check" size={3} label="完了" /> : i + 1}
          </span>
        );
        const text = (
          <span className={cn("flex flex-col", vertical ? "pt-1" : "items-center text-center")}>
            <span
              className={cn(
                "text-2",
                status === "current" ? "font-bold text-text-high" : "text-text-middle",
                status === "upcoming" && "text-text-low",
              )}
            >
              {step.label}
            </span>
            {step.description ? (
              <span className="text-1 text-text-low">{step.description}</span>
            ) : null}
          </span>
        );
        const connector = last ? null : (
          <span
            aria-hidden="true"
            data-slot="stepper-connector"
            className={cn(
              status === "done" ? "bg-surface-primary" : "bg-border-middle",
              vertical ? "mx-auto my-1 h-6 w-0.5" : "mt-4 h-0.5 flex-1",
            )}
          />
        );
        const content = clickable ? (
          <button
            type="button"
            aria-label={`${step.label}（完了）に戻る`}
            onClick={() => onStepClick(i)}
            className={cn(
              "flex gap-2 rounded-action outline-none hover:text-text-high focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-border-focus",
              vertical ? "items-start" : "flex-col items-center",
            )}
          >
            {marker}
            {text}
          </button>
        ) : (
          <span className={cn("flex gap-2", vertical ? "items-start" : "flex-col items-center")}>
            {marker}
            {text}
          </span>
        );
        return (
          <li
            // biome-ignore lint/suspicious/noArrayIndexKey: 手順は並び順が意味を持ち、同名の手順もありうるので index を含める
            key={`${step.label}-${i}`}
            data-slot="stepper-step"
            data-status={status}
            aria-current={status === "current" ? "step" : undefined}
            className={cn(
              "flex",
              vertical ? "flex-col" : "min-w-0 flex-1 flex-row items-start last:flex-none",
            )}
          >
            {vertical ? (
              <>
                {content}
                {connector}
              </>
            ) : (
              <>
                <span className="flex flex-col items-center px-1">{content}</span>
                {connector}
              </>
            )}
          </li>
        );
      })}
    </ol>
  );
}
