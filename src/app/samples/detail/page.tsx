"use client";

// 画面の型 B「詳細」のサンプル（設計書 §10.1）。Breadcrumb → 見出し＋状態 StatusTag＋操作 Menu → 2 カラム（左: 情報 Card、右: 関連 Card）
import NextLink from "next/link";
import { useState } from "react";
import { Avatar } from "@/components/ui/avatar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogAction,
  DialogCancel,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { EmptyState } from "@/components/ui/empty-state";
import { Icon } from "@/components/ui/icon";
import { IconButton } from "@/components/ui/icon-button";
import { InlineMessage } from "@/components/ui/inline-message";
import { Menu, MenuContent, MenuItem, MenuSeparator, MenuTrigger } from "@/components/ui/menu";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { StatusTag } from "@/components/ui/tag";
import { toast } from "@/components/ui/toast";
import { AppShell } from "../app-shell";
import { StateSwitcher, type ViewState } from "../state-switcher";

const TASKS = [
  { id: 1, name: "要件の確認", owner: "五十棲", due: "2026/09/25", done: true },
  { id: 2, name: "画面設計", owner: "山田", due: "2026/10/02", done: false },
  { id: 3, name: "ユーザーインタビュー（3 名）", owner: "五十棲", due: "2026/10/09", done: false },
];

