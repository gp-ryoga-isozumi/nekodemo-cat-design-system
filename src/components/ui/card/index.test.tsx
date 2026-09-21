import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from ".";

// disabled: Card は入力部品ではなく無効状態を持たないため省略する。

describe("Card", () => {
  it("表示: 各パーツが data-slot 付きで描画され、CardTitle は h3 になる", () => {
    const { container } = render(
      <Card>
        <CardHeader>
          <CardTitle>基本情報</CardTitle>
          <CardDescription>案件の担当者と期限です</CardDescription>
          <CardAction>
            <span>操作</span>
          </CardAction>
        </CardHeader>
        <CardContent>山田商事</CardContent>
        <CardFooter>フッター</CardFooter>
      </Card>,
    );

    for (const slot of [
      "card",
      "card-header",
      "card-title",
      "card-description",
      "card-action",
      "card-content",
      "card-footer",
    ]) {
      expect(container.querySelector(`[data-slot="${slot}"]`)).not.toBeNull();
    }
    expect(screen.getByRole("heading", { level: 3, name: "基本情報" })).toBeInTheDocument();
    expect(screen.getByText("案件の担当者と期限です").tagName).toBe("P");
    expect(screen.getByText("山田商事")).toBeInTheDocument();
  });

  it("表示: className と任意の属性を渡せる", () => {
    const { container } = render(<Card className="w-80" data-testid="project-card" />);
    const card = container.querySelector('[data-slot="card"]');
    expect(card).toHaveClass("w-80");
    expect(card).toHaveClass("bg-surface-card");
    expect(card).toHaveAttribute("data-testid", "project-card");
  });

  it("操作: 中に置いたボタンがクリックできる", async () => {
    const onClick = vi.fn();
    render(
      <Card>
        <CardFooter>
          <button type="button" onClick={onClick}>
            案件を追加する
          </button>
        </CardFooter>
      </Card>,
    );
    await userEvent.click(screen.getByRole("button", { name: "案件を追加する" }));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it("アクセシブルネーム: role と aria-labelledby で領域に名前を付けられる", () => {
    render(
      <Card aria-labelledby="card-title" role="region">
        <CardHeader>
          <CardTitle id="card-title">山田商事</CardTitle>
        </CardHeader>
        <CardContent>見積書の作成をお待ちしています</CardContent>
      </Card>,
    );
    expect(screen.getByRole("region", { name: "山田商事" })).toBeInTheDocument();
  });
});
