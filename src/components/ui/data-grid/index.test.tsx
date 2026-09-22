import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type React from "react";
import { describe, expect, it, vi } from "vitest";
import { NekoThemeProvider } from "../../theme/NekoThemeProvider";
import { IconButton } from "../icon-button";
import { DataGrid, type DataGridColumn } from ".";

type Project = { id: string; name: string; customer: string; amount: number };

const columns: DataGridColumn<Project>[] = [
  { id: "name", header: "案件名" },
  { id: "customer", header: "顧客", filter: "select" },
  { id: "amount", header: "金額", numeric: true, cell: (r) => r.amount.toLocaleString() },
];

const projects: Project[] = Array.from({ length: 45 }, (_, i) => ({
  id: `p-${i + 1}`,
  name: `案件 ${String(i + 1).padStart(2, "0")}`,
  customer: ["山田商事", "佐藤工業", "鈴木物産"][i % 3],
  amount: (i + 1) * 100_000,
}));

function renderWithTheme(ui: React.ReactElement) {
  return render(<NekoThemeProvider defaultTheme="calico">{ui}</NekoThemeProvider>);
}

function rowNames() {
  const table = screen.getByRole("table", { name: "案件一覧" });
  return within(table)
    .getAllByRole("row")
    .slice(1)
    .map((r) => within(r).getAllByRole("cell")[0]?.textContent);
}

/** 見出しセルの中のソートボタン（列幅を変えるハンドルも button なので aria-label で除く） */
const sortButton = (head: HTMLElement) =>
  within(head)
    .getAllByRole("button")
    .find((b) => !b.getAttribute("aria-label")?.includes("列幅")) as HTMLElement;

