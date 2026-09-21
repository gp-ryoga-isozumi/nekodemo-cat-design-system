import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { useState } from "react";
import status from "../../../../icons/status.json";
import { Icon, type IconSize } from ".";
import { iconAliases, iconNames, icons } from "./icons.generated";

const meta = {
  title: "UI/Icon",
  component: Icon,
  tags: ["autodocs"],
  args: { icon: "search", size: 6 },
  argTypes: {
    size: { control: { type: "range", min: 1, max: 12, step: 1 } },
    icon: { control: "select", options: iconNames },
  },
} satisfies Meta<typeof Icon>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Sizes: Story = {
  render: () => (
    <div className="flex items-end gap-3">
      {([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12] as IconSize[]).map((s) => (
        <div key={s} className="flex flex-col items-center gap-1">
          <Icon icon="search" size={s} />
          <span className="font-mono text-1 text-text-low">{s}</span>
        </div>
      ))}
    </div>
  ),
};

export const Colors: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <Icon icon="favorite" size={6} className="text-object-primary" />
      <Icon icon="delete" size={6} className="text-object-negative" />
      <Icon icon="help" size={6} className="text-object-low" />
      <Icon icon="favorite" size={6} fill className="text-object-primary" />
      <span className="text-2 text-text-low">色は text-object-* で指定する</span>
    </div>
  ),
};

export const Fallback: Story = {
  name: "T3 フォールバック（猫版なし）",
  render: () => (
    <div className="flex items-center gap-4">
      <Icon icon="qr_code_2" size={6} />
      <Icon icon="print_disabled" size={6} />
      <span className="text-2 text-text-low">
        猫版が無い名前は Material Symbols Rounded のフォントで表示される（開発時は console.warn）
      </span>
    </div>
  ),
};

const TIER_LABEL: Record<string, string> = {
  bespoke: "T1 専用",
  "auto-ear": "T2 自動耳",
  earless: "耳なし規約",
  "no-ear": "耳を置けず",
};

function Catalog() {
  const [fill, setFill] = useState(false);
  const [query, setQuery] = useState("");
  const names = iconNames.filter((n) => n.includes(query));
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center gap-4 text-2">
        <label className="flex items-center gap-2">
          <input type="checkbox" checked={fill} onChange={(e) => setFill(e.target.checked)} />
          fill
        </label>
        <label className="flex items-center gap-2">
          絞り込み
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="h-8 rounded-action border border-border-high bg-surface-input px-2"
          />
        </label>
        <span className="text-text-low">
          {status.counts.total} 件: T1 {status.counts.bespoke} / 自動耳 {status.counts.autoEar} /
          耳なし規約 {status.counts.earless} / 耳を置けず {status.counts.noEar} / 別名{" "}
          {Object.keys(iconAliases).length}
        </span>
      </div>
      <ul className="grid grid-cols-[repeat(auto-fill,minmax(96px,1fr))] gap-2">
        {names.map((name) => (
          <li
            key={name}
            className="flex flex-col items-center gap-1 rounded-action bg-surface-well p-2 text-center"
            title={`${name}: ${TIER_LABEL[icons[name].tier]}`}
          >
            <Icon icon={name} size={6} fill={fill} className="text-object-high" />
            <span className="break-all font-mono text-1 text-text-low leading-tight">{name}</span>
            <span
              className={
                icons[name].tier === "no-ear" ? "text-1 text-text-warning" : "text-1 text-text-low"
              }
            >
              {TIER_LABEL[icons[name].tier]}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export const IconCatalog: Story = {
  name: "Icon Catalog",
  parameters: { layout: "fullscreen" },
  render: () => (
    <div className="p-6">
      <Catalog />
    </div>
  ),
};
