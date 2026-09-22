import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Card, CardContent, CardHeader, CardTitle } from "../card";
import { Progress } from ".";

const meta = {
  title: "UI/Progress",
  component: Progress,
  tags: ["autodocs"],
  args: {
    label: "アップロード",
    value: 42,
    showValue: true,
    size: "md",
  },
  argTypes: {
    value: { control: { type: "range", min: 0, max: 100, step: 1 } },
    size: { control: "radio", options: ["sm", "md"] },
    showValue: { control: "boolean" },
    completeVariant: { control: "boolean" },
  },
  parameters: { layout: "padded" },
  decorators: [
    (Story) => (
      <div className="max-w-md">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Progress>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { name: "既定（42%）" };

export const Steps: Story = {
  name: "進み具合",
  render: () => (
    <div className="flex flex-col gap-4">
      <Progress label="取り込み（開始前）" value={0} showValue />
      <Progress label="取り込み（途中）" value={35} showValue />
      <Progress label="取り込み（もうすぐ）" value={88} showValue />
      <Progress label="取り込み（完了）" value={100} showValue />
    </div>
  ),
};

export const Indeterminate: Story = {
  name: "不確定（終わりが分からない）",
  render: () => (
    <div className="flex flex-col gap-2">
      <Progress label="取り込み" />
      <p className="text-2 text-text-low">取り込み中です。しばらくお待ちください。</p>
    </div>
  ),
};

export const Sizes: Story = {
  name: "サイズ",
  render: () => (
    <div className="flex flex-col gap-4">
      <Progress label="アップロード（sm）" value={42} size="sm" showValue />
      <Progress label="アップロード（md）" value={42} size="md" showValue />
    </div>
  ),
};

export const WithoutValue: Story = {
  name: "割合を出さない",
  render: () => (
    <div className="flex flex-col gap-4">
      <Progress label="アップロード（割合あり）" value={64} showValue />
      <Progress label="アップロード（割合なし）" value={64} />
    </div>
  ),
};

export const NoCompleteVariant: Story = {
  name: "完了しても色を変えない（completeVariant={false}）",
  render: () => (
    <div className="flex flex-col gap-4">
      <Progress label="取り込み（完了色あり）" value={100} showValue />
      <Progress label="取り込み（完了色なし）" value={100} showValue completeVariant={false} />
    </div>
  ),
};

export const InCard: Story = {
  name: "一括取り込みでの使い方",
  render: () => (
    <Card>
      <CardHeader>
        <CardTitle>案件の一括取り込み</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <p className="text-2 text-text-middle">案件データ（1,200 件中 504 件）</p>
            <Progress label="案件データの取り込み" value={42} showValue />
          </div>
          <div className="flex flex-col gap-2">
            <p className="text-2 text-text-middle">添付ファイル（完了）</p>
            <Progress label="添付ファイルの取り込み" value={100} showValue />
          </div>
          <div className="flex flex-col gap-2">
            <p className="text-2 text-text-middle">取引先の突き合わせ（件数は未定）</p>
            <Progress label="取引先の突き合わせ" size="sm" />
          </div>
        </div>
      </CardContent>
    </Card>
  ),
};
