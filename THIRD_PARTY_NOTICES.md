# Third-party notices

nekodemo は次のオープンソースソフトウェアとデザイン資産を利用・参考にしています。各ライセンスの全文は `node_modules/<package>/LICENSE` を参照してください。

| 名前 | ライセンス | 用途 |
|---|---|---|
| [shadcn/ui](https://github.com/shadcn-ui/ui) | MIT | 部品の実装の土台（copy-in して役割トークンと猫耳アイコンに置き換え） |
| [Radix UI](https://github.com/radix-ui/primitives)（`radix-ui`） | MIT | アクセシブルな部品のプリミティブ |
| [Material Symbols](https://github.com/google/material-design-icons)（`@material-symbols/svg-500`、Material Symbols Rounded フォント） | Apache-2.0 | アイコンの名前体系、自動耳の元 SVG、猫版が無いアイコンのフォールバック |
| [Tailwind CSS](https://github.com/tailwindlabs/tailwindcss) / `tw-animate-css` | MIT | ユーティリティ CSS |
| [class-variance-authority](https://github.com/joe-bell/cva) / [clsx](https://github.com/lukeed/clsx) / [tailwind-merge](https://github.com/dcastil/tailwind-merge) | Apache-2.0 / MIT / MIT | クラス名の組み立て |
| [sonner](https://github.com/emilkowalski/sonner) | MIT | Toast |
| [TanStack Table](https://github.com/TanStack/table) / [TanStack Virtual](https://github.com/TanStack/virtual) | MIT | DataGrid の状態（ソート・絞り込み・ページング・選択・列幅）と行の仮想化 |
| [MUI](https://github.com/mui/material-ui)（`@mui/material/useAutocomplete`） | MIT | SearchCombobox の挙動（ヘッドレスフック。emotion は使わない） |
| [react-hook-form](https://github.com/react-hook-form/react-hook-form) / [zod](https://github.com/colinhacks/zod) / `@hookform/resolvers` | MIT | Form |
| [culori](https://github.com/Evercoder/culori) | MIT | コントラスト検査（ビルド時） |
| [sharp](https://github.com/lovell/sharp) / [svgpath](https://github.com/fontello/svgpath) / [svg-path-bbox](https://github.com/mondeja/svg-path-bbox) | Apache-2.0 / MIT / BSD-3-Clause | 自動耳の生成（ビルド時） |
| [ajv](https://github.com/ajv-validator/ajv) | MIT | テーマ JSON の検証（ビルド時） |
| Google Fonts: [Zen Maru Gothic](https://fonts.google.com/specimen/Zen+Maru+Gothic) / [Noto Sans Mono](https://fonts.google.com/specimen/Noto+Sans+Mono) | SIL Open Font License 1.1 | フォント（CDN から読み込み） |

## 参考にした公開情報

- [Sparkle Design](https://sparkle-design.goodpatch.com/) の公開ガイドライン（トークン階層・部品仕様・提供方法の考え方）を参考にした独立したプロジェクトです。Sparkle Design のガイドライン本文・図・アイコン・コードは含んでおらず、名称も使用していません。
