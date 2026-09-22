"use client";

import useAutocomplete, {
  type AutocompleteChangeReason,
  type AutocompleteGroupedOption,
  type AutocompleteInputChangeReason,
  type AutocompleteValue,
  createFilterOptions,
  type UseAutocompleteProps,
  type UseAutocompleteReturnValue,
} from "@mui/material/useAutocomplete";
import { cva } from "class-variance-authority";
import { type ReactNode, useMemo } from "react";
import { cn } from "../../../lib/utils";
import { Icon } from "../icon";
import { Spinner } from "../spinner";
import { Tag } from "../tag";

const fieldVariants = cva(
  [
    "flex w-full min-w-0 flex-wrap items-center gap-1 rounded-action border border-border-high bg-surface-input text-text-high transition-[border-color,box-shadow]",
    "focus-within:border-border-focus focus-within:ring-2 focus-within:ring-border-focus/30",
    "data-[disabled=true]:cursor-not-allowed data-[disabled=true]:border-border-middle data-[disabled=true]:bg-surface-disabled data-[disabled=true]:text-text-disabled",
    "data-[invalid=true]:border-border-negative data-[invalid=true]:focus-within:ring-border-negative/30",
  ],
  {
    variants: {
      size: {
        sm: "min-h-8 px-2 py-0.5 text-2",
        md: "min-h-10 px-3 py-1 text-3",
        lg: "min-h-12 px-3 py-1.5 text-3",
      },
    },
    defaultVariants: { size: "md" },
  },
);

export type SearchComboboxSize = "sm" | "md" | "lg";

export type SearchComboboxProps<
  Value,
  Multiple extends boolean | undefined = false,
  FreeSolo extends boolean | undefined = false,
> = {
  /** 候補 */
  options: ReadonlyArray<Value>;
  /** 候補の表示名（既定: 文字列ならそのまま、オブジェクトなら `label`）。freeSolo の自由入力値（文字列）はそのまま表示する */
  getOptionLabel?: (option: Value) => string;
  /** 候補の 2 行目（補足） */
  getOptionDescription?: (option: Value) => ReactNode;
  /** 見出し付きグループ */
  groupBy?: (option: Value) => string;
  /** 複数選択（選択済みは Tag で表示、Backspace で末尾を外す） */
  multiple?: Multiple;
  /** 候補に無い値も確定できる */
  freeSolo?: FreeSolo;
  value?: AutocompleteValue<Value, Multiple, false, FreeSolo>;
  defaultValue?: AutocompleteValue<Value, Multiple, false, FreeSolo>;
  onChange?: (
    value: AutocompleteValue<Value, Multiple, false, FreeSolo>,
    reason: AutocompleteChangeReason,
  ) => void;
  inputValue?: string;
  /** 入力文字が変わるたびに呼ばれる（サーバー検索は呼び出し側でデバウンスする） */
  onInputChange?: (value: string, reason: AutocompleteInputChangeReason) => void;
  /** 候補の絞り込み（既定: 前方一致＋部分一致、大文字小文字とアクセントを無視） */
  filterOptions?: (options: Value[], state: { inputValue: string }) => Value[];
  isOptionEqualToValue?: (option: Value, value: Value | string) => boolean;
  getOptionDisabled?: (option: Value) => boolean;
  /** 候補を取得中（リストに Spinner を出す） */
  loading?: boolean;
  /** 候補が無いときの文言。既定「候補がありません」 */
  emptyText?: ReactNode;
  /** 入力欄のラベル（アクセシブルネーム）。`hideLabel` で見た目だけ隠す。Form の FormLabel を使うときは省略する（FormControl が id で結ぶ） */
  label?: string;
  hideLabel?: boolean;
  /** Form の FormControl が渡す（補足・エラー文と結ぶ） */
  "aria-describedby"?: string;
  /** Form の FormControl が渡す（枠を negative にする） */
  "aria-invalid"?: boolean | "true" | "false";
  "aria-labelledby"?: string;
  placeholder?: string;
  size?: SearchComboboxSize;
  disabled?: boolean;
  readOnly?: boolean;
  /** クリアボタンの読み上げ名。既定「クリア」 */
  clearLabel?: string;
  id?: string;
  name?: string;
  className?: string;
};

function defaultLabel(option: unknown): string {
  if (typeof option === "string") return option;
  if (option && typeof option === "object" && "label" in option) {
    return String((option as { label: unknown }).label);
  }
  return String(option ?? "");
}

function isGroup<Value>(
  item: Value | AutocompleteGroupedOption<Value>,
): item is AutocompleteGroupedOption<Value> {
  return (
    typeof item === "object" &&
    item !== null &&
    "options" in item &&
    Array.isArray((item as AutocompleteGroupedOption<Value>).options)
  );
}

