import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { Stepper } from ".";

const steps = [
  { label: "基本情報" },
  { label: "担当者" },
  { label: "金額と納期" },
  { label: "確認" },
];

describe("Stepper", () => {
  it("表示: ol に手順が並び、完了・現在・未着手が data-status で分かれる", () => {
    render(<Stepper aria-label="案件の作成" steps={steps} current={1} />);
    const list = screen.getByRole("list", { name: "案件の作成" });
    expect(list).toHaveAttribute("data-slot", "stepper");
    expect(list).toHaveAttribute("data-orientation", "horizontal");

    const items = within(list).getAllByRole("listitem");
    expect(items).toHaveLength(4);
    expect(items[0]).toHaveAttribute("data-status", "done");
    expect(items[1]).toHaveAttribute("data-status", "current");
    expect(items[2]).toHaveAttribute("data-status", "upcoming");
    expect(items[3]).toHaveAttribute("data-status", "upcoming");

    // 完了した手順はチェック、それ以外は番号
    expect(screen.getAllByRole("img", { name: "完了" })).toHaveLength(1);
    expect(within(items[1]).getByText("2")).toBeInTheDocument();
    expect(within(items[3]).getByText("4")).toBeInTheDocument();
    for (const step of steps) expect(screen.getByText(step.label)).toBeInTheDocument();
  });

  it("表示: 現在の手順の li にだけ aria-current=step が付く", () => {
    const { rerender } = render(<Stepper aria-label="案件の作成" steps={steps} current={1} />);
    const items = screen.getAllByRole("listitem");
    expect(items[1]).toHaveAttribute("aria-current", "step");
    expect(items.filter((item) => item.getAttribute("aria-current") === "step")).toHaveLength(1);

    // すべて完了した状態では現在の手順が無い
    rerender(<Stepper aria-label="案件の作成" steps={steps} current={steps.length} />);
    for (const item of screen.getAllByRole("listitem")) {
      expect(item).toHaveAttribute("data-status", "done");
      expect(item).not.toHaveAttribute("aria-current");
    }
  });

  it("表示: 縦にすると data-orientation が変わり、補足も表示される", () => {
    render(
      <Stepper
        aria-label="請求の手続き"
        orientation="vertical"
        current={1}
        steps={[
          { label: "検収", description: "2026-10-31 に完了" },
          { label: "請求書の作成", description: "1,320,000 円（税込）" },
        ]}
      />,
    );
    expect(screen.getByRole("list", { name: "請求の手続き" })).toHaveAttribute(
      "data-orientation",
      "vertical",
    );
    expect(screen.getByText("2026-10-31 に完了")).toBeInTheDocument();
    expect(screen.getByText("1,320,000 円（税込）")).toBeInTheDocument();
  });

  it("操作: onStepClick を渡すと完了した手順だけがボタンになり、index が返る", async () => {
    const onStepClick = vi.fn();
    render(<Stepper aria-label="案件の作成" steps={steps} current={2} onStepClick={onStepClick} />);
    const buttons = screen.getAllByRole("button");
    expect(buttons).toHaveLength(2);

    await userEvent.click(screen.getByRole("button", { name: /基本情報/ }));
    expect(onStepClick).toHaveBeenLastCalledWith(0);

    await userEvent.click(screen.getByRole("button", { name: /担当者/ }));
    expect(onStepClick).toHaveBeenLastCalledWith(1);
  });

  it("操作できない: 現在・未着手の手順はボタンにならず、onStepClick が無ければ全部ただの表示になる", async () => {
    const onStepClick = vi.fn();
    const { unmount } = render(
      <Stepper aria-label="案件の作成" steps={steps} current={2} onStepClick={onStepClick} />,
    );
    expect(screen.queryByRole("button", { name: /金額と納期/ })).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /確認/ })).not.toBeInTheDocument();

    await userEvent.click(screen.getByText("金額と納期"));
    expect(onStepClick).not.toHaveBeenCalled();
    unmount();

    render(<Stepper aria-label="案件の作成" steps={steps} current={2} />);
    expect(screen.queryAllByRole("button")).toHaveLength(0);
  });

  it("アクセシブルネーム: aria-label は既定「手順」で、押せる手順は手順名で引ける", () => {
    const { unmount } = render(<Stepper steps={steps} current={1} />);
    expect(screen.getByRole("list", { name: "手順" })).toBeInTheDocument();
    unmount();

    render(<Stepper aria-label="案件の作成" steps={steps} current={1} onStepClick={() => {}} />);
    expect(screen.getByRole("list", { name: "案件の作成" })).toBeInTheDocument();
    // ボタンの読み上げ名はチェックの「完了」と手順名から組み立てられる
    expect(screen.getByRole("button", { name: /基本情報/ })).toHaveAccessibleName(
      "基本情報（完了）に戻る",
    );
  });
});
