// nekodemo-check-ignore-file NK010 — 解剖図（構成要素の名前と配置）。主要部品の骨組みを番号付きで描く。
// 実物ではなく「線画」なので、面は surface-well / 枠は border-middle の役割トークンだけで描く。
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export type AnatomyPart = { n: number; name: string; description: string };

function Marker({ n, className }: { n: number; className?: string }) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        "absolute z-[1] flex size-5 items-center justify-center rounded-round bg-surface-primary font-bold font-mono text-1 text-text-on-primary shadow-raise",
        className,
      )}
    >
      {n}
    </span>
  );
}

/** 点線の枠（構成要素の範囲） */
function Box({
  n,
  markerClass = "-top-2 -left-2",
  className,
  children,
  label,
}: {
  n?: number;
  markerClass?: string;
  className?: string;
  children?: ReactNode;
  label?: string;
}) {
  return (
    <div
      className={cn(
        "relative rounded-action border border-border-middle border-dashed bg-surface-card",
        className,
      )}
    >
      {n !== undefined ? <Marker n={n} className={markerClass} /> : null}
      {label ? <span className="text-2 text-text-middle">{label}</span> : null}
      {children}
    </div>
  );
}

function Bar({ w = "w-24", className }: { w?: string; className?: string }) {
  return <span className={cn("block h-2 rounded-round bg-border-middle", w, className)} />;
}

function Dot({ className }: { className?: string }) {
  return <span className={cn("block size-4 rounded-notice bg-border-middle", className)} />;
}