/**
 * SearchCombobox
 *
 * 概要: サジェスト付きの検索入力（設計書 §9.3、v1.1）。挙動は MUI の `useAutocomplete`（ヘッドレスフック）、
 * 見た目は nekodemo の Input / Tag で組む（D4）。単一／複数（`multiple`）、自由入力（`freeSolo`）、
 * グループ見出し（`groupBy`）、`loading` の Spinner、0 件の文言に対応する。
 * ↑↓ で候補移動、Enter で確定、Esc で閉じる、Backspace で末尾の選択を外す。
 * `role="combobox"` / `aria-expanded` / `aria-activedescendant` はフックが付ける。
 * 候補パネルは入力欄の直下に絶対配置する（Radix Popover の Portal はフックのフォーカス管理と干渉するため）。
 *
 * アンチパターン:
 * - 5 件程度の固定の選択肢に使う（Select）
 * - 検索欄として使う（InputSearch。候補を出さない検索は InputSearch）
 * - `label` を省略する（`hideLabel` で見た目だけ隠す）
 *
 * 推奨例:
 * - 顧客・担当者・品目のように候補が 20 件を超える参照入力に使い、`label` に何を選ぶかを書く
 * - サーバー検索は `onInputChange` を呼び出し側でデバウンスし、取得中は `loading` で待ちを見せる
 * - 同名の候補があるときは `getOptionDescription` に会社名やコードを出して見分けられるようにする
 * - 絞り込み条件のタグ付けは `multiple`、候補に無い語も許すなら `freeSolo` を足す
 *
 * 使用例:
 * ```tsx
 * <SearchCombobox label="顧客" options={customers} getOptionLabel={(c) => c.name} onChange={(c) => setCustomer(c)} />
 * <SearchCombobox label="タグ" multiple freeSolo options={["急ぎ", "要確認"]} />
 * ```
 */
export function SearchCombobox<
  Value,
  Multiple extends boolean | undefined = false,
  FreeSolo extends boolean | undefined = false,
