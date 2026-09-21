import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Textarea } from ".";

const meta = {
  title: "UI/Textarea",
  component: Textarea,
  tags: ["autodocs"],
  args: {
    "aria-label": "案件メモ",
    placeholder: "案件の状況を記入してください",
  },
  argTypes: {
    maxLength: { control: "number" },
    showCount: { control: "boolean" },
    rows: { control: "number" },
    disabled: { control: "boolean" },
  },
} satisfies Meta<typeof Textarea>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { name: "既定" };

export const WithLabel: Story = {
  name: "ラベル付き",
  render: () => (
    <div className="flex w-80 flex-col gap-1">
      <label htmlFor="memo-basic" className="text-2 text-text-high">
        案件メモ
      </label>
      <Textarea id="memo-basic" placeholder="案件の状況を記入してください" />
    </div>
  ),
};

export const WithCount: Story = {
  name: "文字数カウンタ（maxLength）",
  render: () => (
    <div className="flex w-80 flex-col gap-1">
      <label htmlFor="memo-count" className="text-2 text-text-high">
        共有メモ
      </label>
      <Textarea
        id="memo-count"
        maxLength={200}
        defaultValue="五十棲さんが先方と日程を調整中です。"
        placeholder="案件の状況を記入してください"
      />
    </div>
  ),
};

export const CountReachedLimit: Story = {
  name: "上限に達した状態",
  render: () => (
    <div className="flex w-80 flex-col gap-1">
      <label htmlFor="memo-limit" className="text-2 text-text-high">
        共有メモ
      </label>
      <Textarea id="memo-limit" maxLength={20} defaultValue="山田さんへ引き継ぎ済みです。" />
    </div>
  ),
};

export const CountHidden: Story = {
  name: "カウンタを隠す（showCount=false）",
  render: () => (
    <div className="flex w-80 flex-col gap-1">
      <label htmlFor="memo-hidden" className="text-2 text-text-high">
        共有メモ
      </label>
      <Textarea
        id="memo-hidden"
        maxLength={200}
        showCount={false}
        placeholder="案件の状況を記入してください"
      />
    </div>
  ),
};

export const Rows: Story = {
  name: "行数を増やす",
  render: () => (
    <div className="flex w-80 flex-col gap-1">
      <label htmlFor="memo-rows" className="text-2 text-text-high">
        議事メモ
      </label>
      <Textarea id="memo-rows" rows={8} placeholder="打ち合わせの内容を記入してください" />
    </div>
  ),
};

export const Invalid: Story = {
  name: "invalid（エラー）",
  render: () => (
    <div className="flex w-80 flex-col gap-1">
      <label htmlFor="memo-invalid" className="text-2 text-text-high">
        却下の理由
      </label>
      <Textarea
        id="memo-invalid"
        aria-invalid
        aria-describedby="memo-invalid-error"
        defaultValue=""
        placeholder="理由を記入してください"
      />
      <p id="memo-invalid-error" className="text-1 text-text-negative">
        却下の理由を入力してください。
      </p>
    </div>
  ),
};

export const Disabled: Story = {
  name: "disabled（無効）",
  render: () => (
    <div className="flex w-80 flex-col gap-1">
      <label htmlFor="memo-disabled" className="text-2 text-text-high">
        共有メモ
      </label>
      <Textarea
        id="memo-disabled"
        disabled
        maxLength={200}
        defaultValue="案件が完了したため編集できません。"
      />
    </div>
  ),
};

export const ReadOnly: Story = {
  name: "readOnly（読み取り専用）",
  render: () => (
    <div className="flex w-80 flex-col gap-1">
      <label htmlFor="memo-readonly" className="text-2 text-text-high">
        共有メモ
      </label>
      <Textarea id="memo-readonly" readOnly defaultValue="五十棲さんが 3 月 2 日に確認しました。" />
    </div>
  ),
};
