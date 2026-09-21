import { type ClassValue, clsx } from "clsx";
import { extendTailwindMerge } from "tailwind-merge";

const TEXT_STEPS = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"];
const TEXT_ALIASES = ["xs", "sm", "base", "lg", "xl", "2xl", "3xl", "4xl"];

// tailwind-merge は既定だと `text-2` のような数値の文字サイズを「色」と誤判定し、
// `text-text-on-primary text-2` の並びで色クラスを落としてしまう。nekodemo の文字サイズ段階を font-size として登録する。
const twMerge = extendTailwindMerge({
  extend: {
    classGroups: {
      "font-size": [{ text: [...TEXT_STEPS, ...TEXT_ALIASES] }],
      rounded: [{ rounded: ["action", "container", "modal", "notice", "round"] }],
      shadow: [{ shadow: ["raise", "float", "popout"] }],
    },
  },
});

/** Tailwind クラスを結合し、重複・競合するユーティリティを後勝ちで解決する。 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}
