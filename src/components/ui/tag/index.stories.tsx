import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { useState } from "react";
import { StatusTag, Tag } from ".";

const meta = {
  title: "UI/Tag",
  component: Tag,
  tags: ["autodocs"],
  args: { children: "読み取り専用", variant: "default" },
  argTypes: {
    variant: { control: "radio", options: ["default", "selected"] },
    removeLabel: { control: "text" },
  },
} satisfies Meta<typeof Tag>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Variants: Story = {
  name: "種類",
  render: () => (
    <div className="flex flex-wrap items-center gap-2">
      <Tag>読み取り専用</Tag>
      <Tag variant="selected">状態: 進行中</Tag>
    </div>
  ),
};

function RemovableFilters() {
  const [filters, setFilters] = useState([
    { id: "status", label: "状態: 進行中" },
    { id: "owner", label: "担当: 山田" },
    { id: "client", label: "取引先: 山田商事" },
  ]);

  return (
    <div className="flex min-h-7 flex-wrap items-center gap-2">
      {filters.length === 0 ? (
        <p className="text-2 text-text-low">絞り込み条件はありません</p>
      ) : (
        filters.map((filter) => (
          <Tag
            key={filter.id}
            variant="selected"
            removeLabel={`${filter.label} を外す`}
            onRemove={() => setFilters((prev) => prev.filter((f) => f.id !== filter.id))}
          >
            {filter.label}
          </Tag>
        ))
      )}
    </div>
  );
}

export const Removable: Story = {
  name: "外せるタグ（絞り込み条件）",
  render: () => <RemovableFilters />,
};

export const Truncate: Story = {
  name: "長い文字列",
  render: () => (
    <div className="w-48">
      <Tag>取引先: 山田商事株式会社 東日本統括本部</Tag>
    </div>
  ),
};

export const Status: Story = {
  name: "StatusTag（状態）",
  render: () => (
    <div className="flex flex-wrap items-center gap-2">
      <StatusTag status="info">進行中</StatusTag>
      <StatusTag status="success">完了</StatusTag>
      <StatusTag status="warning">確認待ち</StatusTag>
      <StatusTag status="negative">差し戻し</StatusTag>
      <StatusTag status="neutral">下書き</StatusTag>
    </div>
  ),
};

export const InList: Story = {
  name: "一覧での使い方",
  render: () => (
    <ul className="flex w-96 flex-col gap-2">
      {[
        { name: "山田商事 サイト刷新", status: "info" as const, label: "進行中" },
        { name: "佐藤工業 基幹システム更改", status: "success" as const, label: "完了" },
        { name: "鈴木物産 アプリ開発", status: "warning" as const, label: "確認待ち" },
      ].map((project) => (
        <li
          key={project.name}
          className="flex items-center justify-between gap-3 rounded-container border border-border-low bg-surface-card px-4 py-3"
        >
          <span className="truncate text-2 text-text-high">{project.name}</span>
          <StatusTag status={project.status}>{project.label}</StatusTag>
        </li>
      ))}
    </ul>
  ),
};
