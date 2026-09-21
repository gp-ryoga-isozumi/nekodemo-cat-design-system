import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Switch } from ".";

const meta = {
  title: "UI/Switch",
  component: Switch,
  tags: ["autodocs"],
  args: { "aria-label": "期限が近い案件を通知する" },
  argTypes: {
    checked: { control: "boolean" },
    disabled: { control: "boolean" },
  },
} satisfies Meta<typeof Switch>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { name: "既定" };

export const WithLabel: Story = {
  name: "ラベル付き",
  render: () => (
    <div className="flex items-center gap-2">
      <Switch id="notify" defaultChecked />
      <label htmlFor="notify" className="text-2 text-text-high">
        期限が近い案件を通知する
      </label>
    </div>
  ),
};

export const States: Story = {
  name: "ON / OFF",
  render: () => (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-2">
        <Switch id="state-on" defaultChecked />
        <label htmlFor="state-on" className="text-2 text-text-high">
          通知する（ON）
        </label>
      </div>
      <div className="flex items-center gap-2">
        <Switch id="state-off" />
        <label htmlFor="state-off" className="text-2 text-text-high">
          通知しない（OFF）
        </label>
      </div>
    </div>
  ),
};

export const Disabled: Story = {
  name: "disabled（無効）",
  render: () => (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-2">
        <Switch id="disabled-off" disabled />
        <label htmlFor="disabled-off" className="text-2 text-text-disabled">
          通知する（管理者が無効にしています）
        </label>
      </div>
      <div className="flex items-center gap-2">
        <Switch id="disabled-on" disabled defaultChecked />
        <label htmlFor="disabled-on" className="text-2 text-text-disabled">
          週次のまとめを送る（変更できません）
        </label>
      </div>
    </div>
  ),
};

export const WithDescription: Story = {
  name: "補足付き（設定の一覧）",
  render: () => (
    <div className="flex w-96 flex-col gap-4 rounded-container border border-border-low bg-surface-card p-4">
      <div className="flex items-start justify-between gap-4">
        <div className="flex flex-col gap-0.5">
          <label htmlFor="setting-deadline" className="text-2 text-text-high">
            期限が近い案件を通知する
          </label>
          <p id="setting-deadline-help" className="text-1 text-text-low">
            期限の 3 日前にメールでお知らせします。
          </p>
        </div>
        <Switch id="setting-deadline" aria-describedby="setting-deadline-help" defaultChecked />
      </div>
      <div className="flex items-start justify-between gap-4">
        <div className="flex flex-col gap-0.5">
          <label htmlFor="setting-weekly" className="text-2 text-text-high">
            週次のまとめを送る
          </label>
          <p id="setting-weekly-help" className="text-1 text-text-low">
            毎週月曜日に五十棲さん宛てに送信します。
          </p>
        </div>
        <Switch id="setting-weekly" aria-describedby="setting-weekly-help" />
      </div>
    </div>
  ),
};
