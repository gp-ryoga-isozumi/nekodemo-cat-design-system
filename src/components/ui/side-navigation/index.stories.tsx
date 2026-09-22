import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { useState } from "react";
import { Mascot } from "../../mascot";
import { Button } from "../button";
import { SideNavGroup, SideNavItem, SideNavigation } from ".";

const meta = {
  title: "UI/SideNavigation",
  component: SideNavigation,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "画面左の主ナビです。幅 240px、折りたたむと 64px になります。現在地には active を付けます。",
      },
    },
  },
  // children は各ストーリーの render で組み立てるため、既定は空にしておく
  args: { children: null },
  decorators: [
    (Story) => (
      <div className="flex h-[480px]">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof SideNavigation>;

export default meta;
type Story = StoryObj<typeof meta>;

const logo = (
  <>
    <Mascot theme="calico" size={32} />
    <span>案件管理</span>
  </>
);

export const Default: Story = {
  name: "既定（現在地は案件）",
  render: () => (
    <SideNavigation logo={logo}>
      <SideNavItem icon="home" href="#dashboard">
        ダッシュボード
      </SideNavItem>
      <SideNavItem icon="folder" href="#projects" active>
        案件
      </SideNavItem>
      <SideNavItem icon="assignment" href="#tasks">
        タスク
      </SideNavItem>
      <SideNavItem icon="group" href="#members">
        メンバー
      </SideNavItem>
    </SideNavigation>
  ),
};

export const WithGroups: Story = {
  name: "グループで分ける",
  render: () => (
    <SideNavigation logo={logo}>
      <SideNavItem icon="home" href="#dashboard" active>
        ダッシュボード
      </SideNavItem>
      <SideNavGroup label="案件">
        <SideNavItem icon="folder" href="#projects">
          案件一覧
        </SideNavItem>
        <SideNavItem icon="assignment" href="#tasks">
          タスク
        </SideNavItem>
        <SideNavItem icon="archive" href="#archived">
          完了した案件
        </SideNavItem>
      </SideNavGroup>
      <SideNavGroup label="管理">
        <SideNavItem icon="group" href="#members">
          メンバー
        </SideNavItem>
        <SideNavItem icon="settings" href="#settings">
          設定
        </SideNavItem>
      </SideNavGroup>
    </SideNavigation>
  ),
};

export const WithBadge: Story = {
  name: "件数バッジを付ける",
  render: () => (
    <SideNavigation logo={logo}>
      <SideNavItem icon="home" href="#dashboard">
        ダッシュボード
      </SideNavItem>
      <SideNavItem icon="folder" href="#projects" active badge={3}>
        案件
      </SideNavItem>
      <SideNavItem icon="notifications" href="#notifications" badge={128} badgeVariant="neutral">
        通知
      </SideNavItem>
    </SideNavigation>
  ),
};

export const Collapsed: Story = {
  name: "折りたたんだ状態（defaultCollapsed）",
  render: () => (
    <SideNavigation logo={<Mascot theme="calico" size={32} />} defaultCollapsed>
      <SideNavItem icon="home" href="#dashboard">
        ダッシュボード
      </SideNavItem>
      <SideNavItem icon="folder" href="#projects" active>
        案件
      </SideNavItem>
      <SideNavGroup label="管理">
        <SideNavItem icon="settings" href="#settings">
          設定
        </SideNavItem>
      </SideNavGroup>
    </SideNavigation>
  ),
};

export const NotCollapsible: Story = {
  name: "折りたたみボタンを出さない（collapsible={false}）",
  render: () => (
    <SideNavigation logo={logo} collapsible={false}>
      <SideNavItem icon="home" href="#dashboard" active>
        ダッシュボード
      </SideNavItem>
      <SideNavItem icon="folder" href="#projects">
        案件
      </SideNavItem>
    </SideNavigation>
  ),
};

export const WithoutLogo: Story = {
  name: "ロゴ枠なし",
  render: () => (
    <SideNavigation>
      <SideNavItem icon="home" href="#dashboard" active>
        ダッシュボード
      </SideNavItem>
      <SideNavItem icon="folder" href="#projects">
        案件
      </SideNavItem>
      <SideNavItem icon="settings" href="#settings">
        設定
      </SideNavItem>
    </SideNavigation>
  ),
};

export const AsChild: Story = {
  name: "asChild（ルーティングの Link を包む）",
  render: () => (
    <SideNavigation logo={logo}>
      <SideNavItem icon="home" asChild>
        {/* 実際のアプリでは Next.js の <Link href="/"> を入れます */}
        <a href="#dashboard">ダッシュボード</a>
      </SideNavItem>
      <SideNavItem icon="folder" active asChild>
        <a href="#projects">案件</a>
      </SideNavItem>
    </SideNavigation>
  ),
};

function ControlledExample() {
  const [collapsed, setCollapsed] = useState(false);
  return (
    <>
      <SideNavigation
        logo={collapsed ? <Mascot theme="calico" size={32} /> : logo}
        collapsed={collapsed}
        onCollapsedChange={setCollapsed}
      >
        <SideNavItem icon="home" href="#dashboard">
          ダッシュボード
        </SideNavItem>
        <SideNavItem icon="folder" href="#projects" active badge={3}>
          案件
        </SideNavItem>
        <SideNavItem icon="settings" href="#settings">
          設定
        </SideNavItem>
      </SideNavigation>
      <div className="flex flex-col items-start gap-3 p-5">
        <p className="text-2 text-text-middle">
          ナビは{collapsed ? "折りたたまれています" : "開いています"}。
        </p>
        <Button variant="outline" size="sm" onClick={() => setCollapsed(!collapsed)}>
          {collapsed ? "ナビを開く" : "ナビを折りたたむ"}
        </Button>
      </div>
    </>
  );
}

export const Controlled: Story = {
  name: "制御（collapsed / onCollapsedChange）",
  render: () => <ControlledExample />,
};

export const InLayout: Story = {
  name: "画面に置いたところ",
  render: () => (
    <>
      <SideNavigation logo={logo}>
        <SideNavItem icon="home" href="#dashboard">
          ダッシュボード
        </SideNavItem>
        <SideNavItem icon="folder" href="#projects" active badge={3}>
          案件
        </SideNavItem>
        <SideNavGroup label="管理">
          <SideNavItem icon="settings" href="#settings">
            設定
          </SideNavItem>
        </SideNavGroup>
      </SideNavigation>
      <main className="flex-1 bg-surface-well p-6">
        <h1 className="text-5 font-bold text-text-high">案件</h1>
        <p className="pt-2 text-2 text-text-middle">
          社内備品貸出アプリ 改修 ／ 請求書発行フロー 整備 など 24 件を表示しています。
        </p>
      </main>
    </>
  ),
};
