import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { useState } from "react";
import { Button } from "../button";
import { FilterChip, FilterChipGroup } from ".";

const meta = {
  title: "UI/FilterChip",
  component: FilterChip,
  tags: ["autodocs"],
  args: {
    children: "進行中",
    selected: false,
    size: "md",
  },
  argTypes: {
    size: { control: "radio", options: ["sm", "md", "lg"] },
    selected: { control: "boolean" },
    disabled: { control: "boolean" },
    count: { control: "number" },
    icon: { control: "text" },
  },
  parameters: { layout: "padded" },
} satisfies Meta<typeof FilterChip>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { name: "既定（未選択）" };

export const Selected: Story = {
  name: "選択中（aria-pressed）",
  args: { selected: true },
};

export const Sizes: Story = {
  name: "サイズ",
  render: () => (
    <div className="flex flex-col gap-3">
      <FilterChipGroup label="状態で絞り込む（sm）">
        <FilterChip size="sm">進行中</FilterChip>
        <FilterChip size="sm" selected>
          完了
        </FilterChip>
      </FilterChipGroup>
      <FilterChipGroup label="状態で絞り込む（md）">
        <FilterChip size="md">進行中</FilterChip>
        <FilterChip size="md" selected>
          完了
        </FilterChip>
      </FilterChipGroup>
      <FilterChipGroup label="状態で絞り込む（lg）">
        <FilterChip size="lg">進行中</FilterChip>
        <FilterChip size="lg" selected>
          完了
        </FilterChip>
      </FilterChipGroup>
    </div>
  ),
};

export const WithCount: Story = {
  name: "件数付き",
  render: () => (
    <FilterChipGroup label="状態で絞り込む">
      <FilterChip count={12}>進行中</FilterChip>
      <FilterChip count={128} selected>
        完了
      </FilterChip>
      <FilterChip count={3}>差し戻し</FilterChip>
      <FilterChip count={0}>下書き</FilterChip>
    </FilterChipGroup>
  ),
};

export const WithIcon: Story = {
  name: "アイコン付き",
  render: () => (
    <FilterChipGroup label="よく使う条件で絞り込む">
      <FilterChip icon="person">自分の担当</FilterChip>
      <FilterChip icon="schedule">今週が納期</FilterChip>
      <FilterChip icon="payments" selected>
        未入金
      </FilterChip>
      <FilterChip icon="work">継続案件</FilterChip>
    </FilterChipGroup>
  ),
};

export const Disabled: Story = {
  name: "disabled",
  render: () => (
    <FilterChipGroup label="状態で絞り込む">
      <FilterChip>進行中</FilterChip>
      <FilterChip disabled>完了</FilterChip>
      <FilterChip disabled selected>
        差し戻し
      </FilterChip>
    </FilterChipGroup>
  ),
};

const STATUS_FILTERS = [
  { id: "active", label: "進行中", count: 12 },
  { id: "done", label: "完了", count: 128 },
  { id: "rejected", label: "差し戻し", count: 3 },
  { id: "draft", label: "下書き", count: 7 },
];

function ProjectFilters() {
  const [selected, setSelected] = useState<string[]>(["active"]);
  const [mine, setMine] = useState(false);

  const toggle = (id: string, next: boolean) =>
    setSelected((prev) => (next ? [...prev, id] : prev.filter((v) => v !== id)));
  const total = STATUS_FILTERS.filter((f) => selected.includes(f.id)).reduce(
    (sum, f) => sum + f.count,
    0,
  );

  return (
    <div className="flex max-w-2xl flex-col gap-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <FilterChipGroup label="状態で絞り込む">
          <FilterChip icon="person" selected={mine} onSelectedChange={setMine}>
            自分の担当
          </FilterChip>
          {STATUS_FILTERS.map((filter) => (
            <FilterChip
              key={filter.id}
              count={filter.count}
              selected={selected.includes(filter.id)}
              onSelectedChange={(next) => toggle(filter.id, next)}
            >
              {filter.label}
            </FilterChip>
          ))}
        </FilterChipGroup>
        {selected.length > 0 || mine ? (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setSelected([]);
              setMine(false);
            }}
          >
            絞り込みを解除する
          </Button>
        ) : null}
      </div>
      <p className="text-2 text-text-high">
        {selected.length === 0 && !mine
          ? "すべての案件（150 件）を表示しています。"
          : `${total} 件の案件を表示しています。`}
      </p>
    </div>
  );
}

export const Filtering: Story = {
  name: "一覧の絞り込み（複数選択）",
  render: () => <ProjectFilters />,
};
