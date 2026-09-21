import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { useState } from "react";
import { Button } from "../button";
import { IconButton } from "../icon-button";
import {
  Drawer,
  DrawerBody,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from ".";

const meta = {
  title: "UI/Drawer",
  component: Drawer,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "画面端から出るサイドパネルです。一覧を見ながら詳細を確認・編集する用途に使います。右（既定）／左／下から出せます。",
      },
    },
  },
} satisfies Meta<typeof Drawer>;

export default meta;
type Story = StoryObj<typeof meta>;

const detail = (
  <>
    <div className="flex flex-col gap-1">
      <p className="text-1 text-text-low">担当者</p>
      <p className="text-2 text-text-high">五十棲さん</p>
    </div>
    <div className="flex flex-col gap-1">
      <p className="text-1 text-text-low">納期</p>
      <p className="text-2 text-text-high">2026 年 5 月 20 日</p>
    </div>
    <div className="flex flex-col gap-1">
      <p className="text-1 text-text-low">進捗</p>
      <p className="text-2 text-text-high">タスク 12 件中 5 件が完了しています</p>
    </div>
  </>
);

export const Right: Story = {
  name: "右から出す（既定）",
  render: () => (
    <Drawer>
      <DrawerTrigger asChild>
        <Button variant="outline">詳細を見る</Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>社内備品貸出アプリ 改修</DrawerTitle>
          <DrawerDescription>案件番号 PRJ-2026-041</DrawerDescription>
        </DrawerHeader>
        <DrawerBody>{detail}</DrawerBody>
        <DrawerFooter>
          <DrawerClose asChild>
            <Button variant="ghost" size="sm">
              閉じる
            </Button>
          </DrawerClose>
          <Button size="sm">編集する</Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  ),
};

export const Left: Story = {
  name: "左から出す（絞り込み）",
  render: () => (
    <Drawer>
      <DrawerTrigger asChild>
        <Button variant="outline">絞り込む</Button>
      </DrawerTrigger>
      <DrawerContent side="left">
        <DrawerHeader>
          <DrawerTitle>案件を絞り込む</DrawerTitle>
          <DrawerDescription>条件は保存され、次回も同じ並びで表示されます。</DrawerDescription>
        </DrawerHeader>
        <DrawerBody>
          <p className="text-2 text-text-middle">ステータス、担当者、納期で絞り込めます。</p>
        </DrawerBody>
        <DrawerFooter>
          <DrawerClose asChild>
            <Button variant="ghost" size="sm">
              条件を消す
            </Button>
          </DrawerClose>
          <Button size="sm">絞り込む</Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  ),
};

export const Bottom: Story = {
  name: "下から出す（狭い画面向け）",
  render: () => (
    <Drawer>
      <DrawerTrigger asChild>
        <Button variant="outline">並び替える</Button>
      </DrawerTrigger>
      <DrawerContent side="bottom">
        <DrawerHeader>
          <DrawerTitle>案件を並び替える</DrawerTitle>
          <DrawerDescription>一覧の表示順を変更します。</DrawerDescription>
        </DrawerHeader>
        <DrawerBody>
          <p className="text-2 text-text-middle">
            更新が新しい順、納期が近い順、案件名の五十音順から選べます。
          </p>
        </DrawerBody>
        <DrawerFooter>
          <DrawerClose asChild>
            <Button variant="ghost" size="sm">
              キャンセル
            </Button>
          </DrawerClose>
          <Button size="sm">並び替える</Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  ),
};

export const IconTrigger: Story = {
  name: "行末のアイコンから開く",
  render: () => (
    <Drawer>
      <DrawerTrigger asChild>
        <IconButton icon="visibility" label="案件の詳細を見る" variant="outline" />
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>請求書発行フロー 整備</DrawerTitle>
          <DrawerDescription>案件番号 PRJ-2026-052</DrawerDescription>
        </DrawerHeader>
        <DrawerBody>{detail}</DrawerBody>
      </DrawerContent>
    </Drawer>
  ),
};

