"use client";

import { type ComponentProps, type DragEvent, useId, useRef, useState } from "react";
import { cn } from "../../../lib/utils";
import { Icon } from "../icon";
import { IconButton } from "../icon-button";

export type InputFileProps = Omit<
  ComponentProps<"input">,
  "type" | "value" | "defaultValue" | "onChange" | "size"
> & {
  /** 選択中のファイル（制御） */
  value?: File[];
  /** 非制御の初期ファイル（編集フォームで既存の添付を出す） */
  defaultValue?: File[];
  /** 選択・削除のたびに呼ばれる */
  onValueChange?: (files: File[]) => void;
  /** 受け付けない理由（種類・サイズ・件数）。拒否したファイルごとに呼ばれる */
  onReject?: (file: File, reason: "type" | "size" | "count") => void;
  /** 1 ファイルの上限（MB） */
  maxSizeMB?: number;
  /** 複数選択時の上限件数 */
  maxFiles?: number;
  /** 領域の文言。既定「ここにファイルをドロップ、または」 */
  dropText?: string;
  /** ボタンの文言。既定「ファイルを選ぶ」 */
  buttonText?: string;
  /** 削除ボタンの読み上げ名の接尾。既定「を外す」（「見積書.pdf を外す」のように空白を挟んで読む） */
  removeLabelSuffix?: string;
};

function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}

function acceptsType(file: File, accept?: string): boolean {
  if (!accept) return true;
  const rules = accept
    .split(",")
    .map((r) => r.trim().toLowerCase())
    .filter(Boolean);
  const name = file.name.toLowerCase();
  const type = file.type.toLowerCase();
  return rules.some((r) => {
    if (r.startsWith(".")) return name.endsWith(r);
    if (r.endsWith("/*")) return type.startsWith(r.slice(0, -1));
    return type === r;
  });
}

/**
 * InputFile
 *
 * 概要: ファイルの添付（v1.2）。ドロップ領域と「ファイルを選ぶ」ボタン、選択済みファイルの一覧（名前・サイズ・外す）を
 * 1 つにまとめたもの。`accept` / `maxSizeMB` / `maxFiles` で受け付ける条件を決め、外れたファイルは `onReject` に
 * 理由付きで渡す（画面側で InlineMessage に出す）。アップロード自体は行わず、`File[]` を返すだけ。
 * 中の `<input type="file">` は視覚的に隠すがタブ順に残す（Enter でファイル選択が開く）。見えている「ファイルを選ぶ」は
 * マウス用の本物のボタンで、押すとその input を開く。
 *
 * アンチパターン:
 * - 受け付ける種類と上限を文言で示さない（`accept` と `maxSizeMB` は説明にも書く。「PDF・画像、10 MB まで」）
 * - 選んだ直後に自動でアップロードして、外せなくする（保存ボタンまでは一覧で確認できるようにする）
 * - `<label>` を付けない（Form の Field で付ける）
 *
 * 推奨例:
 * - 見積書・契約書の添付は `accept=".pdf,image/*" maxSizeMB={10}` にし、説明に同じ条件を書く
 * - 複数添付は `multiple maxFiles={5}` にし、一覧で 1 件ずつ外せるようにする
 * - 拒否したときは `onReject` で InlineMessage（negative）に「PDF か画像だけ添付できます」と出す
 *
 * 使用例:
 * ```tsx
 * <InputFile id="attachments" multiple accept=".pdf,image/*" maxSizeMB={10} maxFiles={5}
 *   value={files} onValueChange={setFiles} onReject={(f, why) => setError(`${f.name}: ${why}`)} />
 * ```
 */