const FIGURES: Record<string, { parts: AnatomyPart[]; figure: ReactNode }> = {
  button: {
    parts: [
      {
        n: 1,
        name: "Container",
        description:
          "高さ sm 32 / md 40 / lg 48、角丸 rounded-action、variant で面と枠の色が変わる",
      },
      {
        n: 2,
        name: "Leading icon",
        description: "任意。Icon size 4。loading のときは Spinner に置き換わる",
      },
      { n: 3, name: "Label", description: "「保存する」のように動作で書く。font-bold" },
      { n: 4, name: "Trailing icon", description: "任意。外部リンクや展開の矢印" },
    ],
    figure: (
      <Box n={1} markerClass="-top-3 -left-3" className="inline-flex h-12 items-center gap-3 px-5">
        <Box n={2} markerClass="-bottom-3 -left-1" className="p-0.5">
          <Dot />
        </Box>
        <Box n={3} markerClass="-bottom-3 left-1/2 -translate-x-1/2" className="px-2 py-1">
          <Bar w="w-16" />
        </Box>
        <Box n={4} markerClass="-bottom-3 -right-1" className="p-0.5">
          <Dot />
        </Box>
      </Box>
    ),
  },
  input: {
    parts: [
      {
        n: 1,
        name: "Label",
        description: "Form の FormLabel / Field が付ける。必須は「必須」の語で示す",
      },
      {
        n: 2,
        name: "Container",
        description:
          "高さ sm 32 / md 40 / lg 48、bg-surface-input、枠 border-border-high。focus で border-focus とリング、invalid で negative",
      },
      {
        n: 3,
        name: "Value / Placeholder",
        description: "placeholder は入力例だけ（text-text-placeholder）",
      },
      {
        n: 4,
        name: "Description / Message",
        description: "補足は text-text-low、エラーは text-text-negative（aria-describedby で結ぶ）",
      },
    ],
    figure: (
      <div className="flex w-72 flex-col gap-1.5">
        <Box n={1} className="w-fit px-2 py-0.5">
          <Bar w="w-12" />
        </Box>
        <Box n={2} className="flex h-10 items-center px-3">
          <Box n={3} markerClass="-bottom-3 -left-1" className="px-2 py-1">
            <Bar w="w-24" className="bg-border-low" />
          </Box>
        </Box>
        <Box n={4} className="w-fit px-2 py-0.5">
          <Bar w="w-32" />
        </Box>
      </div>
    ),
  },
  select: {
    parts: [
      {
        n: 1,
        name: "Trigger",
        description: "Input と同じ高さ・枠。SelectValue に選択中の値か placeholder",
      },
      { n: 2, name: "Chevron", description: "耳なしの keyboard_arrow_down" },
      {
        n: 3,
        name: "Content（一覧）",
        description: "shadow-float の面。SelectGroup / SelectLabel で見出し",
      },
      { n: 4, name: "Item", description: "選択中は check アイコン、ハイライトは bg-surface-well" },
    ],
    figure: (
      <div className="flex w-64 flex-col gap-2">
        <Box n={1} className="flex h-10 items-center justify-between px-3">
          <Bar w="w-20" />
          <Box n={2} markerClass="-top-3 -right-1" className="p-0.5">
            <Dot className="size-3" />
          </Box>
        </Box>
        <Box n={3} className="flex flex-col gap-1 p-1 shadow-float">
          <Box n={4} className="flex items-center gap-2 bg-surface-well px-2 py-1.5">
            <Dot className="size-3" />
            <Bar w="w-24" />
          </Box>
          <div className="px-2 py-1.5">
            <Bar w="w-20" />
          </div>
          <div className="px-2 py-1.5">
            <Bar w="w-28" />
          </div>
        </Box>
      </div>
    ),
  },
  table: {
    parts: [
      {
        n: 1,
        name: "Container",
        description: "rounded-container の枠。横にあふれる列は横スクロール",
      },
      {
        n: 2,
        name: "Header",
        description: "bg-surface-well、上に固定。TableHead に sort / numeric",
      },
      {
        n: 3,
        name: "Row / Cell",
        description: "行高 density xs 40 / sm 56 / md 80。数値は numeric で右寄せ等幅",
      },
      { n: 4, name: "Row actions", description: "行末の IconButton か Menu" },
      { n: 5, name: "Caption", description: "表の下の補足（任意）" },
    ],
    figure: (
      <Box n={1} className="w-80 p-0">
        <Box
          n={2}
          className="flex gap-4 rounded-none rounded-t-action border-0 border-b bg-surface-well px-3 py-2"
        >
          <Bar w="w-16" />
          <Bar w="w-12" />
          <Bar w="w-10 ml-auto" />
        </Box>
        {[0, 1].map((i) => (
          <Box
            key={i}
            n={i === 0 ? 3 : undefined}
            className="flex items-center gap-4 rounded-none border-0 border-b px-3 py-3"
          >
            <Bar w="w-24" />
            <Bar w="w-12" className="bg-border-low" />
            <Box
              n={i === 0 ? 4 : undefined}
              markerClass="-top-3 -right-1"
              className="ml-auto p-0.5"
            >
              <Dot className="size-3" />
            </Box>
          </Box>
        ))}
        <Box n={5} className="rounded-none rounded-b-action border-0 px-3 py-2">
          <Bar w="w-32" className="bg-border-low" />
        </Box>
      </Box>
    ),
  },
  dialog: {
    parts: [
      { n: 1, name: "Overlay", description: "bg-surface-overlay。背後の操作を止める" },
      { n: 2, name: "Panel", description: "rounded-modal、shadow-popout、幅 sm:max-w-md" },
      {
        n: 3,
        name: "Title / Description",
        description: "問いの形（「この案件を削除しますか？」）と影響範囲",
      },
      {
        n: 4,
        name: "Footer",
        description:
          "右寄せで DialogCancel（キャンセル）と DialogAction（negative の「削除する」）",
      },
    ],
    figure: (
      <Box n={1} className="w-80 bg-surface-well p-6">
        <Box n={2} className="flex flex-col gap-3 rounded-modal p-4 shadow-popout">
          <Box n={3} className="flex flex-col gap-2 px-2 py-1">
            <Bar w="w-40" />
            <Bar w="w-48" className="bg-border-low" />
          </Box>
          <Box n={4} className="flex justify-end gap-2 px-2 py-1">
            <Bar w="w-14" className="h-6 rounded-action" />
            <Bar w="w-14" className="h-6 rounded-action bg-surface-negative" />
          </Box>
        </Box>
      </Box>
    ),
  },
  drawer: {
    parts: [
      {
        n: 1,
        name: "Overlay",
        description: "bg-surface-overlay。背後の一覧は見えるが操作できない",
      },
      { n: 2, name: "Panel", description: "右（既定）/ 左 / 下から出る。右は幅 400〜480px" },
      {
        n: 3,
        name: "Header",
        description: "DrawerTitle（項目名）と DrawerDescription、閉じる IconButton",
      },
      { n: 4, name: "Body", description: "内容。長ければここだけスクロール" },
      { n: 5, name: "Footer", description: "右寄せで「閉じる」と主ボタン 1 つ" },
    ],
    figure: (
      <Box n={1} className="flex h-56 w-80 justify-end bg-surface-well p-0">
        <Box
          n={2}
          markerClass="-top-2 -left-2"
          className="flex w-40 flex-col rounded-none shadow-popout"
        >
          <Box
            n={3}
            className="flex items-center justify-between rounded-none border-0 border-b p-3"
          >
            <Bar w="w-16" />
            <Dot className="size-3" />
          </Box>
          <Box n={4} className="flex flex-1 flex-col gap-2 rounded-none border-0 p-3">
            <Bar w="w-24" className="bg-border-low" />
            <Bar w="w-20" className="bg-border-low" />
          </Box>
          <Box n={5} className="flex justify-end gap-2 rounded-none border-0 border-t p-3">
            <Bar w="w-10" className="h-5 rounded-action" />
            <Bar w="w-10" className="h-5 rounded-action bg-surface-primary" />
          </Box>
        </Box>
      </Box>
    ),
  },
  card: {
    parts: [
      {
        n: 1,
        name: "Container",
        description: "rounded-container、bg-surface-card、shadow-raise。入れ子にしない",
      },
      {
        n: 2,
        name: "Header",
        description: "CardTitle（見出し）と CardDescription、右上に CardAction",
      },
      { n: 3, name: "Content", description: "本文。DescriptionList や Form の項目" },
      { n: 4, name: "Footer", description: "補助操作（outline / ghost の Button）" },
    ],
    figure: (
      <Box n={1} className="w-72 shadow-raise">
        <Box n={2} className="flex items-start justify-between rounded-none border-0 border-b p-3">
          <div className="flex flex-col gap-1.5">
            <Bar w="w-24" />
            <Bar w="w-32" className="bg-border-low" />
          </div>
          <Dot className="size-3" />
        </Box>
        <Box n={3} className="flex flex-col gap-2 rounded-none border-0 p-3">
          <Bar w="w-40" className="bg-border-low" />
          <Bar w="w-36" className="bg-border-low" />
        </Box>
        <Box n={4} className="flex rounded-none border-0 border-t p-3">
          <Bar w="w-16" className="h-5 rounded-action" />
        </Box>
      </Box>
    ),
  },
  tabs: {
    parts: [
      { n: 1, name: "List", description: "TabsList（aria-label 必須）。横は下線、縦は左の帯" },
      {
        n: 2,
        name: "Trigger",
        description: "選択中は text-text-high と primary の下線、他は text-text-middle",
      },
      { n: 3, name: "Content", description: "選択中のタブに対応する内容。上に 16px の余白" },
    ],
    figure: (
      <div className="flex w-72 flex-col gap-3">
        <Box n={1} className="flex gap-4 rounded-none border-0 border-b px-1">
          <Box
            n={2}
            markerClass="-top-3 -left-1"
            className="rounded-none border-0 border-surface-primary border-b-2 px-1 pb-2"
          >
            <Bar w="w-12" />
          </Box>
          <div className="px-1 pb-2">
            <Bar w="w-10" className="bg-border-low" />
          </div>
          <div className="px-1 pb-2">
            <Bar w="w-14" className="bg-border-low" />
          </div>
        </Box>
        <Box n={3} className="flex flex-col gap-2 p-3">
          <Bar w="w-48" className="bg-border-low" />
          <Bar w="w-40" className="bg-border-low" />
        </Box>
      </div>
    ),
  },
  "side-navigation": {
    parts: [
      {
        n: 1,
        name: "Container",
        description: "幅 240px（折りたたみ 64px）、bg-surface-card、右に border-low",
      },
      { n: 2, name: "Logo", description: "Mascot とアプリ名" },
      {
        n: 3,
        name: "Item",
        description:
          "Icon + label。現在地は active（aria-current=page、bg-surface-primary-subtle）",
      },
      { n: 4, name: "Badge", description: "件数（任意）" },
      { n: 5, name: "Group label", description: "SideNavGroup の見出し（text-1 text-text-low）" },
      { n: 6, name: "Collapse", description: "下端の折りたたみボタン" },
    ],
    figure: (
      <Box n={1} className="flex h-64 w-40 flex-col gap-2 p-2">
        <Box n={2} className="flex items-center gap-2 px-2 py-1.5">
          <Dot className="size-5 rounded-round" />
          <Bar w="w-14" />
        </Box>
        <Box n={3} className="flex items-center gap-2 bg-surface-primary-subtle px-2 py-1.5">
          <Dot className="size-3" />
          <Bar w="w-12" />
          <Box n={4} markerClass="-top-3 -right-1" className="ml-auto p-0.5">
            <Dot className="size-3 rounded-round bg-surface-negative" />
          </Box>
        </Box>
        <div className="flex items-center gap-2 px-2 py-1.5">
          <Dot className="size-3" />
          <Bar w="w-16" className="bg-border-low" />
        </div>
        <Box n={5} className="w-fit px-2 py-0.5">
          <Bar w="w-8" className="h-1.5 bg-border-low" />
        </Box>
        <div className="flex items-center gap-2 px-2 py-1.5">
          <Dot className="size-3" />
          <Bar w="w-10" className="bg-border-low" />
        </div>
        <Box n={6} className="mt-auto ml-auto p-1">
          <Dot className="size-3" />
        </Box>
      </Box>
    ),
  },
  "data-grid": {
    parts: [
      {
        n: 1,
        name: "Toolbar",
        description: "InputSearch（全列検索）、選択件数、絞り込み解除、右端に toolbar と「列」Menu",
      },
      {
        n: 2,
        name: "Header cell",
        description:
          "ソートボタン（昇順 → 降順 → 解除）、filter: select の列は絞り込み Popover、右端に列幅ハンドル",
      },
      {
        n: 3,
        name: "Select column",
        description: "selectable のチェックボックス列（全選択は一部選択の indeterminate に対応）",
      },
      {
        n: 4,
        name: "Rows",
        description:
          "Table と同じ行。pinFirstColumn で先頭列を左に固定。virtualize で見えている行だけ描く",
      },
      { n: 5, name: "Row actions", description: "行末の IconButton / Menu" },
      { n: 6, name: "Footer", description: "Pagination と 1 ページの件数（20 / 50 / 100）" },
    ],
    figure: (
      <div className="flex w-96 flex-col gap-2">
        <Box n={1} className="flex items-center gap-2 px-2 py-1.5">
          <Bar w="w-24" className="h-5 rounded-action bg-border-low" />
          <Bar w="w-10 ml-auto" className="h-5 rounded-action" />
        </Box>
        <Box className="p-0">
          <Box
            n={2}
            className="flex items-center gap-3 rounded-none rounded-t-action border-0 border-b bg-surface-well px-2 py-2"
          >
            <Box n={3} markerClass="-bottom-3 -left-1" className="p-0.5">
              <Dot className="size-3" />
            </Box>
            <Bar w="w-14" />
            <Dot className="size-2" />
            <Bar w="w-10" />
            <Bar w="w-8 ml-auto" />
          </Box>
          {[0, 1, 2].map((i) => (
            <Box
              key={i}
              n={i === 1 ? 4 : undefined}
              className={cn(
                "flex items-center gap-3 rounded-none border-0 border-b px-2 py-2",
                i === 2 && "rounded-b-action border-b-0",
              )}
            >
              <Dot className="size-3" />
              <Bar w="w-20" />
              <Bar w="w-10" className="bg-border-low" />
              <Box
                n={i === 0 ? 5 : undefined}
                markerClass="-top-3 -right-1"
                className="ml-auto p-0.5"
              >
                <Dot className="size-3" />
              </Box>
            </Box>
          ))}
        </Box>
        <Box n={6} className="flex items-center justify-between px-2 py-1.5">
          <Bar w="w-24" className="bg-border-low" />
          <Bar w="w-20" className="h-5 rounded-action" />
        </Box>
      </div>
    ),
  },
};

/** 解剖図を持つ部品（ガイドラインの整備状況の判定に使う） */
export const ANATOMY_SLUGS: string[] = Object.keys(FIGURES);

export function AnatomyFigure({ slug }: { slug: string }) {
  const entry = FIGURES[slug];
  if (!entry) return null;
  return (
    <div className="grid gap-6 md:grid-cols-[auto_1fr]">
      <div className="flex items-start justify-center rounded-container border border-border-low bg-surface-well p-6">
        {entry.figure}
      </div>
      <ol className="flex flex-col gap-2 text-3">
        {entry.parts.map((p) => (
          <li key={p.n} className="flex gap-3">
            <span
              aria-hidden="true"
              className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-round bg-surface-primary font-bold font-mono text-1 text-text-on-primary"
            >
              {p.n}
            </span>
            <span>
              <span className="font-bold text-text-high">
                <span className="sr-only">{p.n}. </span>
                {p.name}
              </span>
              <span className="block text-2 text-text-middle">{p.description}</span>
            </span>
          </li>
        ))}
      </ol>
    </div>
  );
}
