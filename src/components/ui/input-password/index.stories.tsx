import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { InputPassword } from ".";

const meta = {
  title: "UI/InputPassword",
  component: InputPassword,
  tags: ["autodocs"],
  args: { size: "md", autoComplete: "current-password" },
  argTypes: {
    size: { control: "radio", options: ["sm", "md", "lg"] },
    disabled: { control: "boolean" },
  },
  render: (args) => (
    <div className="flex w-80 flex-col gap-1.5">
      <label htmlFor="password" className="text-2 font-bold text-text-high">
        パスワード
      </label>
      <InputPassword id="password" {...args} />
    </div>
  ),
} satisfies Meta<typeof InputPassword>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { name: "基本" };

export const Sizes: Story = {
  name: "サイズ（sm / md / lg）",
  render: () => (
    <div className="flex w-80 flex-col gap-4">
      <div className="flex flex-col gap-1.5">
        <label htmlFor="password-sm" className="text-2 font-bold text-text-high">
          パスワード（sm 32px）
        </label>
        <InputPassword id="password-sm" size="sm" autoComplete="current-password" />
      </div>
      <div className="flex flex-col gap-1.5">
        <label htmlFor="password-md" className="text-2 font-bold text-text-high">
          パスワード（md 40px）
        </label>
        <InputPassword id="password-md" size="md" autoComplete="current-password" />
      </div>
      <div className="flex flex-col gap-1.5">
        <label htmlFor="password-lg" className="text-2 font-bold text-text-high">
          パスワード（lg 48px）
        </label>
        <InputPassword id="password-lg" size="lg" autoComplete="current-password" />
      </div>
    </div>
  ),
};

export const WithValue: Story = {
  name: "入力済み（目のアイコンで表示を切り替えます）",
  render: () => (
    <div className="flex w-80 flex-col gap-1.5">
      <label htmlFor="password-filled" className="text-2 font-bold text-text-high">
        パスワード
      </label>
      <InputPassword
        id="password-filled"
        defaultValue="nekodemo2025"
        autoComplete="current-password"
        aria-describedby="password-filled-description"
      />
      <p id="password-filled-description" className="text-1 text-text-low">
        目のアイコンを押すと入力した文字を確認できます。
      </p>
    </div>
  ),
};

export const NewPassword: Story = {
  name: "新しいパスワード（autoComplete=new-password）",
  render: () => (
    <div className="flex w-80 flex-col gap-1.5">
      <label htmlFor="password-new" className="text-2 font-bold text-text-high">
        新しいパスワード
      </label>
      <InputPassword
        id="password-new"
        autoComplete="new-password"
        aria-describedby="password-new-description"
      />
      <p id="password-new-description" className="text-1 text-text-low">
        英字と数字を混ぜた 8 文字以上を設定してください。
      </p>
    </div>
  ),
};

export const Invalid: Story = {
  name: "エラー（aria-invalid）",
  render: () => (
    <div className="flex w-80 flex-col gap-1.5">
      <label htmlFor="password-invalid" className="text-2 font-bold text-text-high">
        パスワード
      </label>
      <InputPassword
        id="password-invalid"
        defaultValue="neko"
        autoComplete="current-password"
        aria-invalid
        aria-describedby="password-invalid-error"
      />
      <p id="password-invalid-error" role="alert" className="text-1 text-text-negative">
        パスワードが短すぎます。8 文字以上で入力してください
      </p>
    </div>
  ),
};

export const Disabled: Story = {
  name: "disabled",
  render: () => (
    <div className="flex w-80 flex-col gap-1.5">
      <label htmlFor="password-disabled" className="text-2 font-bold text-text-high">
        パスワード
      </label>
      <InputPassword
        id="password-disabled"
        disabled
        defaultValue="nekodemo2025"
        autoComplete="current-password"
        aria-describedby="password-disabled-description"
      />
      <p id="password-disabled-description" className="text-1 text-text-low">
        管理者が設定したため、この画面では変更できません。
      </p>
    </div>
  ),
};
