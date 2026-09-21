import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { useState } from "react";
import { Checkbox } from ".";

const meta = {
  title: "UI/Checkbox",
  component: Checkbox,
  tags: ["autodocs"],
  args: { "aria-label": "この案件を選択します" },
  argTypes: {
    checked: { control: "radio", options: [false, true, "indeterminate"] },
    disabled: { control: "boolean" },
  },
} satisfies Meta<typeof Checkbox>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithLabel: Story = {
  name: "ラベル付き",
  render: () => (
    <div className="flex items-center gap-2">
      <Checkbox id="notify" defaultChecked />
      <label htmlFor="notify" className="text-2 text-text-high">
        更新があったら通知を受け取ります
      </label>
    </div>
  ),
};

export const Checked: Story = {
  name: "状態（未選択 / 選択済み / 一部選択）",
  render: () => (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-2">
        <Checkbox id="state-unchecked" checked={false} />
        <label htmlFor="state-unchecked" className="text-2 text-text-high">
          未選択です
        </label>
      </div>
      <div className="flex items-center gap-2">
        <Checkbox id="state-checked" checked />
        <label htmlFor="state-checked" className="text-2 text-text-high">
          選択済みです（チェックは猫の顔です）
        </label>
      </div>
      <div className="flex items-center gap-2">
        <Checkbox id="state-indeterminate" checked="indeterminate" />
        <label htmlFor="state-indeterminate" className="text-2 text-text-high">
          一部だけ選択しています
        </label>
      </div>
    </div>
  ),
};

export const Indeterminate: Story = {
  name: "一部選択",
  args: { checked: "indeterminate", "aria-label": "すべての案件を選択します" },
};

export const Disabled: Story = {
  name: "無効",
  render: () => (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-2">
        <Checkbox id="disabled-off" disabled />
        <label htmlFor="disabled-off" className="text-2 text-text-disabled">
          完了した案件は選べません
        </label>
      </div>
      <div className="flex items-center gap-2">
        <Checkbox id="disabled-on" disabled checked />
        <label htmlFor="disabled-on" className="text-2 text-text-disabled">
          必ず含まれるため外せません
        </label>
      </div>
    </div>
  ),
};

export const Invalid: Story = {
  name: "エラー",
  render: () => (
    <div className="flex flex-col gap-1">
      <div className="flex items-center gap-2">
        <Checkbox id="terms" aria-invalid aria-describedby="terms-error" />
        <label htmlFor="terms" className="text-2 text-text-high">
          利用規約に同意します
        </label>
      </div>
      <p id="terms-error" className="text-1 text-text-negative">
        同意が必要です
      </p>
    </div>
  ),
};

const PROJECTS = [
  { id: "p1", name: "山田商事 サイト刷新" },
  { id: "p2", name: "佐藤工業 基幹システム更改" },
  { id: "p3", name: "鈴木物産 アプリ開発" },
];

function SelectableProjectList() {
  const [selected, setSelected] = useState<string[]>([PROJECTS[0].id]);
  const all = selected.length === PROJECTS.length;
  const some = selected.length > 0 && !all;

  return (
    <div className="flex w-80 flex-col gap-3 rounded-container border border-border-low bg-surface-card p-4">
      <div className="flex items-center gap-2">
        <Checkbox
          id="select-all"
          checked={all ? true : some ? "indeterminate" : false}
          onCheckedChange={(next) => setSelected(next === true ? PROJECTS.map((p) => p.id) : [])}
        />
        <label htmlFor="select-all" className="text-2 text-text-high">
          すべての案件を選択します（{selected.length} / {PROJECTS.length} 件）
        </label>
      </div>
      <ul className="flex flex-col gap-2 border-border-low border-t pt-3">
        {PROJECTS.map((project) => (
          <li key={project.id} className="flex items-center gap-2">
            <Checkbox
              id={project.id}
              checked={selected.includes(project.id)}
              onCheckedChange={(next) =>
                setSelected((prev) =>
                  next === true ? [...prev, project.id] : prev.filter((id) => id !== project.id),
                )
              }
            />
            <label htmlFor={project.id} className="text-2 text-text-high">
              {project.name}
            </label>
          </li>
        ))}
      </ul>
    </div>
  );
}

export const SelectAll: Story = {
  name: "一括選択（indeterminate の使い方）",
  render: () => <SelectableProjectList />,
};
