#!/usr/bin/env node
// Claude Code の Stop hook（設計書 §11.4、実装計画 A5）。応答終了時に nekodemo check を実行し、
// error があれば findings を stderr に出して exit 2（停止をブロックし、Claude が修正を続ける）。
// stop_hook_active（既にこの hook でブロックした後の応答）のときは無限ループを避けて exit 0 にし、警告だけ出す。
import { spawnSync } from "node:child_process";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..", "..");

let input = "";
try {
  input = await new Promise((resolve) => {
    let data = "";
    process.stdin.setEncoding("utf8");
    process.stdin.on("data", (c) => {
      data += c;
    });
    process.stdin.on("end", () => resolve(data));
    setTimeout(() => resolve(data), 500);
  });
} catch {
  input = "";
}
let stopHookActive = false;
try {
  stopHookActive = Boolean(JSON.parse(input || "{}").stop_hook_active);
} catch {
  stopHookActive = false;
}

const result = spawnSync(
  process.execPath,
  [join(ROOT, "scripts", "check", "index.mjs"), "src", "--strict"],
  {
    cwd: ROOT,
    encoding: "utf8",
  },
);
const output = `${result.stdout ?? ""}${result.stderr ?? ""}`.trim();

if (result.status === 0) process.exit(0);

if (stopHookActive) {
  console.error(
    `[nekodemo check] まだ error が残っていますが、無限ループを避けるため停止を許可します。\n${output}`,
  );
  process.exit(0);
}
console.error(`[nekodemo check] error があります。修正してから完了してください。\n${output}`);
process.exit(2);
