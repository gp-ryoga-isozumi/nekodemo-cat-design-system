// @vitest-environment node
// jsdom 環境では import.meta.url が file: にならないため、この Node スクリプトのテストは node 環境で実行する。
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

const script = fileURLToPath(new URL("./irreversible-ops-guard.mjs", import.meta.url));

function run(command) {
  const result = spawnSync(process.execPath, [script], {
    input: JSON.stringify({ tool_input: { command } }),
    encoding: "utf8",
  });
  return result.status;
}

describe("irreversible-ops-guard", () => {
  it.each([
    "npm publish",
    "pnpm publish --access public",
    "cd /x && pnpm publish",
    "git push --force origin main",
    "git push -f",
    "git push origin v1.0.0",
    "git push origin :refs/tags/v1",
    "git push --tags",
    "gh release create v1.0.0",
    "git tag -d v1.0.0",
  ])("ブロックする（exit 2）: %s", (command) => {
    expect(run(command)).toBe(2);
  });

  it.each([
    "pnpm test",
    "git push origin main",
    "git push -u origin main",
    "gh repo create x --public --push",
    "NEKODEMO_CONFIRM=1 npm publish",
    "cd /x && NEKODEMO_CONFIRM=1 pnpm publish",
    "cat > a.md <<'EOF'\n- `npm publish` は hook でブロックされる\nEOF",
  ])("通す（exit 0）: %s", (command) => {
    expect(run(command)).toBe(0);
  });

  it("JSON でない入力は通す", () => {
    const result = spawnSync(process.execPath, [script], { input: "not json", encoding: "utf8" });
    expect(result.status).toBe(0);
  });
});
