import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Icon } from "../icon";
import { Button } from ".";

const meta = {
  title: "UI/Button",
  component: Button,
  tags: ["autodocs"],
  args: { children: "保存する", variant: "primary", size: "md" },
  argTypes: {
    variant: {
      control: "radio",
      options: ["primary", "secondary", "outline", "ghost", "negative"],
    },
    size: { control: "radio", options: ["sm", "md", "lg"] },
    loading: { control: "boolean" },
    disabled: { control: "boolean" },
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {};

export const Variants: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-2">
      <Button>保存する</Button>
      <Button variant="secondary">下書き保存</Button>
      <Button variant="outline">キャンセル</Button>
      <Button variant="ghost">詳細</Button>
      <Button variant="negative">削除する</Button>
    </div>
  ),
};

export const Sizes: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-2">
      <Button size="sm">sm 32</Button>
      <Button size="md">md 40</Button>
      <Button size="lg">lg 48</Button>
    </div>
  ),
};

export const WithIcon: Story = {
  name: "アイコン付き",
  render: () => (
    <div className="flex flex-wrap items-center gap-2">
      <Button>
        <Icon icon="add" size={4} />
        案件を追加する
      </Button>
      <Button variant="outline">
        <Icon icon="download" size={4} />
        CSV を書き出す
      </Button>
    </div>
  ),
};

export const States: Story = {
  name: "loading / disabled",
  render: () => (
    <div className="flex flex-wrap items-center gap-2">
      <Button loading>保存中</Button>
      <Button variant="outline" loading size="lg">
        読み込み中
      </Button>
      <Button disabled>無効</Button>
      <Button variant="outline" disabled>
        無効
      </Button>
    </div>
  ),
};

export const AsChild: Story = {
  name: "asChild（リンクをボタンに）",
  render: () => (
    <Button asChild variant="secondary">
      <a href="#top">案件一覧へ</a>
    </Button>
  ),
};
