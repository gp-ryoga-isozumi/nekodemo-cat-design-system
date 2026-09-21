import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { MouseEvent, MouseEventHandler } from "react";
import { describe, expect, it, vi } from "vitest";
import {
  Breadcrumb,
  BreadcrumbEllipsis,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from ".";

/** jsdom では実際の遷移ができないため、クリックの既定動作を止める */
const preventNavigation = (event: MouseEvent<HTMLAnchorElement>) => event.preventDefault();

function ProjectBreadcrumb({ onHome }: { onHome?: MouseEventHandler<HTMLAnchorElement> } = {}) {
  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink href="/" onClick={onHome}>
            ホーム
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbEllipsis />
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbLink href="/projects">案件</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbPage>社内備品貸出アプリ 改修</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  );
}

describe("Breadcrumb", () => {
  it("表示: リンク・省略記号・現在地を ol の中に描画する", () => {
    const { container } = render(<ProjectBreadcrumb />);
    expect(container.querySelector('[data-slot="breadcrumb-list"]')?.tagName).toBe("OL");
    expect(container.querySelectorAll('[data-slot="breadcrumb-item"]')).toHaveLength(4);
    expect(container.querySelector('[data-slot="breadcrumb-ellipsis"]')).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "ホーム" })).toHaveAttribute("href", "/");
    expect(screen.getByText("社内備品貸出アプリ 改修")).toBeInTheDocument();
  });

  it("表示: 区切りと省略記号は読み上げから隠す", () => {
    const { container } = render(<ProjectBreadcrumb />);
    const separators = container.querySelectorAll('[data-slot="breadcrumb-separator"]');
    expect(separators).toHaveLength(3);
    for (const separator of separators) {
      expect(separator).toHaveAttribute("aria-hidden", "true");
    }
    expect(container.querySelector('[data-slot="breadcrumb-ellipsis"]')).toHaveAttribute(
      "aria-hidden",
      "true",
    );
  });

  it("操作: リンクを押すと onClick が呼ばれ、asChild でも同じように動く", async () => {
    const onHome = vi.fn(preventNavigation);
    const onRouter = vi.fn(preventNavigation);
    const { rerender } = render(<ProjectBreadcrumb onHome={onHome} />);
    await userEvent.click(screen.getByRole("link", { name: "ホーム" }));
    expect(onHome).toHaveBeenCalledTimes(1);

    rerender(
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <a href="/projects" onClick={onRouter}>
                案件
              </a>
            </BreadcrumbLink>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>,
    );
    const link = screen.getByRole("link", { name: "案件" });
    expect(link).toHaveAttribute("data-slot", "breadcrumb-link");
    await userEvent.click(link);
    expect(onRouter).toHaveBeenCalledTimes(1);
  });

  it("disabled: 現在地（BreadcrumbPage）はリンクにならず、押せる先を持たない", () => {
    const { container } = render(<ProjectBreadcrumb />);
    const page = container.querySelector('[data-slot="breadcrumb-page"]');
    expect(page?.tagName).toBe("SPAN");
    expect(page).toHaveTextContent("社内備品貸出アプリ 改修");
    expect(page).not.toHaveAttribute("href");
    expect(screen.queryByRole("link", { name: "社内備品貸出アプリ 改修" })).toBeNull();
  });

  it("アクセシブルネーム: nav は「パンくずリスト」、現在地は aria-current=page", () => {
    const { container } = render(<ProjectBreadcrumb />);
    expect(screen.getByRole("navigation", { name: "パンくずリスト" })).toBeInTheDocument();
    expect(screen.getAllByRole("link").map((link) => link.textContent)).toEqual(["ホーム", "案件"]);
    expect(container.querySelector('[data-slot="breadcrumb-page"]')).toHaveAttribute(
      "aria-current",
      "page",
    );
  });
});
