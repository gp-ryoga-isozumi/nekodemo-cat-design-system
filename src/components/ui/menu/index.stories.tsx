import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { useState } from "react";
import { Button } from "../button";
import { Icon } from "../icon";
import { IconButton } from "../icon-button";
import {
  Menu,
  MenuCheckboxItem,
  MenuContent,
  MenuGroup,
  MenuItem,
  MenuLabel,
  MenuRadioGroup,
  MenuRadioItem,
  MenuSeparator,
  MenuShortcut,
  MenuTrigger,
} from ".";

const meta = {
  title: "UI/Menu",
  component: Menu,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "操作の一覧を出すドロップダウンです。行末の「⋮」や見出し横に置きます。破壊的操作は最後に置き、区切り線で分けて negative にします。",
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
} satisfies Meta<typeof Menu>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  name: "既定（行末の操作メニュー）",
  render: () => (
    <Menu>
      <MenuTrigger asChild>
        <IconButton icon="more_vert" label="案件の操作" />
      </MenuTrigger>
      <MenuContent>
        <MenuItem>
          <Icon icon="edit" size={4} />
          編集する
        </MenuItem>
        <MenuItem>
          <Icon icon="content_copy" size={4} />
          複製する
        </MenuItem>
        <MenuItem>
          <Icon icon="archive" size={4} />
          アーカイブする
        </MenuItem>
        <MenuSeparator />
        <MenuItem variant="negative">
          <Icon icon="delete" size={4} />
          削除する
        </MenuItem>
      </MenuContent>
    </Menu>
  ),
};

export const ButtonTrigger: Story = {
  name: "ボタンをトリガーにする",
  render: () => (
    <Menu>
      <MenuTrigger asChild>
        <Button variant="outline">
          案件を操作する
          <Icon icon="expand_more" size={4} />
        </Button>
      </MenuTrigger>
      <MenuContent align="start">
        <MenuItem>
          <Icon icon="share" size={4} />
          共有リンクを発行する
        </MenuItem>
        <MenuItem>
          <Icon icon="download" size={4} />
          CSV を書き出す
        </MenuItem>
      </MenuContent>
    </Menu>
  ),
};

export const Grouped: Story = {
  name: "見出しとグループで分ける",
  render: () => (
    <Menu>
      <MenuTrigger asChild>
        <IconButton icon="more_vert" label="案件の操作" />
      </MenuTrigger>
      <MenuContent>
        <MenuLabel>社内備品貸出アプリ 改修</MenuLabel>
        <MenuGroup>
          <MenuItem>
            <Icon icon="visibility" size={4} />
            詳細を見る
          </MenuItem>
          <MenuItem>
            <Icon icon="assignment" size={4} />
            タスクを一覧する
          </MenuItem>
        </MenuGroup>
        <MenuSeparator />
        <MenuLabel>操作</MenuLabel>
        <MenuGroup>
          <MenuItem>
            <Icon icon="edit" size={4} />
            編集する
          </MenuItem>
          <MenuItem>
            <Icon icon="content_copy" size={4} />
            複製する
          </MenuItem>
        </MenuGroup>
        <MenuSeparator />
        <MenuItem variant="negative">
          <Icon icon="delete" size={4} />
          削除する
        </MenuItem>
      </MenuContent>
    </Menu>
  ),
};

export const WithShortcut: Story = {
  name: "ショートカットを添える",
  render: () => (
    <Menu>
      <MenuTrigger asChild>
        <IconButton icon="more_vert" label="案件の操作" />
      </MenuTrigger>
      <MenuContent>
        <MenuItem>
          <Icon icon="edit" size={4} />
          編集する
          <MenuShortcut>⌘E</MenuShortcut>
        </MenuItem>
        <MenuItem>
          <Icon icon="content_copy" size={4} />
          複製する
          <MenuShortcut>⌘D</MenuShortcut>
        </MenuItem>
        <MenuSeparator />
        <MenuItem variant="negative">
          <Icon icon="delete" size={4} />
          削除する
          <MenuShortcut>⌫</MenuShortcut>
        </MenuItem>
      </MenuContent>
    </Menu>
  ),
};