export const ScrollableBody: Story = {
  name: "本文が長いとき（本文だけスクロール）",
  render: () => (
    <Drawer>
      <DrawerTrigger asChild>
        <Button variant="outline">タスクを一覧する</Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>社内備品貸出アプリ 改修のタスク</DrawerTitle>
          <DrawerDescription>未完了のタスクを納期が近い順に並べています。</DrawerDescription>
        </DrawerHeader>
        <DrawerBody>
          {TASKS.map((task) => (
            <div key={task.name} className="flex flex-col gap-1">
              <p className="text-2 text-text-high">{task.name}</p>
              <p className="text-1 text-text-low">
                {task.owner}さん / 納期 {task.due}
              </p>
            </div>
          ))}
        </DrawerBody>
        <DrawerFooter>
          <DrawerClose asChild>
            <Button variant="ghost" size="sm">
              閉じる
            </Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  ),
};

const TASKS = [
  { name: "貸出台帳の項目を整理する", owner: "五十棲", due: "5 月 8 日" },
  { name: "返却リマインドの文面を作る", owner: "山田", due: "5 月 10 日" },
  { name: "在庫照合のバッチを組む", owner: "佐藤", due: "5 月 12 日" },
  { name: "管理画面の一覧を作り直す", owner: "鈴木", due: "5 月 15 日" },
  { name: "QR ラベルの印刷手順をまとめる", owner: "五十棲", due: "5 月 18 日" },
  { name: "利用マニュアルを更新する", owner: "山田", due: "5 月 20 日" },
  { name: "棚卸しの運用フローを決める", owner: "佐藤", due: "5 月 22 日" },
  { name: "通知メールの配信設定を見直す", owner: "鈴木", due: "5 月 25 日" },
];

export const WithoutCloseButton: Story = {
  name: "右上の閉じるボタンを出さない",
  render: () => (
    <Drawer>
      <DrawerTrigger asChild>
        <Button variant="outline">ヘルプを開く</Button>
      </DrawerTrigger>
      <DrawerContent showCloseButton={false}>
        <DrawerHeader className="pr-5">
          <DrawerTitle>案件の進め方</DrawerTitle>
          <DrawerDescription>フッターのボタンで閉じてください。</DrawerDescription>
        </DrawerHeader>
        <DrawerBody>
          <p className="text-2 text-text-middle">
            案件を作成したら、担当者と納期を決めてからタスクを登録します。
          </p>
        </DrawerBody>
        <DrawerFooter>
          <DrawerClose asChild>
            <Button variant="ghost" size="sm">
              閉じる
            </Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  ),
};

export const DisabledTrigger: Story = {
  name: "disabled（権限が無く開けない）",
  render: () => (
    <Drawer>
      <DrawerTrigger asChild>
        <Button variant="outline" disabled>
          詳細を見る
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>社内備品貸出アプリ 改修</DrawerTitle>
          <DrawerDescription>閲覧権限がありません。</DrawerDescription>
        </DrawerHeader>
        <DrawerBody>{detail}</DrawerBody>
      </DrawerContent>
    </Drawer>
  ),
};

function ControlledExample() {
  const [open, setOpen] = useState(false);
  return (
    <div className="flex flex-col items-start gap-3">
      <p className="text-2 text-text-middle">パネルは{open ? "開いています" : "閉じています"}。</p>
      <Button variant="outline" onClick={() => setOpen(true)}>
        詳細を見る
      </Button>
      <Drawer open={open} onOpenChange={setOpen}>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>社内備品貸出アプリ 改修</DrawerTitle>
            <DrawerDescription>案件番号 PRJ-2026-041</DrawerDescription>
          </DrawerHeader>
          <DrawerBody>{detail}</DrawerBody>
          <DrawerFooter>
            <Button variant="ghost" size="sm" onClick={() => setOpen(false)}>
              閉じる
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </div>
  );
}

export const Controlled: Story = {
  name: "制御（open / onOpenChange）",
  render: () => <ControlledExample />,
};
