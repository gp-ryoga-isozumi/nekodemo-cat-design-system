import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { useState } from "react";
import { StatusTag } from "../tag";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from ".";

type Project = {
  name: string;
  client: string;
  amount: number;
  due: string;
  status: "進行中" | "確認待ち" | "完了";
};

const PROJECTS: Project[] = [
  {
    name: "社内備品貸出アプリ 改修",
    client: "山田商事",
    amount: 1_200_000,
    due: "2026/09/21",
    status: "進行中",
  },
  {
    name: "勤怠システム 連携",
    client: "鈴木工業",
    amount: 840_000,
    due: "2026/10/05",
    status: "確認待ち",
  },
  {
    name: "在庫管理ダッシュボード",
    client: "田中システム",
    amount: 2_400_000,
    due: "2026/11/30",
    status: "完了",
  },
];

const STATUS = {
  進行中: "info",
  確認待ち: "warning",
  完了: "success",
} as const;

const yen = (value: number) => value.toLocaleString("ja-JP");

const meta = {
  title: "UI/Table",
  component: Table,
  tags: ["autodocs"],
  args: { density: "sm" },
  argTypes: { density: { control: "radio", options: ["xs", "sm", "md"] } },
  parameters: { layout: "padded" },
} satisfies Meta<typeof Table>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  name: "基本（density sm）",
  render: (args) => (
    <Table {...args}>
      <TableCaption>山田商事ほかの案件一覧です。</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>案件名</TableHead>
          <TableHead>顧客</TableHead>
          <TableHead numeric>金額</TableHead>
          <TableHead>納期</TableHead>
          <TableHead>状態</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {PROJECTS.map((project) => (
          <TableRow key={project.name}>
            <TableCell>{project.name}</TableCell>
            <TableCell>{project.client}</TableCell>
            <TableCell numeric>{yen(project.amount)}</TableCell>
            <TableCell>{project.due}</TableCell>
            <TableCell>
              <StatusTag status={STATUS[project.status]}>{project.status}</StatusTag>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  ),
};

export const Densities: Story = {
  name: "行の高さ（xs 40 / sm 56 / md 80）",
  render: () => (
    <div className="flex flex-col gap-6">
      {(["xs", "sm", "md"] as const).map((density) => (
        <Table key={density} density={density}>
          <TableCaption>density {density} の案件一覧です。</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>案件名</TableHead>
              <TableHead>顧客</TableHead>
              <TableHead numeric>金額</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {PROJECTS.slice(0, 2).map((project) => (
              <TableRow key={project.name}>
                <TableCell>{project.name}</TableCell>
                <TableCell>{project.client}</TableCell>
                <TableCell numeric>{yen(project.amount)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      ))}
    </div>
  ),
};

function SortableProjects() {
  const [sort, setSort] = useState<{ key: "client" | "amount"; order: "asc" | "desc" }>({
    key: "amount",
    order: "asc",
  });
  const sortOf = (key: "client" | "amount") => (sort.key === key ? sort.order : "none");
  const toggle = (key: "client" | "amount") =>
    setSort((current) =>
      current.key === key
        ? { key, order: current.order === "asc" ? "desc" : "asc" }
        : { key, order: "asc" },
    );
  const rows = [...PROJECTS].sort((a, b) => {
    const diff =
      sort.key === "amount" ? a.amount - b.amount : a.client.localeCompare(b.client, "ja");
    return sort.order === "asc" ? diff : -diff;
  });

  return (
    <Table>
      <TableCaption>列見出しを押すと並び順が変わります。</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>案件名</TableHead>
          <TableHead sort={sortOf("client")} onSort={() => toggle("client")}>
            顧客
          </TableHead>
          <TableHead numeric sort={sortOf("amount")} onSort={() => toggle("amount")}>
            金額
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {rows.map((project) => (
          <TableRow key={project.name}>
            <TableCell>{project.name}</TableCell>
            <TableCell>{project.client}</TableCell>
            <TableCell numeric>{yen(project.amount)}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

export const Sortable: Story = {
  name: "並べ替え（sort / onSort）",
  render: () => <SortableProjects />,
};

export const WithFooter: Story = {
  name: "合計行（TableFooter）",
  render: () => (
    <Table density="xs">
      <TableCaption>2026/09/21 時点の受注金額の合計です。</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>案件名</TableHead>
          <TableHead numeric>金額</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {PROJECTS.map((project) => (
          <TableRow key={project.name}>
            <TableCell>{project.name}</TableCell>
            <TableCell numeric>{yen(project.amount)}</TableCell>
          </TableRow>
        ))}
      </TableBody>
      <TableFooter>
        <TableRow>
          <TableCell>合計</TableCell>
          <TableCell numeric>
            {yen(PROJECTS.reduce((total, project) => total + project.amount, 0))}
          </TableCell>
        </TableRow>
      </TableFooter>
    </Table>
  ),
};

export const SelectedRow: Story = {
  name: "選択中の行",
  render: () => (
    <Table>
      <TableCaption>選択中の行は data-state=&quot;selected&quot; で示します。</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>案件名</TableHead>
          <TableHead>顧客</TableHead>
          <TableHead numeric>金額</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {PROJECTS.map((project, index) => (
          <TableRow key={project.name} data-state={index === 0 ? "selected" : undefined}>
            <TableCell>{project.name}</TableCell>
            <TableCell>{project.client}</TableCell>
            <TableCell numeric>{yen(project.amount)}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  ),
};

/** 固定ヘッダーの確認用に案件を繰り返して 12 件にした一覧 */
const MANY_PROJECTS: Project[] = Array.from({ length: 12 }, (_, index) => {
  const project = PROJECTS[index % PROJECTS.length];
  return { ...project, name: `${project.name}（${index + 1}）` };
});

export const Scrollable: Story = {
  name: "横スクロールと固定ヘッダー",
  render: () => (
    // スクロールする領域はキーボードで到達できるようにする（axe: scrollable-region-focusable）
    <div
      className="max-h-72 overflow-y-auto"
      tabIndex={0}
      role="region"
      aria-label="案件一覧（スクロール）"
    >
      <Table density="xs">
        <TableCaption>行数が多いとヘッダーが上に固定されます。</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>案件名</TableHead>
            <TableHead>顧客</TableHead>
            <TableHead numeric>金額</TableHead>
            <TableHead>納期</TableHead>
            <TableHead>状態</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {MANY_PROJECTS.map((project) => (
            <TableRow key={project.name}>
              <TableCell>{project.name}</TableCell>
              <TableCell>{project.client}</TableCell>
              <TableCell numeric>{yen(project.amount)}</TableCell>
              <TableCell>{project.due}</TableCell>
              <TableCell>
                <StatusTag status={STATUS[project.status]}>{project.status}</StatusTag>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  ),
};
