import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { NekoThemePicker } from "./NekoThemePicker";
import { useNekoTheme } from "./NekoThemeProvider";

// .storybook/preview.tsx のデコレータが NekoThemeProvider で包む
const meta = {
  title: "Theme/NekoThemePicker",
  component: NekoThemePicker,
  tags: ["autodocs"],
  argTypes: { variant: { control: "radio", options: ["faces", "menu"] } },
} satisfies Meta<typeof NekoThemePicker>;

export default meta;
type Story = StoryObj<typeof meta>;

function CurrentTheme() {
  const { theme, themes } = useNekoTheme();
  const t = themes.find((x) => x.id === theme);
  return (
    <p className="text-2 text-text-middle">
      現在: <span className="font-bold text-text-high">{t?.label.ja}</span>（{theme} / {t?.scheme}）
    </p>
  );
}

export const Faces: Story = {
  args: { variant: "faces" },
  render: (args) => (
    <div className="flex flex-col gap-3">
      <NekoThemePicker {...args} />
      <CurrentTheme />
    </div>
  ),
};

export const Menu: Story = {
  args: { variant: "menu" },
  render: (args) => (
    <div className="flex flex-col gap-3">
      <NekoThemePicker {...args} />
      <CurrentTheme />
    </div>
  ),
};
