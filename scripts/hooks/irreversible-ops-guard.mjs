#!/usr/bin/env node
// Claude Code の PreToolUse hook（matcher: Bash）の本体。
// scripts/hooks/irreversible-ops-guard.sh から呼ばれる。設計書 §17.4。
//
// 不可逆操作（レジストリへの公開・取り消し、GitHub Release、タグ push、force push、タグ削除）を検出し、
// 理由を stderr に出して exit 2（ブロック）する。
//
// 判定は「コマンド位置」（行頭、または && / || / ; / | の直後）でのみ行う。
// heredoc やドキュメント本文の途中に語が現れただけでは反応しない（行頭にあると反応する）。
// 利用者が操作を明示したときだけ、そのコマンドの直前に "NEKODEMO_CONFIRM=1 " を付けて実行する
// （コマンド単位の承認。環境変数として export したものは見ない）。

const CONFIRM_PREFIX = "NEKODEMO_CONFIRM=1 ";

const rules = [
  {
    name: "パッケージレジストリへの公開・取り消し",
    re: /^(sudo\s+)?(npm|pnpm|yarn|npx)\s+(publish|unpublish|deprecate)\b/,
  },
  {
    name: "GitHub Release の作成・削除",
    re: /^(sudo\s+)?gh\s+release\s+(create|delete)\b/,
  },
  {
    name: "タグ push / force push / リモート参照の削除",
    re: /^(sudo\s+)?git\s+push\b(?=.*(--tags|--force|--force-with-lease|--delete|refs\/tags\/|\s-f(\s|$)|\s:\S|\sv?\d+\.\d+))/,
  },
  {
    name: "タグの削除",
    re: /^(sudo\s+)?git\s+tag\s+(-d|--delete)\b/,
  },
];

let data = "";
process.stdin.setEncoding("utf8");
process.stdin.on("data", (chunk) => {
  data += chunk;
});
process.stdin.on("end", () => {
  let command = "";
  try {
    command = String(JSON.parse(data)?.tool_input?.command ?? "");
  } catch {
    command = "";
  }
  if (!command) process.exit(0);

  const segments = command
    .split(/\r?\n|&&|\|\||;|\|/)
    .map((s) => s.trim())
    .filter(Boolean);

  const hits = [];
  for (const segment of segments) {
    if (segment.startsWith(CONFIRM_PREFIX)) continue;
    for (const rule of rules) {
      if (rule.re.test(segment)) hits.push({ segment, rule });
    }
  }

  if (hits.length === 0) process.exit(0);

  console.error("nekodemo guard: 不可逆操作を検出したためブロックしました。");
  for (const hit of hits) {
    console.error(`  [${hit.rule.name}] ${hit.segment}`);
  }
  console.error(
    `利用者がこの操作を明示的に承認している場合のみ、そのコマンドの直前に ${CONFIRM_PREFIX.trim()} を付けて再実行してください。`,
  );
  process.exit(2);
});
