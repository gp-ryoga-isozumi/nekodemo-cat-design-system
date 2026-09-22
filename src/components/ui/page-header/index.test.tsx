import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { Button } from "../button";
import { StatusTag } from "../tag";
import { PageHeader } from ".";

describe("PageHeader", () => {
  it("表示: header に h1 の見出しと 1 行の説明が出る", () => {
    const { container } = render(
      <PageHeader title="案件一覧" description="担当している案件を表示しています。" />,
    );
    const header = container.querySelector('[data-slot="page-header"]');
    expect(header).toBeInTheDocument();
    expect(header?.tagName).toBe("HEADER");

    const heading = screen.getByRole("heading", { level: 1, name: "案件一覧" });
    expect(heading.tagName).toBe("H1");
    expect(heading).toHaveClass("text-6");
    expect(screen.getByText("担当している案件を表示しています。")).toBeInTheDocument();
  });

  it("表示: breadcrumb → 見出し＋meta → 説明 の順に並び、actions は専用の入れ物に入る", () => {
    const { container } = render(
      <PageHeader
        breadcrumb={<nav aria-label="パンくずリスト">案件 / 社内備品貸出アプリ 改修</nav>}
        title="社内備品貸出アプリ 改修"
        meta={<StatusTag status="info">進行中</StatusTag>}
        description="山田商事 / 更新 2026-09-22"
        actions={<Button variant="outline">編集する</Button>}
      />,
    );
    const header = container.querySelector('[data-slot="page-header"]');
    expect(header?.firstElementChild?.tagName).toBe("NAV");

    expect(screen.getByRole("navigation", { name: "パンくずリスト" })).toBeInTheDocument();
    expect(screen.getByText("進行中")).toBeInTheDocument();
    expect(screen.getByText("山田商事 / 更新 2026-09-22")).toBeInTheDocument();

    const actions = container.querySelector('[data-slot="page-header-actions"]');
    expect(actions).toBeInTheDocument();
    expect(within(actions as HTMLElement).getByRole("button", { name: "編集する" })).toBeVisible();
  });

  it("表示: description と actions を渡さないと、その要素自体が出ない", () => {
    const { container } = render(<PageHeader title="設定" />);
    expect(screen.getByRole("heading", { level: 1, name: "設定" })).toBeInTheDocument();
    expect(container.querySelector("p")).not.toBeInTheDocument();
    expect(container.querySelector('[data-slot="page-header-actions"]')).not.toBeInTheDocument();
    expect(screen.queryAllByRole("button")).toHaveLength(0);
  });

  it("操作: actions に置いたボタンをそのまま押せる", async () => {
    const onClick = vi.fn();
    render(
      <PageHeader
        title="案件一覧"
        actions={
          <>
            <Button variant="outline">絞り込む</Button>
            <Button onClick={onClick}>案件を追加する</Button>
          </>
        }
      />,
    );
    await userEvent.click(screen.getByRole("button", { name: "案件を追加する" }));
    expect(onClick).toHaveBeenCalledTimes(1);
    expect(screen.getAllByRole("button")).toHaveLength(2);
  });

  it("disabled: actions の無効なボタンは押せない", async () => {
    const onClick = vi.fn();
    render(
      <PageHeader
        title="案件の作成"
        actions={
          <Button disabled onClick={onClick}>
            保存する
          </Button>
        }
      />,
    );
    const save = screen.getByRole("button", { name: "保存する" });
    expect(save).toBeDisabled();
    await userEvent.click(save);
    expect(onClick).not.toHaveBeenCalled();
  });

  it("アクセシブルネーム: 見出しは h1 で、header は banner ランドマークになる", () => {
    render(<PageHeader title="案件一覧" className="border-border-low border-b" id="page-header" />);
    const banner = screen.getByRole("banner");
    expect(banner).toHaveAttribute("id", "page-header");
    expect(banner).toHaveClass("border-b");
    expect(within(banner).getByRole("heading", { level: 1 })).toHaveAccessibleName("案件一覧");
  });
});
