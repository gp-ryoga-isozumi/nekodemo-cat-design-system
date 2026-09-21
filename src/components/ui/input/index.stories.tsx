import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import type { ReactNode } from "react";
import { Input } from ".";

const meta = {
  title: "UI/Input",
  component: Input,
  tags: ["autodocs"],
  args: {
    "aria-label": "取引先名",
    placeholder: "例: 山田商事",
    size: "md",
  },
  argTypes: {
    size: { control: "radio", options: ["sm", "md", "lg"] },
    disabled: { control: "boolean" },
    "aria-invalid": { control: "boolean" },
  },
} satisfies Meta<typeof Input>;

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

export const Default: Story = {};

export const WithLabel: Story = {
  name: "ラベルと補足",
  render: () => (
    <Field id="company" label="取引先名" description="正式名称を入力してください">
      <Input id="company" placeholder="例: 山田商事" aria-describedby="company-description" />
    </Field>
  ),
};

export const Sizes: Story = {
  name: "サイズ",
  render: () => (
    <div className="flex flex-col gap-4">
      <Field id="size-sm" label="取引先名（sm 32px）">
        <Input id="size-sm" size="sm" placeholder="例: 山田商事" />
      </Field>
      <Field id="size-md" label="取引先名（md 40px）">
        <Input id="size-md" size="md" placeholder="例: 山田商事" />
      </Field>
      <Field id="size-lg" label="取引先名（lg 48px）">
        <Input id="size-lg" size="lg" placeholder="例: 山田商事" />
      </Field>
    </div>
  ),
};

export const Invalid: Story = {
  name: "エラー（aria-invalid）",
  render: () => (
    <div className="flex w-72 flex-col gap-1.5">
      <label htmlFor="invalid-company" className="text-2 text-text-middle">
        取引先名
      </label>
      <Input
        id="invalid-company"
        aria-invalid
        aria-describedby="invalid-company-error"
        defaultValue=""
        placeholder="例: 山田商事"
      />
      <p id="invalid-company-error" className="text-1 text-text-negative">
        取引先名を入力してください
      </p>
    </div>
  ),
};

export const Disabled: Story = {
  name: "disabled / readOnly",
  render: () => (
    <div className="flex flex-col gap-4">
      <Field id="disabled-company" label="取引先名（変更できません）">
        <Input id="disabled-company" disabled defaultValue="山田商事" />
      </Field>
      <Field id="readonly-code" label="案件番号（自動で採番されます）">
        <Input id="readonly-code" readOnly defaultValue="PRJ-2026-0031" />
      </Field>
    </div>
  ),
};

export const Types: Story = {
  name: "入力の種類",
  render: () => (
    <div className="flex flex-col gap-4">
      <Field id="type-email" label="担当者のメールアドレス">
        <Input id="type-email" type="email" placeholder="例: sato@example.co.jp" />
      </Field>
      <Field id="type-tel" label="電話番号">
        <Input id="type-tel" type="tel" placeholder="例: 03-1234-5678" />
      </Field>
      <Field id="type-number" label="受注金額（円）">
        <Input id="type-number" type="number" placeholder="例: 1200000" />
      </Field>
      <Field id="type-date" label="納品予定日">
        <Input id="type-date" type="date" />
      </Field>
      <Field id="type-file" label="見積書のファイル">
        <Input id="type-file" type="file" />
      </Field>
    </div>
  ),
};
