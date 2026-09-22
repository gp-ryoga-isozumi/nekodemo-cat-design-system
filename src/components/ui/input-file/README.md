# InputFile

> このファイルは `pnpm build:readmes` が `index.tsx` の JSDoc から生成する。手で編集せず JSDoc を直す。

## 概要

ファイルの添付（v1.2）。ドロップ領域と「ファイルを選ぶ」ボタン、選択済みファイルの一覧（名前・サイズ・外す）を
1 つにまとめたもの。`accept` / `maxSizeMB` / `maxFiles` で受け付ける条件を決め、外れたファイルは `onReject` に
理由付きで渡す（画面側で InlineMessage に出す）。アップロード自体は行わず、`File[]` を返すだけ。
中の `<input type="file">` は視覚的に隠すがタブ順に残す（Enter でファイル選択が開く）。見えている「ファイルを選ぶ」は
マウス用の本物のボタンで、押すとその input を開く。

## アンチパターン

- 受け付ける種類と上限を文言で示さない（`accept` と `maxSizeMB` は説明にも書く。「PDF・画像、10 MB まで」）
- 選んだ直後に自動でアップロードして、外せなくする（保存ボタンまでは一覧で確認できるようにする）
- `<label>` を付けない（Form の Field で付ける）

## 推奨例

- 見積書・契約書の添付は `accept=".pdf,image/*" maxSizeMB={10}` にし、説明に同じ条件を書く
- 複数添付は `multiple maxFiles={5}` にし、一覧で 1 件ずつ外せるようにする
- 拒否したときは `onReject` で InlineMessage（negative）に「PDF か画像だけ添付できます」と出す

## 使用例

```tsx
<InputFile id="attachments" multiple accept=".pdf,image/*" maxSizeMB={10} maxFiles={5}
  value={files} onValueChange={setFiles} onReject={(f, why) => setError(`${f.name}: ${why}`)} />
```
