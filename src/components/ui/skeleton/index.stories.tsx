import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Skeleton, SkeletonRows } from ".";

const meta = {
  title: "UI/Skeleton",
  component: Skeleton,
  tags: ["autodocs"],
  argTypes: {
    className: { control: "text" },
  },
} satisfies Meta<typeof Skeleton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <div className="w-80">
      <Skeleton />
    </div>
  ),
};

export const Shapes: Story = {
  name: "形",
  render: () => (
    <div className="flex w-80 flex-col gap-3">
      <Skeleton className="h-4 w-3/5" />
      <Skeleton className="h-8 w-full" />
      <Skeleton className="size-10 rounded-round" />
      <Skeleton className="h-24 w-full rounded-container" />
    </div>
  ),
};

export const ListItem: Story = {
  name: "一覧の 1 行（アバター付き）",
  render: () => (
    <div className="flex w-80 items-center gap-3">
      <Skeleton className="size-10 rounded-round" />
      <div className="flex flex-1 flex-col gap-2">
        <Skeleton className="h-4 w-3/5" />
        <Skeleton className="h-4 w-4/5" />
      </div>
    </div>
  ),
};

export const Rows: Story = {
  name: "SkeletonRows（既定 5 行）",
  render: () => (
    <div className="w-80">
      <SkeletonRows />
    </div>
  ),
};

export const RowsCount: Story = {
  name: "SkeletonRows（行数を変える）",
  render: () => (
    <div className="flex w-80 flex-col gap-6">
      <SkeletonRows rows={3} />
      <SkeletonRows rows={8} />
    </div>
  ),
};

export const Cards: Story = {
  name: "カードの読み込み中（3 枚）",
  render: () => (
    <div className="flex flex-wrap gap-4">
      {["a", "b", "c"].map((key) => (
        <div
          key={key}
          className="flex w-60 flex-col gap-3 rounded-container border border-border-low bg-surface-card p-4"
        >
          <Skeleton className="h-5 w-2/3" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-4/5" />
          <Skeleton className="h-8 w-24 rounded-action" />
        </div>
      ))}
    </div>
  ),
};

export const BeforeAndAfter: Story = {
  name: "読み込み中と読み込み後",
  render: () => (
    <div className="flex flex-wrap gap-4">
      <div className="flex w-60 flex-col gap-3 rounded-container border border-border-low bg-surface-card p-4">
        <p className="text-1 text-text-low">読み込み中です</p>
        <SkeletonRows rows={3} />
      </div>
      <div className="flex w-60 flex-col gap-3 rounded-container border border-border-low bg-surface-card p-4">
        <p className="text-1 text-text-low">読み込み後</p>
        <p className="text-2 text-text-high">山田商事 サイト刷新</p>
        <p className="text-2 text-text-high">佐藤工業 基幹システム更改</p>
        <p className="text-2 text-text-high">鈴木物産 アプリ開発</p>
      </div>
    </div>
  ),
};
