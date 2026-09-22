import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Card, CardContent, CardHeader, CardTitle } from "../card";
import { Link } from "../link";
import { StatusTag } from "../tag";
import { DescriptionItem, DescriptionList } from ".";

const meta = {
  title: "UI/DescriptionList",
  component: DescriptionList,
  tags: ["autodocs"],
  args: {
    columns: 2,
    layout: "vertical",
    density: "md",
    children: (
      <>
        <DescriptionItem label="取引先">山田商事</DescriptionItem>
        <DescriptionItem label="担当者">佐藤 花子</DescriptionItem>
        <DescriptionItem label="受注金額">1,200,000 円</DescriptionItem>
        <DescriptionItem label="納品予定日">2026-10-31</DescriptionItem>
      </>
    ),
  },
  argTypes: {
    columns: { control: "radio", options: [1, 2, 3] },
    layout: { control: "radio", options: ["vertical", "horizontal"] },
    density: { control: "radio", options: ["sm", "md"] },
  },
  parameters: { layout: "padded" },
} satisfies Meta<typeof DescriptionList>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { name: "既定（2 列）" };

export const Columns: Story = {
  name: "列数（1 / 2 / 3）",
  render: () => (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-2">
        <p className="text-1 text-text-low">1 列（項目が少ない、値が長い）</p>
        <DescriptionList columns={1}>
          <DescriptionItem label="案件名">社内備品貸出アプリ 改修</DescriptionItem>
          <DescriptionItem label="取引先">山田商事</DescriptionItem>
        </DescriptionList>
      </div>
      <div className="flex flex-col gap-2">
        <p className="text-1 text-text-low">2 列（既定）</p>
        <DescriptionList columns={2}>
          <DescriptionItem label="案件名">社内備品貸出アプリ 改修</DescriptionItem>
          <DescriptionItem label="取引先">山田商事</DescriptionItem>
          <DescriptionItem label="受注金額">1,200,000 円</DescriptionItem>
          <DescriptionItem label="納品予定日">2026-10-31</DescriptionItem>
        </DescriptionList>
      </div>
      <div className="flex flex-col gap-2">
        <p className="text-1 text-text-low">3 列（短い値が多い）</p>
        <DescriptionList columns={3}>
          <DescriptionItem label="案件番号">PRJ-2026-0031</DescriptionItem>
          <DescriptionItem label="受注日">2026-09-22</DescriptionItem>
          <DescriptionItem label="納品予定日">2026-10-31</DescriptionItem>
          <DescriptionItem label="担当者">佐藤 花子</DescriptionItem>
          <DescriptionItem label="部署">第 2 営業部</DescriptionItem>
          <DescriptionItem label="受注金額">1,200,000 円</DescriptionItem>
        </DescriptionList>
      </div>
    </div>
  ),
};

export const Horizontal: Story = {
  name: "項目名を左に置く（horizontal）",
  render: () => (
    <DescriptionList layout="horizontal" columns={1} className="max-w-xl">
      <DescriptionItem label="案件名">社内備品貸出アプリ 改修</DescriptionItem>
      <DescriptionItem label="取引先">山田商事</DescriptionItem>
      <DescriptionItem label="担当者">佐藤 花子（第 2 営業部）</DescriptionItem>
      <DescriptionItem label="受注金額">1,200,000 円</DescriptionItem>
    </DescriptionList>
  ),
};

export const EmptyValues: Story = {
  name: "空の値（—）",
  render: () => (
    <DescriptionList columns={2}>
      <DescriptionItem label="取引先">山田商事</DescriptionItem>
      <DescriptionItem label="検収日">{""}</DescriptionItem>
      <DescriptionItem label="請求番号">{null}</DescriptionItem>
      <DescriptionItem label="次回の連絡日" emptyText="未定" />
    </DescriptionList>
  ),
};

export const Span: Story = {
  name: "全幅の項目（span）",
  render: () => (
    <DescriptionList columns={2}>
      <DescriptionItem label="取引先">山田商事</DescriptionItem>
      <DescriptionItem label="担当者">佐藤 花子</DescriptionItem>
      <DescriptionItem label="請求先住所" span>
        東京都千代田区丸の内 1-2-3 山田商事ビル 8 階 経理部
      </DescriptionItem>
      <DescriptionItem label="備考" span>
        検収は 2026-11-05 に実施します。請求書は月末締めで翌月 10 日までに送付してください。
      </DescriptionItem>
    </DescriptionList>
  ),
};

export const Density: Story = {
  name: "行間（density）",
  render: () => (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-2">
        <p className="text-1 text-text-low">md（既定）</p>
        <DescriptionList density="md" columns={2}>
          <DescriptionItem label="取引先">山田商事</DescriptionItem>
          <DescriptionItem label="担当者">佐藤 花子</DescriptionItem>
          <DescriptionItem label="受注金額">1,200,000 円</DescriptionItem>
          <DescriptionItem label="納品予定日">2026-10-31</DescriptionItem>
        </DescriptionList>
      </div>
      <div className="flex flex-col gap-2">
        <p className="text-1 text-text-low">sm（項目が多い確認画面）</p>
        <DescriptionList density="sm" columns={2}>
          <DescriptionItem label="取引先">山田商事</DescriptionItem>
          <DescriptionItem label="担当者">佐藤 花子</DescriptionItem>
          <DescriptionItem label="受注金額">1,200,000 円</DescriptionItem>
          <DescriptionItem label="納品予定日">2026-10-31</DescriptionItem>
        </DescriptionList>
      </div>
    </div>
  ),
};

export const InCard: Story = {
  name: "詳細画面での使い方",
  render: () => (
    <div className="flex max-w-3xl flex-col gap-4">
      <Card>
        <CardHeader>
          <CardTitle>基本情報</CardTitle>
        </CardHeader>
        <CardContent>
          <DescriptionList columns={2}>
            <DescriptionItem label="案件番号">PRJ-2026-0031</DescriptionItem>
            <DescriptionItem label="状態">
              <StatusTag status="info">進行中</StatusTag>
            </DescriptionItem>
            <DescriptionItem label="取引先">
              <Link href="#customer">山田商事</Link>
            </DescriptionItem>
            <DescriptionItem label="担当者">佐藤 花子</DescriptionItem>
            <DescriptionItem label="受注金額">1,200,000 円</DescriptionItem>
            <DescriptionItem label="納品予定日">2026-10-31</DescriptionItem>
            <DescriptionItem label="備考" span>
              検収は 2026-11-05 に実施します。
            </DescriptionItem>
          </DescriptionList>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>請求</CardTitle>
        </CardHeader>
        <CardContent>
          <DescriptionList columns={2} density="sm">
            <DescriptionItem label="請求番号">{null}</DescriptionItem>
            <DescriptionItem label="請求日">{null}</DescriptionItem>
            <DescriptionItem label="入金予定日">2026-11-30</DescriptionItem>
            <DescriptionItem label="支払条件">月末締め翌月末払い</DescriptionItem>
          </DescriptionList>
        </CardContent>
      </Card>
    </div>
  ),
};
