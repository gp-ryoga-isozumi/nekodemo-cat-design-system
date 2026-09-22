import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { NekoThemeProvider } from "@/components/theme/NekoThemeProvider";
import DashboardSamplePage from "./page";

describe("DashboardSamplePage", () => {
  it("見出しと期間の切替、直近の案件の表を表示する", () => {
    render(
      <NekoThemeProvider defaultTheme="calico">
        <DashboardSamplePage />
      </NekoThemeProvider>,
    );
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("ダッシュボード");
    expect(screen.getByRole("radiogroup", { name: "期間" })).toBeInTheDocument();
    expect(screen.getByRole("table", { name: "直近の案件" })).toBeInTheDocument();
  });
});
