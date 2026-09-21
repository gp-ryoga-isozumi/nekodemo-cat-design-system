import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { Avatar } from ".";

// jsdom は画像を読み込まないため、Radix の Avatar.Image は常に「読み込み中」のままで
// 描画されず、代わりに Avatar.Fallback が出る（Radix の仕様）。以下はそれを前提にしている。

describe("Avatar", () => {
  it("表示: fallback を省略すると猫の顔のシルエットが出る", async () => {
    const { container } = render(<Avatar name="担当者未定" />);
    expect(await screen.findByRole("img", { name: "担当者未定" })).toBeInTheDocument();
    expect(container.querySelector('[data-icon="cat_face"]')).not.toBeNull();
  });

  it("表示: fallback の文字を渡すとその文字が出る（猫の顔は出さない）", async () => {
    const { container } = render(<Avatar name="山田 太郎" fallback="山田" />);
    expect(await screen.findByText("山田")).toBeInTheDocument();
    expect(container.querySelector('[data-icon="cat_face"]')).toBeNull();
  });

  it("表示: size を data-size に出す（既定は md）", async () => {
    const { container, rerender } = render(<Avatar name="山田 太郎" fallback="山田" />);
    await screen.findByText("山田");
    expect(container.querySelector('[data-slot="avatar"]')).toHaveAttribute("data-size", "md");

    rerender(<Avatar name="山田 太郎" fallback="山田" size="lg" />);
    expect(container.querySelector('[data-slot="avatar"]')).toHaveAttribute("data-size", "lg");
  });

  it("表示: src を渡しても読み込めなければ fallback が出る", async () => {
    render(<Avatar name="山田 太郎" fallback="山田" src="/does-not-load.png" />);
    expect(await screen.findByText("山田")).toBeInTheDocument();
  });

  it("操作: 操作部品ではないため Tab でフォーカスされない", async () => {
    render(
      <div>
        <Avatar name="山田 太郎" fallback="山田" />
        <a href="/projects">案件一覧へ</a>
      </div>,
    );
    await screen.findByText("山田");
    await userEvent.tab();
    // 最初の Tab がリンクに当たる = Avatar はフォーカス順に入っていない
    expect(screen.getByRole("link", { name: "案件一覧へ" })).toHaveFocus();
  });

  // disabled: Avatar は表示専用で無効状態を持たないため、この観点は該当しない

  it("アクセシブルネーム: 猫の顔のときは name が role=img の名前になる", async () => {
    render(<Avatar name="ゲスト" size="sm" />);
    const image = await screen.findByRole("img", { name: "ゲスト" });
    expect(image).toHaveAttribute("aria-label", "ゲスト");
  });

  it("アクセシブルネーム: fallback の文字のときは role=img を付けず、文字をそのまま読ませる", async () => {
    render(<Avatar name="山田 太郎" fallback="山田" />);
    const fallback = await screen.findByText("山田");
    expect(fallback).not.toHaveAttribute("role");
    expect(fallback).not.toHaveAttribute("aria-label");
  });
});
