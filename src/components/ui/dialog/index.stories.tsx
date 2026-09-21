import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { useState } from "react";
import { Button } from "../button";
import { IconButton } from "../icon-button";
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
} from ".";

const meta = {
  title: "UI/Dialog",
  component: Dialog,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "確認ダイアログ専用です。トリガーを押すと開きます。外側クリックや Esc では閉じず、必ずボタンで答えます。",
      },
    },
  },
} satisfies Meta<typeof Dialog>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  name: "破壊的な確認（negative）",
  render: () => (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="negative">削除する</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>この案件を削除しますか？</DialogTitle>
          <DialogDescription>
            「社内備品貸出アプリ 改修」に紐づく 8
            件のタスクも削除されます。この操作は取り消せません。
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogCancel>キャンセル</DialogCancel>
          <DialogAction variant="negative">削除する</DialogAction>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ),
};

export const Positive: Story = {
  name: "破壊的でない確認（primary）",
  render: () => (
    <Dialog>
      <DialogTrigger asChild>
        <Button>申請する</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>この案件を承認依頼に出しますか？</DialogTitle>
          <DialogDescription>
            承認者の五十棲さんに通知が届きます。依頼後は見積金額を編集できなくなります。
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogCancel>キャンセル</DialogCancel>
          <DialogAction>承認依頼を出す</DialogAction>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ),
};

export const IconTrigger: Story = {
  name: "行末のアイコンから開く",
  render: () => (
    <Dialog>
      <DialogTrigger asChild>
        <IconButton icon="delete" label="この案件を削除する" variant="negative" />
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>「請求書発行フロー 整備」を削除しますか？</DialogTitle>
          <DialogDescription>削除すると一覧から消え、元に戻せません。</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogCancel>キャンセル</DialogCancel>
          <DialogAction variant="negative">削除する</DialogAction>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ),
};

export const LongDescription: Story = {
  name: "影響範囲が長い説明",
  render: () => (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="negative">プロジェクトを閉じる</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>「社内備品貸出アプリ 改修」を終了しますか？</DialogTitle>
          <DialogDescription>
            終了すると、進行中のタスク 12 件が自動で「完了」になり、担当者 4
            名の稼働予定からも外れます。あわせて、外部共有リンクが無効になり、取引先からは閲覧できなくなります。この操作は取り消せません。
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogCancel>キャンセル</DialogCancel>
          <DialogAction variant="negative">終了する</DialogAction>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ),
};

export const CancelOutline: Story = {
  name: "キャンセルを outline にする",
  render: () => (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">下書きを破棄する</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>編集中の内容を破棄しますか？</DialogTitle>
          <DialogDescription>保存していない変更は失われます。</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogCancel variant="outline">編集に戻る</DialogCancel>
          <DialogAction variant="negative">破棄する</DialogAction>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ),
};

export const LoadingAction: Story = {
  name: "確定ボタンが処理中（loading）",
  render: () => (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="negative">削除する</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>この案件を削除しますか？</DialogTitle>
          <DialogDescription>削除の処理中はボタンを押せません。</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogCancel disabled>キャンセル</DialogCancel>
          <DialogAction variant="negative" loading>
            削除中
          </DialogAction>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ),
};

function ControlledExample() {
  const [open, setOpen] = useState(false);
  const [removed, setRemoved] = useState(false);
  return (
    <div className="flex flex-col items-start gap-3">
      <Button variant="negative" onClick={() => setOpen(true)} disabled={removed}>
        担当者を外す
      </Button>
      <p className="text-2 text-text-low">
        {removed ? "山田さんを担当から外しました。" : "担当者: 山田さん"}
      </p>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>山田さんを担当から外しますか？</DialogTitle>
            <DialogDescription>
              担当中の 3 件のタスクは未割り当てに戻ります。あとから割り当て直せます。
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogCancel>キャンセル</DialogCancel>
            <DialogAction variant="negative" onClick={() => setRemoved(true)}>
              外す
            </DialogAction>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export const Controlled: Story = {
  name: "制御（open / onOpenChange）",
  render: () => <ControlledExample />,
};