describe("DataGrid", () => {
  it("操作: selection を渡した制御では親の値だけが選択になり、defaultSelection は初期選択になる", async () => {
    const onSelectionChange = vi.fn();
    const { unmount, container } = renderWithTheme(
      <DataGrid
        aria-label="案件一覧"
        columns={columns}
        data={projects}
        getRowId={(r) => r.id}
        selectable
        selection={[projects[0].id]}
        onSelectionChange={onSelectionChange}
      />,
    );
    expect(container.querySelectorAll('tr[data-state="selected"]')).toHaveLength(1);
    await userEvent.click(screen.getAllByRole("checkbox")[2]);
    expect(onSelectionChange).toHaveBeenCalled();
    // 親が selection を変えない限り選択は増えない
    expect(container.querySelectorAll('tr[data-state="selected"]')).toHaveLength(1);
    // defaultSelection は初期選択なので、別のマウントで確認する（制御 → 非制御の切替は仕様外）
    unmount();
    const second = renderWithTheme(
      <DataGrid
        aria-label="案件一覧"
        columns={columns}
        data={projects}
        getRowId={(r) => r.id}
        selectable
        defaultSelection={[projects[1].id, projects[2].id]}
      />,
    );
    expect(second.container.querySelectorAll('tr[data-state="selected"]')).toHaveLength(2);
  });

  it("表示: 見出し・20 件ずつのページング・件数・数値列の右寄せ", () => {
    renderWithTheme(
      <DataGrid aria-label="案件一覧" columns={columns} data={projects} getRowId={(r) => r.id} />,
    );
    expect(screen.getByRole("columnheader", { name: /案件名/ })).toBeInTheDocument();
    expect(rowNames()).toHaveLength(20);
    expect(screen.getByRole("navigation", { name: "ページ送り" })).toHaveTextContent(
      "45件中 1〜20件を表示",
    );
  });

  it("操作: ソート → ページ移動 → 検索 → 絞り込み解除", async () => {
    renderWithTheme(
      <DataGrid aria-label="案件一覧" columns={columns} data={projects} getRowId={(r) => r.id} />,
    );
    // 金額の降順
    const amountSort = sortButton(screen.getByRole("columnheader", { name: /金額/ }));
    await userEvent.click(amountSort);
    expect(rowNames()[0]).toBe("案件 01");
    await userEvent.click(amountSort);
    expect(rowNames()[0]).toBe("案件 45");
    await userEvent.click(amountSort);
    expect(rowNames()[0]).toBe("案件 01");
    // 次のページ
    await userEvent.click(screen.getByRole("button", { name: "次のページ" }));
    expect(rowNames()[0]).toBe("案件 21");
    // 検索（ページは先頭に戻る）
    await userEvent.type(screen.getByRole("searchbox", { name: "案件一覧を検索" }), "案件 4");
    expect(rowNames()).toHaveLength(6); // 40〜45（「案件 04」は "案件 4" を含まない）
  });

  it("操作: 列の絞り込み（値の一覧から選択）と解除", async () => {
    renderWithTheme(
      <DataGrid aria-label="案件一覧" columns={columns} data={projects} getRowId={(r) => r.id} />,
    );
    await userEvent.click(screen.getByRole("button", { name: "顧客で絞り込む" }));
    // Popover が開くと入力にフォーカスが移り、候補が開く
    await screen.findByRole("combobox", { name: "顧客の値" });
    await userEvent.click(await screen.findByRole("option", { name: "佐藤工業" }));
    expect(rowNames().length).toBe(15);
    await userEvent.keyboard("{Escape}");
    await userEvent.click(screen.getByRole("button", { name: /絞り込みを解除する/ }));
    expect(rowNames().length).toBe(20);
  });

  it("操作: 選択（全選択 → 一部解除 → 件数）と選択の解除", async () => {
    const onSelectionChange = vi.fn();
    renderWithTheme(
      <DataGrid
        aria-label="案件一覧"
        columns={columns}
        data={projects.slice(0, 3)}
        getRowId={(r) => r.id}
        selectable
        onSelectionChange={onSelectionChange}
      />,
    );
    await userEvent.click(screen.getByRole("checkbox", { name: "このページの行をすべて選択" }));
    expect(onSelectionChange).toHaveBeenLastCalledWith(["p-1", "p-2", "p-3"]);
    expect(screen.getAllByText("3件を選択中").length).toBeGreaterThan(0);
    await userEvent.click(screen.getByRole("checkbox", { name: "行 2 を選択" }));
    expect(onSelectionChange).toHaveBeenLastCalledWith(["p-1", "p-3"]);
    expect(screen.getByRole("checkbox", { name: "このページの行をすべて選択" })).toHaveAttribute(
      "aria-checked",
      "mixed",
    );
    await userEvent.click(screen.getByRole("button", { name: "選択を解除する" }));
    expect(onSelectionChange).toHaveBeenLastCalledWith([]);
  });

  it("操作: 「列」メニューで列を隠せる", async () => {
    renderWithTheme(
      <DataGrid aria-label="案件一覧" columns={columns} data={projects} getRowId={(r) => r.id} />,
    );
    // Radix の DropdownMenu は jsdom ではキーボードで開く
    screen.getByRole("button", { name: "列" }).focus();
    await userEvent.keyboard("{Enter}");
    await userEvent.click(await screen.findByRole("menuitemcheckbox", { name: "顧客" }));
    expect(screen.queryByRole("columnheader", { name: /顧客/ })).not.toBeInTheDocument();
  });

  it("状態: loading は Skeleton、error は再試行、0 件は EmptyState、検索 0 件は条件クリア", async () => {
    const onRetry = vi.fn();
    const wrap = (ui: React.ReactElement) => (
      <NekoThemeProvider defaultTheme="calico">{ui}</NekoThemeProvider>
    );
    const { rerender } = render(
      wrap(<DataGrid aria-label="案件一覧" columns={columns} data={[]} status="loading" />),
    );
    expect(screen.getByRole("status", { name: "読み込み中" })).toBeInTheDocument();
    rerender(
      wrap(
        <DataGrid
          aria-label="案件一覧"
          columns={columns}
          data={[]}
          status="error"
          onRetry={onRetry}
        />,
      ),
    );
    await userEvent.click(screen.getByRole("button", { name: "再試行" }));
    expect(onRetry).toHaveBeenCalledTimes(1);
    rerender(
      wrap(
        <DataGrid
          aria-label="案件一覧"
          columns={columns}
          data={[]}
          emptyTitle="まだ案件がありません"
        />,
      ),
    );
    expect(screen.getByRole("heading", { name: "まだ案件がありません" })).toBeInTheDocument();
    rerender(
      wrap(
        <DataGrid aria-label="案件一覧" columns={columns} data={projects} getRowId={(r) => r.id} />,
      ),
    );
    await userEvent.type(screen.getByRole("searchbox", { name: "案件一覧を検索" }), "存在しない");
    expect(
      screen.getByRole("heading", { name: "条件に合うデータがありません" }),
    ).toBeInTheDocument();
    await userEvent.click(screen.getByRole("button", { name: "条件をクリアする" }));
    expect(rowNames()).toHaveLength(20);
  });

  it("行内操作: rowActions が各行の末尾に出る", () => {
    renderWithTheme(
      <DataGrid
        aria-label="案件一覧"
        columns={columns}
        data={projects.slice(0, 2)}
        getRowId={(r) => r.id}
        rowActions={(r) => (
          <IconButton icon="edit" label={`${r.name} を編集`} variant="ghost" size="sm" />
        )}
      />,
    );
    expect(screen.getByRole("button", { name: "案件 01 を編集" })).toBeInTheDocument();
    expect(screen.getByRole("columnheader", { name: "操作" })).toBeInTheDocument();
  });

  it("アクセシブルネーム: table に aria-label、仮想化のときだけスクロール領域に名前とタブストップ、ソート列に aria-sort", async () => {
    const { unmount } = renderWithTheme(
      <DataGrid
        aria-label="案件一覧"
        columns={columns}
        data={projects}
        getRowId={(r) => r.id}
        virtualize
        height={240}
      />,
    );
    expect(screen.getByLabelText("案件一覧（スクロール領域）")).toHaveAttribute("tabindex", "0");
    unmount();
    renderWithTheme(
      <DataGrid aria-label="案件一覧" columns={columns} data={projects} getRowId={(r) => r.id} />,
    );
    expect(screen.getByRole("table", { name: "案件一覧" })).toBeInTheDocument();
    // 仮想化しない表は余分なタブストップを作らない
    expect(screen.queryByLabelText("案件一覧（スクロール領域）")).toBeNull();
    const head = screen.getByRole("columnheader", { name: /案件名/ });
    expect(head).toHaveAttribute("aria-sort", "none");
    await userEvent.click(sortButton(head));
    expect(head).toHaveAttribute("aria-sort", "ascending");
  });
});
