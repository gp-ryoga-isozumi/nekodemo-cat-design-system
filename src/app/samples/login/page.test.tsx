import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { NekoThemeProvider } from "@/components/theme/NekoThemeProvider";
import LoginSamplePage from "./page";

// ログイン成功時の遷移に useRouter を使うため、jsdom では push をモックする
vi.mock("next/navigation", () => ({ useRouter: () => ({ push: vi.fn() }) }));

// jsdom には ResizeObserver が無い（Checkbox が内部で使う Radix が参照する）
class ResizeObserverStub {
  observe() {
    // 何もしない
  }
  unobserve() {
    // 何もしない
  }
  disconnect() {
    // 何もしない
  }
}
globalThis.ResizeObserver ??= ResizeObserverStub as unknown as typeof ResizeObserver;

describe("LoginSamplePage", () => {
  it("アプリ名の見出しと、初期状態から押せる「ログインする」を表示する", () => {
    render(
      <NekoThemeProvider defaultTheme="calico">
        <LoginSamplePage />
      </NekoThemeProvider>,
    );
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("案件管理");
    expect(screen.getByRole("button", { name: "ログインする" })).toBeEnabled();
  });
});