export function InputFile({
  className,
  value,
  defaultValue,
  onValueChange,
  onReject,
  maxSizeMB,
  maxFiles,
  dropText = "ここにファイルをドロップ、または",
  buttonText = "ファイルを選ぶ",
  removeLabelSuffix = "を外す",
  accept,
  multiple,
  disabled,
  id,
  ...props
}: InputFileProps) {
  const autoId = useId();
  const inputId = id ?? autoId;
  const inputRef = useRef<HTMLInputElement>(null);
  const [inner, setInner] = useState<File[]>(defaultValue ?? []);
  const [dragging, setDragging] = useState(false);
  const files = value ?? inner;

  const update = (next: File[]) => {
    if (value === undefined) setInner(next);
    onValueChange?.(next);
  };

  const add = (incoming: FileList | File[]) => {
    const accepted: File[] = [];
    const limit = multiple ? (maxFiles ?? Number.POSITIVE_INFINITY) : 1;
    let current = multiple ? [...files] : [];
    const sameFile = (a: File, b: File) =>
      a.name === b.name && a.size === b.size && a.lastModified === b.lastModified;
    for (const file of Array.from(incoming)) {
      // 同じファイル（名前・サイズ・更新日時が一致）は 2 回目を無視する（一覧の key が衝突するため）
      if ([...current, ...accepted].some((f) => sameFile(f, file))) continue;
      if (!acceptsType(file, accept)) {
        onReject?.(file, "type");
        continue;
      }
      if (maxSizeMB !== undefined && file.size > maxSizeMB * 1024 * 1024) {
        onReject?.(file, "size");
        continue;
      }
      if (current.length + accepted.length >= limit) {
        onReject?.(file, "count");
        continue;
      }
      accepted.push(file);
    }
    if (accepted.length === 0) return;
    current = multiple ? [...current, ...accepted] : [accepted[0]];
    update(current);
  };

  const remove = (index: number) => {
    update(files.filter((_, i) => i !== index));
    // 外したボタンごと一覧が消えるので、フォーカスを入力（ドロップ領域）に戻す
    if (files.length === 1) inputRef.current?.focus();
  };

  const onDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragging(false);
    if (disabled) return;
    add(e.dataTransfer.files);
  };

  return (
    <div data-slot="input-file" className={cn("flex flex-col gap-2", className)}>
      {/* biome-ignore lint/a11y/noStaticElementInteractions: ドロップ領域（ポインタ専用）。キーボードは中のボタンで開く */}
      <div
        data-slot="input-file-dropzone"
        data-dragging={dragging ? "true" : undefined}
        data-disabled={disabled ? "true" : undefined}
        onDragOver={(e) => {
          e.preventDefault();
          if (!disabled) setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={onDrop}
        className={cn(
          "flex flex-col items-center justify-center gap-2 rounded-action border border-border-high border-dashed bg-surface-input px-4 py-6 text-center transition-colors",
          "has-[input:focus-visible]:border-border-focus has-[input:focus-visible]:ring-2 has-[input:focus-visible]:ring-border-focus/30",
          "has-[input[aria-invalid=true]]:border-border-negative",
          "has-[button:focus-visible]:border-border-focus has-[button:focus-visible]:ring-2 has-[button:focus-visible]:ring-border-focus/30",
          dragging && "border-border-primary bg-surface-primary-subtle",
          disabled && "cursor-not-allowed border-border-middle bg-surface-disabled",
        )}
      >
        <Icon icon="upload" size={6} className="text-object-middle" />
        <p className="text-2 text-text-middle">
          {dropText}{" "}
          <input
            {...props}
            ref={inputRef}
            id={inputId}
            type="file"
            accept={accept}
            multiple={multiple}
            disabled={disabled}
            onChange={(e) => {
              if (e.target.files) add(e.target.files);
              e.target.value = "";
            }}
            className="sr-only"
          />
          {/* マウス用。読み上げは上の input（ラベル付き）が担うので、こちらは支援技術とタブ順から外す */}
          <button
            type="button"
            tabIndex={-1}
            aria-hidden="true"
            disabled={disabled}
            onClick={() => inputRef.current?.click()}
            className={cn(
              "inline-flex h-8 items-center rounded-action border border-border-high bg-surface-card px-3 font-bold text-2 text-text-high transition-colors",
              "hover:bg-surface-well",
              "disabled:cursor-not-allowed disabled:border-border-middle disabled:bg-surface-disabled disabled:text-text-disabled",
            )}
          >
            {buttonText}
          </button>
        </p>
        {accept || maxSizeMB ? (
          <p className={cn("text-1", disabled ? "text-text-middle" : "text-text-low")}>
            {[
              accept
                ?.split(",")
                .map((a) => a.trim())
                .join(" / "),
              maxSizeMB ? `${maxSizeMB} MB まで` : null,
            ]
              .filter(Boolean)
              .join("、")}
          </p>
        ) : null}
      </div>
      {files.length > 0 ? (
        <ul data-slot="input-file-list" className="flex flex-col gap-1">
          {files.map((file, i) => (
            <li
              key={`${file.name}-${file.size}-${file.lastModified}`}
              className="flex items-center gap-2 rounded-action border border-border-low bg-surface-card px-3 py-1.5 text-2"
            >
              <Icon icon="description" size={3} className="shrink-0 text-object-middle" />
              <span className="min-w-0 flex-1 truncate text-text-high">{file.name}</span>
              <span className="shrink-0 font-mono text-1 text-text-low tabular-nums">
                {formatSize(file.size)}
              </span>
              <IconButton
                icon="close"
                label={`${file.name} ${removeLabelSuffix}`}
                variant="ghost"
                size="sm"
                disabled={disabled}
                onClick={() => remove(i)}
              />
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
