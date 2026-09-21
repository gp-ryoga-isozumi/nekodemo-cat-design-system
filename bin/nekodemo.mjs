#!/usr/bin/env node
// nekodemo CLI（npm の bin）。v1 は `nekodemo check` だけ。設計書 §11.4 / §12。
//   nekodemo check [dir...] [--strict] [--format text|json]
import { spawn } from "node:child_process";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const HERE = dirname(fileURLToPath(import.meta.url));
const [command, ...rest] = process.argv.slice(2);

function usage() {
  console.log(`nekodemo <command>

  check [dir...] [--strict] [--format text|json]   役割トークン以外の色や既定パレット、猫版が無いアイコン等を検出する

詳細: https://github.com/gp-ryoga-isozumi/nekodemo-cat-design-system/blob/main/docs/ai/USING_NEKODEMO.md`);
}

if (!command || command === "--help" || command === "-h") {
  usage();
  process.exit(command ? 0 : 1);
}

if (command === "check") {
  const script = join(HERE, "..", "scripts", "check", "index.mjs");
  const child = spawn(process.execPath, [script, ...rest], { stdio: "inherit" });
  child.on("exit", (code) => process.exit(code ?? 1));
} else {
  console.error(`不明なコマンド: ${command}`);
  usage();
  process.exit(1);
}
