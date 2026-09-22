"use client";

// 画面の型 C「作成・編集フォーム」のサンプル（設計書 §10.1）。見出し → Form（セクションごとに Card）→ 画面下部に固定のフッター
import { zodResolver } from "@hookform/resolvers/zod";
import NextLink from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { Input } from "@/components/ui/input";
import { InputDate } from "@/components/ui/input-date";
import { InputNumber } from "@/components/ui/input-number";
import { RadioGroup, RadioItem } from "@/components/ui/radio";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/toast";
import { AppShell } from "../app-shell";

const schema = z.object({
  name: z.string().min(1, "案件名を入力してください"),
  customer: z.string().min(1, "顧客を選択してください"),
  amount: z.number({ error: "金額を入力してください" }).min(0, "金額は 0 以上で入力してください"),
  due: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "納期を選択してください"),
  scope: z.enum(["internal", "customer"]),
  notify: z.boolean(),
  memo: z.string().max(200, "メモは 200 文字以内で入力してください"),
});
type Values = z.infer<typeof schema>;

export default function FormSamplePage() {
  const [saving, setSaving] = useState(false);
  const form = useForm<Values>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "社内備品貸出アプリ 改修",
      customer: "yamada-shoji",
      amount: 1200000,
      due: "2026-10-31",
      scope: "internal",
      notify: true,
      memo: "ユーザーインタビューは 9/25 に 3 名。",
    },
  });

  const onSubmit = async () => {
    setSaving(true);
    await new Promise((r) => setTimeout(r, 600));
    setSaving(false);
    // 保存後は詳細に戻して Toast（§10.3）。サンプルでは Toast だけ
    toast.success("案件を保存しました", { description: "詳細画面に反映されています。" });
  };

  return (
    <AppShell current="projects">
      <div className="flex flex-col gap-4 pb-24">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <NextLink href="/samples/list/">案件</NextLink>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <NextLink href="/samples/detail/">社内備品貸出アプリ 改修</NextLink>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>編集</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <h1 className="text-6 font-bold">案件を編集する</h1>

        <Form {...form}>
          <form
            id="project-form"
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col gap-6"
          >
            <Card>
              <CardHeader>
                <CardTitle>基本情報</CardTitle>
              </CardHeader>
              <CardContent className="gap-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel required>案件名</FormLabel>
                      <FormControl>
                        <Input placeholder="例: 社内備品貸出アプリ 改修" {...field} />
                      </FormControl>
                      <FormDescription>顧客に見せる名前になります</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="customer"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel required>顧客</FormLabel>
                      <Select value={field.value} onValueChange={field.onChange}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="選択してください" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="yamada-shoji">山田商事</SelectItem>
                          <SelectItem value="yamada-seisakusho">山田製作所</SelectItem>
                          <SelectItem value="yamada-butsuryu">山田物流</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="grid gap-4 sm:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="amount"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel required>金額</FormLabel>
                        <FormControl>
                          <InputNumber
                            unit="円"
                            min={0}
                            step={10000}
                            name={field.name}
                            value={field.value}
                            onValueChange={(v) => field.onChange(v)}
                            onBlur={field.onBlur}
                          />
                        </FormControl>
                        <FormDescription>税抜。1 万円単位で増減できます</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="due"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>納期</FormLabel>
                        <FormControl>
                          <InputDate
                            min="2026-01-01"
                            name={field.name}
                            value={field.value}
                            onValueChange={field.onChange}
                            onBlur={field.onBlur}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>公開と通知</CardTitle>
              </CardHeader>
              <CardContent className="gap-4">
                <FormField
                  control={form.control}
                  name="scope"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>公開範囲</FormLabel>
                      <FormControl>
                        <RadioGroup
                          aria-label="公開範囲"
                          value={field.value}
                          onValueChange={field.onChange}
                          className="flex gap-6"
                        >
                          <div className="flex items-center gap-2">
                            <RadioItem value="internal" id="scope-internal" />
                            <label htmlFor="scope-internal" className="text-2">
                              社内のみ
                            </label>
                          </div>
                          <div className="flex items-center gap-2">
                            <RadioItem value="customer" id="scope-customer" />
                            <label htmlFor="scope-customer" className="text-2">
                              顧客にも公開
                            </label>
                          </div>
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="notify"
                  render={({ field }) => (
                    <FormItem className="flex-row items-center gap-2">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={(v) => field.onChange(v === true)}
                        />
                      </FormControl>
                      <FormLabel className="font-normal">
                        期限が近づいたら担当者に通知する
                      </FormLabel>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="memo"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>メモ</FormLabel>
                      <FormControl>
                        <Textarea maxLength={200} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>
          </form>
        </Form>
      </div>

      <div className="fixed inset-x-0 bottom-0 z-10 border-border-low border-t bg-surface-card px-6 py-3 shadow-float md:left-60">
        <div className="mx-auto flex max-w-[1200px] justify-end gap-2">
          <Button asChild variant="ghost">
            <NextLink href="/samples/detail/">キャンセル</NextLink>
          </Button>
          <Button type="submit" form="project-form" loading={saving}>
            保存する
          </Button>
        </div>
      </div>
    </AppShell>
  );
}
