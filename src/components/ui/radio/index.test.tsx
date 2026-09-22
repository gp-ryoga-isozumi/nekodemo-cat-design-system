import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { RadioGroup, RadioItem } from ".";

function renderRadio(props?: {
  disabled?: boolean;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
}) {
  return render(
    <RadioGroup
      aria-label="公開範囲"
      defaultValue={props?.defaultValue}
      disabled={props?.disabled}
      onValueChange={props?.onValueChange}
    >
      <div>
        <RadioItem value="internal" id="scope-internal" />
        <label htmlFor="scope-internal">社内のみ</label>
      </div>
      <div>
        <RadioItem value="partner" id="scope-partner" />
        <label htmlFor="scope-partner">取引先にも公開する</label>
      </div>
      <div>
        <RadioItem value="public" id="scope-public" disabled />
        <label htmlFor="scope-public">全体に公開する</label>
      </div>
    </RadioGroup>,
  );
}

describe("Radio", () => {
  it("アクセシブルネーム: RadioGroup に aria-label も aria-labelledby も無いと開発時に警告する", () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    render(
      <RadioGroup defaultValue="a">
        <RadioItem value="a" aria-label="A" />
      </RadioGroup>,
    );
    expect(warn).toHaveBeenCalledWith(expect.stringContaining("読み上げ名がありません"));
    warn.mockRestore();
  });

  it("表示: radiogroup の中に radio が並び、defaultValue の 1 つだけが選択済みになる", () => {
    renderRadio({ defaultValue: "internal" });
    const group = screen.getByRole("radiogroup", { name: "公開範囲" });
    expect(group).toBeInTheDocument();
    const radios = screen.getAllByRole("radio");
    expect(radios).toHaveLength(3);
    expect(screen.getByRole("radio", { name: "社内のみ" })).toBeChecked();
    expect(screen.getByRole("radio", { name: "取引先にも公開する" })).not.toBeChecked();
  });

  it("操作: クリックで選択が変わり、onValueChange が呼ばれる", async () => {
    const onValueChange = vi.fn();
    renderRadio({ defaultValue: "internal", onValueChange });

    await userEvent.click(screen.getByRole("radio", { name: "取引先にも公開する" }));
    expect(onValueChange).toHaveBeenLastCalledWith("partner");
    expect(screen.getByRole("radio", { name: "取引先にも公開する" })).toBeChecked();
    expect(screen.getByRole("radio", { name: "社内のみ" })).not.toBeChecked();
  });

  it("操作: Tab で選択中の項目に入り、矢印キーで次の項目へ移動できる", async () => {
    const onValueChange = vi.fn();
    renderRadio({ defaultValue: "internal", onValueChange });

    await userEvent.tab();
    expect(screen.getByRole("radio", { name: "社内のみ" })).toHaveFocus();
    // Radix は矢印キーのフォーカス移動を setTimeout で行い、フォーカス時に「矢印キーが押されているか」を見て選択する。
    // jsdom ＋ userEvent では keyup が先に届いてしまうため、押したまま（{ArrowDown>}）にしてから離す
    await userEvent.keyboard("{ArrowDown>}{/ArrowDown}");
    expect(screen.getByRole("radio", { name: "取引先にも公開する" })).toHaveFocus();
    expect(onValueChange).toHaveBeenLastCalledWith("partner");
    expect(screen.getByRole("radio", { name: "取引先にも公開する" })).toBeChecked();
  });

  it("disabled: グループ全体と 1 つだけの無効が効き、選択が変わらない", async () => {
    const onValueChange = vi.fn();
    const { unmount } = renderRadio({ defaultValue: "internal", disabled: true, onValueChange });
    expect(screen.getByRole("radio", { name: "取引先にも公開する" })).toBeDisabled();
    await userEvent.click(screen.getByRole("radio", { name: "取引先にも公開する" }));
    expect(onValueChange).not.toHaveBeenCalled();
    expect(screen.getByRole("radio", { name: "社内のみ" })).toBeChecked();
    unmount();

    renderRadio({ defaultValue: "internal", onValueChange });
    const disabledRadio = screen.getByRole("radio", { name: "全体に公開する" });
    expect(disabledRadio).toBeDisabled();
    await userEvent.click(disabledRadio);
    expect(onValueChange).not.toHaveBeenCalled();
  });

  it("アクセシブルネーム: グループは aria-label、各項目は <label htmlFor> で名前が付く", () => {
    renderRadio({ defaultValue: "internal" });
    expect(screen.getByRole("radiogroup", { name: "公開範囲" })).toBeInTheDocument();
    for (const name of ["社内のみ", "取引先にも公開する", "全体に公開する"]) {
      expect(screen.getByRole("radio", { name })).toBeInTheDocument();
    }
  });
});
