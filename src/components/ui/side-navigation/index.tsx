"use client";

import { Slot } from "radix-ui";
import {
  type ComponentProps,
  cloneElement,
  createContext,
  isValidElement,
  type ReactElement,
  type ReactNode,
  useContext,
  useState,
} from "react";
import { cn } from "../../../lib/utils";
import { Badge } from "../badge";
import { Icon } from "../icon";
import { IconButton } from "../icon-button";

type SideNavContext = { collapsed: boolean; setCollapsed: (v: boolean) => void };
const Ctx = createContext<SideNavContext | null>(null);

function useSideNav() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("SideNavigation の中で使ってください");
  return ctx;
}

export type SideNavigationProps = Omit<ComponentProps<"nav">, "children"> & {
  /** 上部のロゴ枠（マスコットやアプリ名） */
  logo?: ReactNode;
  /** 折りたたみ状態（制御する場合） */
  collapsed?: boolean;
  defaultCollapsed?: boolean;
  onCollapsedChange?: (collapsed: boolean) => void;
  /** 折りたたみボタンを出す（既定 true） */
  collapsible?: boolean;
  children: ReactNode;
};

/**
 * SideNavigation
 *
 * 概要: 画面左の主ナビ（設計書 §9.1 #27、§10.1）。幅 240px、折りたたむと 64px（アイコンだけ）。
 * SideNavGroup で見出しを付け、SideNavItem に `icon` と `active` を渡す。Next.js の Link は `asChild` で包む。
 * ロゴ枠にはマスコットを置ける（§8.6）。
 *
 * アンチパターン:
 * - 項目を 8 個以上並べる（グループ化するか設定に寄せる）
 * - 現在地（active）を付けない
 *
 * 使用例:
 * ```tsx
 * <SideNavigation logo={<><Mascot theme="calico" size={32} /><span>案件管理</span></>}>
 *   <SideNavItem icon="home" href="/">ダッシュボード</SideNavItem>
 *   <SideNavItem icon="folder" href="/projects" active badge={3}>案件</SideNavItem>
 *   <SideNavGroup label="管理">
 *     <SideNavItem icon="settings" href="/settings">設定</SideNavItem>
 *   </SideNavGroup>
 * </SideNavigation>
 * ```
 */
export function SideNavigation({
  className,
  logo,
  collapsed,
  defaultCollapsed = false,
  onCollapsedChange,
  collapsible = true,
  children,
  ...props
}: SideNavigationProps) {
  const [inner, setInner] = useState(defaultCollapsed);
  const isCollapsed = collapsed ?? inner;
  const setCollapsed = (v: boolean) => {
    if (collapsed === undefined) setInner(v);
    onCollapsedChange?.(v);
  };
  return (
    <Ctx.Provider value={{ collapsed: isCollapsed, setCollapsed }}>
      <nav
        aria-label="メイン"
        data-slot="side-navigation"
        data-collapsed={isCollapsed}
        className={cn(
          "flex h-full shrink-0 flex-col gap-1 border-border-low border-r bg-surface-card p-3 transition-[width]",
          isCollapsed ? "w-16 items-center" : "w-60",
          className,
        )}
        {...props}
      >
        {logo ? (
          <div
            data-slot="side-navigation-logo"
            className={cn(
              "flex items-center gap-2.5 px-2 pt-1 pb-4 font-bold text-text-high",
              isCollapsed && "justify-center px-0",
            )}
          >
            {logo}
          </div>
        ) : null}
        <div className="flex flex-1 flex-col gap-1">{children}</div>
        {collapsible ? (
          <IconButton
            icon={isCollapsed ? "keyboard_arrow_right" : "keyboard_arrow_left"}
            label={isCollapsed ? "ナビゲーションを開く" : "ナビゲーションを折りたたむ"}
            aria-expanded={!isCollapsed}
            onClick={() => setCollapsed(!isCollapsed)}
            className="mt-2 self-end"
          />
        ) : null}
      </nav>
    </Ctx.Provider>
  );
}

export function SideNavGroup({
  label,
  className,
  children,
  ...props
}: ComponentProps<"div"> & { label: string }) {
  const { collapsed } = useSideNav();
  return (
    <div
      data-slot="side-navigation-group"
      className={cn("flex flex-col gap-1 pt-3", className)}
      {...props}
    >
      <div className={cn("px-2.5 pb-1 text-1 text-text-low tracking-wide", collapsed && "sr-only")}>
        {label}
      </div>
      {children}
    </div>
  );
}

export type SideNavItemProps = ComponentProps<"a"> & {
  icon: string;
  active?: boolean;
  badge?: number;
  asChild?: boolean;
};

export function SideNavItem({
  icon,
  active,
  badge,
  asChild,
  className,
  children,
  ...props
}: SideNavItemProps) {
  const { collapsed } = useSideNav();
  const Comp = asChild ? Slot.Root : "a";
  // asChild のときは子要素（Next.js の Link 等）をルートにし、その中身をラベルとして扱う
  const child =
    asChild && isValidElement(children)
      ? (children as ReactElement<{ children?: ReactNode }>)
      : null;
  const labelText = child ? child.props.children : children;
  const label = <span className={cn("flex-1 truncate", collapsed && "sr-only")}>{labelText}</span>;
  return (
    <Comp
      data-slot="side-navigation-item"
      aria-current={active ? "page" : undefined}
      title={collapsed && typeof labelText === "string" ? labelText : undefined}
      className={cn(
        "flex h-10 items-center gap-2.5 rounded-action px-2.5 text-2 text-text-middle outline-none transition-colors hover:bg-surface-well hover:text-text-high focus-visible:outline-2 focus-visible:outline-border-focus",
        active && "bg-surface-selected font-bold text-text-primary hover:bg-surface-selected",
        collapsed && "w-10 justify-center px-0",
        className,
      )}
      {...props}
    >
      <Icon icon={icon} size={5} fill={active} />
      {child ? <Slot.Slottable>{cloneElement(child, undefined, label)}</Slot.Slottable> : label}
      {badge !== undefined && !collapsed ? <Badge count={badge} variant="negative" /> : null}
    </Comp>
  );
}
