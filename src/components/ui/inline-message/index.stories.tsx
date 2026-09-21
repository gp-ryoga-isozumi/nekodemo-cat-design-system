import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Button } from "../button";
import { Icon } from "../icon";
import { Input } from "../input";
import { InlineMessage } from ".";

const meta = {
  title: "UI/InlineMessage",
  component: InlineMessage,
  tags: ["autodocs"],
  args: {
    variant: "info",
    children: "この案件は 2026/09/30 に自動で完了になります。",
  },
  argTypes: {
    variant: { control: "radio", options: ["info", "success", "warning", "negative"] },
  },
  parameters: { layout: "padded" },
} satisfies Meta<typeof InlineMessage>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Info: Story = { name: "info（既定）" };

export const Success: Story = {
  name: "success",
  args: { variant: "success", children: "案件「社内備品貸出アプリ 改修」を保存しました。" },
};

export const Warning: Story = {
  name: "warning",
  args: {
    variant: "warning",
    children: "この案件は編集中の担当者がいます。保存すると相手の変更が失われる場合があります。",
  },
};

export const Negative: Story = {
  name: "negative",
  args: {
    variant: "negative",
    children: "一覧を読み込めませんでした。通信状態を確認して再試行してください。",
  },
};

export const Variants: Story = {
  name: "4 種類を並べる",
  render: () => (
    <div className="flex max-w-2xl flex-col gap-3">
      <InlineMessage variant="info">この案件は 2026/09/30 に自動で完了になります。</InlineMessage>
      <InlineMessage variant="success">
        案件「社内備品貸出アプリ 改修」を保存しました。
      </InlineMessage>
      <InlineMessage variant="warning">
        見積金額が 1,200,000 円を超えています。承認が必要です。
      </InlineMessage>
      <InlineMessage variant="negative">
        一覧を読み込めませんでした。通信状態を確認して再試行してください。
      </InlineMessage>
    </div>
  ),
};

export const WithTitle: Story = {
  name: "見出し付き（title）",
  render: () => (
    <div className="flex max-w-2xl flex-col gap-3">
      <InlineMessage variant="info" title="自動完了">
        この案件は 2026/09/30 に自動で完了になります。完了後も履歴から参照できます。
      </InlineMessage>
      <InlineMessage variant="negative" title="保存できませんでした">
        山田商事の与信情報が取得できませんでした。時間をおいて再試行してください。
      </InlineMessage>
    </div>
  ),
};

export const WithAction: Story = {
  name: "操作付き（action）",
  render: () => (
    <div className="flex max-w-2xl flex-col gap-3">
      <InlineMessage
        variant="negative"
        title="一覧を読み込めませんでした"
        action={
          <Button variant="outline" size="sm">
            <Icon icon="refresh" size={4} />
            再試行する
          </Button>
        }
      >
        通信状態を確認してから、もう一度お試しください。
      </InlineMessage>
      <InlineMessage
        variant="warning"
        action={
          <Button variant="outline" size="sm">
            承認を依頼する
          </Button>
        }
      >
        見積金額 1,200,000 円は承認が必要な金額です。
      </InlineMessage>
    </div>
  ),
};

export const InForm: Story = {
  name: "フォームの中で使う",
  render: () => (
    <form className="flex max-w-lg flex-col gap-3">
      <InlineMessage variant="negative" title="入力に誤りがあります">
        金額は半角数字で入力してください。
      </InlineMessage>
      <div className="flex flex-col gap-1.5">
        <label htmlFor="inline-message-amount" className="text-2 font-bold text-text-high">
          金額
        </label>
        <Input id="inline-message-amount" defaultValue="1,200,000" aria-invalid />
      </div>
    </form>
  ),
};
