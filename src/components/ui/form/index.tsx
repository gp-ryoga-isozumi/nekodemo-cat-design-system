"use client";

import { Label as LabelPrimitive, Slot } from "radix-ui";
import { type ComponentProps, createContext, useContext, useEffect, useId, useState } from "react";
import {
  Controller,
  type ControllerProps,
  type FieldPath,
  type FieldValues,
  FormProvider,
  useFormContext,
  useFormState,
} from "react-hook-form";
import { cn } from "../../../lib/utils";
import { Icon } from "../icon";

/**
 * Form
 *
 * 概要: react-hook-form ＋ zod でフォームを組む土台（設計書 §9.1 #24）。ラベル・補足・エラーの配置を固定し、
 * `aria-describedby` / `aria-invalid` を自動で結ぶ（§10.7）。
 *
 * 構成: Form（FormProvider）> FormField（Controller）> FormItem > FormLabel / FormControl / FormDescription / FormMessage。
 * 単純な項目には Field（ラベル・補足・エラーだけの静的版）を使える。
 *
 * アンチパターン:
 * - エラー文を「入力が不正です」だけにする（何が起きたか＋どうすればよいか。§10.4）
 * - placeholder に必須情報を書く
 * - フォームの保存後に編集画面に留まる（詳細か一覧に戻して Toast。§10.3）
 *
 * 使用例:
 * ```tsx
 * const form = useForm({ resolver: zodResolver(schema) });
 * <Form {...form}>
 *   <form onSubmit={form.handleSubmit(onSubmit)}>
 *     <FormField control={form.control} name="name" render={({ field }) => (
 *       <FormItem>
 *         <FormLabel required>顧客名</FormLabel>
 *         <FormControl><Input placeholder="例: 山田商事" {...field} /></FormControl>
 *         <FormDescription>顧客に見せる名前になります</FormDescription>
 *         <FormMessage />
 *       </FormItem>
 *     )} />
 *   </form>
 * </Form>
 * ```
 */
export const Form = FormProvider;

type FormFieldContextValue<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> = {
  name: TName;
};
const FormFieldContext = createContext<FormFieldContextValue | null>(null);

export function FormField<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>(props: ControllerProps<TFieldValues, TName>) {
  return (
    <FormFieldContext.Provider value={{ name: props.name }}>
      <Controller {...props} />
    </FormFieldContext.Provider>
  );
}

type FormItemContextValue = {
  id: string;
  hasDescription: boolean;
  setHasDescription: (v: boolean) => void;
};
const FormItemContext = createContext<FormItemContextValue | null>(null);

export function useFormField() {
  const fieldContext = useContext(FormFieldContext);
  const itemContext = useContext(FormItemContext);
  const { getFieldState } = useFormContext();
  const formState = useFormState({ name: fieldContext?.name });
  if (!fieldContext) throw new Error("useFormField は FormField の中で使ってください");
  if (!itemContext) throw new Error("useFormField は FormItem の中で使ってください");
  const fieldState = getFieldState(fieldContext.name, formState);
  const { id, hasDescription } = itemContext;
  return {
    id,
    hasDescription,
    name: fieldContext.name,
    formItemId: `${id}-form-item`,
    formDescriptionId: `${id}-form-item-description`,
    formMessageId: `${id}-form-item-message`,
    ...fieldState,
  };
}

export function FormItem({ className, ...props }: ComponentProps<"div">) {
  const id = useId();
  const [hasDescription, setHasDescription] = useState(false);
  return (
    <FormItemContext.Provider value={{ id, hasDescription, setHasDescription }}>
      <div data-slot="form-item" className={cn("flex flex-col gap-1.5", className)} {...props} />
    </FormItemContext.Provider>
  );
}

/** ラベル。`required` で「必須」の印を付ける（* ではなく語で示す） */
export function FormLabel({
  className,
  required,
  children,
  ...props
}: ComponentProps<typeof LabelPrimitive.Root> & { required?: boolean }) {
  const { error, formItemId } = useFormField();
  return (
    <LabelPrimitive.Root
      data-slot="form-label"
      data-error={!!error}
      htmlFor={formItemId}
      className={cn("flex items-center gap-1.5 text-2 font-bold text-text-high", className)}
      {...props}
    >
      {children}
      {required ? <span className="font-normal text-1 text-text-negative">必須</span> : null}
    </LabelPrimitive.Root>
  );
}

export function FormControl(props: ComponentProps<typeof Slot.Root>) {
  const { error, formItemId, formDescriptionId, formMessageId, hasDescription } = useFormField();
  const describedBy = [hasDescription ? formDescriptionId : null, error ? formMessageId : null]
    .filter(Boolean)
    .join(" ");
  return (
    <Slot.Root
      data-slot="form-control"
      id={formItemId}
      aria-describedby={describedBy || undefined}
      aria-invalid={!!error}
      {...props}
    />
  );
}

export function FormDescription({ className, ...props }: ComponentProps<"p">) {
  const { formDescriptionId } = useFormField();
  const item = useContext(FormItemContext);
  useEffect(() => {
    item?.setHasDescription(true);
    return () => item?.setHasDescription(false);
  }, [item]);
  return (
    <p
      data-slot="form-description"
      id={formDescriptionId}
      className={cn("text-1 text-text-low", className)}
      {...props}
    />
  );
}

/** エラー文。children が無ければ react-hook-form のエラーメッセージを出す */
export function FormMessage({ className, children, ...props }: ComponentProps<"p">) {
  const { error, formMessageId } = useFormField();
  const body = error ? String(error?.message ?? "") : children;
  if (!body) return null;
  return (
    <p
      data-slot="form-message"
      id={formMessageId}
      role="alert"
      className={cn("flex items-center gap-1 text-1 text-text-negative", className)}
      {...props}
    >
      <Icon icon="error" size={2} />
      {body}
    </p>
  );
}

/**
 * Field — react-hook-form を使わない静的なラベル・補足・エラーの組（設定画面の 1 項目など）。
 * 子の入力部品には `id={fieldId}` と `aria-describedby` を自分で付ける。
 */
export function Field({
  label,
  required,
  description,
  error,
  htmlFor,
  className,
  children,
}: {
  label: string;
  required?: boolean;
  description?: string;
  error?: string;
  htmlFor: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div data-slot="field" className={cn("flex flex-col gap-1.5", className)}>
      <label
        htmlFor={htmlFor}
        className="flex items-center gap-1.5 text-2 font-bold text-text-high"
      >
        {label}
        {required ? <span className="font-normal text-1 text-text-negative">必須</span> : null}
      </label>
      {children}
      {description ? (
        <p id={`${htmlFor}-description`} className="text-1 text-text-low">
          {description}
        </p>
      ) : null}
      {error ? (
        <p
          id={`${htmlFor}-error`}
          role="alert"
          className="flex items-center gap-1 text-1 text-text-negative"
        >
          <Icon icon="error" size={2} />
          {error}
        </p>
      ) : null}
    </div>
  );
}
