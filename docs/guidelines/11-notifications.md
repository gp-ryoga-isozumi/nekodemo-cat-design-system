# 知らせ方の選び方

利用者に何かを伝えるときに、どこへ出すかのルールです。5 項目あります。[02-states.md](./02-states.md) の 4 状態のうち「エラー」「成功」を、場面ごとに分けたものです。

## 1. 5 つから選ぶ

| 伝えたいこと | 使うもの |
|---|---|
| 操作が成功した（取り消し不要） | `toast.success`（3 秒で消える） |
| 操作が失敗した／その領域を読み込めない | `InlineMessage variant="negative"` ＋ `action` に「再試行する」 |
| 入力が正しくない | `FormMessage`（項目のすぐ下） |
| これから起きることの確認（取り消し不可） | `Dialog` |
| 常に効いている制約・予定 | `InlineMessage variant="info"` を該当領域の上に置いたまま |

## 2. エラーを Toast だけで伝えない

Toast は 3 秒で消えるので、失敗の理由と次の操作を残せません。失敗は必ず、失敗した領域のすぐ上の `InlineMessage` に出します。Toast を併用してもかまいませんが、Toast だけにしません。全画面エラーにも置き換えません。

- 良い例: 一覧の上に `InlineMessage variant="negative"`、本文に「案件を読み込めませんでした。通信状況を確認してください。」、`action` に「再試行する」
- 悪い例: `toast.error("読み込みに失敗しました")` だけで済ませる

## 3. 同時に複数出さない

`<Toaster />` はアプリのルート（`NekoThemeProvider` の内側）に 1 つだけ置き、Toast は 1 度に 1 つにします。同じ画面に `InlineMessage` を 2 つ以上並べません（1 つにまとめます）。`InlineMessage` の本文には「何が起きたか」と「どうすればよいか」の両方を書きます（[04-writing.md](./04-writing.md) の 2）。

## 4. 取り消せる操作は Toast の action に「取り消す」を置く

元に戻せる削除・非表示は、確認 `Dialog` をやめて、実行 → `toast.success` の `action` に「取り消す」を置く形にできます。戻せない操作は必ず `Dialog` で確認します（[03-actions.md](./03-actions.md) の 2）。取り消せるかどうかで形を決め、同じ画面で両方を混ぜません。

## 5. 通知の色は状態の意味どおりに使う

`variant` は info（補足）/ success（成功）/ warning（注意）/ negative（失敗）の意味どおりに使い、目立たせたいだけの理由で選びません。お知らせバナーに success や warning を使うのは不可です（[05-spacing-and-color.md](./05-spacing-and-color.md) の 4）。件数や状態のラベルは通知ではないので、`Badge`（件数）と `StatusTag`（状態）を使います。

## AI 向けの要約

- 成功は `toast.success`（3 秒）、失敗は `InlineMessage variant="negative"` ＋「再試行する」、入力エラーは `FormMessage`、取り消し不可の確認は `Dialog`。
- エラーを Toast だけで伝えない。失敗した領域のすぐ上に出す。全画面エラーにしない。
- `<Toaster />` はルートに 1 つ、Toast は同時に 1 つ、`InlineMessage` は 1 画面に 1 つにまとめる。
- 元に戻せる操作は `Dialog` をやめて Toast の `action`「取り消す」にしてよい。戻せない操作は必ず `Dialog`。
- `variant` は info / success / warning / negative の意味どおりに使い、目立たせる目的で選ばない。