function CheckboxExample() {
  const [columns, setColumns] = useState({ status: true, owner: true, due: false });
  return (
    <Menu>
      <MenuTrigger asChild>
        <Button variant="outline" size="sm">
          列の表示
          <Icon icon="expand_more" size={4} />
        </Button>
      </MenuTrigger>
      <MenuContent align="start">
        <MenuLabel>一覧に表示する列</MenuLabel>
        <MenuCheckboxItem
          checked={columns.status}
          onCheckedChange={(checked) => setColumns((c) => ({ ...c, status: checked === true }))}
        >
          ステータス
        </MenuCheckboxItem>
        <MenuCheckboxItem
          checked={columns.owner}
          onCheckedChange={(checked) => setColumns((c) => ({ ...c, owner: checked === true }))}
        >
          担当者
        </MenuCheckboxItem>
        <MenuCheckboxItem
          checked={columns.due}
          onCheckedChange={(checked) => setColumns((c) => ({ ...c, due: checked === true }))}
        >
          納期
        </MenuCheckboxItem>
      </MenuContent>
    </Menu>
  );
}

export const CheckboxItems: Story = {
  name: "複数選択（MenuCheckboxItem）",
  render: () => <CheckboxExample />,
};

function RadioExample() {
  const [order, setOrder] = useState("updated");
  return (
    <Menu>
      <MenuTrigger asChild>
        <Button variant="outline" size="sm">
          並び替え
          <Icon icon="expand_more" size={4} />
        </Button>
      </MenuTrigger>
      <MenuContent align="start">
        <MenuLabel>並び順</MenuLabel>
        <MenuRadioGroup value={order} onValueChange={setOrder}>
          <MenuRadioItem value="updated">更新が新しい順</MenuRadioItem>
          <MenuRadioItem value="due">納期が近い順</MenuRadioItem>
          <MenuRadioItem value="name">案件名の五十音順</MenuRadioItem>
        </MenuRadioGroup>
      </MenuContent>
    </Menu>
  );
}

export const RadioItems: Story = {
  name: "単一選択（MenuRadioItem）",
  render: () => <RadioExample />,
};

export const DisabledItem: Story = {
  name: "disabled（権限が無い項目）",
  render: () => (
    <Menu>
      <MenuTrigger asChild>
        <IconButton icon="more_vert" label="案件の操作" />
      </MenuTrigger>
      <MenuContent>
        <MenuItem>
          <Icon icon="visibility" size={4} />
          詳細を見る
        </MenuItem>
        <MenuItem disabled>
          <Icon icon="edit" size={4} />
          編集する
        </MenuItem>
        <MenuSeparator />
        <MenuItem variant="negative" disabled>
          <Icon icon="delete" size={4} />
          削除する
        </MenuItem>
      </MenuContent>
    </Menu>
  ),
};

export const DisabledTrigger: Story = {
  name: "disabled（トリガーごと無効）",
  render: () => (
    <Menu>
      <MenuTrigger asChild>
        <IconButton icon="more_vert" label="案件の操作" disabled />
      </MenuTrigger>
      <MenuContent>
        <MenuItem>
          <Icon icon="edit" size={4} />
          編集する
        </MenuItem>
      </MenuContent>
    </Menu>
  ),
};

function ControlledExample() {
  const [open, setOpen] = useState(false);
  const [last, setLast] = useState("まだ操作していません");
  return (
    <div className="flex flex-col items-start gap-3">
      <p className="text-2 text-text-middle">{last}</p>
      <Menu open={open} onOpenChange={setOpen}>
        <MenuTrigger asChild>
          <IconButton icon="more_vert" label="案件の操作" />
        </MenuTrigger>
        <MenuContent>
          <MenuItem onSelect={() => setLast("編集を開きました")}>
            <Icon icon="edit" size={4} />
            編集する
          </MenuItem>
          <MenuSeparator />
          <MenuItem variant="negative" onSelect={() => setLast("削除を実行しました")}>
            <Icon icon="delete" size={4} />
            削除する
          </MenuItem>
        </MenuContent>
      </Menu>
    </div>
  );
}

export const Controlled: Story = {
  name: "制御（open / onOpenChange）",
  render: () => <ControlledExample />,
};
