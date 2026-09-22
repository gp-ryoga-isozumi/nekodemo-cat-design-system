import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "../breadcrumb";
import { Button } from "../button";
import { StatusTag } from "../tag";
import { PageHeader } from ".";

const meta = {
  title: "UI/PageHeader",
  component: PageHeader,
  tags: ["autodocs"],
  args: {
    title: "案件一覧",
    description: "担当している案件を表示しています。",
    actions: <Button>案件を追加する</Button>,
  },
  argTypes: {
    title: { control: "text" },
    description: { control: "text" },
    meta: { control: false },
    actions: { control: false },
    breadcrumb: { control: false },
  },
  parameters: { layout: "padded" },
} satisfies Meta<typeof PageHeader>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { name: "一覧画面（既定）" };

export const TitleOnly: Story = {
  name: "見出しだけ",
  args: { title: "設定", description: undefined, actions: undefined },
};

export const WithMeta: Story = {
  name: "状態を添える（meta）",
  args: {
    title: "社内備品貸出アプリ 改修",
    description: "山田商事 / 更新 2026-09-22",
    meta: <StatusTag status="info">進行中</StatusTag>,
    actions: undefined,
  },
};

export const Detail: Story = {
  name: "詳細画面（breadcrumb + meta + actions）",
  render: () => (
    <PageHeader
      breadcrumb={
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="#home">ホーム</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href="#projects">案件</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>社内備品貸出アプリ 改修</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      }
      title="社内備品貸出アプリ 改修"
      meta={<StatusTag status="info">進行中</StatusTag>}
      description="山田商事 / 受注金額 1,200,000 円 / 納品予定日 2026-10-31"
      actions={
        <>
          <Button variant="outline">編集する</Button>
          <Button variant="secondary">複製する</Button>
        </>
      }
    />
  ),
};

export const Create: Story = {
  name: "作成 / 編集画面（操作はフッターに置く）",
  args: {
    title: "案件の作成",
    description: "必須の項目を入力してから保存してください。",
    actions: undefined,
  },
};

export const LongTitle: Story = {
  name: "長い見出しと複数の状態",
  args: {
    title: "社内備品貸出アプリ 改修（第 2 フェーズ：貸出履歴の可視化と棚卸しの自動化）",
    description: "山田商事 第 2 営業部 / 担当 佐藤 花子",
    meta: (
      <>
        <StatusTag status="info">進行中</StatusTag>
        <StatusTag status="warning">確認待ち</StatusTag>
      </>
    ),
    actions: <Button variant="outline">編集する</Button>,
  },
};

export const Screens: Story = {
  name: "4 つの画面の型",
  render: () => (
    // banner ランドマークが重複しないよう、比較用のこのストーリーだけ section で包む
    <div className="flex flex-col gap-10">
      <section>
        <PageHeader
          title="案件一覧"
          description="担当している案件を表示しています。"
          actions={<Button>案件を追加する</Button>}
        />
      </section>
      <section>
        <PageHeader
          title="社内備品貸出アプリ 改修"
          meta={<StatusTag status="info">進行中</StatusTag>}
          description="山田商事 / 更新 2026-09-22"
          actions={<Button variant="outline">編集する</Button>}
        />
      </section>
      <section>
        <PageHeader title="案件の作成" description="必須の項目を入力してから保存してください。" />
      </section>
      <section>
        <PageHeader title="設定" description="通知と表示の設定を変更できます。" />
      </section>
    </div>
  ),
};
