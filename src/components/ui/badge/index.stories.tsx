import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Button } from "../button";
import { IconButton } from "../icon-button";
import { Badge } from ".";

const meta = {
  title: "UI/Badge",
  component: Badge,
  tags: ["autodocs"],
  args: { count: 3, variant: "primary" },
  argTypes: {
    variant: { control: "radio", options: ["primary", "negative", "neutral"] },
    count: { control: "number" },
    max: { control: "number" },
  },
} satisfies Meta<typeof Badge>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Variants: Story = {
  name: "バリアント",
  render: () => (
    <div className="flex items-center gap-4">
      <div className="flex flex-col items-center gap-1">
        <Badge count={3} />
        <span className="font-mono text-1 text-text-low">primary</span>
      </div>
      <div className="flex flex-col items-center gap-1">
        <Badge count={3} variant="negative" />
        <span className="font-mono text-1 text-text-low">negative</span>
      </div>
      <div className="flex flex-col items-center gap-1">
        <Badge count={3} variant="neutral" />
        <span className="font-mono text-1 text-text-low">neutral</span>
      </div>
    </div>
  ),
};

export const Counts: Story = {
  name: "件数と上限（max）",
  render: () => (
    <div className="flex items-center gap-4">
      <Badge count={0} variant="neutral" />
      <Badge count={9} />
      <Badge count={99} />
      <Badge count={120} />
      <Badge count={120} max={9} />
      <span className="text-2 text-text-low">max（既定 99）を超えると「99+」になります</span>
    </div>
  ),
};

export const WithChildren: Story = {
  name: "件数を文字で書く",
  render: () => (
    <div className="flex items-center gap-4">
      <Badge variant="neutral" className="px-2">
        120件
      </Badge>
      <span className="text-2 text-text-low">
        「進行中」のような状態のラベルは Tag を使ってください
      </span>
    </div>
  ),
};

export const OnIconButton: Story = {
  name: "通知アイコンに重ねる",
  render: () => (
    <div className="flex items-center gap-6">
      <div className="relative inline-flex">
        <IconButton icon="notifications" label="通知を見る（未読 3 件）" variant="ghost" />
        <Badge
          count={3}
          variant="negative"
          aria-hidden="true"
          className="-top-0.5 -right-0.5 absolute"
        />
      </div>
      <p className="text-2 text-text-low">
        数字だけでは意味が伝わらないため、ボタンの label に「未読 3 件」と書き、Badge は aria-hidden
        にします
      </p>
    </div>
  ),
};

export const InButton: Story = {
  name: "ボタンの中に置く",
  render: () => (
    <div className="flex items-center gap-2">
      <Button variant="ghost">
        未対応の案件
        <Badge count={12} variant="negative" />
      </Button>
      <Button variant="ghost">
        対応済みの案件
        <Badge count={120} variant="neutral" />
      </Button>
    </div>
  ),
};
