#!/usr/bin/env bash
# 使い方: pnpm new-component <kebab-name>
# src/components/ui/<kebab-name>/ に index.tsx / index.stories.tsx / index.test.tsx / README.md / item.json の雛形を作る。
set -euo pipefail

name="${1:-}"
if [ -z "$name" ] || ! printf '%s' "$name" | grep -Eq '^[a-z][a-z0-9-]*$'; then
  echo "使い方: pnpm new-component <kebab-name>（例: input-search）" >&2
  exit 1
fi

pascal=$(printf '%s' "$name" | awk -F- '{ for (i = 1; i <= NF; i++) printf "%s%s", toupper(substr($i, 1, 1)), substr($i, 2) }')
dir="src/components/ui/$name"

if [ -e "$dir" ]; then
  echo "$dir は既に存在します" >&2
  exit 1
fi
mkdir -p "$dir"

cat > "$dir/index.tsx" <<TSX
import type { ComponentProps } from "react";
import { cn } from "../../../lib/utils";

/**
 * ${pascal}
 *
 * 概要: （この部品が何をするものか、1〜2 行で）
 *
 * アンチパターン:
 * - （使ってはいけない場面・やりがちな誤用）
 *
 * 使用例:
 * \`\`\`tsx
 * <${pascal}>…</${pascal}>
 * \`\`\`
 */
export function ${pascal}({ className, ...props }: ComponentProps<"div">) {
  return <div data-slot="${name}" className={cn("", className)} {...props} />;
}
TSX

cat > "$dir/index.stories.tsx" <<TSX
import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { ${pascal} } from ".";

const meta = {
  title: "UI/${pascal}",
  component: ${pascal},
  tags: ["autodocs"],
} satisfies Meta<typeof ${pascal}>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { children: "${pascal}" },
};
TSX

cat > "$dir/index.test.tsx" <<TSX
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { ${pascal} } from ".";

describe("${pascal}", () => {
  it("表示: children を描画する", () => {
    render(<${pascal}>hello</${pascal}>);
    expect(screen.getByText("hello")).toBeInTheDocument();
  });
  it.todo("操作: ");
  it.todo("disabled: ");
  it.todo("アクセシブルネーム: ");
});
TSX

cat > "$dir/README.md" <<MD
# ${pascal}

> このファイルは \`pnpm build:readmes\` で index.tsx の JSDoc から再生成される（Phase 4）。それまでは手書き。

## 概要

## アンチパターン

## 使用例
MD

cat > "$dir/item.json" <<JSON
{
  "\$schema": "https://ui.shadcn.com/schema/registry-item.json",
  "name": "${name}",
  "type": "registry:ui",
  "title": "${pascal}",
  "description": "",
  "registryDependencies": [],
  "dependencies": [],
  "files": [{ "path": "src/components/ui/${name}/index.tsx", "type": "registry:ui" }],
  "meta": { "shadcnSource": null, "shadcnVersion": null }
}
JSON

echo "作成しました: $dir"
ls -1 "$dir"
