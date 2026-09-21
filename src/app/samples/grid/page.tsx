"use client";

// 画面の型 A「一覧」を DataGrid ＋ SearchCombobox で再現したサンプル（設計書 §9.3 / §9.4、v1.1）。
// 検索・列の絞り込み・ソート・選択・ページング・列の表示切替と、4 状態の切り替えを確認できる。
import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { DataGrid, type DataGridColumn } from "@/components/ui/data-grid";
import { Icon } from "@/components/ui/icon";
import { IconButton } from "@/components/ui/icon-button";
import { Link } from "@/components/ui/link";
import { SearchCombobox } from "@/components/ui/search-combobox";
import { StatusTag } from "@/components/ui/tag";
import { toast } from "@/components/ui/toast";
import { AppShell } from "../app-shell";
import { StateSwitcher, type ViewState } from "../state-switcher";

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
const OWNERS = [
  { id: "u1", name: "山田 太郎", team: "第 1 営業部" },
  { id: "u2", name: "佐藤 花子", team: "第 1 営業部" },
  { id: "u3", name: "鈴木 次郎", team: "第 2 営業部" },
  { id: "u4", name: "高橋 美咲", team: "第 2 営業部" },
  { id: "u5", name: "田中 健", team: "カスタマーサクセス" },
];
const STATUSES: { status: Status; label: string }[] = [
  { status: "info", label: "進行中" },
  { status: "warning", label: "確認待ち" },
  { status: "success", label: "完了" },
  { status: "negative", label: "差し戻し" },
  { status: "neutral", label: "下書き" },
];
const KINDS = ["改修", "新規開発", "運用保守", "PoC", "コンサルティング", "移行"];

const PROJECTS: Project[] = Array.from({ length: 137 }, (_, i) => {
  const st = STATUSES[i % STATUSES.length];
  const day = ((i * 7) % 28) + 1;
  const month = ((i * 3) % 12) + 1;
  return {
    id: `P-${String(1001 + i)}`,
    name: `${CUSTOMERS[i % CUSTOMERS.length]} ${KINDS[i % KINDS.length]}案件 ${String(i + 1).padStart(3, "0")}`,
    customer: CUSTOMERS[i % CUSTOMERS.length],
    owner: OWNERS[i % OWNERS.length].name,
    status: st.status,
    statusLabel: st.label,
    amount: (((i * 37) % 90) + 10) * 100_000,
    updatedAt: `2026/${String(month).padStart(2, "0")}/${String(day).padStart(2, "0")}`,
  };
});

const columns: DataGridColumn<Project>[] = [
  {
    id: "name",
    header: "案件名",
    size: 250,
    cell: (r) => <Link href="/samples/detail/">{r.name}</Link>,
  },
  { id: "customer", header: "顧客", filter: "select", size: 120 },
  { id: "owner", header: "担当", filter: "select", size: 120 },
  {
    id: "statusLabel",
    header: "状態",
    filter: "select",
    size: 110,
    cell: (r) => <StatusTag status={r.status}>{r.statusLabel}</StatusTag>,
  },
  {
    id: "amount",
    header: "金額（円）",
    numeric: true,
    size: 130,
    cell: (r) => r.amount.toLocaleString("ja-JP"),
  },
  { id: "updatedAt", header: "更新日", size: 110 },
];

export default function GridSamplePage() {
  const [state, setState] = useState<ViewState>("success");
  const [owners, setOwners] = useState<(typeof OWNERS)[number][]>([]);
  const [selected, setSelected] = useState<string[]>([]);

  const data = useMemo(() => {
    if (state === "empty") return [];
    if (owners.length === 0) return PROJECTS;
    const names = new Set(owners.map((o) => o.name));
    return PROJECTS.filter((p) => names.has(p.owner));
  }, [state, owners]);

  return (
    <AppShell current="projects">
      <div className="flex flex-col gap-6">
        <StateSwitcher value={state} onChange={setState} />
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="font-bold text-6 text-text-high">案件一覧（DataGrid）</h1>
            <p className="mt-1 text-2 text-text-low">
              一覧の型 A を DataGrid で組んだ例。担当の絞り込みは SearchCombobox（複数選択）。
            </p>
          </div>
          <Button onClick={() => toast.success("案件を追加しました")}>
            <Icon icon="add" />
            案件を追加する
          </Button>
        </div>

        <DataGrid
          aria-label="案件一覧"
          columns={columns}
          data={data}
          getRowId={(r) => r.id}
          status={state === "loading" ? "loading" : state === "error" ? "error" : "ready"}
          onRetry={() => setState("success")}
          emptyTitle="まだ案件がありません"
          emptyDescription="最初の案件を追加すると、ここに一覧が表示されます。"
          emptyAction={<Button onClick={() => setState("success")}>案件を追加する</Button>}
          selectable
          onSelectionChange={setSelected}
          pinFirstColumn
          searchPlaceholder="案件名・顧客・担当で検索"
          toolbar={
            <SearchCombobox
              label="担当で絞り込む"
              hideLabel
              multiple
              options={OWNERS}
              getOptionLabel={(o) => o.name}
              getOptionDescription={(o) => o.team}
              groupBy={(o) => o.team}
              value={owners}
              onChange={(v) => setOwners(v)}
              placeholder="担当で絞り込む"
              size="sm"
              className="w-72"
            />
          }
          rowActions={(r) => (
            <>
              <IconButton
                icon="edit"
                label={`${r.name} を編集する`}
                variant="ghost"
                size="sm"
                onClick={() => toast.info(`${r.name} を編集します`)}
              />
              <IconButton
                icon="delete"
                label={`${r.name} を削除する`}
                variant="ghost"
                size="sm"
                onClick={() => toast.error(`${r.name} は削除できません（サンプル）`)}
              />
            </>
          )}
          unit="件"
          caption={selected.length > 0 ? `${selected.length} 件を選択しています` : undefined}
        />
      </div>
    </AppShell>
  );
}
