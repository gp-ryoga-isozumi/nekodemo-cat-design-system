import type { Preview } from "@storybook/nextjs-vite";
import "../src/styles/globals.css";

// Phase 2 で globalTypes.nekoTheme（テーマ切替ツールバー）とデコレータを追加する。
const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    a11y: {
      // a11y 違反は CI で失敗させる（設計書 Phase 4 完成条件「a11y アドオンの違反 0」）
      test: "error",
    },
  },
};

export default preview;
