import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { useState } from "react";
import { SearchCombobox } from ".";

type Customer = { id: string; name: string; area: string; owner: string };

const CUSTOMERS: Customer[] = [
  { id: "c1", name: "山田商事", area: "関東", owner: "山田 太郎" },
  { id: "c2", name: "佐藤工業", area: "関西", owner: "佐藤 花子" },
  { id: "c3", name: "鈴木物産", area: "関東", owner: "鈴木 次郎" },
  { id: "c4", name: "高橋建設", area: "中部", owner: "高橋 美咲" },
  { id: "c5", name: "田中電機", area: "九州", owner: "田中 健" },
  { id: "c6", name: "伊藤商店", area: "関西", owner: "伊藤 涼" },
];

const KEYWORDS = ["見積書", "請求書", "契約書", "議事録", "要件定義"];

const describeCustomer = (customer: Customer) => `${customer.area}・担当 ${customer.owner}`;

const meta = {
  title: "UI/SearchCombobox",
  component: SearchCombobox<Customer>,
  tags: ["autodocs"],
  args: {
    label: "顧客",
    options: CUSTOMERS,
    getOptionLabel: (customer: Customer) => customer.name,
    getOptionDescription: describeCustomer,
    placeholder: "顧客名を入力",
    size: "md",
  },
  argTypes: {
    size: { control: "radio", options: ["sm", "md", "lg"] },
    disabled: { control: "boolean" },
    loading: { control: "boolean" },
    hideLabel: { control: "boolean" },
  },
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "サジェスト付きの検索入力です。入力欄を選ぶと候補が開き、↑↓ で移動、Enter で確定、Esc で閉じます。`label` は必須で、見た目だけ隠すときは `hideLabel` を使います。",
      },
    },
  },
  decorators: [
    (Story) => (
      // 候補パネルは入力欄の直下に絶対配置されるので、下に余白を取って重なりを見えるようにする
      <div className="w-96 pb-72">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof SearchCombobox<Customer>>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  name: "単一選択（候補に補足を添える）",
};

function MultipleCustomers() {
  const [customers, setCustomers] = useState<Customer[]>([CUSTOMERS[0]]);
  return (
    <div className="flex flex-col gap-2">
      <SearchCombobox
        label="取引先"
        multiple
        options={CUSTOMERS}
        getOptionLabel={(customer) => customer.name}
        getOptionDescription={describeCustomer}
        value={customers}
        onValueChange={(value) => setCustomers([...value])}
        placeholder="取引先を追加"
      />
      <p className="text-1 text-text-low" role="status">
        {customers.length} 社を選択しています。選択済みは Tag で表示され、Backspace
        で末尾を外せます。
      </p>
    </div>
  );
}

export const Multiple: Story = {
  name: "複数選択（multiple・選択済みは Tag）",
  render: () => <MultipleCustomers />,
};

function FreeSoloKeyword() {
  const [keyword, setKeyword] = useState<string | null>("見積書");
  return (
    <div className="flex flex-col gap-2">
      <SearchCombobox
        label="検索キーワード"
        freeSolo
        options={KEYWORDS}
        value={keyword}
        onValueChange={(value) => setKeyword(value)}
        placeholder="キーワードを入力"
      />
      <p className="text-1 text-text-low" role="status">
        {keyword ? `「${keyword}」で検索します。` : "キーワードが未指定です。"}
      </p>
    </div>
  );
}

export const FreeSolo: Story = {
  name: "自由入力（freeSolo・候補に無い語も確定できる）",
  render: () => <FreeSoloKeyword />,
};

export const Grouped: Story = {
  name: "グループ見出し（groupBy）",
  args: {
    label: "顧客（エリア別）",
    groupBy: (customer: Customer) => customer.area,
    placeholder: "顧客名を入力",
  },
};

export const Loading: Story = {
  name: "読み込み中（loading）",
  args: { options: [], loading: true, placeholder: "顧客名を入力" },
  parameters: {
    docs: {
      description: {
        story: "入力欄を選ぶと、候補パネルに Spinner と「候補を読み込み中…」が出ます。",
      },
    },
  },
};

export const Sizes: Story = {
  name: "サイズ（sm / md / lg）",
  render: () => (
    <div className="flex flex-col gap-4">
      <SearchCombobox
        label="顧客（sm 32px）"
        size="sm"
        options={CUSTOMERS}
        getOptionLabel={(customer) => customer.name}
        placeholder="顧客名を入力"
      />
      <SearchCombobox
        label="顧客（md 40px）"
        size="md"
        options={CUSTOMERS}
        getOptionLabel={(customer) => customer.name}
        placeholder="顧客名を入力"
      />
      <SearchCombobox
        label="顧客（lg 48px）"
        size="lg"
        options={CUSTOMERS}
        getOptionLabel={(customer) => customer.name}
        placeholder="顧客名を入力"
      />
    </div>
  ),
};

export const Disabled: Story = {
  name: "disabled（顧客の読み込みが終わるまで選べない）",
  args: { disabled: true, defaultValue: CUSTOMERS[0] },
};

export const EmptyOptions: Story = {
  name: "候補 0 件の文言（emptyText）",
  args: {
    options: [],
    emptyText: "該当する顧客がありません。名称の一部だけでもお試しください。",
    placeholder: "顧客名を入力",
  },
  parameters: {
    docs: {
      description: {
        story: "入力欄を選ぶと、候補パネルに `emptyText` の文言が出ます。",
      },
    },
  },
};
