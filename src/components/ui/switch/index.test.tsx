import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { Switch } from ".";

function renderSwitch(props?: {
  disabled?: boolean;
  defaultChecked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
}) {
  return render(
    <div>
      <Switch
        id="notify"
        defaultChecked={props?.defaultChecked}
        disabled={props?.disabled}
        onCheckedChange={props?.onCheckedChange}
      />
      <label htmlFor="notify">期限が近い案件を通知する</label>
    </div>,
  );
}

describe("Switch", () => {
  it("表示: role=switch で、checked / unchecked が data-state に出る", () => {
    renderSwitch({ defaultChecked: true });
    const control = screen.getByRole("switch", { name: "期限が近い案件を通知する" });
    expect(control).toBeChecked();
    expect(control).toHaveAttribute("data-state", "checked");
    expect(control).toHaveAttribute("data-slot", "switch");
  });

  it("操作: クリックと Space キーで ON / OFF が切り替わる", async () => {
    const onCheckedChange = vi.fn();
    renderSwitch({ onCheckedChange });
    const control = screen.getByRole("switch", { name: "期限が近い案件を通知する" });
    expect(control).not.toBeChecked();

    await userEvent.click(control);
    expect(onCheckedChange).toHaveBeenLastCalledWith(true);
    expect(control).toBeChecked();

    await userEvent.keyboard(" ");
    expect(onCheckedChange).toHaveBeenLastCalledWith(false);
    expect(control).not.toBeChecked();
  });

  it("disabled: クリックしても切り替わらない", async () => {
    const onCheckedChange = vi.fn();
    renderSwitch({ disabled: true, defaultChecked: true, onCheckedChange });
    const control = screen.getByRole("switch", { name: "期限が近い案件を通知する" });
    expect(control).toBeDisabled();
    await userEvent.click(control);
    expect(onCheckedChange).not.toHaveBeenCalled();
    expect(control).toBeChecked();
  });

  it("アクセシブルネーム: <label htmlFor> と aria-label のどちらでも名前が付く", () => {
    renderSwitch();
    expect(screen.getByRole("switch", { name: "期限が近い案件を通知する" })).toBeInTheDocument();

    render(<Switch aria-label="週次のまとめを送る" />);
    expect(screen.getByRole("switch", { name: "週次のまとめを送る" })).toBeInTheDocument();
  });
});
