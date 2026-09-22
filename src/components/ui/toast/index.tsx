"use client";

import { Toaster as Sonner, type ToasterProps as SonnerProps } from "sonner";
import { Icon } from "../icon";

/**
 * Toast
 *
 * 概要: 操作結果の一時的な通知（設計書 §9.1 #8、§10.2）。成功は 3 秒で消える。
 * `<Toaster />` をアプリのルート（NekoThemeProvider の内側）に 1 つ置き、`toast.success("案件を保存しました")` で出す。
 * 画面遷移を伴う保存は遷移先で出す（§10.3）。種別アイコンは猫耳版。
 *
 * アンチパターン:
 * - エラーの詳細や再試行を Toast にだけ出す（InlineMessage を該当箇所に）
 * - 同時に何個も出す
 * - 確認が必要な操作の結果に使う（Dialog）
 *
 * 推奨例:
 * - 保存・削除の成功を `toast.success("案件を保存しました")` で 3 秒だけ伝える
 * - 画面遷移を伴う操作は遷移先で出す（保存して詳細に戻るなら、詳細の表示時に出す）
 * - 取り消せる操作は `action` に「取り消す」を付け、消えるまでの間に戻せるようにする
 * - `<Toaster />` はアプリのルート（NekoThemeProvider の内側）に 1 つだけ置く
 *
 * 使用例:
 * ```tsx
 * <Toaster />
 * toast.success("案件を保存しました");
 * toast.error("保存できませんでした", { description: "通信が切れています。再試行してください。" });
 * ```
 */
const DEFAULT_CLASS_NAMES = {
  toast:
    "group flex w-full max-w-[360px] items-start gap-3 rounded-container border border-border-low bg-surface-card p-4 text-text-high shadow-popout",
  title: "text-2 font-bold leading-5",
  description: "text-2 text-text-middle leading-5",
  content: "flex min-w-0 flex-1 flex-col gap-0.5",
  icon: "mt-px flex size-5 shrink-0 items-center justify-center",
  success: "[&_[data-icon]]:text-text-success",
  error: "[&_[data-icon]]:text-text-negative",
  warning: "[&_[data-icon]]:text-text-warning",
  info: "[&_[data-icon]]:text-text-info",
  closeButton:
    "absolute top-2 right-2 flex size-6 items-center justify-center rounded-notice text-object-low hover:bg-surface-well hover:text-object-high",
  actionButton:
    "ml-auto h-8 shrink-0 rounded-action bg-surface-primary px-3 text-1 font-bold text-text-on-primary hover:bg-surface-primary-hover",
  cancelButton:
    "ml-auto h-8 shrink-0 rounded-action border border-border-high bg-surface-card px-3 text-1 font-bold text-text-high hover:bg-surface-well",
};

export function Toaster({ toastOptions, ...props }: SonnerProps) {
  return (
    <Sonner
      position="top-right"
      duration={3000}
      closeButton
      containerAriaLabel="通知"
      toastOptions={{
        unstyled: true,
        closeButtonAriaLabel: "閉じる",
        ...toastOptions,
        classNames: { ...DEFAULT_CLASS_NAMES, ...toastOptions?.classNames },
      }}
      icons={{
        success: <Icon icon="check_circle" size={5} />,
        error: <Icon icon="error" size={5} />,
        warning: <Icon icon="warning" size={5} />,
        info: <Icon icon="info" size={5} />,
        loading: <Icon icon="hourglass_empty" size={5} />,
        close: <Icon icon="close" size={4} />,
      }}
      {...props}
    />
  );
}

export { toast } from "sonner";
