import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { Link } from ".";

describe("Link", () => {
  it("表示: <a> を描画し、data-slot と href を持つ", () => {
    render(<Link href="/projects/1">案件の詳細</Link>);
    const link = screen.getByRole("link", { name: "案件の詳細" });
    expect(link).toHaveAttribute("data-slot", "link");
    expect(link).toHaveAttribute("href", "/projects/1");
    expect(link).not.toHaveAttribute("target");
  });

  it("表示: external は target=_blank と rel、open_in_new アイコンを付ける", () => {
    const { container } = render(
      <Link href="https://example.com" external>
        ヘルプセンター
      </Link>,
    );
    const link = screen.getByRole("link", { name: /ヘルプセンター/ });
    expect(link).toHaveAttribute("target", "_blank");
    expect(link).toHaveAttribute("rel", "noopener noreferrer");
    expect(container.querySelector('[data-icon="open_in_new"]')).not.toBeNull();
  });

  it("表示: external で rel を渡しても noopener noreferrer が残る", () => {
    render(
      <Link href="https://example.com/me" external rel="me">
        プロフィール
      </Link>,
    );
    expect(screen.getByRole("link", { name: /プロフィール/ })).toHaveAttribute(
      "rel",
      "me noopener noreferrer",
    );
  });

  it("操作: クリックで onClick が呼ばれる", async () => {
    const onClick = vi.fn((event: React.MouseEvent) => event.preventDefault());
    render(
      <Link href="/projects/1" onClick={onClick}>
        案件の詳細
      </Link>,
    );
    await userEvent.click(screen.getByRole("link", { name: "案件の詳細" }));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it("操作: Tab でフォーカスできる", async () => {
    render(<Link href="/projects/1">案件の詳細</Link>);
    await userEvent.tab();
    expect(screen.getByRole("link", { name: "案件の詳細" })).toHaveFocus();
  });

  // disabled: リンクに無効状態は無い（押せないようにするなら Button の disabled を使う）ため該当しない

  it("アクセシブルネーム: external は「新しいタブで開く」が名前に含まれる", () => {
    render(
      <Link href="https://example.com" external>
        ヘルプセンター
      </Link>,
    );
    expect(
      screen.getByRole("link", { name: "ヘルプセンター新しいタブで開く" }),
    ).toBeInTheDocument();
  });

  it("アクセシブルネーム: asChild で子の <a> に置き換えても名前と href が保たれる", () => {
    render(
      <Link asChild>
        <a href="/projects">案件一覧</a>
      </Link>,
    );
    const link = screen.getByRole("link", { name: "案件一覧" });
    expect(link).toHaveAttribute("href", "/projects");
    expect(link).toHaveAttribute("data-slot", "link");
  });

  it("アクセシブルネーム: asChild + external でもアイコンが子の中に入る", () => {
    const { container } = render(
      <Link asChild external>
        <a href="https://example.com">利用規約</a>
      </Link>,
    );
    const link = screen.getByRole("link", { name: "利用規約新しいタブで開く" });
    expect(link).toHaveAttribute("target", "_blank");
    expect(container.querySelector('[data-icon="open_in_new"]')).not.toBeNull();
  });
});
