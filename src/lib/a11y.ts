// 開発時だけ出す a11y の警告（本番では何もしない）。読み上げ名を型で必須にすると Storybook の型推論と相性が悪いため、実行時に補う
const warned = new Set<string>();

/** `aria-label` も `aria-labelledby` も無い部品に、開発時だけ一度警告する（名前の無い radiogroup / tablist を防ぐ） */
export function warnMissingName(
  component: string,
  props: { "aria-label"?: string; "aria-labelledby"?: string },
): void {
  if (process.env.NODE_ENV === "production") return;
  if (props["aria-label"]?.trim() || props["aria-labelledby"]) return;
  if (warned.has(component)) return;
  warned.add(component);
  console.warn(
    `[nekodemo] ${component} に読み上げ名がありません。aria-label（例: "表示の切替"）か aria-labelledby を付けてください`,
  );
}
