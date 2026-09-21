import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Button } from "../button";
import { IconButton } from "../icon-button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from ".";

const meta = {
  title: "UI/Tooltip",
  component: Tooltip,
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <TooltipProvider>
        <div className="flex min-h-24 items-center justify-center p-8">
          <Story />
        </div>
      </TooltipProvider>
    ),
  ],
} satisfies Meta<typeof Tooltip>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  name: "アイコンボタンの補足",
  render: () => (
    <Tooltip>
      <TooltipTrigger asChild>
        <IconButton icon="delete" label="削除" variant="negative" />
      </TooltipTrigger>
      <TooltipContent>この案件を削除します</TooltipContent>
    </Tooltip>
  ),
};

export const OnButton: Story = {
  name: "ボタンに付ける",
  render: () => (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button variant="outline">CSV を書き出す</Button>
      </TooltipTrigger>
      <TooltipContent>表示中の案件 24 件を書き出します</TooltipContent>
    </Tooltip>
  ),
};

export const Sides: Story = {
  name: "表示位置（open のまま）",
  render: () => (
    <div className="grid grid-cols-2 gap-16 py-12">
      {(["top", "right", "bottom", "left"] as const).map((side) => (
        <Tooltip key={side} open>
          <TooltipTrigger asChild>
            <Button variant="secondary">{side}</Button>
          </TooltipTrigger>
          <TooltipContent side={side}>担当者を変更します</TooltipContent>
        </Tooltip>
      ))}
    </div>
  ),
};

export const NoDelay: Story = {
  name: "すぐ出す（delayDuration=0）",
  render: () => (
    <Tooltip delayDuration={0}>
      <TooltipTrigger asChild>
        <IconButton icon="info" label="案件番号について" variant="outline" />
      </TooltipTrigger>
      <TooltipContent>案件番号は登録時に自動で採番されます</TooltipContent>
    </Tooltip>
  ),
};

export const LongText: Story = {
  name: "長い説明文",
  render: () => (
    <Tooltip open>
      <TooltipTrigger asChild>
        <IconButton icon="help" label="公開範囲について" variant="outline" />
      </TooltipTrigger>
      <TooltipContent>
        公開範囲を「社内のみ」にすると、五十棲さんと山田さんのように社内のメンバーだけが閲覧できます。
      </TooltipContent>
    </Tooltip>
  ),
};
