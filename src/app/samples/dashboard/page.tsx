"use client";

// 画面の型 F「ダッシュボード」のサンプル（設計書 §10.1）。PageHeader（actions に期間切替の SegmentedControl）→
// 指標カード 4 枚 → 直近の案件（DataGrid）→ 期限が近い案件（Table）。
// nekodemo にグラフの部品は無いので、推移や内訳は数値と表で代替する。期間を切り替えると数値と補足だけが変わる。
// 4 状態（読み込み中 / 0 件 / エラー / 成功）は StateSwitcher で確認できる（設計書 §10.2）。
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DataGrid, type DataGridColumn } from "@/components/ui/data-grid";
import { EmptyState } from "@/components/ui/empty-state";
import { InlineMessage } from "@/components/ui/inline-message";
import { Link } from "@/components/ui/link";
import { PageHeader } from "@/components/ui/page-header";
import { SegmentedControl, SegmentedControlItem } from "@/components/ui/segmented-control";
import { Skeleton, SkeletonRows } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { StatusTag } from "@/components/ui/tag";
import { AppShell } from "../app-shell";
import { StateSwitcher, type ViewState } from "../state-switcher";

type Status = "info" | "warning" | "success" | "negative" | "neutral";
type Period = "week" | "month" | "quarter";

const PERIODS: { value: Period; label: string; range: string }[] = [
  { value: "week", label: "今週", range: "2026/09/21〜2026/09/27" },
  { value: "month", label: "今月", range: "2026/09/01〜2026/09/30" },
  { value: "quarter", label: "今四半期", range: "2026/07/01〜2026/09/30" },
];

type Metric = {
  id: string;
  label: string;
  value: number;
  unit: string;
  /** 増減や内訳の補足（グラフの代わり。04-writing の 5） */
  caption: string;
  status?: { status: Status; label: string };
};

// 期間を切り替えると数値と補足だけが変わる（グラフは無いので推移は文字で書く）
const METRICS: Record<Period, Metric[]> = {
  week: [
    { id: "count", label: "案件数", value: 24, unit: "件", caption: "先週比 +3件" },
    { id: "amount", label: "受注金額", value: 4800000, unit: "円", caption: "先週比 +1,200,000円" },
    {
      id: "active",
      label: "進行中",
      value: 12,
      unit: "件",
      caption: "先週比 +2件",
      status: { status: "info", label: "進行中" },
    },
    {
      id: "overdue",
      label: "期限超過",
      value: 2,
      unit: "件",
      caption: "先週比 +1件",
      status: { status: "negative", label: "要対応" },
    },
  ],
  month: [
    { id: "count", label: "案件数", value: 96, unit: "件", caption: "先月比 +12件" },
    {
      id: "amount",
      label: "受注金額",
      value: 18600000,
      unit: "円",
      caption: "先月比 +2,400,000円",
    },
    {
      id: "active",
      label: "進行中",
      value: 18,
      unit: "件",
      caption: "先月比 +4件",
      status: { status: "info", label: "進行中" },
    },
    {
      id: "overdue",
      label: "期限超過",
      value: 5,
      unit: "件",
      caption: "先月比 -2件",
      status: { status: "negative", label: "要対応" },
    },
  ],
  quarter: [
    { id: "count", label: "案件数", value: 312, unit: "件", caption: "前四半期比 +28件" },
    {
      id: "amount",
      label: "受注金額",
      value: 52400000,
      unit: "円",
      caption: "前四半期比 -1,800,000円",
    },
    {
      id: "active",
      label: "進行中",
      value: 27,
      unit: "件",
      caption: "前四半期比 +6件",
      status: { status: "info", label: "進行中" },
    },
    {
      id: "overdue",
      label: "期限超過",
      value: 9,
      unit: "件",
      caption: "前四半期比 +3件",
      status: { status: "negative", label: "要対応" },
    },
  ],
};

type Project = {
  id: string;
  name: string;
  customer: string;
  owner: string;
  amount: number;
  status: Status;
  statusLabel: string;
};

const RECENT: Project[] = [
  {
    id: "P-1001",
    name: "備品貸出アプリ 改修",
    customer: "山田商事",
    owner: "山田 太郎",
    amount: 1200000,
    status: "info",
    statusLabel: "進行中",
  },
  {
    id: "P-1002",
    name: "顧客ポータル 要件定義",
    customer: "佐藤工業",
    owner: "佐藤 花子",
    amount: 480000,
    status: "warning",
    statusLabel: "確認待ち",
  },
  {
    id: "P-1003",
    name: "在庫管理システム 移行",
    customer: "鈴木物産",
    owner: "鈴木 次郎",
    amount: 2350000,
    status: "info",
    statusLabel: "進行中",
  },
  {
    id: "P-1004",
    name: "採用サイト リニューアル",
    customer: "高橋建設",
    owner: "高橋 美咲",
    amount: 960000,
    status: "negative",
    statusLabel: "差し戻し",
  },
  {
    id: "P-1005",
    name: "勤怠アプリ ユーザーインタビュー",
    customer: "田中電機",
    owner: "田中 健",
    amount: 150000,
    status: "neutral",
    statusLabel: "下書き",
  },
  {
    id: "P-1006",
    name: "受発注システム 追加開発",
    customer: "伊藤商店",
    owner: "山田 太郎",
    amount: 3100000,
    status: "success",
    statusLabel: "完了",
  },
  {
    id: "P-1007",
    name: "営業支援ツール 導入支援",
    customer: "山田商事",
    owner: "佐藤 花子",
    amount: 620000,
    status: "info",
    statusLabel: "進行中",
  },
  {
    id: "P-1008",
    name: "請求書発行機能 追加",
    customer: "佐藤工業",
    owner: "鈴木 次郎",
    amount: 840000,
    status: "warning",
    statusLabel: "確認待ち",
  },
];

