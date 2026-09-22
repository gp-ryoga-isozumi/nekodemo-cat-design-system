"use client";

// 画面の型 E「ログイン」のサンプル（設計書 §10.1）。SideNavigation とヘッダーを置かず、1 カラムを画面の中央に置く。
// マスコット（出してよい 4 か所の 1 つ。§10.6）→ アプリ名 → Card の中の Form の順。
// 検証は送信時だけ、認証の失敗は Toast ではなくフォームの上の InlineMessage（negative）で伝える（10-forms / 11-notifications）。
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Mascot } from "@/components/mascot";
import { useNekoTheme } from "@/components/theme/NekoThemeProvider";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { InlineMessage } from "@/components/ui/inline-message";
import { Input } from "@/components/ui/input";
import { InputPassword } from "@/components/ui/input-password";
import { Link } from "@/components/ui/link";

const schema = z.object({
  email: z
    .string()
    .min(1, "メールアドレスを入力してください")
    .refine(
      (v) => v.includes("@"),
      "メールアドレスの形式が正しくありません。@ を含めて入力してください",
    ),
  password: z.string().min(1, "パスワードを入力してください"),
  remember: z.boolean(),
});
type Values = z.infer<typeof schema>;

/** このメールアドレスだけログインに失敗する（サンプルで失敗の表示を確認するため） */
const FAILING_EMAIL = "error@example.com";

export default function LoginSamplePage() {
  const { theme } = useNekoTheme();
  const router = useRouter();
  const [signingIn, setSigningIn] = useState(false);
  const [failed, setFailed] = useState(false);
  const form = useForm<Values>({
    resolver: zodResolver(schema),
    defaultValues: { email: "", password: "", remember: true },
  });

  const onSubmit = async (values: Values) => {
    setFailed(false);
    setSigningIn(true);
    // プロトタイプの擬似的な待ち。送信中は loading で二重送信を防ぐ（10-forms の 4）
    await new Promise((r) => setTimeout(r, 800));
    setSigningIn(false);
    if (values.email === FAILING_EMAIL) {
      setFailed(true);
      return;
    }
    router.push("/samples/list/");
  };

  return (
    <main className="flex min-h-[calc(100vh-57px)] items-center justify-center bg-surface-page p-6">
      <div className="flex w-full max-w-sm flex-col items-center gap-4">
        <Mascot theme={theme} size={96} />
        <div className="flex flex-col items-center gap-1">
          <h1 className="font-bold text-6 text-text-high">案件管理</h1>
          <p className="text-2 text-text-low">社内のアカウントでログインしてください。</p>
        </div>

        {failed ? (
          <InlineMessage variant="negative" className="w-full">
            メールアドレスかパスワードが違います。入力し直してください
          </InlineMessage>
        ) : null}

        <Card className="w-full">
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel required>メールアドレス</FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          autoComplete="email"
                          placeholder="taro@example.com"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>社内で使っているアドレスを入力してください</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel required>パスワード</FormLabel>
                      <FormControl>
                        <InputPassword autoComplete="current-password" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="remember"
                  render={({ field }) => (
                    <FormItem className="flex-row items-center gap-2">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={(v) => field.onChange(v === true)}
                        />
                      </FormControl>
                      <FormLabel className="font-normal">ログイン状態を保持する</FormLabel>
                    </FormItem>
                  )}
                />
                <Button type="submit" loading={signingIn} className="w-full">
                  ログインする
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>

        {/* パスワード再設定の画面はサンプルに無いので、このログイン画面に戻す */}
        <Link href="/samples/login/" className="text-2">
          パスワードを忘れた場合
        </Link>

        <p className="text-center text-1 text-text-low">
          サンプルの画面です。{FAILING_EMAIL}{" "}
          でログインすると、失敗したときの表示を確認できます。それ以外のメールアドレスでは案件一覧に移ります。
        </p>
      </div>
    </main>
  );
}
