import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useState } from "react";
import { describe, expect, it, vi } from "vitest";
import { InputSearch, type InputSearchProps } from ".";

function renderField(props: InputSearchProps = {}) {
  return render(
    <>
      <label htmlFor="search">案件を検索</label>
      <InputSearch id="search" {...props} />
    </>,
  );
}

function ControlledField() {
  const [value, setValue] = useState("山田商事");
  return (
    <>
      <label htmlFor="search-controlled">案件を検索</label>
      <InputSearch id="search-controlled" value={value} onValueChange={setValue} />
      <output data-testid="value">{value}</output>
    </>
  );
}

describe("InputSearch", () => {
  it("表示: className はルートに、inputClassName は入力欄に付く", () => {
    const { container } = render(
      <InputSearch aria-label="検索" className="w-64" inputClassName="font-bold" />,
    );
    expect(container.querySelector('[data-slot="input-search"]')).toHaveClass("w-64");
    expect(screen.getByRole("searchbox", { name: "検索" })).toHaveClass("font-bold");
  });

  it("表示: 値が空のときはクリアボタンが無く、入力があると出る。検索条件ボタンは onOpenConditions のときだけ出る", async () => {
    const { container } = renderField();
    expect(container.querySelector('[data-slot="input-search"]')).not.toBeNull();
    expect(screen.queryByRole("button", { name: "クリア" })).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "検索条件" })).not.toBeInTheDocument();

    await userEvent.type(screen.getByRole("searchbox", { name: "案件を検索" }), "山田");
    expect(screen.getByRole("button", { name: "クリア" })).toBeInTheDocument();
  });

  it("操作: 非制御では入力とクリアで値が変わり、onValueChange と onOpenConditions が呼ばれる", async () => {
    const onValueChange = vi.fn();
    const onOpenConditions = vi.fn();
    renderField({ defaultValue: "山田商事", onValueChange, onOpenConditions });
    const input = screen.getByRole("searchbox", { name: "案件を検索" });
    expect(input).toHaveValue("山田商事");

    await userEvent.type(input, "X");
    expect(onValueChange).toHaveBeenLastCalledWith("山田商事X");
    expect(input).toHaveValue("山田商事X");

    await userEvent.click(screen.getByRole("button", { name: "検索条件" }));
    expect(onOpenConditions).toHaveBeenCalledTimes(1);

    await userEvent.click(screen.getByRole("button", { name: "クリア" }));
    expect(onValueChange).toHaveBeenLastCalledWith("");
    expect(input).toHaveValue("");
    expect(screen.queryByRole("button", { name: "クリア" })).not.toBeInTheDocument();
  });

  it("操作: 制御では親の value だけが表示され、クリアでも親に空文字が伝わる", async () => {
    render(<ControlledField />);
    const input = screen.getByRole("searchbox", { name: "案件を検索" });
    expect(input).toHaveValue("山田商事");

    await userEvent.type(input, "と");
    expect(input).toHaveValue("山田商事と");
    expect(screen.getByTestId("value")).toHaveTextContent("山田商事と");

    await userEvent.click(screen.getByRole("button", { name: "クリア" }));
    expect(input).toHaveValue("");
    expect(screen.getByTestId("value")).toBeEmptyDOMElement();
  });

  it("disabled: 入力できず、onValueChange も呼ばれない", async () => {
    const onValueChange = vi.fn();
    renderField({ disabled: true, onValueChange });
    const input = screen.getByRole("searchbox", { name: "案件を検索" });
    expect(input).toBeDisabled();
    await userEvent.type(input, "山田");
    expect(onValueChange).not.toHaveBeenCalled();
    expect(input).toHaveValue("");
  });

  it("操作: クリアボタンを押すとフォーカスが入力欄に戻る（ボタンが消えても body に落ちない）", async () => {
    renderField({ defaultValue: "山田商事" });
    await userEvent.click(screen.getByRole("button", { name: "クリア" }));
    expect(screen.getByRole("searchbox", { name: "案件を検索" })).toHaveFocus();
    expect(screen.queryByRole("button", { name: "クリア" })).not.toBeInTheDocument();
  });

  it("アクセシブルネーム: 入力は label、クリアは clearLabel、検索条件は固定の名前を持つ", () => {
    renderField({
      defaultValue: "山田商事",
      clearLabel: "検索語を消す",
      onOpenConditions: () => {},
    });
    expect(screen.getByRole("searchbox", { name: "案件を検索" })).toHaveAttribute("id", "search");
    expect(screen.getByRole("button", { name: "検索語を消す" })).toHaveAttribute("type", "button");
    expect(screen.getByRole("button", { name: "検索条件" })).toBeInTheDocument();
  });
});
