import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from ".";

function SettingsAccordion({
  type = "single",
  defaultValue,
  onValueChange,
}: {
  type?: "single";
  defaultValue?: string;
  onValueChange?: (value: string) => void;
} = {}) {
  return (
    <Accordion type={type} collapsible defaultValue={defaultValue} onValueChange={onValueChange}>
      <AccordionItem value="notify">
        <AccordionTrigger>通知の詳細</AccordionTrigger>
        <AccordionContent>納期の 3 日前と当日にメールで通知します。</AccordionContent>
      </AccordionItem>
      <AccordionItem value="export">
        <AccordionTrigger>書き出しの形式</AccordionTrigger>
        <AccordionContent>CSV（UTF-8）と Excel 形式で書き出せます。</AccordionContent>
      </AccordionItem>
      <AccordionItem value="billing" disabled>
        <AccordionTrigger>請求の詳細</AccordionTrigger>
        <AccordionContent>請求の設定は管理者だけが確認できます。</AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}

describe("Accordion", () => {
  it("表示: 見出しはボタンで、既定は閉じている（aria-expanded=false / 本文は無い）", () => {
    const { container } = render(<SettingsAccordion />);
    expect(container.querySelector('[data-slot="accordion"]')).toBeInTheDocument();
    expect(container.querySelectorAll('[data-slot="accordion-item"]')).toHaveLength(3);

    const trigger = screen.getByRole("button", { name: "通知の詳細" });
    expect(trigger).toHaveAttribute("data-slot", "accordion-trigger");
    expect(trigger).toHaveAttribute("aria-expanded", "false");
    expect(screen.queryByText("納期の 3 日前と当日にメールで通知します。")).not.toBeInTheDocument();
  });

  it("表示: defaultValue を渡した項目だけ最初から開いている", () => {
    render(<SettingsAccordion defaultValue="export" />);
    expect(screen.getByRole("button", { name: "書き出しの形式" })).toHaveAttribute(
      "aria-expanded",
      "true",
    );
    expect(screen.getByText("CSV（UTF-8）と Excel 形式で書き出せます。")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "通知の詳細" })).toHaveAttribute(
      "aria-expanded",
      "false",
    );
  });

  it("操作: 押すと開き、もう一度押すと閉じる（collapsible）", async () => {
    const onValueChange = vi.fn();
    render(<SettingsAccordion onValueChange={onValueChange} />);
    const trigger = screen.getByRole("button", { name: "通知の詳細" });

    await userEvent.click(trigger);
    expect(onValueChange).toHaveBeenLastCalledWith("notify");
    expect(trigger).toHaveAttribute("aria-expanded", "true");
    expect(screen.getByText("納期の 3 日前と当日にメールで通知します。")).toBeInTheDocument();

    await userEvent.click(trigger);
    expect(onValueChange).toHaveBeenLastCalledWith("");
    expect(trigger).toHaveAttribute("aria-expanded", "false");
    expect(screen.queryByText("納期の 3 日前と当日にメールで通知します。")).not.toBeInTheDocument();
  });

  it("操作: type=single は 1 つだけ、type=multiple は複数を同時に開ける", async () => {
    const { unmount } = render(<SettingsAccordion />);
    await userEvent.click(screen.getByRole("button", { name: "通知の詳細" }));
    await userEvent.click(screen.getByRole("button", { name: "書き出しの形式" }));
    expect(screen.getByRole("button", { name: "通知の詳細" })).toHaveAttribute(
      "aria-expanded",
      "false",
    );
    expect(screen.getByRole("button", { name: "書き出しの形式" })).toHaveAttribute(
      "aria-expanded",
      "true",
    );
    unmount();

    render(
      <Accordion type="multiple">
        <AccordionItem value="notify">
          <AccordionTrigger>通知の詳細</AccordionTrigger>
          <AccordionContent>納期の 3 日前と当日にメールで通知します。</AccordionContent>
        </AccordionItem>
        <AccordionItem value="export">
          <AccordionTrigger>書き出しの形式</AccordionTrigger>
          <AccordionContent>CSV（UTF-8）と Excel 形式で書き出せます。</AccordionContent>
        </AccordionItem>
      </Accordion>,
    );
    await userEvent.click(screen.getByRole("button", { name: "通知の詳細" }));
    await userEvent.click(screen.getByRole("button", { name: "書き出しの形式" }));
    expect(screen.getByRole("button", { name: "通知の詳細" })).toHaveAttribute(
      "aria-expanded",
      "true",
    );
    expect(screen.getByText("納期の 3 日前と当日にメールで通知します。")).toBeInTheDocument();
    expect(screen.getByText("CSV（UTF-8）と Excel 形式で書き出せます。")).toBeInTheDocument();
  });

  it("disabled: 無効な項目は押しても開かない", async () => {
    const onValueChange = vi.fn();
    render(<SettingsAccordion onValueChange={onValueChange} />);
    const trigger = screen.getByRole("button", { name: "請求の詳細" });
    expect(trigger).toBeDisabled();

    await userEvent.click(trigger);
    expect(onValueChange).not.toHaveBeenCalled();
    expect(trigger).toHaveAttribute("aria-expanded", "false");
    expect(screen.queryByText("請求の設定は管理者だけが確認できます。")).not.toBeInTheDocument();
  });

  it("アクセシブルネーム: 見出しのボタンと本文が aria-controls / aria-labelledby で結び付く", async () => {
    render(<SettingsAccordion />);
    const trigger = screen.getByRole("button", { name: "通知の詳細" });
    await userEvent.click(trigger);

    const region = screen.getByRole("region", { name: "通知の詳細" });
    expect(trigger).toHaveAttribute("aria-controls", region.getAttribute("id"));
    expect(region).toHaveAttribute("aria-labelledby", trigger.getAttribute("id"));
    expect(region).toHaveAttribute("data-slot", "accordion-content");
  });
});
