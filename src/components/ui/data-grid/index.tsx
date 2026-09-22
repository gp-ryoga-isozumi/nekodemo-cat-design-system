"use client";

import {
  type Column,
  type ColumnDef,
  columnFilteringFeature,
  columnPinningFeature,
  columnResizingFeature,
  columnSizingFeature,
  columnVisibilityFeature,
  constructFilterFn,
  createColumnHelper,
  createFilteredRowModel,
  createPaginatedRowModel,
  createSortedRowModel,
  filterFn_includesString,
  functionalUpdate,
  globalFilteringFeature,
  type Header,
  type Row,
  type RowData,
  type RowSelectionState,
  rowPaginationFeature,
  rowSelectionFeature,
  rowSortingFeature,
  sortFn_alphanumeric,
  sortFn_basic,
  sortFn_datetime,
  sortFn_text,
  tableFeatures,
  useTable,
} from "@tanstack/react-table";
import { useVirtualizer } from "@tanstack/react-virtual";
import { type ReactNode, useMemo, useRef, useState } from "react";
import { cn } from "../../../lib/utils";
import { Button } from "../button";
import { Checkbox } from "../checkbox";
import { EmptyState } from "../empty-state";
import { Icon } from "../icon";
import { IconButton } from "../icon-button";
import { InlineMessage } from "../inline-message";
import { InputSearch } from "../input-search";
import { Menu, MenuCheckboxItem, MenuContent, MenuLabel, MenuTrigger } from "../menu";
import { Pagination } from "../pagination";
import { Popover, PopoverContent, PopoverTitle, PopoverTrigger } from "../popover";
import { SearchCombobox } from "../search-combobox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../select";
import { SkeletonRows } from "../skeleton";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  type TableDensity,
  TableHead,
  TableHeader,
  TableRow,
} from "../table";

// 使う機能だけを登録する（設計書 §9.4、TanStack Table v9 は機能を明示的に登録する）
const features = tableFeatures({
  rowSortingFeature,
  sortedRowModel: createSortedRowModel(),
  columnFilteringFeature,
  globalFilteringFeature,
  filteredRowModel: createFilteredRowModel(),
  rowPaginationFeature,
  paginatedRowModel: createPaginatedRowModel(),
  rowSelectionFeature,
  columnVisibilityFeature,
  columnSizingFeature,
  columnResizingFeature,
  columnPinningFeature,
  filterFns: {
    includesString: filterFn_includesString,
    // 列の絞り込み（値の一覧から複数選択）: セルの値が選んだ値のどれかに一致する
    inList: constructFilterFn({
      filter: (dataValue: unknown, filterValue: unknown) =>
        Array.isArray(filterValue) && filterValue.includes(String(dataValue ?? "")),
      autoRemove: (v: unknown) => !Array.isArray(v) || v.length === 0,
    }),
  },
  sortFns: {
    alphanumeric: sortFn_alphanumeric,
    basic: sortFn_basic,
    datetime: sortFn_datetime,
    text: sortFn_text,
  },
  columnMeta: {} as { numeric?: boolean },
});
type Features = typeof features;

const SELECT_COLUMN_ID = "__select";
const ACTIONS_COLUMN_ID = "__actions";
const ROW_HEIGHT: Record<TableDensity, number> = { xs: 40, sm: 56, md: 80 };
const VIRTUAL_PAGE_SIZE = 1_000_000;
const EMPTY: never[] = [];

export type DataGridColumn<T extends RowData> = {
  /** 列の id（状態のキー） */
  id: string;
  /** ヘッダー文言 */
  header: string;
  /** 値の取り出し。省略時は `row[id]` */
  accessor?: keyof T | ((row: T) => unknown);
  /** セルの描画。省略時は値を文字列で出す */
  cell?: (row: T) => ReactNode;
  /** 数値列（右寄せ・等幅） */
  numeric?: boolean;
  /** 列幅（px）。既定 160 */
  size?: number;
  minSize?: number;
  maxSize?: number;
  /** ソート可（既定 true） */
  enableSorting?: boolean;
  /** 「列」メニューで非表示にできる（既定 true） */
  enableHiding?: boolean;
  /** 列の絞り込み。`"select"` は値の一覧から複数選択（ヘッダーの Popover に SearchCombobox） */
  filter?: "select";
};

