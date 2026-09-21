// build:package の後処理。Phase 0 では dist/ の存在確認のみ。
// Phase 5 で styles.css（tokens.css + themes.css）の結合と ai/ のコピーを実装する。
import { existsSync } from "node:fs";

if (!existsSync("dist/index.js")) {
  console.error(
    "[build:package] dist/index.js がありません。tsc -p tsconfig.build.json の出力を確認してください。",
  );
  process.exit(1);
}
console.log("[build:package] dist/ を生成しました（styles.css / ai/ の同梱は Phase 5 で実装）。");
