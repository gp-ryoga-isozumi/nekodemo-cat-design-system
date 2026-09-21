import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { useState } from "react";
import { InputSearch } from ".";

const meta = {
  title: "UI/InputSearch",
  component: InputSearch,
  tags: ["autodocs"],
  args: { size: "md", placeholder: "案件名・顧客名で検索" },
  argTypes: {
    size: { control: "radio", options: ["sm", "md", "lg"] },
    disabled: { control: "boolean" },
  },
  render: (args) => (
    <div className="flex w-96 flex-col gap-1.5">
      <label htmlFor="search" className="text-2 font-bold text-text-high">
        案件を検索
      </label>
      <InputSearch id="search" {...args} />
    </div>
  ),
} satisfies Meta<typeof InputSearch>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { name: "基本（非制御）" };

export const Uncontrolled: Story = {
  name: "非制御（初期値あり・クリアで空になります）",
  render: () => (
    <div className="flex w-96 flex-col gap-1.5">
      <label htmlFor="search-uncontrolled" className="text-2 font-bold text-text-high">
        案件を検索
      </label>
      <InputSearch
        id="search-uncontrolled"
        defaultValue="山田商事"
        placeholder="案件名・顧客名で検索"
        aria-describedby="search-uncontrolled-description"
      />
      <p id="search-uncontrolled-description" className="text-1 text-text-low">
        入力があるとクリアボタンが出ます。
      </p>
    </div>
  ),
};

const PROJECTS = [
  "山田商事 サイトリニューアル",
  "山田商事 保守運用",
  "猫田製作所 アプリ開発",
  "三毛フーズ 会員基盤の刷新",
];

function ControlledDemo() {
  const [query, setQuery] = useState("");
  const hits = PROJECTS.filter((name) => name.includes(query));
  return (
    <div className="flex w-96 flex-col gap-1.5">
      <label htmlFor="search-controlled" className="text-2 font-bold text-text-high">
        案件を検索
      </label>
      <InputSearch
        id="search-controlled"
        value={query}
        onValueChange={setQuery}
        placeholder="案件名・顧客名で検索"
      />
      <p className="text-1 text-text-low" role="status">
        {hits.length} 件が見つかりました。
      </p>
      <ul className="flex flex-col gap-1 text-2 text-text-high">
        {hits.map((name) => (
          <li key={name}>{name}</li>
        ))}
      </ul>
    </div>
  );
}

export const Controlled: Story = {
  name: "制御（value / onValueChange で絞り込みます）",
  render: () => <ControlledDemo />,
};

function WithConditionsDemo() {
  const [opened, setOpened] = useState(0);
  return (
    <div className="flex w-96 flex-col gap-1.5">
      <label htmlFor="search-conditions" className="text-2 font-bold text-text-high">
        案件を検索
      </label>
      <InputSearch
        id="search-conditions"
        defaultValue="山田商事"
        placeholder="案件名・顧客名で検索"
        onOpenConditions={() => setOpened((n) => n + 1)}
        aria-describedby="search-conditions-description"
      />
      <p id="search-conditions-description" className="text-1 text-text-low">
        絞り込みボタンから、期間や担当者の条件を指定できます。
      </p>
      <p className="text-1 text-text-middle" role="status">
        検索条件を開いた回数: {opened} 回
      </p>
    </div>
  );
}

export const WithConditions: Story = {
  name: "検索条件ボタン付き（onOpenConditions）",
  render: () => <WithConditionsDemo />,
};

export const Sizes: Story = {
  name: "サイズ（sm / md / lg）",
  render: () => (
    <div className="flex w-96 flex-col gap-4">
      <div className="flex flex-col gap-1.5">
        <label htmlFor="search-sm" className="text-2 font-bold text-text-high">
          案件を検索（sm 32px）
        </label>
        <InputSearch
          id="search-sm"
          size="sm"
          defaultValue="山田商事"
          placeholder="案件名・顧客名で検索"
          onOpenConditions={() => {}}
        />
      </div>
      <div className="flex flex-col gap-1.5">
        <label htmlFor="search-md" className="text-2 font-bold text-text-high">
          案件を検索（md 40px）
        </label>
        <InputSearch
          id="search-md"
          size="md"
          defaultValue="山田商事"
          placeholder="案件名・顧客名で検索"
          onOpenConditions={() => {}}
        />
      </div>
      <div className="flex flex-col gap-1.5">
        <label htmlFor="search-lg" className="text-2 font-bold text-text-high">
          案件を検索（lg 48px）
        </label>
        <InputSearch
          id="search-lg"
          size="lg"
          defaultValue="山田商事"
          placeholder="案件名・顧客名で検索"
          onOpenConditions={() => {}}
        />
      </div>
    </div>
  ),
};

export const Invalid: Story = {
  name: "エラー（aria-invalid）",
  render: () => (
    <div className="flex w-96 flex-col gap-1.5">
      <label htmlFor="search-invalid" className="text-2 font-bold text-text-high">
        案件を検索
      </label>
      <InputSearch
        id="search-invalid"
        defaultValue="!!!"
        placeholder="案件名・顧客名で検索"
        aria-invalid
        aria-describedby="search-invalid-error"
      />
      <p id="search-invalid-error" role="alert" className="text-1 text-text-negative">
        記号だけでは検索できません。案件名か顧客名の一部を入力してください
      </p>
    </div>
  ),
};

export const Disabled: Story = {
  name: "disabled",
  render: () => (
    <div className="flex w-96 flex-col gap-1.5">
      <label htmlFor="search-disabled" className="text-2 font-bold text-text-high">
        案件を検索
      </label>
      <InputSearch
        id="search-disabled"
        disabled
        placeholder="案件名・顧客名で検索"
        aria-describedby="search-disabled-description"
      />
      <p id="search-disabled-description" className="text-1 text-text-low">
        案件の読み込みが終わるまで検索できません。
      </p>
    </div>
  ),
};
