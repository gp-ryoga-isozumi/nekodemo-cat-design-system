import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { useState } from "react";
import { Icon } from "../icon";
import { SegmentedControl, SegmentedControlItem } from ".";

const meta = {
  title: "UI/SegmentedControl",
  component: SegmentedControl,
  tags: ["autodocs"],
  args: { "aria-label": "表示", defaultValue: "list", size: "md" },
  argTypes: {
    size: { control: "radio", options: ["sm", "md", "lg"] },
    disabled: { control: "boolean" },
  },
  parameters: { layout: "padded" },
} satisfies Meta<typeof SegmentedControl>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  name: "既定（表示の切替）",
  render: (args) => (
    <SegmentedControl {...args}>
      <SegmentedControlItem value="list">一覧</SegmentedControlItem>
      <SegmentedControlItem value="grid">カード</SegmentedControlItem>
    </SegmentedControl>
  ),
};

export const WithIcon: Story = {
  name: "アイコンと文言",
  render: () => (
    <SegmentedControl aria-label="案件の表示" defaultValue="list">
      <SegmentedControlItem value="list">
        <Icon icon="view_list" size={4} />
        一覧
      </SegmentedControlItem>
      <SegmentedControlItem value="grid">
        <Icon icon="grid_view" size={4} />
        カード
      </SegmentedControlItem>
      <SegmentedControlItem value="calendar">
        <Icon icon="calendar_today" size={4} />
        カレンダー
      </SegmentedControlItem>
    </SegmentedControl>
  ),
};

export const Sizes: Story = {
  name: "サイズ",
  render: () => (
    <div className="flex flex-col items-start gap-4">
      <SegmentedControl aria-label="表示（sm 32px）" size="sm" defaultValue="list">
        <SegmentedControlItem value="list">一覧</SegmentedControlItem>
        <SegmentedControlItem value="grid">カード</SegmentedControlItem>
      </SegmentedControl>
      <SegmentedControl aria-label="表示（md 40px）" size="md" defaultValue="list">
        <SegmentedControlItem value="list">一覧</SegmentedControlItem>
        <SegmentedControlItem value="grid">カード</SegmentedControlItem>
      </SegmentedControl>
      <SegmentedControl aria-label="表示（lg 48px）" size="lg" defaultValue="list">
        <SegmentedControlItem value="list">一覧</SegmentedControlItem>
        <SegmentedControlItem value="grid">カード</SegmentedControlItem>
      </SegmentedControl>
    </div>
  ),
};

export const Period: Story = {
  name: "期間の切替（3 択）",
  render: () => (
    <SegmentedControl aria-label="集計する期間" defaultValue="month">
      <SegmentedControlItem value="day">日</SegmentedControlItem>
      <SegmentedControlItem value="week">週</SegmentedControlItem>
      <SegmentedControlItem value="month">月</SegmentedControlItem>
    </SegmentedControl>
  ),
};

const summaries: Record<string, string> = {
  all: "山田商事の案件は 24 件です。",
  active: "進行中の案件は 8 件、合計 9,600,000 円です。",
  done: "完了した案件は 16 件、合計 21,200,000 円です。",
};

function ProjectFilter() {
  const [status, setStatus] = useState("active");
  return (
    <div className="flex flex-col items-start gap-3">
      <SegmentedControl aria-label="案件の状態" value={status} onValueChange={setStatus}>
        <SegmentedControlItem value="all">すべて</SegmentedControlItem>
        <SegmentedControlItem value="active">進行中</SegmentedControlItem>
        <SegmentedControlItem value="done">完了</SegmentedControlItem>
      </SegmentedControl>
      <p className="text-2 text-text-high">{summaries[status]}</p>
    </div>
  );
}

export const Controlled: Story = {
  name: "値を持って内容を切り替える",
  render: () => <ProjectFilter />,
};

export const DisabledItem: Story = {
  name: "選択肢を 1 つ無効にする",
  render: () => (
    <SegmentedControl aria-label="案件の表示（一部無効）" defaultValue="list">
      <SegmentedControlItem value="list">一覧</SegmentedControlItem>
      <SegmentedControlItem value="grid">カード</SegmentedControlItem>
      <SegmentedControlItem value="calendar" disabled>
        カレンダー
      </SegmentedControlItem>
    </SegmentedControl>
  ),
};

export const Disabled: Story = {
  name: "disabled（グループ全体）",
  render: () => (
    <SegmentedControl aria-label="案件の表示（無効）" defaultValue="list" disabled>
      <SegmentedControlItem value="list">一覧</SegmentedControlItem>
      <SegmentedControlItem value="grid">カード</SegmentedControlItem>
    </SegmentedControl>
  ),
};
