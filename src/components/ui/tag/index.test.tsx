import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { StatusTag, Tag } from ".";

describe("Tag", () => {
  it("表示: children と data-slot / data-variant を描画し、既定は default", () => {
    const { rerender } = render(<Tag>読み取り専用</Tag>);
    const tag = screen.getByText("読み取り専用").parentElement;
    expect(tag).toHaveAttribute("data-slot", "tag");
    expect(tag).toHaveAttribute("data-variant", "default");

    rerender(<Tag variant="selected">状態: 進行中</Tag>);
    expect(screen.getByText("状態: 進行中").parentElement).toHaveAttribute(
      "data-variant",
      "selected",
    );
  });

  it("表示: onRemove を渡さなければ × ボタンを出さない", () => {
    render(<Tag>読み取り専用</Tag>);
    expect(screen.queryByRole("button")).toBeNull();
  });

  it("操作: × ボタンを押すと onRemove が呼ばれる", async () => {
    const onRemove = vi.fn();
    render(<Tag onRemove={onRemove}>状態: 進行中</Tag>);
    await userEvent.click(screen.getByRole("button", { name: "外す" }));
    expect(onRemove).toHaveBeenCalledTimes(1);
  });

  // disabled: Tag は操作部品ではなく無効状態を持たないため、この観点は該当しない
  // （押して何かをするなら Button、無効化が要るなら Button の disabled を使う）

  it("アクセシブルネーム: × ボタンの名前は removeLabel で上書きできる", () => {
    render(
      <Tag onRemove={() => undefined} removeLabel="取引先: 山田商事 を外す">
        取引先: 山田商事
      </Tag>,
    );
    expect(screen.getByRole("button", { name: "取引先: 山田商事 を外す" })).toBeInTheDocument();
  });
});

describe("StatusTag", () => {
  it("表示: children と data-status を描画し、既定は neutral", () => {
    const { rerender } = render(<StatusTag>下書き</StatusTag>);
    expect(screen.getByText("下書き")).toHaveAttribute("data-slot", "status-tag");
    expect(screen.getByText("下書き")).toHaveAttribute("data-status", "neutral");

    for (const status of ["info", "success", "warning", "negative"] as const) {
      rerender(<StatusTag status={status}>進行中</StatusTag>);
      expect(screen.getByText("進行中")).toHaveAttribute("data-status", status);
    }
  });

  // 操作 / disabled: StatusTag は表示専用で操作できないため、この 2 観点は該当しない

  it("アクセシブルネーム: 状態は色だけでなく文字で伝わる（§10.5）", () => {
    render(<StatusTag status="negative">差し戻し</StatusTag>);
    expect(screen.getByText("差し戻し")).toHaveTextContent("差し戻し");
  });
});
