import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Avatar } from ".";

/** 外部 URL に頼らないためのダミー写真（データ URI の SVG） */
const PHOTO = `data:image/svg+xml;utf8,${encodeURIComponent(
  [
    "<svg xmlns='http://www.w3.org/2000/svg' width='112' height='112'>",
    "<rect width='112' height='112' fill='lightslategray'/>",
    "<circle cx='56' cy='42' r='20' fill='gainsboro'/>",
    "<circle cx='56' cy='102' r='34' fill='gainsboro'/>",
    "</svg>",
  ].join(""),
)}`;

const meta = {
  title: "UI/Avatar",
  component: Avatar,
  tags: ["autodocs"],
  args: { name: "山田 太郎", size: "md" },
  argTypes: {
    size: { control: "radio", options: ["sm", "md", "lg"] },
    src: { control: "text" },
    fallback: { control: "text" },
  },
} satisfies Meta<typeof Avatar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithImage: Story = {
  name: "画像あり",
  args: { src: PHOTO, name: "山田 太郎" },
};

export const WithFallbackText: Story = {
  name: "画像なし（イニシャル）",
  render: () => (
    <div className="flex items-center gap-3">
      <Avatar name="山田 太郎" fallback="山田" />
      <Avatar name="佐藤 花子" fallback="佐藤" />
      <Avatar name="鈴木 一郎" fallback="鈴木" />
    </div>
  ),
};

export const WithCatFace: Story = {
  name: "画像なし（猫の顔）",
  render: () => (
    <div className="flex items-center gap-3">
      <Avatar name="ゲスト" size="sm" />
      <Avatar name="未割り当て" size="md" />
      <Avatar name="担当者未定" size="lg" />
    </div>
  ),
};

export const Sizes: Story = {
  name: "サイズ",
  render: () => (
    <div className="flex items-end gap-3">
      <Avatar name="山田 太郎" fallback="山田" size="sm" />
      <Avatar name="山田 太郎" fallback="山田" size="md" />
      <Avatar name="山田 太郎" fallback="山田" size="lg" />
    </div>
  ),
};

export const InList: Story = {
  name: "一覧での使い方",
  render: () => (
    <ul className="flex w-96 flex-col gap-2">
      {[
        { project: "山田商事 サイト刷新", owner: "山田 太郎", src: PHOTO, initial: "山田" },
        {
          project: "佐藤工業 基幹システム更改",
          owner: "佐藤 花子",
          src: undefined,
          initial: "佐藤",
        },
        { project: "鈴木物産 アプリ開発", owner: "担当者未定", src: undefined, initial: undefined },
      ].map((row) => (
        <li
          key={row.project}
          className="flex items-center gap-3 rounded-container border border-border-low bg-surface-card px-4 py-3"
        >
          <Avatar name={row.owner} src={row.src} fallback={row.initial} size="sm" />
          <div className="flex min-w-0 flex-col">
            <span className="truncate text-2 text-text-high">{row.project}</span>
            <span className="text-1 text-text-low">担当: {row.owner}</span>
          </div>
        </li>
      ))}
    </ul>
  ),
};
