import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Skeleton, SkeletonRows } from ".";

describe("Skeleton", () => {
  it("表示: data-slot と aria-hidden を付け、className を足せる", () => {
    const { container } = render(<Skeleton className="size-10 rounded-round" />);
    const skeleton = container.querySelector('[data-slot="skeleton"]');
    expect(skeleton).not.toBeNull();
    expect(skeleton).toHaveAttribute("aria-hidden", "true");
    expect(skeleton).toHaveClass("size-10", "rounded-round", "animate-pulse");
  });

  // 操作 / disabled: Skeleton は読み込み中の見た目だけで、操作も無効状態も持たないため該当しない

  it("アクセシブルネーム: Skeleton 単体は読み上げられない（aria-hidden）", () => {
    render(<Skeleton />);
    expect(screen.queryByRole("status")).toBeNull();
  });
});

describe("SkeletonRows", () => {
  it("表示: 既定で 5 行、rows で行数を変えられる", () => {
    const { container, rerender } = render(<SkeletonRows />);
    expect(container.querySelectorAll('[data-slot="skeleton"]')).toHaveLength(5);

    rerender(<SkeletonRows rows={3} />);
    expect(container.querySelectorAll('[data-slot="skeleton"]')).toHaveLength(3);
  });

  it("表示: data-slot と className を付けられる", () => {
    const { container } = render(<SkeletonRows rows={2} className="w-80" />);
    const rows = container.querySelector('[data-slot="skeleton-rows"]');
    expect(rows).not.toBeNull();
    expect(rows).toHaveClass("w-80");
  });

  // 操作 / disabled: SkeletonRows も表示専用のため該当しない

  it("アクセシブルネーム: role=status と「読み込み中」で読み込み中が伝わる", () => {
    render(<SkeletonRows rows={2} />);
    expect(screen.getByRole("status", { name: "読み込み中" })).toBeInTheDocument();
  });
});
