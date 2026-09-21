import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Button } from "../button";
import { IconButton } from "../icon-button";
import { Spinner } from "../spinner";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from ".";

const meta = {
  title: "UI/Card",
  component: Card,
  tags: ["autodocs"],
  parameters: { layout: "centered" },
} satisfies Meta<typeof Card>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Card className="w-80">
      <CardHeader>
        <CardTitle>基本情報</CardTitle>
        <CardDescription>案件の担当者と期限です</CardDescription>
      </CardHeader>
      <CardContent>
        <dl className="grid grid-cols-[6rem_1fr] gap-2 text-2">
          <dt className="text-text-low">取引先</dt>
          <dd className="text-text-high">山田商事</dd>
          <dt className="text-text-low">担当者</dt>
          <dd className="text-text-high">佐藤 花子</dd>
          <dt className="text-text-low">期限</dt>
          <dd className="text-text-high">2026年10月31日</dd>
        </dl>
      </CardContent>
    </Card>
  ),
};

export const WithAction: Story = {
  name: "ヘッダーの操作（CardAction）",
  render: () => (
    <Card className="w-80">
      <CardHeader>
        <CardTitle>山田商事</CardTitle>
        <CardDescription>見積書の作成をお待ちしています</CardDescription>
        <CardAction>
          <IconButton icon="more_vert" label="この案件の操作を開く" size="sm" />
        </CardAction>
      </CardHeader>
      <CardContent>
        <p className="text-2 text-text-low">
          前回の更新は 3 日前です。担当者に確認をお願いします。
        </p>
      </CardContent>
    </Card>
  ),
};

export const WithFooter: Story = {
  name: "フッター（CardFooter）",
  render: () => (
    <Card className="w-80">
      <CardHeader>
        <CardTitle>新しい案件</CardTitle>
        <CardDescription>入力した内容は下書きとして保存されます</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-2 text-text-low">案件名と取引先を入力すると登録できます。</p>
      </CardContent>
      <CardFooter>
        <Button variant="outline" size="sm">
          キャンセル
        </Button>
        <Button size="sm">案件を追加する</Button>
      </CardFooter>
    </Card>
  ),
};

export const ContentOnly: Story = {
  name: "本文だけ",
  render: () => (
    <Card className="w-80">
      <CardContent>
        <p className="text-3 text-text-high">今月の受注は 12 件です</p>
        <p className="text-2 text-text-low">先月より 3 件増えています</p>
      </CardContent>
    </Card>
  ),
};

export const Loading: Story = {
  name: "読み込み中",
  render: () => (
    <Card className="w-80">
      <CardHeader>
        <CardTitle>基本情報</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-center gap-2 py-8 text-2 text-text-low">
          <Spinner size="sm" label="案件を読み込み中" />
          案件を読み込んでいます
        </div>
      </CardContent>
    </Card>
  ),
};

export const CardList: Story = {
  name: "一覧に並べる",
  parameters: { layout: "padded" },
  render: () => (
    <ul className="grid gap-3 sm:grid-cols-2">
      {[
        { name: "山田商事", status: "見積書を作成中です" },
        { name: "鈴木工業", status: "契約書の確認をお待ちしています" },
        { name: "田中システム", status: "納品が完了しています" },
      ].map((item) => (
        <li key={item.name}>
          <Card>
            <CardHeader>
              <CardTitle>{item.name}</CardTitle>
              <CardAction>
                <IconButton icon="edit" label={`${item.name}を編集する`} size="sm" />
              </CardAction>
            </CardHeader>
            <CardContent>
              <p className="text-2 text-text-low">{item.status}</p>
            </CardContent>
          </Card>
        </li>
      ))}
    </ul>
  ),
};
