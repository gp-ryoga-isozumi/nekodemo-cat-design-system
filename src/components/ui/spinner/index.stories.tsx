import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Spinner } from ".";

const meta = {
  title: "UI/Spinner",
  component: Spinner,
  tags: ["autodocs"],
  args: { size: "md", label: "読み込み中" },
  argTypes: {
    size: { control: "radio", options: ["sm", "md", "lg"] },
    label: { control: "text" },
  },
} satisfies Meta<typeof Spinner>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Sizes: Story = {
  name: "サイズ",
  render: () => (
    <div className="flex items-end gap-6">
      {(["sm", "md", "lg"] as const).map((size) => (
        <div key={size} className="flex flex-col items-center gap-2">
          <Spinner size={size} label={`案件を読み込み中（${size}）`} />
          <span className="font-mono text-1 text-text-low">{size}</span>
        </div>
      ))}
    </div>
  ),
};

export const WithLabel: Story = {
  name: "ラベル",
  render: () => (
    <div className="flex items-center gap-2 text-2 text-text-low">
      <Spinner size="sm" label="案件を読み込み中" />
      案件を読み込んでいます
    </div>
  ),
};

export const Colors: Story = {
  name: "色",
  render: () => (
    <div className="flex items-center gap-6">
      <Spinner size="lg" label="読み込み中（既定）" />
      <Spinner size="lg" label="読み込み中（primary）" className="text-object-primary" />
      <Spinner size="lg" label="読み込み中（low）" className="text-object-low" />
    </div>
  ),
};

export const InPanel: Story = {
  name: "領域の読み込み中",
  render: () => (
    <div className="flex h-40 w-80 flex-col items-center justify-center gap-3 rounded-container border border-border-low bg-surface-card">
      <Spinner size="lg" label="案件を読み込み中" className="text-object-primary" />
      <p className="text-2 text-text-low">案件を読み込んでいます</p>
    </div>
  ),
};
