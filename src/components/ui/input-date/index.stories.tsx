import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { type ReactNode, useState } from "react";
import { InputDate } from ".";

const meta = {
  title: "UI/InputDate",
  component: InputDate,
  tags: ["autodocs"],
  args: {
    "aria-label": "納品予定日",
    defaultValue: "2026-10-31",
    size: "md",
  },
  argTypes: {
    size: { control: "radio", options: ["sm", "md", "lg"] },
    disabled: { control: "boolean" },
    readOnly: { control: "boolean" },
  },
  decorators: [
    (Story) => (
      <div className="w-72">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof InputDate>;

export default meta;
type Story = StoryObj<typeof meta>;

/** ラベルと補足をまとめる、ストーリー用の簡易フィールド（実装では Form の Field を使う） */
function Field({
  id,
  label,
  description,
  children,
}: {
  id: string;
  label: string;
  description?: string;
  children: ReactNode;
}) {
  return (
    <div className="flex w-72 flex-col gap-1.5">
      <label htmlFor={id} className="text-2 text-text-middle">
        {label}
      </label>
      {children}
      {description ? (
        <p id={`${id}-description`} className="text-1 text-text-low">
          {description}
        </p>
      ) : null}
    </div>
  );
}

export const Default: Story = { name: "既定（納品予定日）" };

export const WithLabel: Story = {
  name: "ラベルと補足",
  render: () => (
    <Field id="due" label="納品予定日" description="キーボードでも入力できます">
      <InputDate id="due" defaultValue="2026-10-31" aria-describedby="due-description" />
    </Field>
  ),
};

export const Sizes: Story = {
  name: "サイズ",
  render: () => (
    <div className="flex flex-col gap-4">
      <Field id="date-sm" label="納品予定日（sm 32px）">
        <InputDate id="date-sm" size="sm" defaultValue="2026-10-31" />
      </Field>
      <Field id="date-md" label="納品予定日（md 40px）">
        <InputDate id="date-md" size="md" defaultValue="2026-10-31" />
      </Field>
      <Field id="date-lg" label="納品予定日（lg 48px）">
        <InputDate id="date-lg" size="lg" defaultValue="2026-10-31" />
      </Field>
    </div>
  ),
};

export const MinMax: Story = {
  name: "選べる範囲を限る（min / max）",
  render: () => (
    <Field
      id="fiscal"
      label="計上日"
      description="2026 年度（2026-04-01 〜 2027-03-31）の日付だけを選べます"
    >
      <InputDate
        id="fiscal"
        defaultValue="2026-09-22"
        min="2026-04-01"
        max="2027-03-31"
        aria-describedby="fiscal-description"
      />
    </Field>
  ),
};

function DeliveryPeriod() {
  const [from, setFrom] = useState("2026-10-01");
  const [to, setTo] = useState("2026-10-31");
  return (
    <div className="flex flex-col gap-4">
      <Field id="period-from" label="納品日（開始）">
        <InputDate id="period-from" value={from} max={to} onValueChange={setFrom} />
      </Field>
      <Field id="period-to" label="納品日（終了）">
        <InputDate id="period-to" value={to} min={from} onValueChange={setTo} />
      </Field>
      <p className="text-2 text-text-high">
        {from} 〜 {to} に納品する案件を表示しています。
      </p>
    </div>
  );
}

export const Period: Story = {
  name: "期間で絞り込む（2 つ並べる）",
  render: () => <DeliveryPeriod />,
};

export const Empty: Story = {
  name: "未入力",
  render: () => (
    <Field id="empty-date" label="検収日" description="検収が終わってから入力します">
      <InputDate id="empty-date" defaultValue="" aria-describedby="empty-date-description" />
    </Field>
  ),
};

export const Invalid: Story = {
  name: "エラー（aria-invalid）",
  render: () => (
    <div className="flex w-72 flex-col gap-1.5">
      <label htmlFor="invalid-due" className="text-2 text-text-middle">
        納品予定日
      </label>
      <InputDate id="invalid-due" aria-invalid aria-describedby="invalid-due-error" />
      <p id="invalid-due-error" className="text-1 text-text-negative">
        納品予定日を入力してください
      </p>
    </div>
  ),
};

export const Disabled: Story = {
  name: "disabled / readOnly",
  render: () => (
    <div className="flex flex-col gap-4">
      <Field id="disabled-date" label="納品予定日（変更できません）">
        <InputDate id="disabled-date" disabled defaultValue="2026-10-31" />
      </Field>
      <Field id="readonly-date" label="受注日（受注時に確定します）">
        <InputDate id="readonly-date" readOnly defaultValue="2026-09-22" />
      </Field>
    </div>
  ),
};
