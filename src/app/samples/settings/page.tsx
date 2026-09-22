"use client";

// 画面の型 D「設定」のサンプル（設計書 §10.1）。左に縦 Tabs → 右に設定項目（1 項目 = 見出し・説明・入力の 3 行）
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Divider } from "@/components/ui/divider";
import { Field } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { InputPassword } from "@/components/ui/input-password";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "@/components/ui/toast";
import { AppShell } from "../app-shell";

function SettingRow({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <div className="grid gap-2 py-4 sm:grid-cols-[1fr_280px] sm:items-center">
      <div className="flex flex-col gap-0.5">
        <span className="font-bold">{title}</span>
        <span className="text-2 text-text-low">{description}</span>
      </div>
      <div>{children}</div>
    </div>
  );
}

export default function SettingsSamplePage() {
  const [days, setDays] = useState(7);
  return (
    <AppShell current="settings">
      <div className="flex flex-col gap-4">
        <h1 className="text-6 font-bold">設定</h1>
        <Tabs defaultValue="general" orientation="vertical">
          <TabsList aria-label="設定のカテゴリ">
            <TabsTrigger value="general">一般</TabsTrigger>
            <TabsTrigger value="notifications">通知</TabsTrigger>
            <TabsTrigger value="account">アカウント</TabsTrigger>
          </TabsList>
          <TabsContent value="general" className="flex flex-col">
            <SettingRow title="表示言語" description="画面の言語。日付や数値の形式も変わります">
              <Select defaultValue="ja">
                <SelectTrigger aria-label="表示言語">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ja">日本語</SelectItem>
                  <SelectItem value="en">English</SelectItem>
                </SelectContent>
              </Select>
            </SettingRow>
            <Divider />
            <SettingRow title="1 ページの件数" description="一覧に表示する件数">
              <Select defaultValue="20">
                <SelectTrigger aria-label="1 ページの件数">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="20">20件</SelectItem>
                  <SelectItem value="50">50件</SelectItem>
                  <SelectItem value="100">100件</SelectItem>
                </SelectContent>
              </Select>
            </SettingRow>
          </TabsContent>
          <TabsContent value="notifications" className="flex flex-col">
            <SettingRow title="期限が近い案件を通知する" description="納期の前にメールで知らせます">
              <div className="flex items-center gap-2">
                <Switch id="notify-due" defaultChecked />
                <label htmlFor="notify-due" className="text-2">
                  有効
                </label>
              </div>
            </SettingRow>
            <Divider />
            <SettingRow title="通知する日数" description={`納期の ${days} 日前に通知します`}>
              <Slider
                label="通知する日数"
                min={1}
                max={30}
                value={[days]}
                onValueChange={([v]) => setDays(v ?? 7)}
              />
            </SettingRow>
            <Divider />
            <SettingRow title="週次レポート" description="毎週月曜に進捗をまとめて送ります">
              <div className="flex items-center gap-2">
                <Switch id="weekly" />
                <label htmlFor="weekly" className="text-2">
                  有効
                </label>
              </div>
            </SettingRow>
          </TabsContent>
          <TabsContent value="account" className="flex flex-col gap-4">
            <Field label="表示名" htmlFor="display-name">
              <Input id="display-name" defaultValue="五十棲" />
            </Field>
            <Field label="メールアドレス" htmlFor="email" description="通知の送り先になります">
              <Input
                id="email"
                type="email"
                defaultValue="isozumi@example.com"
                aria-describedby="email-description"
              />
            </Field>
            <Field
              label="新しいパスワード"
              htmlFor="password"
              description="8 文字以上。英字と数字を含めてください"
            >
              <InputPassword
                id="password"
                autoComplete="new-password"
                aria-describedby="password-description"
              />
            </Field>
            <div className="flex justify-end">
              <Button onClick={() => toast.success("アカウント設定を保存しました")}>
                保存する
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </AppShell>
  );
}
