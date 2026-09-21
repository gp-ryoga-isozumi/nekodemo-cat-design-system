# Form

> このファイルは `pnpm build:readmes` が `index.tsx` の JSDoc から生成する。手で編集せず JSDoc を直す。

## 概要

react-hook-form ＋ zod でフォームを組む土台（設計書 §9.1 #24）。ラベル・補足・エラーの配置を固定し、
`aria-describedby` / `aria-invalid` を自動で結ぶ（§10.7）。

## 構成

Form（FormProvider）> FormField（Controller）> FormItem > FormLabel / FormControl / FormDescription / FormMessage。
単純な項目には Field（ラベル・補足・エラーだけの静的版）を使える。

## アンチパターン

- エラー文を「入力が不正です」だけにする（何が起きたか＋どうすればよいか。§10.4）
- placeholder に必須情報を書く
- フォームの保存後に編集画面に留まる（詳細か一覧に戻して Toast。§10.3）

## 使用例

```tsx
const form = useForm({ resolver: zodResolver(schema) });
<Form {...form}>
  <form onSubmit={form.handleSubmit(onSubmit)}>
    <FormField control={form.control} name="name" render={({ field }) => (
      <FormItem>
        <FormLabel required>顧客名</FormLabel>
        <FormControl><Input placeholder="例: 山田商事" {...field} /></FormControl>
        <FormDescription>顧客に見せる名前になります</FormDescription>
        <FormMessage />
      </FormItem>
    )} />
  </form>
</Form>
```
