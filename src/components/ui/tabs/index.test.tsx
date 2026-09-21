import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { Tabs, TabsContent, TabsList, TabsTrigger } from ".";

function ProjectTabs({
  orientation = "horizontal",
  onValueChange,
}: {
  orientation?: "horizontal" | "vertical";
  onValueChange?: (value: string) => void;
} = {}) {
  return (
    <Tabs defaultValue="overview" orientation={orientation} onValueChange={onValueChange}>
      <TabsList aria-label="案件の情報">
        <TabsTrigger value="overview">概要</TabsTrigger>
        <TabsTrigger value="tasks">タスク</TabsTrigger>
        <TabsTrigger value="invoice" disabled>
          請求
        </TabsTrigger>
      </TabsList>
      <TabsContent value="overview">案件「社内備品貸出アプリ 改修」の概要です。</TabsContent>
      <TabsContent value="tasks">未完了のタスクが 8 件あります。</TabsContent>
      <TabsContent value="invoice">請求金額は 1,200,000 円です。</TabsContent>
    </Tabs>
  );
}

describe("Tabs", () => {
  it("表示: 既定のタブの内容だけが表示され、orientation が data 属性に出る", () => {
    const { container, rerender } = render(<ProjectTabs />);
    expect(screen.getByText("案件「社内備品貸出アプリ 改修」の概要です。")).toBeInTheDocument();
    expect(screen.queryByText("未完了のタスクが 8 件あります。")).not.toBeInTheDocument();
    expect(container.querySelector('[data-slot="tabs"]')).toHaveAttribute(
      "data-orientation",
      "horizontal",
    );

    rerender(<ProjectTabs orientation="vertical" />);
    expect(screen.getByRole("tablist")).toHaveAttribute("data-orientation", "vertical");
  });

  it("操作: タブを押すと内容が切り替わり、矢印キーでも移動できる", async () => {
    const onValueChange = vi.fn();
    render(<ProjectTabs onValueChange={onValueChange} />);

    await userEvent.click(screen.getByRole("tab", { name: "タスク" }));
    expect(onValueChange).toHaveBeenCalledWith("tasks");
    expect(screen.getByText("未完了のタスクが 8 件あります。")).toBeInTheDocument();
    expect(
      screen.queryByText("案件「社内備品貸出アプリ 改修」の概要です。"),
    ).not.toBeInTheDocument();

    // 横並びは ← → で移動する（Radix の roving focus）
    await userEvent.keyboard("{ArrowLeft}");
    expect(onValueChange).toHaveBeenLastCalledWith("overview");
    expect(screen.getByRole("tab", { name: "概要" })).toHaveAttribute("aria-selected", "true");
  });

  it("disabled: 無効なタブは選べず、内容も表示されない", async () => {
    const onValueChange = vi.fn();
    render(<ProjectTabs onValueChange={onValueChange} />);
    const invoice = screen.getByRole("tab", { name: "請求" });
    expect(invoice).toBeDisabled();

    await userEvent.click(invoice);
    expect(onValueChange).not.toHaveBeenCalled();
    expect(screen.queryByText("請求金額は 1,200,000 円です。")).not.toBeInTheDocument();
    expect(screen.getByText("案件「社内備品貸出アプリ 改修」の概要です。")).toBeInTheDocument();
  });

  it("アクセシブルネーム: tablist に名前が付き、選択中のタブと tabpanel が結び付く", () => {
    render(<ProjectTabs />);
    expect(screen.getByRole("tablist", { name: "案件の情報" })).toBeInTheDocument();

    const overview = screen.getByRole("tab", { name: "概要", selected: true });
    const panel = screen.getByRole("tabpanel");
    expect(overview).toHaveAttribute("aria-controls", panel.getAttribute("id"));
    expect(panel).toHaveAttribute("aria-labelledby", overview.getAttribute("id"));
  });
});
