import { zodResolver } from "@hookform/resolvers/zod";
import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
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
  dueDate: z.string().min(1, "納期を選んでください"),
  amount: z.string().regex(/^[0-9]*$/, "金額は半角数字で入力してください（例: 250000）"),
});

type ProjectValues = z.infer<typeof schema>;

const emptyValues: ProjectValues = { customerName: "", dueDate: "", amount: "" };

type ProjectFormProps = {
  /** 読み込み直後にバリデーションを走らせ、エラー表示を見せる */
  showErrorsOnMount?: boolean;
  /** 送信中の見た目を固定する */
  pending?: boolean;
  /** 送信に掛ける時間（ミリ秒）。送信中の Spinner を確かめられる */
  delayMs?: number;
};

/** 案件を登録するフォーム。顧客名（必須）・納期（必須）・金額の 3 項目を zod で検査します */
function ProjectForm({
  showErrorsOnMount = false,
  pending = false,
  delayMs = 0,
}: ProjectFormProps) {
  const [result, setResult] = useState<string | null>(null);
  const form = useForm({ resolver: zodResolver(schema), defaultValues: emptyValues });
  const busy = pending || form.formState.isSubmitting;

  useEffect(() => {
    if (showErrorsOnMount) void form.trigger();
  }, [showErrorsOnMount, form]);

  const onSubmit = async (values: ProjectValues) => {
    if (delayMs > 0) await new Promise((resolve) => setTimeout(resolve, delayMs));
    setResult(
      `「${values.customerName}」の案件を登録しました（納期 ${values.dueDate} / 金額 ${
        values.amount === "" ? "未定" : `${values.amount} 円`
      }）。`,
    );
  };

  return (
    <Form {...form}>
      <form
        noValidate
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex w-96 flex-col gap-4 rounded-container bg-surface-card p-4"
      >
        <FormField
          control={form.control}
          name="customerName"
          render={({ field }) => (
            <FormItem>
              <FormLabel required>顧客名</FormLabel>
              <FormControl>
                <Input placeholder="例: 山田商事" disabled={busy} {...field} />
              </FormControl>
              <FormDescription>請求書と案件一覧に表示されます。</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="dueDate"
          render={({ field }) => (
            <FormItem>
              <FormLabel required>納期</FormLabel>
              <FormControl>
                <Input type="date" disabled={busy} {...field} />
              </FormControl>
              <FormDescription>納品物を先方に渡す予定日です。</FormDescription>
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
                <Input inputMode="numeric" placeholder="例: 250000" disabled={busy} {...field} />
              </FormControl>
              <FormDescription>税抜の見込み金額です。未定のままでも登録できます。</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex items-center gap-2">
          <Button type="submit" loading={busy}>
            {busy ? "登録中" : "案件を登録する"}
          </Button>
          <Button
            type="button"
            variant="outline"
            disabled={busy}
            onClick={() => {
              form.reset(emptyValues);
              setResult(null);
            }}
          >
            入力を取り消す
          </Button>
        </div>
        {result ? (
          <p role="status" className="text-2 text-text-high">
            {result}
          </p>
        ) : null}
      </form>
    </Form>
  );
}

const meta = {
  title: "UI/Form",
  component: ProjectForm,
  tags: ["autodocs"],
  args: { showErrorsOnMount: false, pending: false, delayMs: 0 },
  argTypes: {
    showErrorsOnMount: { control: "boolean" },
    pending: { control: "boolean" },
    delayMs: { control: { type: "number", min: 0, step: 100 } },
  },
} satisfies Meta<typeof ProjectForm>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { name: "基本（案件を登録する）" };

export const WithErrors: Story = {
  name: "エラー表示（必須が未入力のとき）",
  args: { showErrorsOnMount: true },
};

export const Submitting: Story = {
  name: "送信中",
  args: { pending: true },
};

export const SlowSubmit: Story = {
  name: "送信に時間が掛かる場合（1.5 秒）",
  args: { delayMs: 1500 },
};

export const StaticField: Story = {
  name: "Field（react-hook-form を使わない静的版）",
  render: () => (
    <div className="flex w-96 flex-col gap-4 rounded-container bg-surface-card p-4">
      <Field
        label="顧客名"
        required
        htmlFor="static-customer"
        description="請求書と案件一覧に表示されます。"
      >
        <Input
          id="static-customer"
          defaultValue="山田商事"
          aria-describedby="static-customer-description"
        />
      </Field>
      <Field
        label="金額"
        htmlFor="static-amount"
        description="税抜の見込み金額です。"
        error="金額は半角数字で入力してください（例: 250000）"
      >
        <Input
          id="static-amount"
          defaultValue="25万"
          aria-invalid
          aria-describedby="static-amount-description static-amount-error"
        />
      </Field>
    </div>
  ),
};
