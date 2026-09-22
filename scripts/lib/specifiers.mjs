// dist/ の相対 import に拡張子を補う（tsc は書き換えないため。Node ESM は拡張子なし・ディレクトリの import を解決できない）。
// 純関数にして build-package.mjs から使い、テストで網羅する。
const SPEC_RE = /((?:from|import)\s*\(?\s*["'])(\.{1,2}\/[^"']+)(["'])/g;

/**
 * @param {string} src ファイルの中身
 * @param {{ isDts: boolean, fileExists: (absNoExt: string) => boolean, isDirectory: (abs: string) => boolean, resolve: (spec: string) => string }} env
 *   fileExists には拡張子を除いた絶対パスを渡す（.js / .d.ts のどちらを見るかは isDts で決める）
 */
export function rewriteSpecifiers(src, env) {
  return src.replace(SPEC_RE, (m, pre, spec, post) => {
    if (/\.(js|mjs|cjs|css|json)$/.test(spec)) return m;
    const abs = env.resolve(spec);
    if (env.fileExists(`${abs}${env.isDts ? ".d.ts" : ".js"}`)) return `${pre}${spec}.js${post}`;
    if (env.isDirectory(abs)) return `${pre}${spec}/index.js${post}`;
    return m;
  });
}
