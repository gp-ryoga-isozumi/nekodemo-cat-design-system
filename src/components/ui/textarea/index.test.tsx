import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { Textarea } from ".";

describe("Textarea", () => {
  it("表示: maxLength を渡すとカウンタが出て、textarea と aria-describedby で結ばれる", () => {
    render(<Textarea id="memo" aria-label="案件メモ" maxLength={200} defaultValue="進行中" />);
    const textarea = screen.getByRole("textbox", { name: "案件メモ" });
    expect(textarea).toHaveAttribute("maxlength", "200");
    expect(textarea).toHaveAttribute("aria-describedby", "memo-count");
    const count = screen.getByRole("status");
    expect(count).toHaveAttribute("id", "memo-count");
    expect(count).toHaveTextContent("3 / 200");
  });

  it("表示: showCount={false} ならカウンタを出さず、aria-describedby も付けない", () => {
    render(<Textarea aria-label="案件メモ" maxLength={200} showCount={false} />);
    expect(screen.queryByRole("status")).not.toBeInTheDocument();
    expect(screen.getByRole("textbox", { name: "案件メモ" })).not.toHaveAttribute(
      "aria-describedby",
    );
  });

  it("操作: 入力するとカウンタが増え、onChange が呼ばれる", async () => {
    const onChange = vi.fn();
    render(<Textarea aria-label="案件メモ" maxLength={10} onChange={onChange} />);
    const textarea = screen.getByRole("textbox", { name: "案件メモ" });
    expect(screen.getByRole("status")).toHaveTextContent("0 / 10");
    await userEvent.type(textarea, "調整中");
    expect(textarea).toHaveValue("調整中");
    expect(onChange).toHaveBeenCalledTimes(3);
    expect(screen.getByRole("status")).toHaveTextContent("3 / 10");
  });

  it("操作: value を渡した制御では value の長さがカウンタになる", () => {
    render(<Textarea aria-label="案件メモ" maxLength={100} value="五十棲" onChange={() => {}} />);
    expect(screen.getByRole("status")).toHaveTextContent("3 / 100");
  });

  it("disabled: 入力できず、値が変わらない", async () => {
    const onChange = vi.fn();
    render(
      <Textarea aria-label="案件メモ" disabled defaultValue="下書き" onChange={onChange} />, //
    );
    const textarea = screen.getByRole("textbox", { name: "案件メモ" });
    expect(textarea).toBeDisabled();
    await userEvent.type(textarea, "追記");
    expect(textarea).toHaveValue("下書き");
    expect(onChange).not.toHaveBeenCalled();
  });

  it("アクセシブルネーム: <label htmlFor> で名前が付く", () => {
    render(
      <>
        <label htmlFor="memo-label">案件メモ</label>
        <Textarea id="memo-label" />
      </>,
    );
    expect(screen.getByRole("textbox", { name: "案件メモ" })).toBeInTheDocument();
  });
});
