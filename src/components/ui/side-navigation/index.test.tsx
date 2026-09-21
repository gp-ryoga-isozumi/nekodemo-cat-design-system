import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { SideNavGroup, SideNavItem, SideNavigation } from ".";

function renderNav(props?: {
  collapsed?: boolean;
  defaultCollapsed?: boolean;
  collapsible?: boolean;
  onCollapsedChange?: (collapsed: boolean) => void;
}) {
  return render(
    <SideNavigation
      logo={<span>案件管理</span>}
      collapsed={props?.collapsed}
      defaultCollapsed={props?.defaultCollapsed}
      collapsible={props?.collapsible}
      onCollapsedChange={props?.onCollapsedChange}
    >
      <SideNavItem icon="home" href="/">
        ダッシュボード
      </SideNavItem>
      <SideNavItem icon="folder" href="/projects" active badge={3}>
        案件
      </SideNavItem>
      <SideNavGroup label="管理">
        <SideNavItem icon="settings" href="/settings">
          設定
        </SideNavItem>
      </SideNavGroup>
    </SideNavigation>,
  );
}

describe("SideNavigation", () => {
  it("表示: nav とロゴ・項目・グループ見出し・バッジを描画し、現在地に aria-current が付く", () => {
    renderNav();
    const nav = screen.getByRole("navigation", { name: "メイン" });
    expect(nav).toHaveAttribute("data-slot", "side-navigation");
    expect(nav).toHaveAttribute("data-collapsed", "false");
    expect(screen.getByText("案件管理")).toBeInTheDocument();
    expect(screen.getByText("管理")).toBeInTheDocument();

    // 件数バッジ（3）も読み上げ名に含まれる
    expect(screen.getByRole("link", { name: "案件3" })).toHaveAttribute("aria-current", "page");
    expect(screen.getByRole("link", { name: "ダッシュボード" })).not.toHaveAttribute(
      "aria-current",
    );
    expect(screen.getByRole("link", { name: "設定" })).toHaveAttribute("href", "/settings");
  });

  it("表示: defaultCollapsed では data-collapsed=true になり、項目名は読み上げに残る", () => {
    renderNav({ defaultCollapsed: true });
    expect(screen.getByRole("navigation", { name: "メイン" })).toHaveAttribute(
      "data-collapsed",
      "true",
    );
    // ラベルは sr-only になるだけでアクセシブルネームは保たれる
    expect(screen.getByRole("link", { name: "ダッシュボード" })).toHaveAttribute(
      "title",
      "ダッシュボード",
    );
    expect(screen.getByRole("link", { name: "案件" })).toBeInTheDocument();
  });

  it("操作: 折りたたみボタンで開閉が切り替わり、制御時は onCollapsedChange だけが呼ばれる", async () => {
    const { unmount } = renderNav();
    const nav = screen.getByRole("navigation", { name: "メイン" });
    await userEvent.click(screen.getByRole("button", { name: "ナビゲーションを折りたたむ" }));
    expect(nav).toHaveAttribute("data-collapsed", "true");
    await userEvent.click(screen.getByRole("button", { name: "ナビゲーションを開く" }));
    expect(nav).toHaveAttribute("data-collapsed", "false");
    unmount();

    const onCollapsedChange = vi.fn();
    renderNav({ collapsed: false, onCollapsedChange });
    await userEvent.click(screen.getByRole("button", { name: "ナビゲーションを折りたたむ" }));
    expect(onCollapsedChange).toHaveBeenCalledWith(true);
    // 制御されているので、親が collapsed を変えるまで表示は変わらない
    expect(screen.getByRole("navigation", { name: "メイン" })).toHaveAttribute(
      "data-collapsed",
      "false",
    );
  });

  it("操作: asChild で子の要素をそのまま項目にできる", () => {
    render(
      <SideNavigation collapsible={false}>
        <SideNavItem icon="folder" active asChild>
          <a href="/projects" data-testid="router-link">
            案件
          </a>
        </SideNavItem>
      </SideNavigation>,
    );
    const link = screen.getByRole("link", { name: "案件" });
    expect(link).toHaveAttribute("data-testid", "router-link");
    expect(link).toHaveAttribute("aria-current", "page");
    expect(link).toHaveAttribute("data-slot", "side-navigation-item");
  });

  it("disabled: collapsible={false} では折りたたみボタンを出さない", () => {
    renderNav({ collapsible: false });
    expect(
      screen.queryByRole("button", { name: "ナビゲーションを折りたたむ" }),
    ).not.toBeInTheDocument();
    expect(screen.getByRole("link", { name: "ダッシュボード" })).toBeInTheDocument();
  });

  it("アクセシブルネーム: nav は「メイン」、折りたたみボタンは状態で名前と aria-expanded が変わる", async () => {
    renderNav();
    expect(screen.getByRole("navigation", { name: "メイン" })).toBeInTheDocument();
    const toggle = screen.getByRole("button", { name: "ナビゲーションを折りたたむ" });
    expect(toggle).toHaveAttribute("aria-expanded", "true");

    await userEvent.click(toggle);
    const opened = screen.getByRole("button", { name: "ナビゲーションを開く" });
    expect(opened).toHaveAttribute("aria-expanded", "false");
  });

  it("SideNavGroup / SideNavItem を SideNavigation の外で使うと例外", () => {
    expect(() =>
      render(
        <SideNavItem icon="home" href="/">
          ダッシュボード
        </SideNavItem>,
      ),
    ).toThrow(/SideNavigation/);
  });
});
