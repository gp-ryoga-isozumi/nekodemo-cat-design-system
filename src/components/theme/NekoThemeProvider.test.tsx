import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it } from "vitest";
import { NekoThemePicker } from "./NekoThemePicker";
import { NekoThemeProvider, useNekoTheme } from "./NekoThemeProvider";

function Current() {
  const { theme } = useNekoTheme();
  return <output data-testid="current">{theme}</output>;
}

const attr = () => document.documentElement.getAttribute("data-neko-theme");

afterEach(() => {
  document.documentElement.removeAttribute("data-neko-theme");
  localStorage.clear();
});

describe("NekoThemeProvider / useNekoTheme", () => {
  it("表示: defaultTheme を <html data-neko-theme> と context に反映する", () => {
    render(
      <NekoThemeProvider defaultTheme="russian-blue">
        <Current />
      </NekoThemeProvider>,
    );
    expect(attr()).toBe("russian-blue");
    expect(screen.getByTestId("current")).toHaveTextContent("russian-blue");
  });

  it("操作: setTheme で属性が変わり、persist なら localStorage に保存される", async () => {
    render(
      <NekoThemeProvider defaultTheme="calico" persist>
        <NekoThemePicker />
        <Current />
      </NekoThemeProvider>,
    );
    await userEvent.click(screen.getByRole("button", { name: "アメショ" }));
    expect(attr()).toBe("american-shorthair");
    expect(screen.getByTestId("current")).toHaveTextContent("american-shorthair");
    expect(localStorage.getItem("neko-theme")).toBe("american-shorthair");
  });

  it("persist: 保存済みのテーマを初回に読む", () => {
    localStorage.setItem("neko-theme", "russian-blue");
    render(
      <NekoThemeProvider defaultTheme="calico" persist>
        <Current />
      </NekoThemeProvider>,
    );
    expect(screen.getByTestId("current")).toHaveTextContent("russian-blue");
    expect(attr()).toBe("russian-blue");
  });

  it("persist なし: localStorage の値は無視され、保存もしない", async () => {
    localStorage.setItem("neko-theme", "russian-blue");
    render(
      <NekoThemeProvider defaultTheme="calico">
        <NekoThemePicker />
        <Current />
      </NekoThemeProvider>,
    );
    expect(screen.getByTestId("current")).toHaveTextContent("calico");
    await userEvent.click(screen.getByRole("button", { name: "アメショ" }));
    expect(localStorage.getItem("neko-theme")).toBe("russian-blue");
  });

  it("Provider の外で useNekoTheme を呼ぶと例外", () => {
    expect(() => render(<Current />)).toThrow(/NekoThemeProvider/);
  });
});

describe("NekoThemePicker", () => {
  it("アクセシブルネーム: faces は group と aria-pressed、選択中が 1 つ", () => {
    render(
      <NekoThemeProvider defaultTheme="calico">
        <NekoThemePicker />
      </NekoThemeProvider>,
    );
    expect(screen.getByRole("group", { name: "テーマ切替" })).toBeInTheDocument();
    const buttons = screen.getAllByRole("button");
    expect(buttons).toHaveLength(3);
    expect(screen.getByRole("button", { name: "三毛" })).toHaveAttribute("aria-pressed", "true");
    expect(screen.getByRole("button", { name: "アメショ" })).toHaveAttribute(
      "aria-pressed",
      "false",
    );
  });

  it("menu: select で切り替えられる", async () => {
    render(
      <NekoThemeProvider defaultTheme="calico">
        <NekoThemePicker variant="menu" />
        <Current />
      </NekoThemeProvider>,
    );
    const select = screen.getByRole("combobox", { name: "テーマ" });
    await userEvent.selectOptions(select, "russian-blue");
    expect(screen.getByTestId("current")).toHaveTextContent("russian-blue");
    expect(attr()).toBe("russian-blue");
  });
});