export type DataGridStatus = "ready" | "loading" | "error";

export type DataGridProps<T extends RowData> = {
  columns: DataGridColumn<T>[];
  data: T[];
  /** 行の id。省略時は配列の index */
  getRowId?: (row: T) => string;
  /** 表のアクセシブルネーム（必須） */
  "aria-label": string;
  caption?: ReactNode;
  density?: TableDensity;
  /** 読み込み中 / エラー。空は data が 0 件のときに自動で出す */
  status?: DataGridStatus;
  /** エラー時の文言と再試行 */
  errorMessage?: ReactNode;
  onRetry?: () => void;
  /** 0 件のときの EmptyState */
  emptyTitle?: ReactNode;
  emptyDescription?: ReactNode;
  emptyAction?: ReactNode;
  /** チェックボックス列を出す */
  selectable?: boolean;
  onSelectionChange?: (ids: string[]) => void;
  /** 上部のグローバル検索（既定 true） */
  searchable?: boolean;
  searchPlaceholder?: string;
  /** 「列」メニュー（表示切替。既定 true） */
  columnMenu?: boolean;
  /** 先頭列（選択列があればその次）を左に固定 */
  pinFirstColumn?: boolean;
  /** ページング（既定 true。`virtualize` のときは無効） */
  pagination?: boolean;
  pageSize?: 20 | 50 | 100;
  /** 1,000 行超の想定時。`height` の領域内で行を仮想化し、ページングを使わない */
  virtualize?: boolean;
  /** 仮想化時の表の高さ（px）。既定 480 */
  height?: number;
  /** 行末の操作（IconButton や Menu） */
  rowActions?: (row: T) => ReactNode;
  rowActionsLabel?: string;
  /** 件数の単位。既定「件」 */
  unit?: string;
  /** 検索欄の右に置く追加の操作 */
  toolbar?: ReactNode;
  className?: string;
};

function accessorOf<T extends RowData>(col: DataGridColumn<T>): (row: T) => unknown {
  if (typeof col.accessor === "function") return col.accessor;
  const key = (col.accessor ?? col.id) as keyof T;
  return (row: T) => row[key];
}

/**
 * DataGrid
 *
 * 概要: ソート・列幅・固定・選択・ページング・検索・列の絞り込み・列の表示切替・密度・4 状態・仮想化・行内操作を
 * 備えた表（設計書 §9.4、v1.1）。状態は TanStack Table v9（ヘッドレス）が持ち、描画は Table 部品で行う（D5）。
 * - ソート: ヘッダーをクリックで 昇順 → 降順 → 解除。Shift+クリックで複数列
 * - 列幅: ヘッダー右端のハンドルをドラッグ。ダブルクリックで既定幅
 * - 固定: ヘッダーは常に固定。`pinFirstColumn` で先頭列を左に固定
 * - 選択: `selectable` でチェックボックス列。全選択・一部選択（indeterminate）・選択件数
 * - 検索: 上部の InputSearch で全列を部分一致。列ごとの絞り込みは `filter: "select"`
 * - 状態: `status="loading"` は Skeleton、`"error"` は InlineMessage ＋ 再試行、0 件は EmptyState
 *
 * アンチパターン:
 * - 5 行程度の静的な表に使う（Table）
 * - セル内編集をさせる（v1 では対象外）
 * - 縞模様や縦罫線を足す
 *
 * 推奨例:
 * - 数十行以上の業務一覧（案件・請求・利用者）に使い、`aria-label` に何の一覧かを書く
 * - 読み込み中とエラーは `status` と `errorMessage` / `onRetry`、0 件は `emptyTitle` / `emptyAction` に渡して 4 状態をそろえる
 * - 金額・数量の列は `numeric`、値の種類が決まっている列は `filter: "select"` にする
 * - 1,000 行を超える想定では `virtualize` と `height` を使い、行末の操作は `rowActions` にまとめる
 *
 * 使用例:
 * ```tsx
 * <DataGrid
 *   aria-label="案件一覧"
 *   columns={[
 *     { id: "name", header: "案件名" },
 *     { id: "customer", header: "顧客", filter: "select" },
 *     { id: "amount", header: "金額", numeric: true, cell: (r) => r.amount.toLocaleString() },
 *   ]}
 *   data={projects}
 *   getRowId={(r) => r.id}
 *   selectable
 *   pinFirstColumn
 *   rowActions={(r) => <IconButton icon="edit" label={`${r.name} を編集`} variant="ghost" size="sm" />}
 * />
 * ```
 */