const DEADLINES: {
  id: string;
  name: string;
  owner: string;
  due: string;
  status: Status;
  statusLabel: string;
}[] = [
  {
    id: "P-1002",
    name: "顧客ポータル 要件定義",
    owner: "佐藤 花子",
    due: "2026/09/18",
    status: "negative",
    statusLabel: "期限超過",
  },
  {
    id: "P-1004",
    name: "採用サイト リニューアル",
    owner: "高橋 美咲",
    due: "2026/09/24",
    status: "warning",
    statusLabel: "期限間近",
  },
  {
    id: "P-1008",
    name: "請求書発行機能 追加",
    owner: "鈴木 次郎",
    due: "2026/09/25",
    status: "warning",
    statusLabel: "期限間近",
  },
  {
    id: "P-1007",
    name: "営業支援ツール 導入支援",
    owner: "佐藤 花子",
    due: "2026/09/30",
    status: "info",
    statusLabel: "予定どおり",
  },
];

const columns: DataGridColumn<Project>[] = [
  {
    id: "name",
    header: "案件名",
    size: 240,
    cell: (r) => <Link href="/samples/detail/">{r.name}</Link>,
  },
  { id: "customer", header: "顧客", size: 130 },
  { id: "owner", header: "担当", size: 120 },
  {
    id: "amount",
    header: "金額（円）",
    numeric: true,
    size: 130,
    cell: (r) => r.amount.toLocaleString("ja-JP"),
  },
  {
    id: "statusLabel",
    header: "状態",
    size: 110,
    cell: (r) => <StatusTag status={r.status}>{r.statusLabel}</StatusTag>,
  },
];

export default function DashboardSamplePage() {
  const [state, setState] = useState<ViewState>("success");
  const [period, setPeriod] = useState<Period>("week");
  const current = PERIODS.find((p) => p.value === period) ?? PERIODS[0];
  const empty = state === "empty";

  return (
    <AppShell current="dashboard">
      <div className="flex flex-col gap-6">
        <StateSwitcher value={state} onChange={setState} />

        <PageHeader
          title="ダッシュボード"
          description={`${current.label}（${current.range}）の案件の状況です。`}
          actions={
            <SegmentedControl
              aria-label="期間"
              value={period}
              onValueChange={(v) => setPeriod(v as Period)}
            >
              {PERIODS.map((p) => (
                <SegmentedControlItem key={p.value} value={p.value}>
                  {p.label}
                </SegmentedControlItem>
              ))}
            </SegmentedControl>
          }
        />

        {state === "error" ? (
          <InlineMessage
            variant="negative"
            action={
              <Button variant="outline" size="sm" onClick={() => setState("success")}>
                再試行する
              </Button>
            }
          >
            ダッシュボードを読み込めませんでした。通信状態を確認して、再試行してください。
          </InlineMessage>
        ) : (
          <>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              {METRICS[period].map((m) => (
                <Card key={m.id}>
                  <CardContent className="gap-1">
                    <h3 className="text-2 text-text-low">{m.label}</h3>
                    {state === "loading" ? (
                      <>
                        <Skeleton className="h-9 w-24" />
                        <Skeleton className="h-4 w-28" />
                      </>
                    ) : (
                      <>
                        <p className="flex items-baseline text-text-high">
                          <span className="font-bold font-mono text-7 tabular-nums">
                            {(empty ? 0 : m.value).toLocaleString("ja-JP")}
                          </span>
                          <span className="text-3">{m.unit}</span>
                        </p>
                        <div className="flex flex-wrap items-center gap-2">
                          {m.status && !empty ? (
                            <StatusTag status={m.status.status}>{m.status.label}</StatusTag>
                          ) : null}
                          <span className="text-1 text-text-low">{empty ? "—" : m.caption}</span>
                        </div>
                      </>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>

            <Card>
              <CardHeader>
                <CardTitle>直近の案件</CardTitle>
              </CardHeader>
              <CardContent>
                <DataGrid
                  aria-label="直近の案件"
                  columns={columns}
                  data={empty ? [] : RECENT}
                  getRowId={(r) => r.id}
                  status={state === "loading" ? "loading" : "ready"}
                  density="xs"
                  searchable={false}
                  columnMenu={false}
                  pagination={false}
                  emptyTitle="まだ案件がありません"
                  emptyDescription="案件を追加すると、ここに直近の案件が表示されます。"
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>期限が近い案件</CardTitle>
              </CardHeader>
              <CardContent>
                {state === "loading" ? (
                  <SkeletonRows rows={4} />
                ) : empty ? (
                  <EmptyState
                    hideMascot
                    headingLevel={4}
                    title="期限が近い案件はありません"
                    description="期限が 7 日以内の案件が、ここに表示されます。"
                  />
                ) : (
                  <Table density="xs">
                    <TableHeader>
                      <TableRow>
                        <TableHead>案件名</TableHead>
                        <TableHead>担当</TableHead>
                        <TableHead>期限</TableHead>
                        <TableHead>状態</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {DEADLINES.map((d) => (
                        <TableRow key={d.id}>
                          <TableCell>
                            <Link href="/samples/detail/">{d.name}</Link>
                          </TableCell>
                          <TableCell>{d.owner}</TableCell>
                          <TableCell className="font-mono">{d.due}</TableCell>
                          <TableCell>
                            <StatusTag status={d.status}>{d.statusLabel}</StatusTag>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </AppShell>
  );
}
