import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { useState } from "react";
import { Button } from "../button";
import { Icon } from "../icon";
import { IconButton } from "../icon-button";
import { RadioGroup, RadioItem } from "../radio";
import { StatusTag } from "../tag";
import { DataGrid, type DataGridColumn } from ".";

type Status = "info" | "warning" | "success" | "negative" | "neutral";
type Project = {
  id: string;
  name: string;
  customer: string;
  owner: string;
  status: Status;
  statusLabel: string;
  amount: number;
  updatedAt: string;
};

const CUSTOMERS = ["山田商事", "佐藤工業", "鈴木物産", "高橋建設", "田中電機", "伊藤商店"];
const OWNERS = ["山田 太郎", "佐藤 花子", "鈴木 次郎", "高橋 美咲", "田中 健"];
const STATUSES: { status: Status; label: string }[] = [
  { status: "info", label: "進行中" },
  { status: "warning", label: "確認待ち" },
  { status: "success", label: "完了" },
  { status: "negative", label: "差し戻し" },
  { status: "neutral", label: "下書き" },
];
const KINDS = ["改修", "新規開発", "運用保守", "PoC", "コンサルティング", "移行"];

function makeProjects(count: number): Project[] {
  return Array.from({ length: count }, (_, i) => {
    const st = STATUSES[i % STATUSES.length];
    const day = ((i * 7) % 28) + 1;
    const month = ((i * 3) % 12) + 1;
    return {
      id: `P-${String(1001 + i)}`,
      name: `${CUSTOMERS[i % CUSTOMERS.length]} ${KINDS[i % KINDS.length]}案件 ${String(i + 1).padStart(3, "0")}`,
      customer: CUSTOMERS[i % CUSTOMERS.length],
      owner: OWNERS[i % OWNERS.length],
      status: st.status,
      statusLabel: st.label,
      amount: (((i * 37) % 90) + 10) * 100_000,
      updatedAt: `2026/${String(month).padStart(2, "0")}/${String(day).padStart(2, "0")}`,
    };
  });
}

/** 一覧の基本形（ページング 20 件 × 7 ページ） */
const PROJECTS = makeProjects(137);
/** 仮想化の確認用 */
const MANY_PROJECTS = makeProjects(5_000);

const yen = (value: number) => value.toLocaleString("ja-JP");

const columns: DataGridColumn<Project>[] = [
  { id: "name", header: "案件名", size: 320 },
  { id: "customer", header: "顧客", filter: "select", size: 140 },
  { id: "owner", header: "担当", filter: "select", size: 140 },
  {
    id: "statusLabel",
    header: "状態",
    filter: "select",
    size: 120,
    cell: (row) => <StatusTag status={row.status}>{row.statusLabel}</StatusTag>,
  },
  { id: "amount", header: "金額（円）", numeric: true, size: 140, cell: (row) => yen(row.amount) },
  { id: "updatedAt", header: "更新日", size: 120 },
];

/** 行の高さを比べるときや、装飾を外した形を見せるときの簡易版 */
const compactColumns: DataGridColumn<Project>[] = [
  { id: "name", header: "案件名", size: 280 },
  { id: "customer", header: "顧客", size: 140 },
  { id: "amount", header: "金額（円）", numeric: true, size: 140, cell: (row) => yen(row.amount) },
];

const meta = {
  title: "UI/DataGrid",
  component: DataGrid<Project>,
  tags: ["autodocs"],
  args: {
    "aria-label": "案件一覧",
    columns,
    data: PROJECTS,
    getRowId: (row: Project) => row.id,
    density: "sm",
  },
  argTypes: {
    density: { control: "radio", options: ["xs", "sm", "md"] },
    selectable: { control: "boolean" },
    pinFirstColumn: { control: "boolean" },
    searchable: { control: "boolean" },
    columnMenu: { control: "boolean" },
    pagination: { control: "boolean" },
  },
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "ソート・列幅・固定・選択・ページング・検索・列の絞り込み・列の表示切替・密度・4 状態・仮想化・行内操作を備えた表です。`aria-label` は必須です。",
      },
    },
  },
} satisfies Meta<typeof DataGrid<Project>>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  name: "基本（検索・絞り込み・選択・ページング）",
  args: {
    caption: "2026/09/21 時点の案件 137 件です。",
    selectable: true,
    pinFirstColumn: true,
    searchPlaceholder: "案件名・顧客・担当で検索",
    rowActions: (row: Project) => (
      <>
        <IconButton icon="edit" label={`${row.name} を編集する`} variant="ghost" size="sm" />
        <IconButton icon="delete" label={`${row.name} を削除する`} variant="ghost" size="sm" />
      </>
    ),
  },
};

