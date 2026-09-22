# 部品の選び方

似た部品のどれを使うかを 1 枚にまとめた決定表です。ここで決めてから各部品ページの props を見ます。迷ったら「役割が違う部品を見た目で代用しない」を優先してください。

## 1. Dialog / Modal / Drawer / Popover / Tooltip

| 場面 | 使う部品 | 理由 |
|---|---|---|
| 取り消せない操作の直前に確認する | `Dialog` | 外側クリックでは閉じず、キャンセルと確定の 2 択で答えさせるため |
| その場で完結する 3 項目までの入力 | `Modal` | 背後を止めて短い入力だけを終わらせる。4 項目以上はページにする |
| 一覧を見たまま 1 件を確認・短く編集する | `Drawer`（`side="right"`） | 一覧の位置を保ったまま開ける（`side` は right / left / bottom） |
| 列の表示や並び順など、その場で見て閉じる短い設定 | `Popover` | トリガーのそばに小さく出て外側クリックで閉じる |
| アイコンだけのボタンの補足 | `Tooltip` | ホバーとフォーカスで出る 1 行。操作に必要な情報は置かない |

## 2. Table / DataGrid / DescriptionList

| 場面 | 使う部品 | 理由 |
|---|---|---|
| 5 行程度の静的な表 | `Table` | 状態を持たず、`density` と `numeric` だけで整うため |
| 数十行以上の業務一覧（ソート・選択・ページング） | `DataGrid` | 検索・ソート・選択・4 状態を内蔵しているため |
| 1 件の属性を「項目名: 値」で並べる | `DescriptionList` | 列の比較ではないので `<dl>` で読み上げ順を保つ。空値は「—」で残す |

## 3. Tag / Badge / StatusTag / FilterChip

| 場面 | 使う部品 | 理由 |
|---|---|---|
| 進行中・完了などの状態 | `StatusTag`（`status`） | 状態はステータス色で表すため（`Badge` は件数専用） |
| 未読数・件数 | `Badge`（`count` / `max`） | 数値だけを小さく示すため |
| 効いている絞り込み条件（外せる） | `Tag`（`variant="selected"` ＋ `onRemove`） | 外せることを × で示すため |
| 押して ON / OFF する絞り込み | `FilterChip`（`FilterChipGroup` の `label` は必須） | 押した瞬間に一覧が変わることを `aria-pressed` で伝えるため |

## 4. Select / SearchCombobox / SegmentedControl / RadioGroup / Checkbox / Switch

| 場面 | 使う部品 | 理由 |
|---|---|---|
| 候補が 4〜20 個の単一選択 | `Select` | キーボード操作とタイプアヘッドが自動で付くため |
| 候補が 20 個を超える／サジェストが要る | `SearchCombobox`（`label` 必須） | 絞り込みながら選べるため |
| 常に見えている 2〜5 択の切替 | `SegmentedControl` | 必ず 1 つ選ばれた状態を保つため（6 択以上は `Select`） |
| 2〜5 個の選択肢を全部見せて 1 つ選ぶ | `RadioGroup` + `RadioItem` | 並べて比較させるため |
| 複数選択・一覧の一括選択 | `Checkbox` | 一部選択を `checked="indeterminate"` で示せるため |
| 切り替えた瞬間に反映する ON/OFF | `Switch` | 送信して反映する項目は `Checkbox` にする |

## 5. Input / InputNumber / InputDate / InputTime / InputSearch / Textarea

| 場面 | 使う部品 | 理由 |
|---|---|---|
| 1 行の文字入力 | `Input` | ラベル・補足・エラーは `Form` / `Field` に任せられるため |
| 計算する数（金額・数量） | `InputNumber`（`unit`） | 増減と単位を持つ。電話番号・郵便番号・ID は `Input` |
| 日付を 1 つ選ぶ | `InputDate` | 値が `YYYY-MM-DD` に固定される。期間は 2 つ並べて `min` / `max` で縛る |
| 時刻を選ぶ | `InputTime`（`stepMinutes`） | 値が `HH:MM` に固定されるため |
| 一覧の検索欄 | `InputSearch` | クリアと絞り込みボタンを持つ。候補を出すなら `SearchCombobox` |
| 改行を含む自由記述 | `Textarea`（`maxLength`） | 文字数カウンタが出るため |

## 6. Toast / InlineMessage / FormMessage / Dialog

| 場面 | 使う部品 | 理由 |
|---|---|---|
| 操作が成功した（取り消し不要） | `toast.success` | 3 秒で消えてよい情報だから |
| 領域の読み込み・保存に失敗した | `InlineMessage variant="negative"` | 理由と「再試行する」を残す必要があるため |
| 入力が正しくない | `FormMessage` | 直す対象の項目のそばに出す必要があるため |
| これから起きることの確認 | `Dialog` | 実行前に止める必要があるため |

## 7. Spinner / Skeleton / Progress

| 場面 | 使う部品 | 理由 |
|---|---|---|
| ボタンの処理中・小さな領域の待ち | `Spinner`（Button は `loading`） | 場所を取らずに待ちを示すため |
| 一覧・カード群の読み込み | `Skeleton` / `SkeletonRows` | 実際の内容と同じ形で場所を確保するため |
| 割合が分かる処理（アップロード・取り込み） | `Progress`（`label` 必須） | 進み具合を数値で示すため（手順の進みは `Stepper`） |

## 8. Button / IconButton / Link

| 場面 | 使う部品 | 理由 |
|---|---|---|
| 画面の操作（保存・削除・追加） | `Button` | primary は 1 画面 1 つ、文言は「〜する」 |
| 文言を置けない補助操作（行末・閉じる） | `IconButton`（`label` 必須） | `label` が唯一のアクセシブルネームになるため |
| 画面が変わる移動 | `Link`（外部は `external`） | 操作ではなく移動だから |

## AI 向けの要約

- 状態は `StatusTag`、件数は `Badge`、外せる条件は `Tag`、押す絞り込みは `FilterChip`。役割で選ぶ。
- 確認は `Dialog`、短い入力は `Modal`、一覧を見たままなら `Drawer`、短い設定は `Popover`、補足は `Tooltip`。
- 表は 5 行程度なら `Table`、数十行以上で操作が要るなら `DataGrid`、1 件の属性は `DescriptionList`。
- 選択肢は 4〜20 個なら `Select`、20 個超は `SearchCombobox`、2〜5 択の切替は `SegmentedControl`、全部見せるなら `RadioGroup`。
- 成功は Toast、失敗は `InlineMessage`、入力エラーは `FormMessage`、確認は `Dialog`（[11-notifications.md](./11-notifications.md)）。
- 待ちはボタン内が `Spinner`、一覧が `Skeleton`、割合が分かるなら `Progress`。
