# Toast

> このファイルは `pnpm build:readmes` が `index.tsx` の JSDoc から生成する。手で編集せず JSDoc を直す。

## 概要

操作結果の一時的な通知（設計書 §9.1 #8、§10.2）。成功は 3 秒で消える。
`<Toaster />` をアプリのルート（NekoThemeProvider の内側）に 1 つ置き、`toast.success("案件を保存しました")` で出す。
画面遷移を伴う保存は遷移先で出す（§10.3）。種別アイコンは猫耳版。

## アンチパターン

- エラーの詳細や再試行を Toast にだけ出す（InlineMessage を該当箇所に）
- 同時に何個も出す
- 確認が必要な操作の結果に使う（Dialog）

## 使用例

```tsx
<Toaster />
toast.success("案件を保存しました");
toast.error("保存できませんでした", { description: "通信が切れています。再試行してください。" });
```
