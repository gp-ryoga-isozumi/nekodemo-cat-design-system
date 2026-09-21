import { zodResolver } from "@hookform/resolvers/zod";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useForm } from "react-hook-form";
import { describe, expect, it, vi } from "vitest";
import { z } from "zod";
import { Button } from "../button";
import { Input } from "../input";
import {
  Field,
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from ".";

const schema = z.object({
  customerName: z.string().min(1, "顧客名を入力してください"),
  amount: z.string().regex(/^[0-9]*$/, "金額は半角数字で入力してください（例: 250000）"),
});

type Values = z.infer<typeof schema>;

function ProjectForm({
  onSubmit,
  amountDisabled = false,
}: {
  onSubmit: (values: Values) => void;
  amountDisabled?: boolean;
}) {
  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: { customerName: "", amount: "" },
  });
  return (
    <Form {...form}>
      <form noValidate onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name="customerName"
          render={({ field }) => (
            <FormItem>
              <FormLabel required>顧客名</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormDescription>請求書と案件一覧に表示されます。</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="amount"
          render={({ field }) => (
            <FormItem>
              <FormLabel>金額</FormLabel>
              <FormControl>
                <Input disabled={amountDisabled} {...field} />
              </FormControl>
              <FormDescription>税抜の見込み金額です。</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">案件を登録する</Button>
      </form>
    </Form>
  );
}

const customerField = () => screen.getByLabelText(/顧客名/);
const submit = () => screen.getByRole("button", { name: "案件を登録する" });

describe("Form", () => {
  it("表示: ラベル・必須の印・補足が出て、初期状態ではエラーが無い", () => {
    render(<ProjectForm onSubmit={vi.fn()} />);
    expect(screen.getByText("顧客名")).toBeInTheDocument();
    expect(screen.getAllByText("必須")).toHaveLength(1);
    const description = screen.getByText("請求書と案件一覧に表示されます。");
    expect(customerField()).toHaveAttribute("aria-invalid", "false");
    expect(customerField()).toHaveAttribute("aria-describedby", description.id);
    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
  });

  it("操作: 必須未入力で送信するとエラーが出て aria-invalid / aria-describedby が結ばれ、入力し直すと onSubmit が呼ばれる", async () => {
    const onSubmit = vi.fn();
    render(<ProjectForm onSubmit={onSubmit} />);

    await userEvent.click(submit());
    const message = await screen.findByRole("alert");
    expect(message).toHaveTextContent("顧客名を入力してください");
    expect(onSubmit).not.toHaveBeenCalled();

    const input = customerField();
    expect(input).toHaveAttribute("aria-invalid", "true");
    expect(input.getAttribute("aria-describedby")?.split(" ")).toContain(message.id);

    await userEvent.type(input, "山田商事");
    await userEvent.type(screen.getByLabelText("金額"), "250000");
    await userEvent.click(submit());

    expect(onSubmit).toHaveBeenCalledTimes(1);
    expect(onSubmit.mock.calls[0]?.[0]).toMatchObject({
      customerName: "山田商事",
      amount: "250000",
    });
    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
  });

  it("操作: 形式が違う値はエラーになり、送信されない", async () => {
    const onSubmit = vi.fn();
    render(<ProjectForm onSubmit={onSubmit} />);
    await userEvent.type(customerField(), "山田商事");
    await userEvent.type(screen.getByLabelText("金額"), "25万");
    await userEvent.click(submit());

    expect(await screen.findByRole("alert")).toHaveTextContent(
      "金額は半角数字で入力してください（例: 250000）",
    );
    expect(screen.getByLabelText("金額")).toHaveAttribute("aria-invalid", "true");
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it("disabled: 無効な項目は入力できず、値が変わらない", async () => {
    render(<ProjectForm onSubmit={vi.fn()} amountDisabled />);
    const amount = screen.getByLabelText("金額");
    expect(amount).toBeDisabled();
    await userEvent.type(amount, "250000");
    expect(amount).toHaveValue("");
  });

  it("アクセシブルネーム: FormLabel が htmlFor で入力と結ばれる", () => {
    render(<ProjectForm onSubmit={vi.fn()} />);
    const label = screen.getByText("顧客名").closest("label");
    expect(label).not.toBeNull();
    expect(label).toHaveAttribute("for", customerField().id);
    expect(screen.getByLabelText("金額")).toBe(screen.getByRole("textbox", { name: "金額" }));
  });
});

describe("Field", () => {
  it("表示: 補足とエラーを出し、エラーは role=alert になる", () => {
    render(
      <Field
        label="顧客名"
        required
        htmlFor="customer"
        description="請求書と案件一覧に表示されます。"
        error="顧客名を入力してください"
      >
        <Input id="customer" aria-invalid aria-describedby="customer-description customer-error" />
      </Field>,
    );
    expect(screen.getByText("必須")).toBeInTheDocument();
    expect(screen.getByText("請求書と案件一覧に表示されます。")).toHaveAttribute(
      "id",
      "customer-description",
    );
    expect(screen.getByRole("alert")).toHaveTextContent("顧客名を入力してください");
  });

  it("アクセシブルネーム: htmlFor で子の入力と結ばれる", () => {
    render(
      <Field label="顧客名" htmlFor="customer">
        <Input id="customer" />
      </Field>,
    );
    expect(screen.getByRole("textbox", { name: "顧客名" })).toHaveAttribute("id", "customer");
  });
});
