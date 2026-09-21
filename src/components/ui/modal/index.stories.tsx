import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { useState } from "react";
import { Button } from "../button";
import { IconButton } from "../icon-button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../select";
import {
  Modal,
  ModalBody,
  ModalClose,
  ModalContent,
  ModalDescription,
  ModalFooter,
  ModalHeader,
  ModalTitle,
  ModalTrigger,
} from ".";

const meta = {
  title: "UI/Modal",
  component: Modal,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "その場で完結する短い入力やコンテンツ用のモーダルです。トリガーを押すと開き、Esc と外側クリックで閉じます。確認だけなら Dialog を使います。",
      },
    },
  },
} satisfies Meta<typeof Modal>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  name: "既定（担当者を変更する）",
  render: () => (
    <Modal>
      <ModalTrigger asChild>
        <Button variant="outline">担当者を変更する</Button>
      </ModalTrigger>
      <ModalContent>
        <ModalHeader>
          <ModalTitle>担当者を変更する</ModalTitle>
          <ModalDescription>変更すると新しい担当者に通知が届きます。</ModalDescription>
        </ModalHeader>
        <ModalBody>
          <div className="flex flex-col gap-1">
            <label htmlFor="modal-owner" className="text-2 text-text-high">
              担当者
            </label>
            <Select defaultValue="isozumi">
              <SelectTrigger id="modal-owner">
                <SelectValue placeholder="選択してください" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="isozumi">五十棲</SelectItem>
                <SelectItem value="yamada">山田</SelectItem>
                <SelectItem value="sato">佐藤</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </ModalBody>
        <ModalFooter>
          <ModalClose asChild>
            <Button variant="ghost">キャンセル</Button>
          </ModalClose>
          <Button>変更する</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  ),
};

export const WithDescription: Story = {
  name: "説明文を添える",
  render: () => (
    <Modal>
      <ModalTrigger asChild>
        <Button variant="outline">案件を複製する</Button>
      </ModalTrigger>
      <ModalContent>
        <ModalHeader>
          <ModalTitle>案件を複製する</ModalTitle>
          <ModalDescription>
            「社内備品貸出アプリ 改修」の設定とタスク構成をそのまま新しい案件にコピーします。
          </ModalDescription>
        </ModalHeader>
        <ModalBody>
          <p className="text-2 text-text-middle">
            複製後の案件名は「社内備品貸出アプリ 改修（コピー）」になります。作成後に変更できます。
          </p>
        </ModalBody>
        <ModalFooter>
          <ModalClose asChild>
            <Button variant="ghost">キャンセル</Button>
          </ModalClose>
          <Button>複製する</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  ),
};

export const IconTrigger: Story = {
  name: "アイコンから開く",
  render: () => (
    <Modal>
      <ModalTrigger asChild>
        <IconButton icon="edit" label="案件名を編集する" variant="outline" />
      </ModalTrigger>
      <ModalContent>
        <ModalHeader>
          <ModalTitle>案件名を編集する</ModalTitle>
          <ModalDescription>案件名は一覧と取引先向けの共有ページに表示されます。</ModalDescription>
        </ModalHeader>
        <ModalBody>
          <p className="text-2 text-text-middle">
            現在の案件名は「請求書発行フロー 整備」です。取引先にも表示されます。
          </p>
        </ModalBody>
        <ModalFooter>
          <ModalClose asChild>
            <Button variant="ghost">キャンセル</Button>
          </ModalClose>
          <Button>保存する</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  ),
};

const HISTORY = [
  { date: "2026 年 4 月 1 日 10:30", text: "五十棲さんが案件を作成しました" },
  { date: "2026 年 4 月 3 日 09:15", text: "五十棲さんが見積金額を変更しました" },
  { date: "2026 年 4 月 6 日 14:00", text: "山田さんを担当者に追加しました" },
  { date: "2026 年 4 月 9 日 11:20", text: "佐藤さんがタスクを 8 件追加しました" },
  { date: "2026 年 4 月 12 日 16:45", text: "五十棲さんが納期を 5 月 20 日に変更しました" },
  { date: "2026 年 4 月 15 日 10:05", text: "山田さんが要件定義書を添付しました" },
  { date: "2026 年 4 月 18 日 13:30", text: "鈴木さんが見積を承認しました" },
  { date: "2026 年 4 月 21 日 09:50", text: "五十棲さんがステータスを進行中に変更しました" },
  { date: "2026 年 4 月 24 日 15:10", text: "山田さんがタスクを 3 件完了しました" },
  { date: "2026 年 4 月 27 日 17:00", text: "佐藤さんが外部共有リンクを発行しました" },
  { date: "2026 年 5 月 1 日 10:00", text: "五十棲さんが請求予定日を登録しました" },
  { date: "2026 年 5 月 7 日 11:40", text: "山田さんがコメントを追加しました" },
];

