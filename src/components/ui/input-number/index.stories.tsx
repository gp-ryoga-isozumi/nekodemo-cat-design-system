import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { type ReactNode, useState } from "react";
import { InputNumber } from ".";

const meta = {
  title: "UI/InputNumber",
  component: InputNumber,
  tags: ["autodocs"],
  args: {
    "aria-label": "受注金額",
    unit: "円",
    min: 0,
    step: 1000,
    defaultValue: 1200000,
    size: "md",
  },
  argTypes: {
    size: { control: "radio", options: ["sm", "md", "lg"] },
    disabled: { control: "boolean" },
    readOnly: { control: "boolean" },
    format: { control: "boolean" },
    hideSteppers: { control: "boolean" },
  },
  decorators: [
    (Story) => (
      <div className="w-72">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof InputNumber>;

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

export const Default: Story = { name: "既定（受注金額）" };

export const WithLabel: Story = {
  name: "ラベルと補足",
  render: () => (
    <Field id="amount" label="受注金額" description="税抜の金額を入力してください">
      <InputNumber
        id="amount"
        unit="円"
        min={0}
        step={1000}
        defaultValue={1200000}
        aria-describedby="amount-description"
      />
    </Field>
  ),
};

export const Sizes: Story = {
  name: "サイズ",
  render: () => (
    <div className="flex flex-col gap-4">
      <Field id="size-sm" label="受注金額（sm 32px）">
        <InputNumber id="size-sm" size="sm" unit="円" min={0} step={1000} defaultValue={1200000} />
      </Field>
      <Field id="size-md" label="受注金額（md 40px）">
        <InputNumber id="size-md" size="md" unit="円" min={0} step={1000} defaultValue={1200000} />
      </Field>
      <Field id="size-lg" label="受注金額（lg 48px）">
        <InputNumber id="size-lg" size="lg" unit="円" min={0} step={1000} defaultValue={1200000} />
      </Field>
    </div>
  ),
};

export const Units: Story = {
  name: "単位と刻み",
  render: () => (
    <div className="flex flex-col gap-4">
      <Field id="unit-amount" label="受注金額">
        <InputNumber id="unit-amount" unit="円" min={0} step={1000} defaultValue={1200000} />
      </Field>
      <Field id="unit-count" label="納品数">
        <InputNumber id="unit-count" unit="件" min={0} max={999} defaultValue={8} />
      </Field>
      <Field id="unit-rate" label="進捗">
        <InputNumber id="unit-rate" unit="%" min={0} max={100} step={5} defaultValue={40} />
      </Field>
    </div>
  ),
};

export const MinMax: Story = {
  name: "範囲を決める（min / max）",
  render: () => (
    <div className="flex flex-col gap-4">
      <Field
        id="range-min"
        label="納品数（下限に達しています）"
        description="1 〜 99 件で入力します"
      >
        <InputNumber id="range-min" unit="件" min={1} max={99} defaultValue={1} />
      </Field>
      <Field
        id="range-max"
        label="納品数（上限に達しています）"
        description="1 〜 99 件で入力します"
      >
        <InputNumber id="range-max" unit="件" min={1} max={99} defaultValue={99} />
      </Field>
    </div>
  ),
};

function OrderSubtotal() {
  const [unitPrice, setUnitPrice] = useState<number | null>(1200);
  const [quantity, setQuantity] = useState<number | null>(8);
  const subtotal = (unitPrice ?? 0) * (quantity ?? 0);
  return (
    <div className="flex flex-col gap-4">
      <Field id="calc-price" label="単価">
        <InputNumber
          id="calc-price"
          unit="円"
          min={0}
          step={100}
          value={unitPrice}
          onValueChange={setUnitPrice}
        />
      </Field>
      <Field id="calc-quantity" label="数量">
        <InputNumber
          id="calc-quantity"
          unit="件"
          min={0}
          max={999}
          value={quantity}
          onValueChange={setQuantity}
        />
      </Field>
      <p className="text-2 text-text-high">
        小計: <output className="font-bold">{subtotal.toLocaleString("ja-JP")}</output> 円
      </p>
    </div>
  );
}

export const Controlled: Story = {
  name: "値を持って小計を出す",
  render: () => <OrderSubtotal />,
};

export const HideSteppers: Story = {
  name: "増減ボタンを出さない",
  render: () => (
    <Field id="no-stepper" label="受注金額" description="金額のように刻みが大きい値に向きます">
      <InputNumber
        id="no-stepper"
        hideSteppers
        unit="円"
        min={0}
        defaultValue={1200000}
        aria-describedby="no-stepper-description"
      />
    </Field>
  ),
};

export const NoFormat: Story = {
  name: "3 桁区切りを止める（format=false）",
  render: () => (
    <Field id="no-format" label="案件の年度">
      <InputNumber id="no-format" format={false} min={2020} max={2030} defaultValue={2026} />
    </Field>
  ),
};

export const Invalid: Story = {
  name: "エラー（aria-invalid）",
  render: () => (
    <div className="flex w-72 flex-col gap-1.5">
      <label htmlFor="invalid-amount" className="text-2 text-text-middle">
        受注金額
      </label>
      <InputNumber
        id="invalid-amount"
        aria-invalid
        aria-describedby="invalid-amount-error"
        unit="円"
        min={0}
        step={1000}
      />
      <p id="invalid-amount-error" className="text-1 text-text-negative">
        受注金額を入力してください
      </p>
    </div>
  ),
};

export const Disabled: Story = {
  name: "disabled / readOnly",
  render: () => (
    <div className="flex flex-col gap-4">
      <Field id="disabled-amount" label="受注金額（変更できません）">
        <InputNumber id="disabled-amount" disabled unit="円" defaultValue={1200000} />
      </Field>
      <Field id="readonly-amount" label="請求金額（見積から自動で計算されます）">
        <InputNumber id="readonly-amount" readOnly unit="円" defaultValue={1320000} />
      </Field>
    </div>
  ),
};
