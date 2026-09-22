"use client";

// 画面の型 A「一覧」のサンプル（設計書 §10.1）。4 状態（読み込み中 / 0 件 / エラー / 成功）を切り替えて確認できる。
import { useMemo, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogAction,
  DialogCancel,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { EmptyState } from "@/components/ui/empty-state";
import { Icon } from "@/components/ui/icon";
import { IconButton } from "@/components/ui/icon-button";
import { InlineMessage } from "@/components/ui/inline-message";
import { InputSearch } from "@/components/ui/input-search";
import { Link } from "@/components/ui/link";
import { Menu, MenuContent, MenuItem, MenuSeparator, MenuTrigger } from "@/components/ui/menu";
import { Pagination } from "@/components/ui/pagination";
import { SkeletonRows } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { StatusTag, Tag } from "@/components/ui/tag";
import { toast } from "@/components/ui/toast";
import { AppShell } from "../app-shell";
import { StateSwitcher, type ViewState } from "../state-switcher";

type Status = "info" | "warning" | "success" | "negative" | "neutral";
type Project = {
  id: number;
  name: string;
  customer: string;
  status: Status;
  statusLabel: string;
  amount: number;
  updatedAt: string;
};

const PROJECTS: Project[] = [
  {
    id: 1,
    name: "社内備品貸出アプリ 改修",
    customer: "山田商事",
    status: "info",
    statusLabel: "進行中",
    amount: 1200000,
    updatedAt: "2026/09/21",
  },
  {
    id: 2,
    name: "顧客ポータル 要件定義",
    customer: "山田製作所",
    status: "warning",
    statusLabel: "確認待ち",
    amount: 480000,
    updatedAt: "2026/09/19",
  },
  {
    id: 3,
    name: "在庫管理ダッシュボード",
    customer: "山田物流",
    status: "success",
    statusLabel: "完了",
    amount: 2350000,
    updatedAt: "2026/09/12",
  },
  {
    id: 4,
    name: "採用サイト リニューアル",
    customer: "山田ホールディングス",
    status: "negative",
    statusLabel: "差し戻し",
    amount: 960000,
    updatedAt: "2026/09/08",
  },
  {
    id: 5,
    name: "勤怠アプリ ユーザーインタビュー",
    customer: "山田クリニック",
    status: "neutral",
    statusLabel: "下書き",
    amount: 150000,
    updatedAt: "2026/09/02",
  },
];

export default function ListSamplePage() {
  const [state, setState] = useState<ViewState>("success");
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState<Set<number>>(new Set());
  const [filters, setFilters] = useState<string[]>(["状態: 進行中", "担当: 自分"]);
  const [deleting, setDeleting] = useState<Project | null>(null);

  const rows = useMemo(
    () => PROJECTS.filter((p) => !query || p.name.includes(query) || p.customer.includes(query)),
    [query],
  );
  const allSelected = rows.length > 0 && rows.every((r) => selected.has(r.id));
  const someSelected = rows.some((r) => selected.has(r.id));

  return (
    <AppShell current="projects">
      <div className="flex flex-col gap-4">
        <StateSwitcher value={state} onChange={setState} />

        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <h1 className="text-6 font-bold">案件一覧</h1>
            <Badge variant="neutral">{rows.length}件</Badge>
          </div>
          <Button
            onClick={() =>
              toast.success("案件を追加しました", {
                description: "「新規案件」を一覧に追加しました。",
              })
            }
          >
            <Icon icon="add" size={4} />
            案件を追加する
          </Button>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <InputSearch
            className="w-full max-w-sm"
            placeholder="案件名・顧客名で検索"
            value={query}
            onValueChange={(v) => {
              setQuery(v);
              setPage(1);
            }}
            onOpenConditions={() =>
              toast.info("検索条件のパネルは Phase 6（SearchCombobox）で実装します")
            }
          />
          {filters.map((f) => (
            <Tag
              key={f}
              variant="selected"
              onRemove={() => setFilters((fs) => fs.filter((x) => x !== f))}
            >
              {f}
            </Tag>
          ))}
          <Button variant="outline" size="sm">
            <Icon icon="filter_list" size={3} />
            絞り込み
          </Button>
        </div>

        {state === "loading" ? (
          <div className="rounded-container border border-border-low bg-surface-card p-4">
            <SkeletonRows rows={5} />
          </div>
        ) : state === "error" ? (
          <InlineMessage
            variant="negative"
            action={
              <Button variant="outline" size="sm" onClick={() => setState("success")}>
                再試行
              </Button>
            }
          >
            案件一覧を読み込めませんでした。通信状態を確認して再試行してください。
          </InlineMessage>
        ) : state === "empty" || rows.length === 0 ? (
          query ? (
            <EmptyState
              title="条件に合う案件がありません"
              description="検索語や絞り込み条件を変えてみてください。"
              action={
                <Button variant="outline" onClick={() => setQuery("")}>
                  条件をクリアする
                </Button>
              }
            />
          ) : (
            <EmptyState
              title="まだ案件がありません"
              description="最初の案件を追加すると、ここに一覧が表示されます。"
              action={
                <Button onClick={() => setState("success")}>
                  <Icon icon="add" size={4} />
                  案件を追加する
                </Button>
              }
            />
          )
        ) : (
          <>
            {someSelected ? (
              <div className="flex items-center gap-3 rounded-action bg-surface-selected px-3 py-2 text-2 text-text-primary">
                <span className="font-bold">{selected.size}件を選択中</span>
                <Button variant="ghost" size="sm" onClick={() => setSelected(new Set())}>
                  選択を解除する
                </Button>
              </div>
            ) : null}
            <Table density="sm">
              <TableHeader>
                <TableRow>
                  <TableHead className="w-11">
                    <Checkbox
                      aria-label="すべて選択"
                      checked={allSelected ? true : someSelected ? "indeterminate" : false}
                      onCheckedChange={(v) =>
                        setSelected(v ? new Set(rows.map((r) => r.id)) : new Set())
                      }
                    />
                  </TableHead>
                  <TableHead
                    sort="asc"
                    onSort={() => toast.info("並べ替えは v1.1 の DataGrid で対応します")}
                  >
                    案件名
                  </TableHead>
                  <TableHead>顧客</TableHead>
                  <TableHead>状態</TableHead>
                  <TableHead numeric>金額</TableHead>
                  <TableHead>更新日</TableHead>
                  <TableHead className="w-12">
                    <span className="sr-only">操作</span>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rows.map((p) => (
                  <TableRow key={p.id} aria-selected={selected.has(p.id)}>
                    <TableCell>
                      <Checkbox
                        aria-label={`${p.name} を選択`}
                        checked={selected.has(p.id)}
                        onCheckedChange={(v) =>
                          setSelected((s) => {
                            const next = new Set(s);
                            if (v) next.add(p.id);
                            else next.delete(p.id);
                            return next;
                          })
                        }
                      />
                    </TableCell>
                    <TableCell>
                      <Link href="/samples/detail/" className="no-underline hover:underline">
                        {p.name}
                      </Link>
                    </TableCell>
                    <TableCell>{p.customer}</TableCell>
                    <TableCell>
                      <StatusTag status={p.status}>{p.statusLabel}</StatusTag>
                    </TableCell>
                    <TableCell numeric>{p.amount.toLocaleString("ja-JP")}</TableCell>
                    <TableCell className="font-mono">{p.updatedAt}</TableCell>
                    <TableCell className="text-right">
                      <Menu>
                        <MenuTrigger asChild>
                          <IconButton icon="more_vert" label={`${p.name} の操作`} size="sm" />
                        </MenuTrigger>
                        <MenuContent>
                          <MenuItem
                            onSelect={() => toast.info("編集画面は「C. フォーム」のサンプルを参照")}
                          >
                            <Icon icon="edit" size={4} />
                            編集する
                          </MenuItem>
                          <MenuItem onSelect={() => toast.success("複製しました")}>
                            <Icon icon="content_copy" size={4} />
                            複製する
                          </MenuItem>
                          <MenuSeparator />
                          <MenuItem variant="negative" onSelect={() => setDeleting(p)}>
                            <Icon icon="delete" size={4} />
                            削除する
                          </MenuItem>
                        </MenuContent>
                      </Menu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <Pagination page={page} total={120} pageSize={20} onPageChange={setPage} />
          </>
        )}
      </div>

      <Dialog open={deleting !== null} onOpenChange={(open) => !open && setDeleting(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>この案件を削除しますか？</DialogTitle>
            <DialogDescription>
              「{deleting?.name}」と関連するタスクも削除されます。この操作は取り消せません。
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogCancel>キャンセル</DialogCancel>
            <DialogAction
              variant="negative"
              onClick={() => {
                toast.success("案件を削除しました");
                setDeleting(null);
              }}
            >
              削除する
            </DialogAction>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AppShell>
  );
}
