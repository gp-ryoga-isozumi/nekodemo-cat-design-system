import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { useState } from "react";
import { Badge } from "../badge";
import { Button } from "../button";
import { Icon } from "../icon";
import { Tabs, TabsContent, TabsList, TabsTrigger } from ".";

const meta = {
  title: "UI/Tabs",
  component: Tabs,
  tags: ["autodocs"],
  args: { defaultValue: "overview" },
  argTypes: { orientation: { control: "radio", options: ["horizontal", "vertical"] } },
  parameters: { layout: "padded" },
} satisfies Meta<typeof Tabs>;

export default meta;
type Story = StoryObj<typeof meta>;

const panel =
  "rounded-container border border-border-low bg-surface-card p-4 text-2 text-text-high";

export const Horizontal: Story = {
  name: "横（既定）",
  render: (args) => (
    <Tabs {...args} className="max-w-2xl">
      <TabsList aria-label="案件の情報">
        <TabsTrigger value="overview">概要</TabsTrigger>
        <TabsTrigger value="tasks">タスク</TabsTrigger>
        <TabsTrigger value="files">添付</TabsTrigger>
      </TabsList>
      <TabsContent value="overview">
        <div className={panel}>
          <p>案件「社内備品貸出アプリ 改修」の概要です。</p>
          <p className="text-text-low">顧客: 山田商事 / 金額: 1,200,000 円 / 納期: 2026/09/21</p>
        </div>
      </TabsContent>
      <TabsContent value="tasks">
        <div className={panel}>未完了のタスクが 8 件あります。</div>
      </TabsContent>
      <TabsContent value="files">
        <div className={panel}>見積書と要件定義書が添付されています。</div>
      </TabsContent>
    </Tabs>
  ),
};

export const WithBadgeAndIcon: Story = {
  name: "アイコンと件数を付ける",
  render: () => (
    <Tabs defaultValue="tasks" className="max-w-2xl">
      <TabsList aria-label="案件の情報">
        <TabsTrigger value="overview">
          <Icon icon="description" size={4} />
          概要
        </TabsTrigger>
        <TabsTrigger value="tasks">
          <Icon icon="list" size={4} />
          タスク
          <Badge variant="neutral" count={8} />
        </TabsTrigger>
        <TabsTrigger value="history">
          <Icon icon="history" size={4} />
          履歴
        </TabsTrigger>
      </TabsList>
      <TabsContent value="overview">
        <div className={panel}>顧客は山田商事です。</div>
      </TabsContent>
      <TabsContent value="tasks">
        <div className={panel}>2026/09/21 が期限のタスクが 3 件あります。</div>
      </TabsContent>
      <TabsContent value="history">
        <div className={panel}>2026/09/21 に金額を 1,200,000 円へ変更しました。</div>
      </TabsContent>
    </Tabs>
  ),
};

export const Vertical: Story = {
  name: "縦（設定画面）",
  render: () => (
    <Tabs defaultValue="profile" orientation="vertical" className="max-w-3xl">
      <TabsList aria-label="設定の種類">
        <TabsTrigger value="profile">アカウント</TabsTrigger>
        <TabsTrigger value="notification">通知</TabsTrigger>
        <TabsTrigger value="members">メンバー</TabsTrigger>
      </TabsList>
      <TabsContent value="profile">
        <div className={panel}>表示名とメールアドレスを変更できます。</div>
      </TabsContent>
      <TabsContent value="notification">
        <div className={panel}>案件が更新されたときの通知を設定できます。</div>
      </TabsContent>
      <TabsContent value="members">
        <div className={panel}>山田商事の案件に参加しているメンバーは 4 人です。</div>
      </TabsContent>
    </Tabs>
  ),
};

export const Disabled: Story = {
  name: "選べないタブ（disabled）",
  render: () => (
    <Tabs defaultValue="overview" className="max-w-2xl">
      <TabsList aria-label="案件の情報">
        <TabsTrigger value="overview">概要</TabsTrigger>
        <TabsTrigger value="invoice" disabled>
          請求
        </TabsTrigger>
      </TabsList>
      <TabsContent value="overview">
        <div className={panel}>請求は案件が完了すると開けます。</div>
      </TabsContent>
      <TabsContent value="invoice">
        <div className={panel}>請求金額は 1,200,000 円です。</div>
      </TabsContent>
    </Tabs>
  ),
};

function ControlledTabs() {
  const [tab, setTab] = useState("overview");
  return (
    <div className="flex max-w-2xl flex-col gap-3">
      <Button variant="outline" size="sm" className="self-start" onClick={() => setTab("tasks")}>
        タスクを開く
      </Button>
      <Tabs value={tab} onValueChange={setTab}>
        <TabsList aria-label="案件の情報">
          <TabsTrigger value="overview">概要</TabsTrigger>
          <TabsTrigger value="tasks">タスク</TabsTrigger>
        </TabsList>
        <TabsContent value="overview">
          <div className={panel}>案件「社内備品貸出アプリ 改修」の概要です。</div>
        </TabsContent>
        <TabsContent value="tasks">
          <div className={panel}>未完了のタスクが 8 件あります。</div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

export const Controlled: Story = {
  name: "外から切り替える（value / onValueChange）",
  render: () => <ControlledTabs />,
};
