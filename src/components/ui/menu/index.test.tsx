import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { Icon } from "../icon";
import { IconButton } from "../icon-button";
import {
  Menu,
  MenuCheckboxItem,
  MenuContent,
  MenuItem,
  MenuLabel,
  MenuRadioGroup,
  MenuRadioItem,
  MenuSeparator,
  MenuShortcut,
  MenuTrigger,
} from ".";

// jsdom に無い API を補う（Radix DropdownMenu の Popper / RovingFocus が参照する）
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
vi.stubGlobal("DOMRect", class {});
window.HTMLElement.prototype.hasPointerCapture = () => false;
window.HTMLElement.prototype.setPointerCapture = () => {};
window.HTMLElement.prototype.releasePointerCapture = () => {};
window.HTMLElement.prototype.scrollIntoView = () => {};

function renderMenu(props?: {
  onEdit?: () => void;
  onRemove?: () => void;
  editDisabled?: boolean;
  triggerDisabled?: boolean;
}) {
  return render(
    <Menu>
      <MenuTrigger asChild>
        <IconButton icon="more_vert" label="案件の操作" disabled={props?.triggerDisabled} />
      </MenuTrigger>
      <MenuContent>
        <MenuLabel>社内備品貸出アプリ 改修</MenuLabel>
        <MenuItem disabled={props?.editDisabled} onSelect={props?.onEdit}>
          <Icon icon="edit" size={4} />
          編集する
          <MenuShortcut>⌘E</MenuShortcut>
        </MenuItem>
        <MenuSeparator />
        <MenuItem variant="negative" onSelect={props?.onRemove}>
          <Icon icon="delete" size={4} />
          削除する
        </MenuItem>
      </MenuContent>
    </Menu>,
  );
}

const openMenu = async () => {
  // Radix の DropdownMenuTrigger は pointerdown で開くため、キーボードで確実に開く
  await userEvent.tab();
  await userEvent.keyboard("{Enter}");
  return screen.findByRole("menu");
};

describe("Menu", () => {
  it("表示: 既定では閉じていて、トリガーから開くと項目・見出し・区切り線が出る", async () => {
    renderMenu();
    expect(screen.queryByRole("menu")).not.toBeInTheDocument();

    const menu = await openMenu();
    expect(menu).toHaveAttribute("data-slot", "menu-content");
    expect(screen.getByRole("menuitem", { name: /編集する/ })).toBeInTheDocument();
    expect(screen.getByRole("menuitem", { name: /削除する/ })).toHaveAttribute(
      "data-variant",
      "negative",
    );
    expect(screen.getByRole("separator")).toHaveAttribute("data-slot", "menu-separator");
    expect(menu).toHaveTextContent("社内備品貸出アプリ 改修");
    expect(menu).toHaveTextContent("⌘E");
  });

  it("表示: MenuCheckboxItem / MenuRadioItem は選択状態を aria で伝える", async () => {
    render(
      <Menu>
        <MenuTrigger asChild>
          <IconButton icon="more_vert" label="一覧の設定" />
        </MenuTrigger>
        <MenuContent>
          <MenuCheckboxItem checked>ステータス</MenuCheckboxItem>
          <MenuCheckboxItem checked={false}>納期</MenuCheckboxItem>
          <MenuRadioGroup value="updated">
            <MenuRadioItem value="updated">更新が新しい順</MenuRadioItem>
            <MenuRadioItem value="due">納期が近い順</MenuRadioItem>
          </MenuRadioGroup>
        </MenuContent>
      </Menu>,
    );
    await openMenu();
    expect(screen.getByRole("menuitemcheckbox", { name: "ステータス" })).toBeChecked();
    expect(screen.getByRole("menuitemcheckbox", { name: "納期" })).not.toBeChecked();
    expect(screen.getByRole("menuitemradio", { name: "更新が新しい順" })).toBeChecked();
    expect(screen.getByRole("menuitemradio", { name: "納期が近い順" })).not.toBeChecked();
  });

  it("操作: キーボード（Enter）で項目を選ぶと onSelect が呼ばれて閉じる", async () => {
    const onEdit = vi.fn();
    const onRemove = vi.fn();
    renderMenu({ onEdit, onRemove });
    await openMenu();

    // 開いた直後は最初の有効な項目（編集する）にフォーカスが当たっている
    expect(screen.getByRole("menuitem", { name: /編集する/ })).toHaveFocus();
    await userEvent.keyboard("{Enter}");
    expect(onEdit).toHaveBeenCalledTimes(1);
    expect(onRemove).not.toHaveBeenCalled();
    expect(screen.queryByRole("menu")).not.toBeInTheDocument();
  });

  it("操作: Escape で選ばずに閉じる", async () => {
    const onEdit = vi.fn();
    renderMenu({ onEdit });
    await openMenu();
    await userEvent.keyboard("{Escape}");
    expect(onEdit).not.toHaveBeenCalled();
    expect(screen.queryByRole("menu")).not.toBeInTheDocument();
  });

  it("disabled: 無効なトリガーは開かず、無効な項目は選べない", async () => {
    const onEdit = vi.fn();
    const { unmount } = renderMenu({ onEdit, triggerDisabled: true });
    const trigger = screen.getByRole("button", { name: "案件の操作" });
    expect(trigger).toBeDisabled();
    await userEvent.click(trigger);
    expect(screen.queryByRole("menu")).not.toBeInTheDocument();
    unmount();

    const onRemove = vi.fn();
    renderMenu({ onEdit, onRemove, editDisabled: true });
    await openMenu();
    const edit = screen.getByRole("menuitem", { name: /編集する/ });
    expect(edit).toHaveAttribute("data-disabled");
    expect(edit).toHaveAttribute("aria-disabled", "true");
    // 無効な項目は飛ばされ、最初の有効な項目（削除する）にフォーカスが当たる
    expect(screen.getByRole("menuitem", { name: "削除する" })).toHaveFocus();
    await userEvent.keyboard("{Enter}");
    expect(onEdit).not.toHaveBeenCalled();
    expect(onRemove).toHaveBeenCalledTimes(1);
  });

  it("アクセシブルネーム: トリガーは label の名前と aria-expanded を持ち、項目名はテキストから付く", async () => {
    renderMenu();
    const trigger = screen.getByRole("button", { name: "案件の操作" });
    expect(trigger).toHaveAttribute("aria-expanded", "false");

    await openMenu();
    expect(trigger).toHaveAttribute("aria-expanded", "true");
    expect(screen.getByRole("menuitem", { name: /^編集する/ })).toBeInTheDocument();
    expect(screen.getByRole("menuitem", { name: "削除する" })).toBeInTheDocument();
  });
});
