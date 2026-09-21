import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { useState } from "react";
import { Button } from "../button";
import { Checkbox } from "../checkbox";
import { IconButton } from "../icon-button";
import {
  Popover,
  PopoverAnchor,
  PopoverClose,
  PopoverContent,
  PopoverDescription,
  PopoverTitle,
  PopoverTrigger,
} from ".";

const meta = {
  title: "UI/Popover",
  component: Popover,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "トリガーの近くに出る小さなパネルです。列の表示切替や短い補足に使います。Esc と外側クリックで閉じます。読み上げのため PopoverTitle を置き、PopoverContent の aria-labelledby でその id を指します。",
      },
    },
  },
  decorators: [
    (Story) => (
      <div className="flex min-h-40 items-start justify-center p-8">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Popover>;

export default meta;
type Story = StoryObj<typeof meta>;

const COLUMNS = [
  { id: "status", label: "ステータス" },
  { id: "owner", label: "担当者" },
  { id: "due", label: "納期" },
  { id: "amount", label: "見積金額" },
];

export const Default: Story = {
  name: "既定（列の表示を切り替える）",
  render: () => (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm">
          列の表示
        </Button>
      </PopoverTrigger>
      <PopoverContent aria-labelledby="popover-columns-title">
        <PopoverTitle id="popover-columns-title">列の表示</PopoverTitle>
        <div className="flex flex-col gap-2">
          {COLUMNS.map((column) => (
            <div key={column.id} className="flex items-center gap-2">
              <Checkbox id={`popover-column-${column.id}`} defaultChecked />
              <label htmlFor={`popover-column-${column.id}`} className="text-2 text-text-high">
                {column.label}
              </label>
            </div>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  ),
};

export const Opened: Story = {
  name: "開いた状態（defaultOpen）",
  render: () => (
    <Popover defaultOpen>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm">
          案件番号について
        </Button>
      </PopoverTrigger>
      <PopoverContent aria-labelledby="popover-opened-title">
        <PopoverTitle id="popover-opened-title">案件番号について</PopoverTitle>
        <PopoverDescription>
          案件番号は登録時に自動で採番されます。あとから変更できません。
        </PopoverDescription>
      </PopoverContent>
    </Popover>
  ),
};

export const WithDescription: Story = {
  name: "説明文だけを出す",
  render: () => (
    <Popover>
      <PopoverTrigger asChild>
        <IconButton icon="help" label="公開範囲について" variant="outline" size="sm" />
      </PopoverTrigger>
      <PopoverContent aria-labelledby="popover-scope-title">
        <PopoverTitle id="popover-scope-title">公開範囲について</PopoverTitle>
        <PopoverDescription>
          「社内のみ」にすると、五十棲さんや山田さんのような社内のメンバーだけが閲覧できます。
        </PopoverDescription>
      </PopoverContent>
    </Popover>
  ),
};

export const WithClose: Story = {
  name: "パネルの中から閉じる（PopoverClose）",
  render: () => (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm">
          並び替え
        </Button>
      </PopoverTrigger>
      <PopoverContent aria-labelledby="popover-sort-title">
        <PopoverTitle id="popover-sort-title">案件を並び替える</PopoverTitle>
        <PopoverDescription>選んだ順序は次回も引き継がれます。</PopoverDescription>
        <div className="flex justify-end gap-2">
          <PopoverClose asChild>
            <Button variant="ghost" size="sm">
              キャンセル
            </Button>
          </PopoverClose>
          <PopoverClose asChild>
            <Button size="sm">並び替える</Button>
          </PopoverClose>
        </div>
      </PopoverContent>
    </Popover>
  ),
};

export const Placement: Story = {
  name: "表示位置（side / align）",
  render: () => (
    <div className="flex flex-wrap items-center gap-2">
      {(["top", "right", "bottom", "left"] as const).map((side) => (
        <Popover key={side}>
          <PopoverTrigger asChild>
            <Button variant="secondary" size="sm">
              {side}
            </Button>
          </PopoverTrigger>
          <PopoverContent side={side} align="center" aria-labelledby={`popover-side-${side}`}>
            <PopoverTitle id={`popover-side-${side}`}>担当者を変更する</PopoverTitle>
            <PopoverDescription>
              side=&quot;{side}&quot; で出しています。画面の端では自動で反転します。
            </PopoverDescription>
          </PopoverContent>
        </Popover>
      ))}
    </div>
  ),
};

export const WithAnchor: Story = {
  name: "別の要素に寄せて出す（PopoverAnchor）",
  render: () => (
    <Popover>
      <PopoverAnchor asChild>
        <div className="flex w-72 items-center justify-between rounded-container border border-border-low bg-surface-card px-3 py-2">
          <span className="text-2 text-text-high">社内備品貸出アプリ 改修</span>
          <PopoverTrigger asChild>
            <IconButton icon="info" label="案件の補足を見る" size="sm" />
          </PopoverTrigger>
        </div>
      </PopoverAnchor>
      <PopoverContent aria-labelledby="popover-anchor-title">
        <PopoverTitle id="popover-anchor-title">案件の補足</PopoverTitle>
        <PopoverDescription>
          行全体を基準に出しています。担当は五十棲さん、納期は 2026 年 5 月 20 日です。
        </PopoverDescription>
      </PopoverContent>
    </Popover>
  ),
};

export const DisabledTrigger: Story = {
  name: "disabled（権限が無く開けない）",
  render: () => (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" disabled>
          列の表示
        </Button>
      </PopoverTrigger>
      <PopoverContent aria-labelledby="popover-disabled-title">
        <PopoverTitle id="popover-disabled-title">列の表示</PopoverTitle>
        <PopoverDescription>閲覧権限では列を変更できません。</PopoverDescription>
      </PopoverContent>
    </Popover>
  ),
};

function ControlledExample() {
  const [open, setOpen] = useState(false);
  return (
    <div className="flex flex-col items-start gap-3">
      <p className="text-2 text-text-middle">パネルは{open ? "開いています" : "閉じています"}。</p>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button variant="outline" size="sm">
            納期を変更する
          </Button>
        </PopoverTrigger>
        <PopoverContent aria-labelledby="popover-controlled-title">
          <PopoverTitle id="popover-controlled-title">納期を変更する</PopoverTitle>
          <PopoverDescription>現在の納期は 2026 年 5 月 20 日です。</PopoverDescription>
          <div className="flex justify-end">
            <Button size="sm" onClick={() => setOpen(false)}>
              変更する
            </Button>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}

export const Controlled: Story = {
  name: "制御（open / onOpenChange）",
  render: () => <ControlledExample />,
};
