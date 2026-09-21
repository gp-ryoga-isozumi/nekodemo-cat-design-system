import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { Pagination, pageItems } from ".";

describe("pageItems", () => {
  it("ページ数が少ないときは全ページを返す", () => {
    expect(pageItems(1, 5)).toEqual([1, 2, 3, 4, 5]);
    expect(pageItems(4, 7)).toEqual([1, 2, 3, 4, 5, 6, 7]);
  });

  it("先頭・末尾に寄っているときは片側だけ省略する", () => {
    expect(pageItems(1, 10)).toEqual([1, 2, null, 10]);
    expect(pageItems(10, 10)).toEqual([1, null, 9, 10]);
  });

  it("中ほどでは前後を省略し、siblings で数を増やせる", () => {
    expect(pageItems(5, 10)).toEqual([1, null, 4, 5, 6, null, 10]);
    expect(pageItems(5, 10, 2)).toEqual([1, null, 3, 4, 5, 6, 7, null, 10]);
  });
});

describe("Pagination", () => {
  it("表示: 件数の要約とページ番号を描画する", () => {
    const { container } = render(
      <Pagination page={1} total={120} pageSize={20} onPageChange={() => {}} />,
    );
    expect(container.querySelector('[data-slot="pagination"]')).toHaveTextContent(
      "120件中 1〜20件を表示",
    );
    expect(screen.getByRole("button", { name: "1 ページ目" })).toHaveAttribute(
      "aria-current",
      "page",
    );
    expect(screen.getByRole("button", { name: "6 ページ目" })).toBeInTheDocument();
  });

  it("表示: 1 ページに収まるときはページ番号を出さず、showSummary=false で要約も消える", () => {
    const { container, rerender } = render(
      <Pagination page={1} total={12} pageSize={20} onPageChange={() => {}} />,
    );
    expect(container.querySelector('[data-slot="pagination"]')).toHaveTextContent(
      "12件中 1〜12件を表示",
    );
    expect(screen.queryByRole("button", { name: "次のページ" })).toBeNull();

    rerender(
      <Pagination page={1} total={12} pageSize={20} showSummary={false} onPageChange={() => {}} />,
    );
    expect(container.querySelector('[data-slot="pagination"]')).toHaveTextContent("");
  });

  it("操作: ページ番号と前後のボタンで onPageChange が呼ばれる", async () => {
    const onPageChange = vi.fn();
    render(<Pagination page={3} total={120} pageSize={20} onPageChange={onPageChange} />);

    await userEvent.click(screen.getByRole("button", { name: "5 ページ目" }));
    expect(onPageChange).toHaveBeenLastCalledWith(5);

    await userEvent.click(screen.getByRole("button", { name: "次のページ" }));
    expect(onPageChange).toHaveBeenLastCalledWith(4);

    await userEvent.click(screen.getByRole("button", { name: "前のページ" }));
    expect(onPageChange).toHaveBeenLastCalledWith(2);
    expect(onPageChange).toHaveBeenCalledTimes(3);
  });

  it("disabled: 先頭では前へ、最終ページでは次へが押せない", async () => {
    const onPageChange = vi.fn();
    const { rerender } = render(
      <Pagination page={1} total={120} pageSize={20} onPageChange={onPageChange} />,
    );
    const previous = screen.getByRole("button", { name: "前のページ" });
    expect(previous).toBeDisabled();
    await userEvent.click(previous);
    expect(onPageChange).not.toHaveBeenCalled();

    rerender(<Pagination page={6} total={120} pageSize={20} onPageChange={onPageChange} />);
    const next = screen.getByRole("button", { name: "次のページ" });
    expect(next).toBeDisabled();
    await userEvent.click(next);
    expect(onPageChange).not.toHaveBeenCalled();
  });

  it("アクセシブルネーム: nav は「ページ送り」、各ボタンは「N ページ目」になる", () => {
    render(<Pagination page={50} total={2000} pageSize={20} onPageChange={() => {}} />);
    const nav = screen.getByRole("navigation", { name: "ページ送り" });
    expect(nav).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "50 ページ目" })).toHaveAttribute(
      "aria-current",
      "page",
    );
    expect(screen.getByRole("button", { name: "100 ページ目" })).toBeInTheDocument();
    // 省略記号は読み上げない
    expect(nav.querySelectorAll('[aria-hidden="true"]').length).toBeGreaterThan(0);
  });
});