export const Densities: Story = {
  name: "行の高さ（xs 40 / sm 56 / md 80）",
  render: () => (
    <div className="flex flex-col gap-8">
      {(["xs", "sm", "md"] as const).map((density) => (
        <DataGrid
          key={density}
          aria-label={`案件一覧（density ${density}）`}
          caption={`density ${density} の案件一覧です。`}
          columns={compactColumns}
          data={PROJECTS.slice(0, 3)}
          getRowId={(row) => row.id}
          density={density}
          searchable={false}
          columnMenu={false}
          pagination={false}
        />
      ))}
    </div>
  ),
};

type ViewState = "success" | "loading" | "empty" | "error";

const STATES: { value: ViewState; label: string }[] = [
  { value: "success", label: "成功" },
  { value: "loading", label: "読み込み中" },
  { value: "empty", label: "0 件" },
  { value: "error", label: "エラー" },
];

function StatefulGrid() {
  const [state, setState] = useState<ViewState>("success");
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center gap-3 rounded-action border border-border-low border-dashed bg-surface-well px-3 py-2 text-2 text-text-middle">
        <span className="font-bold">一覧の状態</span>
        <RadioGroup
          aria-label="一覧の状態"
          value={state}
          onValueChange={(value) => setState(value as ViewState)}
          className="flex flex-wrap gap-4"
        >
          {STATES.map((item) => (
            <div key={item.value} className="flex items-center gap-1.5">
              <RadioItem value={item.value} id={`data-grid-state-${item.value}`} />
              <label htmlFor={`data-grid-state-${item.value}`}>{item.label}</label>
            </div>
          ))}
        </RadioGroup>
      </div>
      <DataGrid
        aria-label="案件一覧"
        columns={columns}
        data={state === "empty" ? [] : PROJECTS.slice(0, 8)}
        getRowId={(row) => row.id}
        status={state === "loading" ? "loading" : state === "error" ? "error" : "ready"}
        errorMessage="案件一覧を読み込めませんでした。時間をおいて再試行してください。"
        onRetry={() => setState("success")}
        emptyTitle="まだ案件がありません"
        emptyDescription="最初の案件を追加すると、ここに一覧が表示されます。"
        emptyAction={
          <Button onClick={() => setState("success")}>
            <Icon icon="add" />
            案件を追加する
          </Button>
        }
      />
    </div>
  );
}

export const States: Story = {
  name: "4 状態（読み込み中 / エラー / 0 件 / 成功）",
  render: () => <StatefulGrid />,
};

export const Virtualized: Story = {
  name: "仮想化（virtualize・5,000 件）",
  args: {
    "aria-label": "案件一覧（5,000 件）",
    caption: "5,000 件を高さ 480px の領域で仮想化しています。",
    data: MANY_PROJECTS,
    virtualize: true,
    height: 480,
    searchPlaceholder: "案件名・顧客・担当で検索",
  },
  parameters: {
    docs: {
      description: {
        story:
          "`virtualize` のときはページングを使わず、`height` の領域内で見える行だけを描画します。",
      },
    },
  },
};

export const Bare: Story = {
  name: "検索・列メニュー・ページングなし",
  args: {
    "aria-label": "直近の案件",
    caption: "更新が新しい 8 件です。",
    columns: compactColumns,
    data: PROJECTS.slice(0, 8),
    searchable: false,
    columnMenu: false,
    pagination: false,
  },
  parameters: {
    docs: {
      description: {
        story:
          "カードの中など、表そのものだけを見せたいときは `searchable` / `columnMenu` / `pagination` を落とします。",
      },
    },
  },
};