export default function DetailSamplePage() {
  const [state, setState] = useState<ViewState>("success");
  return (
    <AppShell current="projects">
      <div className="flex flex-col gap-4">
        <StateSwitcher value={state} onChange={setState} />
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <NextLink href="/samples/list/">案件</NextLink>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>社内備品貸出アプリ 改修</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-6 font-bold">社内備品貸出アプリ 改修</h1>
            <StatusTag status="info">進行中</StatusTag>
          </div>
          <div className="flex items-center gap-2">
            <Button asChild variant="outline">
              <NextLink href="/samples/form/">
                <Icon icon="edit" size={4} />
                編集する
              </NextLink>
            </Button>
            <Menu>
              <MenuTrigger asChild>
                <IconButton icon="more_vert" label="案件の操作" variant="outline" />
              </MenuTrigger>
              <MenuContent>
                <MenuItem onSelect={() => toast.success("複製しました")}>
                  <Icon icon="content_copy" size={4} />
                  複製する
                </MenuItem>
                <MenuItem onSelect={() => toast.success("アーカイブしました")}>
                  <Icon icon="archive" size={4} />
                  アーカイブする
                </MenuItem>
                <MenuSeparator />
                <Dialog>
                  <DialogTrigger asChild>
                    <MenuItem variant="negative" onSelect={(e) => e.preventDefault()}>
                      <Icon icon="delete" size={4} />
                      削除する
                    </MenuItem>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>この案件を削除しますか？</DialogTitle>
                      <DialogDescription>
                        関連する 3 件のタスクも削除されます。この操作は取り消せません。
                      </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                      <DialogCancel>キャンセル</DialogCancel>
                      <DialogAction
                        variant="negative"
                        onClick={() => toast.success("案件を削除しました")}
                      >
                        削除する
                      </DialogAction>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </MenuContent>
            </Menu>
          </div>
        </div>

        {state === "error" ? (
          <InlineMessage
            variant="negative"
            action={
              <Button variant="outline" size="sm" onClick={() => setState("success")}>
                再試行
              </Button>
            }
          >
            案件を読み込めませんでした。通信状態を確認して再試行してください。
          </InlineMessage>
        ) : null}

        <div className="grid gap-4 lg:grid-cols-[3fr_2fr]">
          <div className="flex flex-col gap-4">
            <Card>
              <CardHeader>
                <CardTitle>基本情報</CardTitle>
                <CardAction>
                  <Drawer>
                    <DrawerTrigger asChild>
                      <Button variant="ghost" size="sm">
                        履歴を見る
                      </Button>
                    </DrawerTrigger>
                    <DrawerContent>
                      <DrawerHeader>
                        <DrawerTitle>変更履歴</DrawerTitle>
                        <DrawerDescription>社内備品貸出アプリ 改修</DrawerDescription>
                      </DrawerHeader>
                      <DrawerBody>
                        <ol className="flex flex-col gap-3 text-2">
                          <li className="flex gap-3">
                            <span className="font-mono text-text-low">2026/09/21 13:05</span>
                            <span>状態を「確認待ち」から「進行中」に変更</span>
                          </li>
                          <li className="flex gap-3">
                            <span className="font-mono text-text-low">2026/09/19 10:20</span>
                            <span>金額を 1,000,000 から 1,200,000 に変更</span>
                          </li>
                        </ol>
                      </DrawerBody>
                    </DrawerContent>
                  </Drawer>
                </CardAction>
              </CardHeader>
              <CardContent>
                {state === "loading" ? (
                  <div className="flex flex-col gap-3">
                    <Skeleton className="w-2/5" />
                    <Skeleton className="w-3/5" />
                    <Skeleton className="w-1/3" />
                  </div>
                ) : (
                  <dl className="grid grid-cols-[96px_1fr] gap-x-3 gap-y-2 text-2">
                    <dt className="text-text-low">顧客</dt>
                    <dd>山田商事</dd>
                    <dt className="text-text-low">担当</dt>
                    <dd className="flex items-center gap-2">
                      <Avatar name="五十棲" fallback="五十" size="sm" />
                      五十棲
                    </dd>
                    <dt className="text-text-low">金額</dt>
                    <dd className="font-mono">1,200,000</dd>
                    <dt className="text-text-low">納期</dt>
                    <dd className="font-mono">2026/10/31</dd>
                    <dt className="text-text-low">メモ</dt>
                    <dd>
                      ユーザーインタビューは 9/25 に 3
                      名。備品の返却フローが分かりにくいという声が多い。
                    </dd>
                  </dl>
                )}
              </CardContent>
            </Card>

            <Tabs defaultValue="tasks">
              <TabsList aria-label="関連情報">
                <TabsTrigger value="tasks">タスク</TabsTrigger>
                <TabsTrigger value="files">ファイル</TabsTrigger>
              </TabsList>
              <TabsContent value="tasks">
                {state === "empty" ? (
                  <EmptyState
                    hideMascot
                    title="まだタスクがありません"
                    action={
                      <Button variant="outline" size="sm">
                        <Icon icon="add" size={3} />
                        タスクを追加する
                      </Button>
                    }
                  />
                ) : (
                  <Table density="xs">
                    <TableHeader>
                      <TableRow>
                        <TableHead>タスク</TableHead>
                        <TableHead>担当</TableHead>
                        <TableHead>期限</TableHead>
                        <TableHead>状態</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {TASKS.map((t) => (
                        <TableRow key={t.id}>
                          <TableCell>{t.name}</TableCell>
                          <TableCell>{t.owner}</TableCell>
                          <TableCell className="font-mono">{t.due}</TableCell>
                          <TableCell>
                            <StatusTag status={t.done ? "success" : "neutral"}>
                              {t.done ? "完了" : "未着手"}
                            </StatusTag>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </TabsContent>
              <TabsContent value="files">
                <EmptyState hideMascot title="ファイルはありません" />
              </TabsContent>
            </Tabs>
          </div>

          <div className="flex flex-col gap-4">
            <Card>
              <CardHeader>
                <CardTitle>顧客</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-3">
                  <Avatar name="山田商事" size="lg" />
                  <div className="flex flex-col">
                    <span className="font-bold">山田商事</span>
                    <span className="text-2 text-text-low">担当: 山田 太郎</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="ghost" size="sm">
                  顧客の詳細を見る
                </Button>
              </CardFooter>
            </Card>
            <InlineMessage variant="info" title="自動完了">
              この案件は 2026/10/31 の納期を過ぎると自動で「確認待ち」になります。
            </InlineMessage>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
