"use client";

// サンプル画面の 4 状態（設計書 §10.2）を切り替える開発用の小さな UI
import { RadioGroup, RadioItem } from "@/components/ui/radio";

export type ViewState = "loading" | "empty" | "error" | "success";

const STATES: { value: ViewState; label: string }[] = [
  { value: "success", label: "成功" },
  { value: "loading", label: "読み込み中" },
  { value: "empty", label: "0 件" },
  { value: "error", label: "エラー" },
];

export function StateSwitcher({
  value,
  onChange,
}: {
  value: ViewState;
  onChange: (v: ViewState) => void;
}) {
  return (
    <div className="flex flex-wrap items-center gap-3 rounded-action border border-border-low border-dashed bg-surface-well px-3 py-2 text-2 text-text-middle">
      <span className="font-bold">サンプルの状態</span>
      <RadioGroup
        aria-label="サンプルの状態"
        value={value}
        onValueChange={(v) => onChange(v as ViewState)}
        className="flex flex-wrap gap-4"
      >
        {STATES.map((s) => (
          <div key={s.value} className="flex items-center gap-1.5">
            <RadioItem value={s.value} id={`state-${s.value}`} />
            <label htmlFor={`state-${s.value}`}>{s.label}</label>
          </div>
        ))}
      </RadioGroup>
    </div>
  );
}