export function DataGrid<T extends RowData>({
  columns,
  data,
  getRowId,
  "aria-label": ariaLabel,
  caption,
  density = "sm",
  status = "ready",
  errorMessage = "一覧を読み込めませんでした。時間をおいて再試行してください。",
  onRetry,
  emptyTitle = "まだデータがありません",
  emptyDescription,
  emptyAction,
  selectable = false,
  onSelectionChange,
  searchable = true,
  searchPlaceholder = "検索",
  columnMenu = true,
  pinFirstColumn = false,
  pagination = true,
  pageSize = 20,
  virtualize = false,
  height = 480,
  rowActions,
  rowActionsLabel = "操作",
  unit = "件",
  toolbar,
  className,
}: DataGridProps<T>) {
  const usePagination = pagination && !virtualize;
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});

  const tableColumns = useMemo(() => {
    const helper = createColumnHelper<Features, T>();
    const defs: ColumnDef<Features, T, unknown>[] = [];
    if (selectable) {
      defs.push(
        helper.display({
          id: SELECT_COLUMN_ID,
          size: 48,
          minSize: 48,
          maxSize: 48,
          enableResizing: false,
          enableHiding: false,
          header: ({ table }) => (
            <Checkbox
              aria-label="このページの行をすべて選択"
              checked={
                table.getIsAllPageRowsSelected()
                  ? true
                  : table.getIsSomePageRowsSelected()
                    ? "indeterminate"
                    : false
              }
              onCheckedChange={(v) => table.toggleAllPageRowsSelected(v === true)}
            />
          ),
          cell: ({ row }) => (
            <Checkbox
              aria-label={`行 ${row.index + 1} を選択`}
              checked={row.getIsSelected()}
              disabled={!row.getCanSelect()}
              onCheckedChange={(v) => row.toggleSelected(v === true)}
            />
          ),
        }),
      );
    }
    for (const col of columns) {
      const accessor = accessorOf(col);
      defs.push(
        helper.accessor((row: T) => accessor(row), {
          id: col.id,
          header: col.header,
          cell: (ctx) => (col.cell ? col.cell(ctx.row.original) : String(ctx.getValue() ?? "")),
          size: col.size ?? 160,
          minSize: col.minSize ?? 64,
          maxSize: col.maxSize,
          enableSorting: col.enableSorting ?? true,
          sortDescFirst: false, // 数値列も 昇順 → 降順 → 解除 に揃える（設計書 §9.4）
          enableHiding: col.enableHiding ?? true,
          enableColumnFilter: col.filter !== undefined,
          filterFn: col.filter === "select" ? "inList" : undefined,
          meta: { numeric: col.numeric },
        }),
      );
    }
    if (rowActions) {
      defs.push(
        helper.display({
          id: ACTIONS_COLUMN_ID,
          header: rowActionsLabel,
          size: 96,
          minSize: 64,
          enableResizing: false,
          enableHiding: false,
          cell: ({ row }) => (
            <div className="flex items-center justify-end gap-1">{rowActions(row.original)}</div>
          ),
        }),
      );
    }
    return defs;
  }, [columns, selectable, rowActions, rowActionsLabel]);

  const firstColumnId = columns[0]?.id;
  const table = useTable<Features, T>({
    features,
    columns: tableColumns,
    data: data ?? EMPTY,
    getRowId: getRowId ? (row) => getRowId(row) : undefined,
    enableRowSelection: selectable,
    enableColumnResizing: true,
    columnResizeMode: "onChange",
    globalFilterFn: "includesString",
    autoResetPageIndex: true,
    initialState: {
      pagination: { pageIndex: 0, pageSize: usePagination ? pageSize : VIRTUAL_PAGE_SIZE },
      columnPinning: {
        start: pinFirstColumn
          ? [selectable ? SELECT_COLUMN_ID : null, firstColumnId].filter((v): v is string =>
              Boolean(v),
            )
          : [],
        end: [],
      },
    },
    state: { rowSelection },
    onRowSelectionChange: (updater) => {
      const next = functionalUpdate(updater, rowSelection);
      setRowSelection(next);
      onSelectionChange?.(Object.keys(next));
    },
  });

  const rows = table.getRowModel().rows;
  const total = table.getRowCount();
  const selectedCount = Object.keys(rowSelection).length;
  const visibleColumnCount = table.getVisibleLeafColumns().length;
  const rowHeight = ROW_HEIGHT[density];

  const scrollRef = useRef<HTMLDivElement>(null);
  const virtualizer = useVirtualizer({
    count: virtualize ? rows.length : 0,
    getScrollElement: () => scrollRef.current,
    estimateSize: () => rowHeight,
    overscan: 8,
  });
  const virtualItems = virtualize ? virtualizer.getVirtualItems() : [];
  const paddingTop = virtualize && virtualItems.length > 0 ? virtualItems[0].start : 0;
  const paddingBottom =
    virtualize && virtualItems.length > 0
      ? virtualizer.getTotalSize() - virtualItems[virtualItems.length - 1].end
      : 0;
  const renderedRows: Row<Features, T>[] = virtualize
    ? virtualItems.map((item) => rows[item.index])
    : rows;

  const hideableColumns = table.getAllLeafColumns().filter((c) => c.getCanHide());
  const filterableColumns = columns.filter((c) => c.filter !== undefined);
  const activeFilterCount = table.state.columnFilters.length;

  return (
    <div data-slot="data-grid" className={cn("flex flex-col gap-3", className)}>
      {searchable || columnMenu || selectable || toolbar ? (
        <div data-slot="data-grid-toolbar" className="flex flex-wrap items-center gap-2">
          {searchable ? (
            <InputSearch
              aria-label={`${ariaLabel}を検索`}
              placeholder={searchPlaceholder}
              value={String(table.state.globalFilter ?? "")}
              onValueChange={(v) => table.setGlobalFilter(v || undefined)}
              size="sm"
              className="w-64"
            />
          ) : null}
          <span aria-live="polite" className="sr-only">
            {selectedCount > 0 ? `${selectedCount.toLocaleString()}${unit}を選択中` : ""}
          </span>
          {selectedCount > 0 ? (
            <div className="flex items-center gap-2 text-2 text-text-middle">
              <span aria-hidden="true">
                {selectedCount.toLocaleString()}
                {unit}を選択中
              </span>
              <Button variant="ghost" size="sm" onClick={() => table.resetRowSelection()}>
                選択を解除する
              </Button>
            </div>
          ) : null}
          {activeFilterCount > 0 ? (
            <Button variant="ghost" size="sm" onClick={() => table.resetColumnFilters()}>
              絞り込みを解除する（{activeFilterCount}）
            </Button>
          ) : null}
          <div className="ml-auto flex items-center gap-2">
            {toolbar}
            {columnMenu && hideableColumns.length > 0 ? (
              <Menu>
                <MenuTrigger asChild>
                  <Button variant="outline" size="sm">
                    <Icon icon="view_column" />列
                  </Button>
                </MenuTrigger>
                <MenuContent align="end">
                  <MenuLabel>表示する列</MenuLabel>
                  {hideableColumns.map((column) => (
                    <MenuCheckboxItem
                      key={column.id}
                      checked={column.getIsVisible()}
                      onCheckedChange={(v) => column.toggleVisibility(v === true)}
                    >
                      {String(column.columnDef.header)}
                    </MenuCheckboxItem>
                  ))}
                </MenuContent>
              </Menu>
            ) : null}
          </div>
        </div>
      ) : null}

      <Table
        density={density}
        aria-label={ariaLabel}
        aria-busy={status === "loading" || undefined}
        containerProps={{
          ref: scrollRef,
          style: virtualize ? { height, overflowY: "auto" } : undefined,
          // 仮想化した表はスクロールで行を出すのでキーボードから届くようにする。それ以外は余分なタブストップを作らない
          tabIndex: virtualize ? 0 : undefined,
          role: virtualize ? "region" : undefined,
          "aria-label": virtualize ? `${ariaLabel}（スクロール領域）` : undefined,
        }}
        className="min-w-full table-fixed"
        style={{ width: table.getTotalSize() }}
      >
        {caption ? <TableCaption>{caption}</TableCaption> : null}
        <TableHeader>
          {table.getHeaderGroups().map((group) => (
            <TableRow key={group.id} className="hover:bg-surface-well">
              {group.headers.map((header) => (
                <GridHead
                  key={header.id}
                  header={header}
                  table={table}
                  filterable={filterableColumns.some((c) => c.id === header.column.id)}
                  values={
                    filterableColumns.some((c) => c.id === header.column.id)
                      ? uniqueValues(
                          data,
                          accessorOf(
                            columns.find((c) => c.id === header.column.id) as DataGridColumn<T>,
                          ),
                        )
                      : EMPTY
                  }
                />
              ))}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {status === "loading" ? (
            <TableRow className="hover:bg-transparent">
              <TableCell colSpan={visibleColumnCount} className="h-auto py-4">
                <SkeletonRows rows={5} />
              </TableCell>
            </TableRow>
          ) : status === "error" ? (
            <TableRow className="hover:bg-transparent">
              <TableCell colSpan={visibleColumnCount} className="h-auto py-4">
                <InlineMessage
                  variant="negative"
                  action={
                    onRetry ? (
                      <Button variant="outline" size="sm" onClick={onRetry}>
                        再試行
                      </Button>
                    ) : undefined
                  }
                >
                  {errorMessage}
                </InlineMessage>
              </TableCell>
            </TableRow>
          ) : rows.length === 0 ? (
            <TableRow className="hover:bg-transparent">
              <TableCell colSpan={visibleColumnCount} className="h-auto py-6">
                <EmptyState
                  title={
                    data.length > 0 && total === 0 ? "条件に合うデータがありません" : emptyTitle
                  }
                  description={emptyDescription}
                  action={
                    data.length > 0 && total === 0 ? (
                      <Button
                        variant="outline"
                        onClick={() => {
                          table.resetGlobalFilter();
                          table.resetColumnFilters();
                        }}
                      >
                        条件をクリアする
                      </Button>
                    ) : (
                      emptyAction
                    )
                  }
                  hideMascot
                />
              </TableCell>
            </TableRow>
          ) : (
            <>
              {paddingTop > 0 ? (
                // biome-ignore lint/a11y/noInteractiveElementToNoninteractiveRole: 仮想化の余白行（見えない・操作しない）
                <tr
                  data-slot="data-grid-spacer"
                  role="presentation"
                  style={{ height: paddingTop }}
                />
              ) : null}
              {renderedRows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() ? "selected" : undefined}
                  data-index={row.index}
                >
                  {row.getVisibleCells().map((cell) => {
                    const pinned = cell.column.getIsPinned();
                    const numeric = cell.column.columnDef.meta?.numeric;
                    return (
                      <TableCell
                        key={cell.id}
                        numeric={numeric}
                        style={{
                          width: cell.column.getSize(),
                          left: pinned === "start" ? cell.column.getStart("start") : undefined,
                        }}
                        className={cn(
                          "truncate",
                          pinned === "start" &&
                            "sticky z-[1] bg-surface-card group-hover/row:bg-surface-well group-data-[state=selected]/row:bg-surface-selected",
                          cell.column.id === ACTIONS_COLUMN_ID && "overflow-visible",
                        )}
                      >
                        <table.FlexRender cell={cell} />
                      </TableCell>
                    );
                  })}
                </TableRow>
              ))}
              {paddingBottom > 0 ? (
                // biome-ignore lint/a11y/noInteractiveElementToNoninteractiveRole: 仮想化の余白行（見えない・操作しない）
                <tr
                  data-slot="data-grid-spacer"
                  role="presentation"
                  style={{ height: paddingBottom }}
                />
              ) : null}
            </>
          )}
        </TableBody>
      </Table>

      {usePagination && status === "ready" && total > 0 ? (
        <div data-slot="data-grid-footer" className="flex flex-wrap items-center gap-3">
          <Pagination
            page={table.state.pagination.pageIndex + 1}
            total={total}
            pageSize={table.state.pagination.pageSize}
            onPageChange={(p) => table.setPageIndex(p - 1)}
            unit={unit}
            className="flex-1"
          />
          <div className="flex items-center gap-2 text-2 text-text-middle">
            <span>1 ページ</span>
            <Select
              value={String(table.state.pagination.pageSize)}
              onValueChange={(v) => table.setPageSize(Number(v))}
            >
              <SelectTrigger size="sm" aria-label="1 ページの件数" className="w-24">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {[20, 50, 100].map((n) => (
                  <SelectItem key={n} value={String(n)}>
                    {n}
                    {unit}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      ) : null}
    </div>
  );
}

function uniqueValues<T extends RowData>(data: T[], accessor: (row: T) => unknown): string[] {
  const set = new Set<string>();
  for (const row of data) {
    const v = accessor(row);
    if (v === null || v === undefined || v === "") continue;
    set.add(String(v));
  }
  return [...set].sort((a, b) => a.localeCompare(b, "ja"));
}

type GridTable<T extends RowData> = ReturnType<typeof useTable<Features, T>>;

type GridHeadProps<T extends RowData> = {
  header: Header<Features, T, unknown>;
  table: GridTable<T>;
  filterable: boolean;
  values: string[];
};

function GridHead<T extends RowData>({ header, table, filterable, values }: GridHeadProps<T>) {
  const column: Column<Features, T, unknown> = header.column;
  const pinned = column.getIsPinned();
  const numeric = column.columnDef.meta?.numeric;
  const sorted = column.getIsSorted();
  const canSort = column.getCanSort();
  const filterValue = (column.getFilterValue() as string[] | undefined) ?? [];
  const label = header.isPlaceholder ? "" : String(column.columnDef.header ?? "");
  const isDisplay = column.id === SELECT_COLUMN_ID || column.id === ACTIONS_COLUMN_ID;

  return (
    <TableHead
      numeric={numeric}
      sort={canSort ? (sorted === false ? "none" : sorted) : undefined}
      onSort={canSort ? column.getToggleSortingHandler() : undefined}
      style={{
        width: header.getSize(),
        left: pinned === "start" ? column.getStart("start") : undefined,
      }}
      className={cn("relative", pinned === "start" && "sticky z-20 bg-surface-well")}
      trailing={
        column.getCanResize() ? (
          // 列幅のハンドル。ドラッグのほか、キーボード（← → で 16px ずつ、Home で既定幅）でも変えられる
          <button
            type="button"
            data-slot="data-grid-resizer"
            aria-label={`${label || column.id} の列幅を変更`}
            onMouseDown={header.getResizeHandler()}
            onTouchStart={header.getResizeHandler()}
            onDoubleClick={() => column.resetSize()}
            onKeyDown={(e) => {
              const delta = e.key === "ArrowRight" ? 16 : e.key === "ArrowLeft" ? -16 : 0;
              if (delta) {
                e.preventDefault();
                const min = column.columnDef.minSize ?? 40;
                table.setColumnSizing((old) => ({
                  ...old,
                  [column.id]: Math.max(min, column.getSize() + delta),
                }));
              } else if (e.key === "Home") {
                e.preventDefault();
                column.resetSize();
              }
            }}
            className={cn(
              "absolute top-0 right-0 h-full w-1.5 cursor-col-resize select-none touch-none rounded-none border-0 bg-transparent p-0 outline-none hover:bg-border-primary focus-visible:bg-border-primary focus-visible:outline-2 focus-visible:outline-offset-0 focus-visible:outline-border-focus",
              column.getIsResizing() && "bg-border-primary",
            )}
          />
        ) : null
      }
      actions={
        filterable ? (
          <Popover>
            <PopoverTrigger asChild>
              <IconButton
                icon="filter_list"
                label={`${label}で絞り込む${filterValue.length ? `（${filterValue.length} 件選択中）` : ""}`}
                variant="ghost"
                size="sm"
                className={cn(filterValue.length > 0 && "text-object-primary")}
              />
            </PopoverTrigger>
            <PopoverContent align="start" className="w-72">
              <PopoverTitle>{label}で絞り込む</PopoverTitle>
              <SearchCombobox
                label={`${label}の値`}
                hideLabel
                multiple
                options={values}
                value={filterValue}
                onChange={(v) => column.setFilterValue(v.length ? v : undefined)}
                size="sm"
                placeholder="値を検索"
              />
            </PopoverContent>
          </Popover>
        ) : undefined
      }
    >
      {isDisplay ? <table.FlexRender header={header} /> : label}
    </TableHead>
  );
}
