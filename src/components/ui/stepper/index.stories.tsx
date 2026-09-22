import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { useState } from "react";
import { Stepper } from ".";

const steps = [
  { label: "基本情報" },
  { label: "担当者" },
  { label: "金額と納期" },
  { label: "確認" },
];

const meta = {
  title: "UI/Stepper",
  component: Stepper,
  tags: ["autodocs"],
  args: { "aria-label": "案件の作成", steps, current: 1 },
  argTypes: {
    orientation: { control: "radio", options: ["horizontal", "vertical"] },
    current: { control: { type: "number", min: 0, max: 4 } },
  },
  parameters: { layout: "padded" },
} satisfies Meta<typeof Stepper>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Horizontal: Story = {
  name: "横（既定）",
  render: (args) => <Stepper {...args} className="max-w-2xl" />,
};

export const Vertical: Story = {
  name: "縦",
  render: (args) => <Stepper {...args} orientation="vertical" className="w-56" />,
};

export const WithDescription: Story = {
  name: "補足付き",
  render: () => (
    <Stepper
      aria-label="案件の作成"
      current={1}
      className="max-w-2xl"
      steps={[
        { label: "基本情報", description: "案件名と取引先" },
        { label: "担当者", description: "営業と技術" },
        { label: "金額と納期", description: "1,200,000 円 / 2026-10-31" },
        { label: "確認", description: "内容を見直します" },
      ]}
    />
  ),
};

export const First: Story = {
  name: "最初の手順",
  render: () => <Stepper aria-label="案件の作成" current={0} steps={steps} className="max-w-2xl" />,
};

export const Completed: Story = {
  name: "すべて完了",
  render: () => (
    <Stepper aria-label="案件の作成" current={steps.length} steps={steps} className="max-w-2xl" />
  ),
};

function ProjectWizard() {
  const [current, setCurrent] = useState(2);
  return (
    <div className="flex flex-col gap-4">
      <Stepper
        aria-label="案件の作成"
        current={current}
        steps={steps}
        onStepClick={setCurrent}
        className="max-w-2xl"
      />
      <p className="text-2 text-text-high">
        「{steps[current]?.label ?? "完了"}」を入力しています。完了した手順は押すと戻れます。
      </p>
    </div>
  );
}

export const Clickable: Story = {
  name: "完了した手順に戻る",
  render: () => <ProjectWizard />,
};

export const VerticalWithDescription: Story = {
  name: "縦・補足付き",
  render: () => (
    <Stepper
      aria-label="請求の手続き"
      orientation="vertical"
      current={2}
      className="w-64"
      steps={[
        { label: "検収", description: "2026-10-31 に完了" },
        { label: "請求書の作成", description: "1,320,000 円（税込）" },
        { label: "送付", description: "山田商事の経理へ" },
        { label: "入金の確認" },
      ]}
    />
  ),
};
