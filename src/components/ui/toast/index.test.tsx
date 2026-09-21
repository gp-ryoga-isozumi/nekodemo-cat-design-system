import { act, render, screen, waitForElementToBeRemoved } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import { Toaster, toast } from ".";

// jsdom には window.matchMedia が無く、sonner がテーマ判定で参照するため最小のモックを置く
if (typeof window.matchMedia !== "function") {
  window.matchMedia = ((query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => false,
  })) as unknown as typeof window.matchMedia;
}

// jsdom にはポインタキャプチャの API が無く、sonner のスワイプ処理が呼ぶため最小のモックを置く
if (typeof Element.prototype.setPointerCapture !== "function") {
  Element.prototype.setPointerCapture = () => {};
  Element.prototype.releasePointerCapture = () => {};
  Element.prototype.hasPointerCapture = () => false;
}

afterEach(async () => {
  // sonner の通知はモジュール全体で共有されるため、テストごとに片付ける
  toast.dismiss();
  // sonner は dismiss 後に 200ms の setTimeout で状態を更新する（TIME_BEFORE_UNMOUNT）。
  // それを待たずにファイルを終えると jsdom の破棄後にタイマーが動き「window is not defined」で CI が落ちる
  await act(() => new Promise((resolve) => setTimeout(resolve, 250)));
});

// disabled: Toast は入力部品ではなく無効状態を持たないため省略する。

describe("Toaster / toast", () => {
  it("表示: toast.success でメッセージと説明が出る", async () => {
    render(<Toaster />);
    toast.success("案件「社内備品貸出アプリ 改修」を保存しました", {
      description: "山田商事 / 1,200,000 円",
    });
    expect(
      await screen.findByText("案件「社内備品貸出アプリ 改修」を保存しました"),
    ).toBeInTheDocument();
    expect(screen.getByText("山田商事 / 1,200,000 円")).toBeInTheDocument();
  });

  it("表示: 種類が data-type に出る（error）", async () => {
    const { container } = render(<Toaster />);
    toast.error("保存できませんでした");
    await screen.findByText("保存できませんでした");
    expect(container.querySelector("[data-sonner-toast]")).toHaveAttribute("data-type", "error");
  });

  it("操作: 操作ボタンを押すと onClick が呼ばれ、閉じるボタンで消える", async () => {
    const onUndo = vi.fn();
    render(<Toaster toastOptions={{ closeButtonAriaLabel: "閉じる" }} />);
    toast.success("案件を削除しました", {
      action: { label: "取り消す", onClick: onUndo },
    });
    const message = await screen.findByText("案件を削除しました");

    await userEvent.click(screen.getByRole("button", { name: "取り消す" }));
    expect(onUndo).toHaveBeenCalledTimes(1);

    await userEvent.click(screen.getByRole("button", { name: "閉じる" }));
    await waitForElementToBeRemoved(message);
  });

  it("アクセシブルネーム: 通知領域に名前が付き、日本語の閉じるボタン名も渡せる", async () => {
    render(<Toaster containerAriaLabel="通知" toastOptions={{ closeButtonAriaLabel: "閉じる" }} />);
    toast.info("山田商事の情報を更新しました");
    await screen.findByText("山田商事の情報を更新しました");
    expect(screen.getByRole("region", { name: /通知/ })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "閉じる" })).toBeInTheDocument();
  });
});
