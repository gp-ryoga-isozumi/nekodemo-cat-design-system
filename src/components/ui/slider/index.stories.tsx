import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { useState } from "react";
import { Slider } from ".";

const meta = {
  title: "UI/Slider",
  component: Slider,
  tags: ["autodocs"],
  args: { label: "通知する日数", min: 1, max: 30, defaultValue: [7] },
  argTypes: {
    disabled: { control: "boolean" },
    step: { control: "number" },
  },
  decorators: [
    (Story) => (
      <div className="w-80">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Slider>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { name: "既定" };

function DaysSlider() {
  const [days, setDays] = useState(7);
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-baseline justify-between">
        <span className="text-2 text-text-high">期限の何日前に通知しますか</span>
        <output className="text-2 text-text-low">{days} 日前</output>
      </div>
      <Slider
        label="通知する日数"
        min={1}
        max={30}
        value={[days]}
        onValueChange={([value]) => setDays(value)}
      />
    </div>
  );
}

export const WithValue: Story = {
  name: "値を表示する",
  render: () => <DaysSlider />,
};

function BudgetSlider() {
  const [range, setRange] = useState([200, 800]);
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-baseline justify-between">
        <span className="text-2 text-text-high">予算の範囲</span>
        <output className="text-2 text-text-low">
          {range[0]} 万円 〜 {range[1]} 万円
        </output>
      </div>
      <Slider
        label={["予算の下限", "予算の上限"]}
        min={0}
        max={1000}
        step={50}
        value={range}
        onValueChange={setRange}
      />
    </div>
  );
}

export const Range: Story = {
  name: "つまみが 2 つ（範囲）",
  render: () => <BudgetSlider />,
};

export const Step: Story = {
  name: "刻みを付ける（step=5）",
  render: () => <Slider label="進捗率" min={0} max={100} step={5} defaultValue={[60]} />,
};

export const Vertical: Story = {
  name: "縦向き",
  render: () => (
    <div className="h-48">
      <Slider label="優先度" orientation="vertical" min={1} max={5} defaultValue={[3]} />
    </div>
  ),
};

export const Disabled: Story = {
  name: "disabled（無効）",
  render: () => <Slider label="通知する日数" min={1} max={30} defaultValue={[7]} disabled />,
};
