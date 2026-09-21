import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Button } from "../button";
import { Toaster, toast } from ".";

const meta = {
  title: "UI/Toast",
  component: Toaster,
  tags: ["autodocs"],
  parameters: { layout: "centered" },
} satisfies Meta<typeof Toaster>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Types: Story = {
  name: "種類（success / error / warning / info）",
  render: () => (
    <div className="flex flex-wrap items-center gap-2">
      <Toaster />
      <Button onClick={() => toast.success("案件「社内備品貸出アプリ 改修」を保存しました")}>
        保存する
      </Button>
      <Button variant="outline" onClick={() => toast.error("保存できませんでした")}>
        失敗を出す
      </Button>
      <Button
        variant="outline"
        onClick={() => toast.warning("見積金額が 1,200,000 円を超えています")}
      >
        注意を出す
      </Button>
      <Button variant="outline" onClick={() => toast.info("山田商事の情報を更新しました")}>
        お知らせを出す
      </Button>
    </div>
  ),
};

export const WithDescription: Story = {
  name: "説明付き",
  render: () => (
    <div className="flex flex-wrap items-center gap-2">
      <Toaster />
      <Button
        variant="negative"
        onClick={() =>
          toast.error("保存できませんでした", {
            description: "通信が切れています。再試行してください。",
          })
        }
      >
        エラーを出す
      </Button>
      <Button
        onClick={() =>
          toast.success("案件を登録しました", {
            description: "山田商事 / 1,200,000 円 / 納期 2026/09/21",
          })
        }
      >
        登録する
      </Button>
    </div>
  ),
};

export const WithAction: Story = {
  name: "操作付き（取り消す）",
  render: () => (
    <div className="flex flex-wrap items-center gap-2">
      <Toaster />
      <Button
        variant="negative"
        onClick={() =>
          toast.success("案件を削除しました", {
            action: {
              label: "取り消す",
              onClick: () => toast.info("削除を取り消しました"),
            },
          })
        }
      >
        削除する
      </Button>
    </div>
  ),
};

export const Loading: Story = {
  name: "処理中から結果へ（toast.promise）",
  render: () => (
    <div className="flex flex-wrap items-center gap-2">
      <Toaster />
      <Button
        onClick={() =>
          toast.promise(new Promise((resolve) => setTimeout(resolve, 1500)), {
            loading: "案件を保存しています",
            success: "案件「社内備品貸出アプリ 改修」を保存しました",
            error: "保存できませんでした",
          })
        }
      >
        保存する
      </Button>
    </div>
  ),
};

export const Position: Story = {
  name: "位置と表示時間を変える",
  render: () => (
    <div className="flex flex-wrap items-center gap-2">
      <Toaster position="bottom-center" duration={6000} />
      <Button onClick={() => toast.success("案件を保存しました")}>保存する</Button>
    </div>
  ),
};
