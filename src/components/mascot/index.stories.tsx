import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { nekoThemes } from "../../themes/registry";
import { Mascot } from ".";

const meta = {
  title: "Theme/Mascot",
  component: Mascot,
  tags: ["autodocs"],
  args: { theme: "calico", size: 96, label: "三毛" },
  argTypes: { theme: { control: "radio", options: nekoThemes.map((t) => t.id) } },
} satisfies Meta<typeof Mascot>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const AllThree: Story = {
  render: () => (
    <div className="flex flex-wrap items-end gap-8">
      {nekoThemes.map((t) => (
        <figure key={t.id} className="flex flex-col items-center gap-2">
          <Mascot theme={t.id} size={96} label={t.label.ja} />
          <figcaption className="text-2 text-text-middle">{t.label.ja}</figcaption>
        </figure>
      ))}
    </div>
  ),
};

export const Sizes: Story = {
  render: () => (
    <div className="flex items-end gap-4">
      {[24, 32, 40, 56, 96].map((s) => (
        <Mascot key={s} theme="russian-blue" size={s} label={`${s}px`} />
      ))}
    </div>
  ),
};