>({
  options,
  getOptionLabel,
  getOptionDescription,
  groupBy,
  multiple,
  freeSolo,
  value,
  defaultValue,
  onChange,
  inputValue,
  onInputChange,
  filterOptions,
  isOptionEqualToValue,
  getOptionDisabled,
  loading = false,
  emptyText = "候補がありません",
  label,
  hideLabel = false,
  placeholder,
  size = "md",
  disabled = false,
  readOnly = false,
  clearLabel = "クリア",
  id,
  name,
  className,
  "aria-describedby": describedBy,
  "aria-invalid": invalid,
  "aria-labelledby": labelledBy,
}: SearchComboboxProps<Value, Multiple, FreeSolo>) {
  const labelOf = useMemo(
    () =>
      (option: Value | string): string =>
        typeof option === "string"
          ? option
          : getOptionLabel
            ? getOptionLabel(option)
            : defaultLabel(option),
    [getOptionLabel],
  );
  // useAutocomplete はグループが連続している前提（飛び飛びだと見出しが重複する）なので、グループ順に並べ替えておく
  const orderedOptions = useMemo(() => {
    if (!groupBy) return options;
    return [...options].sort((a, b) => groupBy(a).localeCompare(groupBy(b), "ja"));
  }, [options, groupBy]);
  const defaultFilter = useMemo(
    () => createFilterOptions<Value>({ stringify: (o) => labelOf(o), ignoreAccents: true }),
    [labelOf],
  );

  const hookProps: UseAutocompleteProps<Value, Multiple, false, FreeSolo> = {
    id,
    options: orderedOptions,
    multiple,
    freeSolo,
    value,
    defaultValue,
    inputValue,
    disabled,
    readOnly,
    groupBy,
    getOptionLabel: labelOf,
    getOptionDisabled,
    isOptionEqualToValue: isOptionEqualToValue as UseAutocompleteProps<
      Value,
      Multiple,
      false,
      FreeSolo
    >["isOptionEqualToValue"],
    filterOptions: filterOptions ?? defaultFilter,
    onChange: (_e, v, reason) => onChange?.(v, reason),
    onInputChange: (_e, v, reason) => onInputChange?.(v, reason),
    openOnFocus: true,
    autoHighlight: true,
    disableCloseOnSelect: Boolean(multiple),
    unstable_classNamePrefix: "nk",
    componentName: "SearchCombobox",
  };
  const ac = (
    useAutocomplete as unknown as (
      p: UseAutocompleteProps<Value, Multiple, false, FreeSolo>,
    ) => UseAutocompleteReturnValue<Value, Multiple, false, FreeSolo, boolean>
  )(hookProps);

  const {
    getRootProps,
    getInputProps,
    getInputLabelProps,
    getClearProps,
    getItemProps,
    getListboxProps,
    getOptionProps,
    groupedOptions,
    popupOpen,
    dirty,
    setAnchorEl,
  } = ac;
  const selected = ac.value as unknown;
  const inputText = ac.inputValue;
  const items = groupedOptions as Array<Value | AutocompleteGroupedOption<Value>>;

  const renderOption = (option: Value, index: number) => {
    const { key, ...optionProps } = getOptionProps({ option, index });
    const description = getOptionDescription?.(option);
    return (
      <li
        key={key}
        {...optionProps}
        data-slot="search-combobox-option"
        className={cn(
          "flex cursor-pointer flex-col rounded-action px-3 py-2 text-text-high",
          "aria-selected:bg-surface-selected aria-disabled:cursor-not-allowed aria-disabled:text-text-disabled",
          // nekodemo-check-ignore-next-line NK003 -- useAutocomplete はハイライト中の候補に class を付けるので、そのセレクタで塗る
          "[&.nk-focused]:bg-surface-well",
        )}
      >
        <span className="text-3 leading-6">{labelOf(option)}</span>
        {description ? <span className="text-2 text-text-low">{description}</span> : null}
      </li>
    );
  };

  const inputProps = getInputProps();
  const labelProps = getInputLabelProps();

  return (
    <div data-slot="search-combobox" className={cn("relative", className)}>
      {label ? (
        // biome-ignore lint/a11y/noLabelWithoutControl: htmlFor は useAutocomplete の getInputLabelProps() が付ける
        <label
          {...labelProps}
          className={cn("mb-1 block text-2 text-text-middle", hideLabel && "sr-only")}
        >
          {label}
        </label>
      ) : null}
      <div
        {...getRootProps()}
        ref={setAnchorEl}
        data-slot="search-combobox-field"
        data-size={size}
        data-disabled={disabled ? "true" : undefined}
        data-invalid={invalid === true || invalid === "true" ? "true" : undefined}
        className={fieldVariants({ size })}
      >
        <Icon icon="search" size={3} className="shrink-0 text-object-middle" />
        {multiple && Array.isArray(selected)
          ? (selected as Value[]).map((v, index) => {
              const { key, onDelete, ...tagProps } = getItemProps({ index }) as unknown as {
                key: number;
                onDelete: (event: unknown) => void;
                [k: string]: unknown;
              };
              return (
                <Tag
                  key={key}
                  {...(tagProps as object)}
                  variant="selected"
                  onRemove={disabled || readOnly ? undefined : () => onDelete(undefined)}
                  removeLabel={`${labelOf(v)} を外す`}
                >
                  {labelOf(v)}
                </Tag>
              );
            })
          : null}
        <input
          {...inputProps}
          name={name}
          placeholder={placeholder}
          aria-describedby={describedBy}
          aria-invalid={invalid}
          aria-labelledby={labelledBy}
          className="min-w-16 flex-1 bg-transparent py-1 outline-none placeholder:text-text-placeholder disabled:cursor-not-allowed"
        />
        {dirty && !disabled && !readOnly ? (
          <button
            type="button"
            {...getClearProps()}
            aria-label={clearLabel}
            className="inline-flex size-6 shrink-0 items-center justify-center rounded-round text-object-middle outline-none hover:bg-surface-well hover:text-object-high focus-visible:outline-2 focus-visible:outline-border-focus"
          >
            <Icon icon="close" size={2} />
          </button>
        ) : null}
      </div>
      {popupOpen ? (
        <ul
          {...getListboxProps()}
          data-slot="search-combobox-listbox"
          className="absolute z-20 mt-1 max-h-80 w-full overflow-auto rounded-container border border-border-low bg-surface-card p-1 shadow-popout"
        >
          {loading ? (
            <li
              role="presentation"
              className="flex items-center gap-2 px-3 py-2 text-2 text-text-low"
            >
              <Spinner size="sm" label="候補を読み込み中" />
              候補を読み込み中…
            </li>
          ) : items.length === 0 ? (
            <li role="presentation" className="px-3 py-2 text-2 text-text-low">
              {freeSolo && inputText
                ? `「${inputText}」を追加するには Enter を押します`
                : emptyText}
            </li>
          ) : (
            items.map((item, i) =>
              isGroup(item) ? (
                <li key={item.key} role="presentation" data-slot="search-combobox-group">
                  <div className="px-3 pt-2 pb-1 font-bold text-1 text-text-low">{item.group}</div>
                  {/* biome-ignore lint/a11y/useSemanticElements: listbox 内のグループは role="group" の ul で表す（WAI-ARIA の listbox パターン） */}
                  <ul role="group" aria-label={item.group}>
                    {item.options.map((option, j) => renderOption(option, item.index + j))}
                  </ul>
                </li>
              ) : (
                renderOption(item, i)
              ),
            )
          )}
        </ul>
      ) : null}
    </div>
  );
}
