"use client";

import { DropdownMenu as MenuPrimitive } from "radix-ui";
import type { ComponentProps } from "react";
import { cn } from "../../../lib/utils";
import { Icon } from "../icon";

/**
 * Menu
 *
 * 概要: 操作の一覧を出すドロップダウン（設計書 §9.1 #29）。行末の「⋮」（IconButton more_vert）や見出し横の操作に使う。
 * Radix DropdownMenu ベースでキーボード操作は自動。破壊的操作は `MenuItem variant="negative"` にして末尾に置き、区切り線で分ける。
 *
 * アンチパターン:
 * - 項目が 1 つだけ（Button か IconButton にする）
 * - 画面遷移と操作を混ぜて並べる（遷移は上、操作は下、破壊的操作は最後）
 *
 * 使用例:
 * ```tsx
 * <Menu>
 *   <MenuTrigger asChild><IconButton icon="more_vert" label="操作" /></MenuTrigger>
 *   <MenuContent>
 *     <MenuItem onSelect={edit}><Icon icon="edit" size={4} />編集する</MenuItem>
 *     <MenuSeparator />
 *     <MenuItem variant="negative" onSelect={remove}><Icon icon="delete" size={4} />削除する</MenuItem>
 *   </MenuContent>
 * </Menu>
 * ```
 */
export function Menu(props: ComponentProps<typeof MenuPrimitive.Root>) {
  return <MenuPrimitive.Root data-slot="menu" {...props} />;
}

export function MenuTrigger(props: ComponentProps<typeof MenuPrimitive.Trigger>) {
  return <MenuPrimitive.Trigger data-slot="menu-trigger" {...props} />;
}

export function MenuGroup(props: ComponentProps<typeof MenuPrimitive.Group>) {
  return <MenuPrimitive.Group data-slot="menu-group" {...props} />;
}

export function MenuContent({
  className,
  sideOffset = 4,
  align = "end",
  ...props
}: ComponentProps<typeof MenuPrimitive.Content>) {
  return (
    <MenuPrimitive.Portal>
      <MenuPrimitive.Content
        data-slot="menu-content"
        sideOffset={sideOffset}
        align={align}
        className={cn(
          "z-50 max-h-(--radix-dropdown-menu-content-available-height) min-w-44 overflow-y-auto overflow-x-hidden rounded-container border border-border-low bg-surface-card p-1 text-text-high shadow-float",
          "data-[state=open]:fade-in-0 data-[state=closed]:fade-out-0 data-[state=open]:zoom-in-95 data-[state=closed]:zoom-out-95 data-[state=open]:animate-in data-[state=closed]:animate-out",
          className,
        )}
        {...props}
      />
    </MenuPrimitive.Portal>
  );
}

const itemClass = [
  "relative flex cursor-default select-none items-center gap-2.5 rounded-action px-2.5 py-2 text-2 outline-hidden",
  "focus:bg-surface-well data-[disabled]:pointer-events-none data-[disabled]:text-text-disabled",
  "[&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg]:text-object-middle",
];

export function MenuItem({
  className,
  variant = "default",
  ...props
}: ComponentProps<typeof MenuPrimitive.Item> & { variant?: "default" | "negative" }) {
  return (
    <MenuPrimitive.Item
      data-slot="menu-item"
      data-variant={variant}
      className={cn(
        itemClass,
        variant === "negative" &&
          "text-text-negative focus:bg-surface-negative-subtle [&_svg]:text-object-negative",
        className,
      )}
      {...props}
    />
  );
}

export function MenuCheckboxItem({
  className,
  children,
  checked,
  ...props
}: ComponentProps<typeof MenuPrimitive.CheckboxItem>) {
  return (
    <MenuPrimitive.CheckboxItem
      data-slot="menu-checkbox-item"
      className={cn(itemClass, "pl-8", className)}
      checked={checked}
      {...props}
    >
      <span className="pointer-events-none absolute left-2 flex size-4 items-center justify-center">
        <MenuPrimitive.ItemIndicator>
          <Icon icon="check" size={3} className="text-object-primary" />
        </MenuPrimitive.ItemIndicator>
      </span>
      {children}
    </MenuPrimitive.CheckboxItem>
  );
}

export function MenuRadioGroup(props: ComponentProps<typeof MenuPrimitive.RadioGroup>) {
  return <MenuPrimitive.RadioGroup data-slot="menu-radio-group" {...props} />;
}

export function MenuRadioItem({
  className,
  children,
  ...props
}: ComponentProps<typeof MenuPrimitive.RadioItem>) {
  return (
    <MenuPrimitive.RadioItem
      data-slot="menu-radio-item"
      className={cn(itemClass, "pl-8", className)}
      {...props}
    >
      <span className="pointer-events-none absolute left-2 flex size-4 items-center justify-center">
        <MenuPrimitive.ItemIndicator>
          <span className="block size-2 rounded-round bg-surface-primary" />
        </MenuPrimitive.ItemIndicator>
      </span>
      {children}
    </MenuPrimitive.RadioItem>
  );
}

export function MenuLabel({ className, ...props }: ComponentProps<typeof MenuPrimitive.Label>) {
  return (
    <MenuPrimitive.Label
      data-slot="menu-label"
      className={cn("px-2.5 py-1.5 text-1 text-text-low", className)}
      {...props}
    />
  );
}

export function MenuSeparator({
  className,
  ...props
}: ComponentProps<typeof MenuPrimitive.Separator>) {
  return (
    <MenuPrimitive.Separator
      data-slot="menu-separator"
      className={cn("-mx-1 my-1 h-px bg-border-middle", className)}
      {...props}
    />
  );
}

export function MenuShortcut({ className, ...props }: ComponentProps<"span">) {
  return (
    <span
      data-slot="menu-shortcut"
      className={cn("ml-auto font-mono text-1 text-text-low tracking-widest", className)}
      {...props}
    />
  );
}
