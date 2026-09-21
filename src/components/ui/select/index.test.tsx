import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from ".";

// jsdom に無い API を補う（Radix Select と Popper が参照する）
class ObserverMock {
  observe() {}
  unobserve() {}
  disconnect() {}
  takeRecords() {
    return [];
  }
}
vi.stubGlobal("ResizeObserver", ObserverMock);
vi.stubGlobal("IntersectionObserver", ObserverMock);
window.HTMLElement.prototype.hasPointerCapture = () => false;
window.HTMLElement.prototype.setPointerCapture = () => {};
window.HTMLElement.prototype.releasePointerCapture = () => {};
window.HTMLElement.prototype.scrollIntoView = () => {};

// jsdom は前のテストでフォーカスした要素を引きずり、次のテストの最初のフォーカス移動で
// window に blur が飛ぶ。Radix Select は window の blur で閉じるため、テストごとに外しておく
afterEach(() => {
  (document.activeElement as HTMLElement | null)?.blur();
});

function renderSelect(props?: {
  disabled?: boolean;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
}) {
  return render(
    <>
      <label htmlFor="owner">担当者</label>
      <Select
        defaultValue={props?.defaultValue}
        disabled={props?.disabled}
        onValueChange={props?.onValueChange}
      >
        <SelectTrigger id="owner">
          <SelectValue placeholder="選択してください" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="isozumi">五十棲</SelectItem>
          <SelectItem value="yamada">山田</SelectItem>
          <SelectItem value="sato" disabled>
            佐藤（休職中）
          </SelectItem>
        </SelectContent>
      </Select>
    </>,
  );
}

describe("Select", () => {
  it("表示: 未選択では placeholder、defaultValue があればその選択肢を出す", () => {
    const { unmount } = renderSelect();
    expect(screen.getByRole("combobox", { name: "担当者" })).toHaveTextContent("選択してください");
    unmount();

    renderSelect({ defaultValue: "yamada" });
    expect(screen.getByRole("combobox", { name: "担当者" })).toHaveTextContent("山田");
  });

  it("操作: クリックで開き、選ぶと onValueChange が呼ばれて表示が変わる", async () => {
    const onValueChange = vi.fn();
    renderSelect({ defaultValue: "isozumi", onValueChange });
    const trigger = screen.getByRole("combobox", { name: "担当者" });
    await userEvent.click(trigger);

    expect(await screen.findByRole("listbox")).toBeInTheDocument();
    expect(screen.getByRole("option", { name: "五十棲" })).toHaveAttribute("aria-selected", "true");

    await userEvent.click(screen.getByRole("option", { name: "山田" }));
    expect(onValueChange).toHaveBeenCalledWith("yamada");
    expect(trigger).toHaveTextContent("山田");
  });

  it("操作: キーボード（Enter で開き、矢印と Enter で選ぶ）でも変更できる", async () => {
    const onValueChange = vi.fn();
    renderSelect({ defaultValue: "isozumi", onValueChange });
    await userEvent.tab();
    expect(screen.getByRole("combobox", { name: "担当者" })).toHaveFocus();
    await userEvent.keyboard("{Enter}");
    expect(await screen.findByRole("listbox")).toBeInTheDocument();
    await userEvent.keyboard("{ArrowDown}{Enter}");
    expect(onValueChange).toHaveBeenCalledWith("yamada");
  });

  it("disabled: トリガーが無効なら開かない", async () => {
    const onValueChange = vi.fn();
    renderSelect({ disabled: true, onValueChange });
    const trigger = screen.getByRole("combobox", { name: "担当者" });
    expect(trigger).toBeDisabled();
    await userEvent.click(trigger);
    expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
    expect(onValueChange).not.toHaveBeenCalled();
  });

  it("disabled: 無効な選択肢は選べない", async () => {
    const onValueChange = vi.fn();
    renderSelect({ defaultValue: "isozumi", onValueChange });
    await userEvent.click(screen.getByRole("combobox", { name: "担当者" }));
    const disabledOption = await screen.findByRole("option", { name: "佐藤（休職中）" });
    expect(disabledOption).toHaveAttribute("data-disabled");
    await userEvent.click(disabledOption);
    expect(onValueChange).not.toHaveBeenCalled();
  });

  it("アクセシブルネーム: <label htmlFor> と aria-label のどちらでも combobox に名前が付く", () => {
    renderSelect();
    expect(screen.getByRole("combobox", { name: "担当者" })).toBeInTheDocument();

    render(
      <Select>
        <SelectTrigger aria-label="並び替え">
          <SelectValue placeholder="選択してください" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">すべての案件</SelectItem>
        </SelectContent>
      </Select>,
    );
    expect(screen.getByRole("combobox", { name: "並び替え" })).toBeInTheDocument();
  });
});
