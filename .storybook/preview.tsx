import type { Preview } from "@storybook/nextjs-vite";
import { NekoThemeProvider } from "../src/components/theme/NekoThemeProvider";
import { defaultNekoTheme, isNekoThemeId, nekoThemes } from "../src/themes/registry";
import "../src/styles/globals.css";

const preview: Preview = {
  globalTypes: {
    nekoTheme: {
      description: "nekodemo のテーマ（data-neko-theme）",
      toolbar: {
        title: "テーマ",
        icon: "paintbrush",
        items: nekoThemes.map((t) => ({ value: t.id, title: `${t.label.ja}（${t.scheme}）` })),
        dynamicTitle: true,
      },
    },
  },
  initialGlobals: { nekoTheme: defaultNekoTheme },
  decorators: [
    (Story, context) => {
      const theme = isNekoThemeId(context.globals.nekoTheme)
        ? context.globals.nekoTheme
        : defaultNekoTheme;
      // key を変えて Provider を作り直し、<html data-neko-theme> を切り替える
      return (
        <NekoThemeProvider key={theme} defaultTheme={theme}>
          <Story />
        </NekoThemeProvider>
      );
    },
  ],
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
    backgrounds: { disable: true },
  },
};

export default preview;
