import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from ".";

const meta = {
  title: "UI/Select",
  component: Select,
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <div className="w-64">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Select>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  name: "既定（担当者を選ぶ）",
  render: () => (
    <div className="flex flex-col gap-1">
      <label htmlFor="owner-default" className="text-2 text-text-high">
        担当者
      </label>
      <Select defaultValue="isozumi">
        <SelectTrigger id="owner-default">
          <SelectValue placeholder="選択してください" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="isozumi">五十棲</SelectItem>
          <SelectItem value="yamada">山田</SelectItem>
          <SelectItem value="sato">佐藤</SelectItem>
        </SelectContent>
      </Select>
    </div>
  ),
};

export const Placeholder: Story = {
  name: "未選択（placeholder）",
  render: () => (
    <div className="flex flex-col gap-1">
      <label htmlFor="owner-placeholder" className="text-2 text-text-high">
        担当者
      </label>
      <Select>
        <SelectTrigger id="owner-placeholder">
          <SelectValue placeholder="選択してください" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="isozumi">五十棲</SelectItem>
          <SelectItem value="yamada">山田</SelectItem>
        </SelectContent>
      </Select>
    </div>
  ),
};

export const Sizes: Story = {
  name: "サイズ（sm / md / lg）",
  render: () => (
    <div className="flex flex-col gap-4">
      {(["sm", "md", "lg"] as const).map((size) => (
        <div key={size} className="flex flex-col gap-1">
          <label htmlFor={`owner-${size}`} className="text-2 text-text-high">
            担当者（{size}）
          </label>
          <Select defaultValue="isozumi">
            <SelectTrigger id={`owner-${size}`} size={size}>
              <SelectValue placeholder="選択してください" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="isozumi">五十棲</SelectItem>
              <SelectItem value="yamada">山田</SelectItem>
            </SelectContent>
          </Select>
        </div>
      ))}
    </div>
  ),
};

export const Grouped: Story = {
  name: "グループと区切り線",
  render: () => (
    <div className="flex flex-col gap-1">
      <label htmlFor="owner-grouped" className="text-2 text-text-high">
        担当者
      </label>
      <Select defaultValue="isozumi">
        <SelectTrigger id="owner-grouped">
          <SelectValue placeholder="選択してください" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>デザイン部</SelectLabel>
            <SelectItem value="isozumi">五十棲</SelectItem>
            <SelectItem value="yamada">山田</SelectItem>
          </SelectGroup>
          <SelectSeparator />
          <SelectGroup>
            <SelectLabel>営業部</SelectLabel>
            <SelectItem value="sato">佐藤</SelectItem>
            <SelectItem value="suzuki">鈴木</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  ),
};

export const WithAriaLabel: Story = {
  name: "ラベルを置けない場所（aria-label）",
  render: () => (
    <Select defaultValue="all">
      <SelectTrigger aria-label="並び替え" size="sm">
        <SelectValue placeholder="選択してください" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">すべての案件</SelectItem>
        <SelectItem value="mine">自分の案件</SelectItem>
        <SelectItem value="archived">完了した案件</SelectItem>
      </SelectContent>
    </Select>
  ),
};

export const DisabledItem: Story = {
  name: "選択肢を無効にする",
  render: () => (
    <div className="flex flex-col gap-1">
      <label htmlFor="owner-disabled-item" className="text-2 text-text-high">
        担当者
      </label>
      <Select defaultValue="isozumi">
        <SelectTrigger id="owner-disabled-item">
          <SelectValue placeholder="選択してください" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="isozumi">五十棲</SelectItem>
          <SelectItem value="yamada">山田</SelectItem>
          <SelectItem value="sato" disabled>
            佐藤（休職中）
          </SelectItem>
        </SelectContent>
      </Select>
    </div>
  ),
};

export const Invalid: Story = {
  name: "invalid（エラー）",
  render: () => (
    <div className="flex flex-col gap-1">
      <label htmlFor="owner-invalid" className="text-2 text-text-high">
        担当者
      </label>
      <Select>
        <SelectTrigger id="owner-invalid" aria-invalid aria-describedby="owner-invalid-error">
          <SelectValue placeholder="選択してください" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="isozumi">五十棲</SelectItem>
          <SelectItem value="yamada">山田</SelectItem>
        </SelectContent>
      </Select>
      <p id="owner-invalid-error" className="text-1 text-text-negative">
        担当者を選択してください。
      </p>
    </div>
  ),
};

export const Disabled: Story = {
  name: "disabled（無効）",
  render: () => (
    <div className="flex flex-col gap-1">
      <label htmlFor="owner-disabled" className="text-2 text-text-high">
        担当者
      </label>
      <Select defaultValue="isozumi" disabled>
        <SelectTrigger id="owner-disabled">
          <SelectValue placeholder="選択してください" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="isozumi">五十棲</SelectItem>
          <SelectItem value="yamada">山田</SelectItem>
        </SelectContent>
      </Select>
    </div>
  ),
};
