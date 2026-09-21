import type { NextConfig } from "next";

// GitHub Pages（https://gp-ryoga-isozumi.github.io/nekodemo-cat-design-system/）に
// 静的書き出しする。basePath は環境変数で切り替える（ローカル開発時は空）。
const basePath = process.env.NEXT_BASE_PATH ?? "";

const nextConfig: NextConfig = {
  output: "export",
  basePath,
  trailingSlash: true,
  images: { unoptimized: true },
  // 親ディレクトリにある lockfile をワークスペースのルートと誤認しないようにする
  turbopack: { root: import.meta.dirname },
};

export default nextConfig;
