import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { SearchCombobox } from ".";

const customers = [
  { id: "c1", name: "山田商事", area: "関東" },
  { id: "c2", name: "佐藤工業", area: "関西" },
  { id: "c3", name: "鈴木物産", area: "関東" },
];

describe("SearchCombobox", () => {
  it("表示: ラベルが combobox のアクセシブルネームになり、入力すると候補が絞り込まれる", async () => {
    render(<SearchCombobox label="顧客" options={customers} getOptionLabel={(c) => c.name} />);
    const input = screen.getByRole("combobox", { name: "顧客" });
    expect(input).toHaveAttribute("aria-expanded", "false");
    await userEvent.type(input, "山");
    const listbox = screen.getByRole("listbox");
    expect(within(listbox).getAllByRole("option")).toHaveLength(1);
    expect(within(listbox).getByRole("option", { name: /山田商事/ })).toBeInTheDocument();
  });

  it("操作: 候補を選ぶと onChange が呼ばれ、クリアで戻る", async () => {
    const onChange = vi.fn();
    render(
      <SearchCombobox
        label="顧客"
        options={customers}
        getOptionLabel={(c) => c.name}
        onChange={onChange}
      />,
    );
    const input = screen.getByRole("combobox", { name: "顧客" });
    await userEvent.click(input);
    await userEvent.click(screen.getByRole("option", { name: /佐藤工業/ }));
    expect(onChange).toHaveBeenLastCalledWith(customers[1], "selectOption");
    expect(input).toHaveValue("佐藤工業");
    await userEvent.click(screen.getByRole("button", { name: "クリア" }));
    expect(onChange).toHaveBeenLastCalledWith(null, "clear");
    expect(input).toHaveValue("");
  });

  it("操作: multiple は選択済みを Tag で出し、× で外せる。freeSolo は Enter で追加できる", async () => {
    const onChange = vi.fn();
    render(
      <SearchCombobox
        label="タグ"
        multiple
        freeSolo
        options={["急ぎ", "要確認"]}
        onChange={onChange}
      />,
    );
    const input = screen.getByRole("combobox", { name: "タグ" });
    await userEvent.click(input);
    await userEvent.click(screen.getByRole("option", { name: "急ぎ" }));
    expect(onChange).toHaveBeenLastCalledWith(["急ぎ"], "selectOption");
    await userEvent.type(input, "社内{Enter}");
    expect(onChange).toHaveBeenLastCalledWith(["急ぎ", "社内"], "createOption");
    await userEvent.click(screen.getByRole("button", { name: "急ぎ を外す" }));
    expect(onChange).toHaveBeenLastCalledWith(["社内"], "removeOption");
  });

  it("表示: 候補が無いときの文言と、グループ見出し", async () => {
    render(
      <SearchCombobox
        label="顧客"
        options={customers}
        getOptionLabel={(c) => c.name}
        groupBy={(c) => c.area}
        emptyText="該当なし"
      />,
    );
    const input = screen.getByRole("combobox", { name: "顧客" });
    await userEvent.click(input);
    expect(screen.getByRole("group", { name: "関東" })).toBeInTheDocument();
    expect(screen.getByRole("group", { name: "関西" })).toBeInTheDocument();
    await userEvent.type(input, "存在しない");
    expect(screen.getByText("該当なし")).toBeInTheDocument();
  });

  it("disabled: 入力できず、クリアも出ない", async () => {
    render(
      <SearchCombobox label="顧客" options={customers} getOptionLabel={(c) => c.name} disabled />,
    );
    const input = screen.getByRole("combobox", { name: "顧客" });
    expect(input).toBeDisabled();
    expect(screen.queryByRole("button", { name: "クリア" })).not.toBeInTheDocument();
  });
});
