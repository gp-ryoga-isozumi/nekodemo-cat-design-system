// 生成物: scripts/build-themes.mjs が themes/*.json から生成する。手で編集しない（pnpm build:themes）。

/**
 * NekoHead
 *
 * 概要: <head> に置く。全テーマのフォント（Google Fonts）と Material Symbols Rounded（猫版が無いアイコンのフォールバック）の
 * <link> を出し、persist 時は hydration 前に localStorage のテーマを <html data-neko-theme> に反映する inline script を出す（ちらつき防止）。
 *
 * アンチパターン:
 * - <body> 内に置く（フォントの preconnect が遅れる）
 * - persist=false なのに NekoThemeProvider に persist を渡す（保存はされるが初回表示が既定テーマになる）
 *
 * 使用例:
 * ```tsx
 * <html lang="ja" data-neko-theme="calico">
 *   <head><NekoHead /></head>
 * ```
 */
export function NekoHead({ persist = true }: { persist?: boolean }) {
  return (
    <>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Zen+Maru+Gothic:wght@400;700&family=Noto+Sans+Mono:wght@400;700&display=swap" />
      <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Rounded:opsz,wght,FILL,GRAD@20..48,500,0..1,0&display=block" />
      {persist ? (
        // biome-ignore lint/security/noDangerouslySetInnerHtml: 固定文字列（テーマ ID の一覧）で、利用者入力は含まない
        <script dangerouslySetInnerHTML={{ __html: "(function(){try{var t=localStorage.getItem(\"neko-theme\");if(t&&[\"calico\",\"american-shorthair\",\"russian-blue\"].indexOf(t)>=0){document.documentElement.setAttribute(\"data-neko-theme\",t)}}catch(e){}})();" }} />
      ) : null}
    </>
  );
}
