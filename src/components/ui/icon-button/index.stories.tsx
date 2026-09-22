import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { IconButton } from ".";

const meta = {
  title: "UI/IconButton",
  component: IconButton,
  tags: ["autodocs"],
  args: { icon: "edit", label: "編集する", variant: "ghost", size: "md" },
  argTypes: {
    variant: { control: "radio", options: ["ghost", "outline", "primary", "negative"] },
    size: { control: "radio", options: ["sm", "md", "lg"] },
    icon: { control: "text" },
    label: { control: "text" },
    fill: { control: "boolean" },
    disabled: { control: "boolean" },
  },
} satisfies Meta<typeof IconButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Variants: Story = {
  name: "バリアント",
  render: () => (
    <div className="flex flex-wrap items-center gap-4">
      {(
        [
          { variant: "ghost", icon: "edit", label: "編集する" },
          { variant: "outline", icon: "content_copy", label: "複製する" },
          { variant: "primary", icon: "add", label: "案件を追加する" },
          { variant: "negative", icon: "delete", label: "削除する" },
        ] as const
      ).map((item) => (
        <div key={item.variant} className="flex flex-col items-center gap-1">
          <IconButton variant={item.variant} icon={item.icon} label={item.label} />
          <span className="font-mono text-1 text-text-low">{item.variant}</span>
        </div>
      ))}
    </div>
  ),
};

export const Sizes: Story = {
  name: "サイズ",
  render: () => (
    <div className="flex items-center gap-4">
      {(
        [
          { size: "sm", note: "sm 32" },
          { size: "md", note: "md 40" },
          { size: "lg", note: "lg 48" },
        ] as const
      ).map((item) => (
        <div key={item.size} className="flex flex-col items-center gap-1">
          <IconButton
            size={item.size}
            variant="outline"
            icon="edit"
            label={`編集する（${item.size}）`}
          />
          <span className="font-mono text-1 text-text-low">{item.note}</span>
        </div>
      ))}
    </div>
  ),
};

export const AsChild: Story = {
  name: "asChild（リンクをアイコンボタンに）",
  render: () => (
    <IconButton icon="open_in_new" label="案件を新しいタブで開く" variant="outline" asChild>
      <a href="#top" />
    </IconButton>
  ),
};

export const Disabled: Story = {
  name: "disabled",
  render: () => (
    <div className="flex items-center gap-4">
      <IconButton icon="edit" label="編集する" disabled />
      <IconButton icon="content_copy" label="複製する" variant="outline" disabled />
      <IconButton icon="add" label="案件を追加する" variant="primary" disabled />
      <IconButton icon="delete" label="削除する" variant="negative" disabled />
    </div>
  ),
};

export const Fill: Story = {
  name: "塗りつぶし（fill）",
  render: () => (
    <div className="flex items-center gap-4">
      <IconButton icon="favorite" label="お気に入りに追加する" />
      <IconButton icon="favorite" label="お気に入りから外す" fill />
      <span className="text-2 text-text-low">選択中は fill で塗りつぶします</span>
    </div>
  ),
};

export const InListRow: Story = {
  name: "一覧の行末に置く",
  parameters: { layout: "padded" },
  render: () => (
    <ul className="w-96 divide-y divide-border-low rounded-container border border-border-low bg-surface-card">
      {["山田商事", "鈴木工業", "田中システム"].map((name) => (
        <li key={name} className="flex items-center justify-between gap-2 px-4 py-2">
          <span className="text-3 text-text-high">{name}</span>
          <span className="flex items-center gap-1">
            <IconButton size="sm" icon="edit" label={`${name}を編集する`} />
            <IconButton size="sm" icon="delete" label={`${name}を削除する`} variant="negative" />
            <IconButton size="sm" icon="more_vert" label={`${name}の操作を開く`} />
          </span>
        </li>
      ))}
    </ul>
  ),
};
