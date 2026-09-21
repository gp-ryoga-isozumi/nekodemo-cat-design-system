#!/usr/bin/env bash
# Claude Code PreToolUse hook（matcher: Bash）。本体は同じディレクトリの irreversible-ops-guard.mjs。
exec node "$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)/irreversible-ops-guard.mjs"
