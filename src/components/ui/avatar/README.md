# Avatar

> このファイルは `pnpm build:readmes` が `index.tsx` の JSDoc から生成する。手で編集せず JSDoc を直す。

## 概要

人やアカウントを表す丸い画像（設計書 §9.1 #12）。画像が無いときは `fallback` の文字か、
省略時は猫の顔のシルエット（D13）。

## アンチパターン

- `name` を省略する（読み上げに必要）
- 会社や物に使う（人・アカウント用）

## 使用例

```tsx
<Avatar name="五十棲" src="/me.png" />
<Avatar name="五十棲" fallback="五十" size="lg" />
<Avatar name="ゲスト" size="sm" />
```
