import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Button } from "../button";
import { Card, CardContent, CardHeader, CardTitle } from "../card";
import { Icon } from "../icon";
import { EmptyState } from ".";

const meta = {
  title: "UI/EmptyState",
  component: EmptyState,
  tags: ["autodocs"],
  args: {
    title: "まだ案件がありません",
    description: "最初の案件を追加すると、ここに一覧が表示されます。",
  },
  argTypes: { hideMascot: { control: "boolean" } },
  parameters: { layout: "padded" },
} satisfies Meta<typeof EmptyState>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { name: "初回 0 件（見出しと説明）" };

export const WithAction: Story = {
  name: "初回 0 件（追加アクション付き）",
  args: {
    title: "まだ案件がありません",
    description: "最初の案件を追加すると、ここに一覧が表示されます。",
    action: (
      <Button>
        <Icon icon="add" size={4} />
        案件を追加する
      </Button>
    ),
  },
};

export const NoSearchResult: Story = {
  name: "検索結果 0 件",
  args: {
    title: "条件に合う案件がありません",
    description: "「山田商事」で絞り込んだ結果は 0 件です。条件を変えてお試しください。",
    action: <Button variant="outline">条件をクリアする</Button>,
  },
};

export const HideMascot: Story = {
  name: "マスコットなし（狭い領域向け）",
  args: {
    hideMascot: true,
    title: "添付ファイルがありません",
    description: "案件「社内備品貸出アプリ 改修」にはまだファイルが添付されていません。",
    action: (
      <Button variant="outline" size="sm">
        <Icon icon="upload" size={4} />
        ファイルを追加する
      </Button>
    ),
  },
};

export const TitleOnly: Story = {
  name: "見出しだけ",
  args: { title: "通知はありません", description: undefined, hideMascot: true },
};

export const InCard: Story = {
  name: "カードの中に置く",
  render: () => (
    <Card className="w-96">
      <CardHeader>
        <CardTitle>山田商事の案件</CardTitle>
      </CardHeader>
      <CardContent>
        <EmptyState
          hideMascot
          title="条件に合う案件がありません"
          description="受注日 2026/09/21 以降の案件は登録されていません。"
          action={
            <Button variant="outline" size="sm">
              条件をクリアする
            </Button>
          }
        />
      </CardContent>
    </Card>
  ),
};
