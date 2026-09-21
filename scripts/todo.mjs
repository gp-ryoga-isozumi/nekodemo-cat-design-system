// まだ実装していないスクリプトの案内。prompt/IMPLEMENTATION_PLAN.md のフェーズに対応する。
const phases = {
  "build:tokens": "Phase 1",
  "build:themes": "Phase 2",
  "check:contrast": "Phase 2",
  screenshots: "Phase 2",
  "icons:list": "Phase 3a",
  "icons:ears": "Phase 3a",
  "build:icons": "Phase 3a",
  "icons:vectorize": "Phase 3b",
  "icons:audit": "Phase 3b",
  check: "Phase 4",
  "build:readmes": "Phase 4",
  "build:registry": "Phase 5",
};
const name = process.argv[2] ?? "(unknown)";
console.error(
  `[nekodemo] "${name}" は ${phases[name] ?? "後続フェーズ"} で実装予定です（prompt/IMPLEMENTATION_PLAN.md 参照）。`,
);
process.exit(1);
