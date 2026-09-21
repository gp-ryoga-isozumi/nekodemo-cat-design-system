import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Divider } from ".";

const meta = {
  title: "UI/Divider",
  component: Divider,
  tags: ["autodocs"],
  argTypes: {
    orientation: { control: "radio", options: ["horizontal", "vertical"] },
    decorative: { control: "boolean" },
  },
} satisfies Meta<typeof Divider>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <div className="w-80">
      <Divider />
    </div>
  ),
};

export const Horizontal: Story = {
  name: "横（セクションの区切り）",
  render: () => (
    <div className="flex w-80 flex-col gap-4 rounded-container border border-border-low bg-surface-card p-4">
      <div className="flex flex-col gap-1">
        <h3 className="text-3 text-text-high">案件の概要</h3>
        <p className="text-2 text-text-low">山田商事 サイト刷新</p>
      </div>
      <Divider />
      <div className="flex flex-col gap-1">
        <h3 className="text-3 text-text-high">担当者</h3>
        <p className="text-2 text-text-low">山田 太郎</p>
      </div>
    </div>
  ),
};

export const Vertical: Story = {
  name: "縦（項目の区切り）",
  render: () => (
    <div className="flex h-6 items-center gap-3 text-2 text-text-low">
      <span>更新日: 2026/09/21</span>
      <Divider orientation="vertical" />
      <span>担当: 山田 太郎</span>
      <Divider orientation="vertical" />
      <span>進行中</span>
    </div>
  ),
};

export const Semantic: Story = {
  name: "意味のある区切り（decorative を外す）",
  render: () => (
    <div className="flex w-80 flex-col gap-4">
      <ul className="flex flex-col gap-2 text-2 text-text-high">
        <li>山田商事 サイト刷新</li>
        <li>佐藤工業 基幹システム更改</li>
      </ul>
      {/* 読み上げにも区切りを伝えたいときは decorative={false} にします */}
      <Divider decorative={false} />
      <ul className="flex flex-col gap-2 text-2 text-text-low">
        <li>鈴木物産 アプリ開発（完了）</li>
      </ul>
    </div>
  ),
};
