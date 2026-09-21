import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from ".";

// disabled: Table は入力部品ではなく無効状態を持たないため省略する（行内のボタン側の責務）。

function ProjectTable({ density }: { density?: "xs" | "sm" | "md" } = {}) {
  return (
    <Table density={density}>
      <TableCaption>案件一覧</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>案件名</TableHead>
          <TableHead>顧客</TableHead>
          <TableHead numeric>金額</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow>
          <TableCell>社内備品貸出アプリ 改修</TableCell>
          <TableCell>山田商事</TableCell>
          <TableCell numeric>1,200,000</TableCell>
        </TableRow>
      </TableBody>
      <TableFooter>
        <TableRow>
          <TableCell>合計</TableCell>
          <TableCell />
          <TableCell numeric>1,200,000</TableCell>
        </TableRow>
      </TableFooter>
    </Table>
  );
}

describe("Table", () => {
  it("表示: 見出し・本文・合計行を描画し、density が data-density に出る", () => {
    const { container } = render(<ProjectTable density="md" />);
    expect(screen.getByRole("table")).toHaveAttribute("data-density", "md");
    expect(screen.getAllByRole("columnheader")).toHaveLength(3);
    expect(screen.getByRole("cell", { name: "社内備品貸出アプリ 改修" })).toBeInTheDocument();
    expect(screen.getAllByRole("row")).toHaveLength(3); // 見出し + 本文 + 合計
    expect(container.querySelector('[data-slot="table-footer"]')).toBeInTheDocument();
  });

  it("表示: density の既定は sm で、numeric のセルは右寄せの等幅になる", () => {
    const { container } = render(<ProjectTable />);
    expect(screen.getByRole("table")).toHaveAttribute("data-density", "sm");
    const amount = screen.getAllByRole("cell").find((cell) => cell.textContent === "1,200,000");
    expect(amount).toHaveClass("text-right", "font-mono", "tabular-nums");
    expect(container.querySelector('[data-slot="table-caption"]')).toHaveTextContent("案件一覧");
  });

  it("操作: sort を渡した見出しはボタンになり、押すと onSort が呼ばれる", async () => {
    const onSort = vi.fn();
    render(
      <Table>
        <TableCaption>案件一覧</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead numeric sort="asc" onSort={onSort}>
              金額
            </TableHead>
            <TableHead sort="none">顧客</TableHead>
            <TableHead>納期</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell numeric>1,200,000</TableCell>
            <TableCell>山田商事</TableCell>
            <TableCell>2026/09/21</TableCell>
          </TableRow>
        </TableBody>
      </Table>,
    );

    const [amount, client, due] = screen.getAllByRole("columnheader");
    expect(amount).toHaveAttribute("aria-sort", "ascending");
    expect(client).toHaveAttribute("aria-sort", "none");
    expect(due).not.toHaveAttribute("aria-sort");

    await userEvent.click(screen.getByRole("button", { name: "金額" }));
    expect(onSort).toHaveBeenCalledTimes(1);
  });

  it("アクセシブルネーム: TableCaption が表の名前になり、行の選択状態が伝わる", () => {
    render(
      <Table>
        <TableCaption>2026/09/21 時点の案件一覧です。</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>案件名</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow aria-selected>
            <TableCell>社内備品貸出アプリ 改修</TableCell>
          </TableRow>
        </TableBody>
      </Table>,
    );
    expect(
      screen.getByRole("table", { name: "2026/09/21 時点の案件一覧です。" }),
    ).toBeInTheDocument();
    expect(screen.getByRole("row", { selected: true })).toHaveTextContent(
      "社内備品貸出アプリ 改修",
    );
  });
});
