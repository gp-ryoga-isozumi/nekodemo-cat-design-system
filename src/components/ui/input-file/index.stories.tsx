import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { type ReactNode, useState } from "react";
import { InlineMessage } from "../inline-message";
import { InputFile } from ".";

const meta = {
  title: "UI/InputFile",
  component: InputFile,
  tags: ["autodocs"],
  args: {
    id: "attachment",
    accept: ".pdf,image/*",
    maxSizeMB: 10,
  },
  argTypes: {
    multiple: { control: "boolean" },
    disabled: { control: "boolean" },
    maxSizeMB: { control: "number" },
    maxFiles: { control: "number" },
    accept: { control: "text" },
    dropText: { control: "text" },
    buttonText: { control: "text" },
  },
  parameters: { layout: "padded" },
  decorators: [
    (Story) => (
      <div className="max-w-xl">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof InputFile>;

export default meta;
type Story = StoryObj<typeof meta>;

/** ラベルと補足をまとめる、ストーリー用の簡易フィールド（実装では Form の Field を使う） */
function Field({
  id,
  label,
  description,
  children,
}: {
  id: string;
  label: string;
  description?: string;
  children: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-2 text-text-middle">
        {label}
      </label>
      {children}
      {description ? (
        <p id={`${id}-description`} className="text-1 text-text-low">
          {description}
        </p>
      ) : null}
    </div>
  );
}

function sampleFile(name: string, type: string, sizeKB: number) {
  return new File([new Uint8Array(sizeKB * 1024)], name, { type });
}

export const Default: Story = {
  name: "既定（1 件だけ添付する）",
  render: (args) => (
    <Field id="attachment" label="見積書">
      <InputFile {...args} />
    </Field>
  ),
};

export const Multiple: Story = {
  name: "複数の添付（maxFiles）",
  render: () => (
    <Field
      id="attachments"
      label="添付ファイル"
      description="PDF か画像を 5 件まで、1 件 10 MB まで添付できます"
    >
      <InputFile
        id="attachments"
        multiple
        accept=".pdf,image/*"
        maxSizeMB={10}
        maxFiles={5}
        aria-describedby="attachments-description"
      />
    </Field>
  ),
};

function AttachedFiles() {
  const [files, setFiles] = useState<File[]>(() => [
    sampleFile("見積書_山田商事.pdf", "application/pdf", 240),
    sampleFile("現地写真.png", "image/png", 1536),
    sampleFile("仕様書_第2版.pdf", "application/pdf", 820),
  ]);
  return (
    <Field id="attached" label="添付ファイル" description="保存するまでは一覧から外せます">
      <InputFile
        id="attached"
        multiple
        accept=".pdf,image/*"
        maxSizeMB={10}
        maxFiles={5}
        value={files}
        onValueChange={setFiles}
        aria-describedby="attached-description"
      />
    </Field>
  );
}

export const WithFiles: Story = {
  name: "選択済みの一覧",
  render: () => <AttachedFiles />,
};

function RejectingFiles() {
  const [files, setFiles] = useState<File[]>([]);
  const [error, setError] = useState<string | null>(null);

  return (
    <div className="flex flex-col gap-3">
      {error ? (
        <InlineMessage variant="negative" title="添付できないファイルがあります">
          {error}
        </InlineMessage>
      ) : null}
      <Field
        id="rejecting"
        label="添付ファイル"
        description="PDF か画像を 2 件まで、1 件 1 MB まで添付できます"
      >
        <InputFile
          id="rejecting"
          multiple
          accept=".pdf,image/*"
          maxSizeMB={1}
          maxFiles={2}
          value={files}
          onValueChange={(next) => {
            setError(null);
            setFiles(next);
          }}
          onReject={(file, reason) =>
            setError(
              {
                type: `${file.name} は PDF か画像ではありません。`,
                size: `${file.name} は 1 MB を超えています。`,
                count: `${file.name} は添付できませんでした。添付は 2 件までです。`,
              }[reason],
            )
          }
          aria-describedby="rejecting-description"
        />
      </Field>
    </div>
  );
}

export const Rejected: Story = {
  name: "受け付けない理由を伝える（onReject）",
  render: () => <RejectingFiles />,
};

export const CustomText: Story = {
  name: "文言を変える",
  render: () => (
    <Field id="custom" label="請求書（PDF）">
      <InputFile
        id="custom"
        accept=".pdf"
        maxSizeMB={5}
        dropText="請求書をここにドロップ、または"
        buttonText="請求書を選ぶ"
        removeLabelSuffix=" の添付を取り消す"
      />
    </Field>
  ),
};

export const Disabled: Story = {
  name: "disabled",
  render: () => (
    <Field id="disabled-file" label="添付ファイル（提出後は変更できません）">
      <InputFile id="disabled-file" disabled accept=".pdf,image/*" maxSizeMB={10} />
    </Field>
  ),
};