export const ScrollableBody: Story = {
  name: "本文が長いとき（本文だけスクロール）",
  render: () => (
    <Modal>
      <ModalTrigger asChild>
        <Button variant="outline">変更履歴を見る</Button>
      </ModalTrigger>
      <ModalContent>
        <ModalHeader>
          <ModalTitle>「社内備品貸出アプリ 改修」の変更履歴</ModalTitle>
          <ModalDescription>直近 12 件の更新を新しい順に表示しています。</ModalDescription>
        </ModalHeader>
        <ModalBody className="max-h-80">
          {HISTORY.map((entry) => (
            <div key={entry.date} className="flex flex-col gap-1">
              <p className="text-2 text-text-high">{entry.text}</p>
              <p className="text-1 text-text-low">{entry.date}</p>
            </div>
          ))}
        </ModalBody>
        <ModalFooter>
          <ModalClose asChild>
            <Button variant="ghost">閉じる</Button>
          </ModalClose>
        </ModalFooter>
      </ModalContent>
    </Modal>
  ),
};

export const WithoutCloseButton: Story = {
  name: "右上の閉じるボタンを出さない",
  render: () => (
    <Modal>
      <ModalTrigger asChild>
        <Button variant="outline">通知設定を開く</Button>
      </ModalTrigger>
      <ModalContent showCloseButton={false}>
        <ModalHeader className="pr-5">
          <ModalTitle>通知設定</ModalTitle>
          <ModalDescription>案件の更新をどこで受け取るかを選びます。</ModalDescription>
        </ModalHeader>
        <ModalBody>
          <p className="text-2 text-text-middle">
            現在はメールのみ受け取る設定です。フッターのボタンで閉じてください。
          </p>
        </ModalBody>
        <ModalFooter>
          <ModalClose asChild>
            <Button variant="ghost">キャンセル</Button>
          </ModalClose>
          <ModalClose asChild>
            <Button>設定を保存する</Button>
          </ModalClose>
        </ModalFooter>
      </ModalContent>
    </Modal>
  ),
};

export const HiddenTitle: Story = {
  name: "見出しを視覚的に隠す（sr-only）",
  render: () => (
    <Modal>
      <ModalTrigger asChild>
        <Button variant="outline">案件のサムネイルを見る</Button>
      </ModalTrigger>
      <ModalContent aria-describedby={undefined}>
        <ModalHeader className="border-b-0 pb-0">
          <ModalTitle className="sr-only">案件のサムネイル</ModalTitle>
        </ModalHeader>
        <ModalBody>
          <div className="flex h-40 items-center justify-center rounded-container bg-surface-well text-2 text-text-low">
            画像を表示する領域です
          </div>
        </ModalBody>
      </ModalContent>
    </Modal>
  ),
};

export const DisabledTrigger: Story = {
  name: "disabled（権限が無く開けない）",
  render: () => (
    <Modal>
      <ModalTrigger asChild>
        <Button variant="outline" disabled>
          担当者を変更する
        </Button>
      </ModalTrigger>
      <ModalContent>
        <ModalHeader>
          <ModalTitle>担当者を変更する</ModalTitle>
          <ModalDescription>案件の担当者を別のメンバーに引き継ぎます。</ModalDescription>
        </ModalHeader>
        <ModalBody>
          <p className="text-2 text-text-middle">閲覧権限では担当者を変更できません。</p>
        </ModalBody>
      </ModalContent>
    </Modal>
  ),
};

function ControlledExample() {
  const [open, setOpen] = useState(false);
  const [owner, setOwner] = useState("五十棲");
  return (
    <div className="flex flex-col items-start gap-3">
      <p className="text-2 text-text-middle">担当者: {owner}さん</p>
      <Button variant="outline" onClick={() => setOpen(true)}>
        担当者を変更する
      </Button>
      <Modal open={open} onOpenChange={setOpen}>
        <ModalContent>
          <ModalHeader>
            <ModalTitle>担当者を変更する</ModalTitle>
            <ModalDescription>変更すると新しい担当者に通知が届きます。</ModalDescription>
          </ModalHeader>
          <ModalBody>
            <p className="text-2 text-text-middle">山田さんに引き継ぎます。</p>
          </ModalBody>
          <ModalFooter>
            <ModalClose asChild>
              <Button variant="ghost">キャンセル</Button>
            </ModalClose>
            <Button
              onClick={() => {
                setOwner("山田");
                setOpen(false);
              }}
            >
              変更する
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
}

export const Controlled: Story = {
  name: "制御（open / onOpenChange）",
  render: () => <ControlledExample />,
};
