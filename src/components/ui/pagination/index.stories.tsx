import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { useState } from "react";
import { Pagination } from ".";

const meta = {
  title: "UI/Pagination",
  component: Pagination,
  tags: ["autodocs"],
  args: { page: 1, total: 120, pageSize: 20, onPageChange: () => {} },
  argTypes: {
    showSummary: { control: "boolean" },
    total: { control: "number" },
    pageSize: { control: "number" },
  },
  parameters: { layout: "padded" },
} satisfies Meta<typeof Pagination>;

export default meta;
type Story = StoryObj<typeof meta>;

function PagedProjects({
  total = 120,
  pageSize = 20,
  initialPage = 1,
  showSummary = true,
  unit,
}: {
  total?: number;
  pageSize?: number;
  initialPage?: number;
  showSummary?: boolean;
  unit?: string;
}) {
  const [page, setPage] = useState(initialPage);
  return (
    <div className="flex max-w-3xl flex-col gap-3">
      <p className="text-2 text-text-low">
        山田商事の案件一覧（{page} ページ目）を表示しています。
      </p>
      <Pagination
        page={page}
        total={total}
        pageSize={pageSize}
        showSummary={showSummary}
        unit={unit}
        onPageChange={setPage}
      />
    </div>
  );
}

export const Default: Story = {
  name: "基本（120 件 / 20 件ずつ）",
  render: () => <PagedProjects />,
};

export const WithEllipsis: Story = {
  name: "ページ数が多い（省略記号あり）",
  render: () => <PagedProjects total={2000} initialPage={50} />,
};

export const FirstPage: Story = {
  name: "先頭ページ（前へが無効）",
  render: (args) => <Pagination {...args} page={1} total={2000} />,
};

export const LastPage: Story = {
  name: "最終ページ（次へが無効）",
  render: (args) => <Pagination {...args} page={100} total={2000} />,
};

export const SinglePage: Story = {
  name: "1 ページに収まる（要約だけ）",
  render: (args) => <Pagination {...args} page={1} total={12} />,
};

export const Empty: Story = {
  name: "0 件",
  render: (args) => <Pagination {...args} page={1} total={0} />,
};

export const WithoutSummary: Story = {
  name: "要約を出さない",
  render: () => <PagedProjects showSummary={false} />,
};

export const CustomUnit: Story = {
  name: "件数の単位を変える",
  render: () => <PagedProjects total={48} pageSize={10} unit="名" />,
};
