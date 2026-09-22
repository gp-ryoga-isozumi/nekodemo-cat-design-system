import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { type ReactNode, useState } from "react";
import { InputDate } from "../input-date";
import { InputTime } from ".";

const meta = {
  title: "UI/InputTime",
  component: InputTime,
  tags: ["autodocs"],
  args: {
    "aria-label": "開始時刻",
    defaultValue: "09:00",
    size: "md",
    stepMinutes: 15,
  },
  argTypes: {
    size: { control: "radio", options: ["sm", "md", "lg"] },
    stepMinutes: { control: { type: "number", min: 1, max: 60 } },
    disabled: { control: "boolean" },
    readOnly: { control: "boolean" },
  },
  decorators: [
    (Story) => (
      <div className="w-72">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof InputTime>;

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
    <div className="flex w-72 flex-col gap-1.5">
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

export const Default: Story = { name: "既定（開始時刻）" };

export const WithLabel: Story = {
  name: "ラベルと補足",
  render: () => (
    <Field id="start" label="開始時刻" description="15 分刻みで選べます">
      <InputTime id="start" defaultValue="09:00" aria-describedby="start-description" />
    </Field>
  ),
};

export const Sizes: Story = {
  name: "サイズ",
  render: () => (
    <div className="flex flex-col gap-4">
      <Field id="time-sm" label="開始時刻（sm 32px）">
        <InputTime id="time-sm" size="sm" defaultValue="09:00" />
      </Field>
      <Field id="time-md" label="開始時刻（md 40px）">
        <InputTime id="time-md" size="md" defaultValue="09:00" />
      </Field>
      <Field id="time-lg" label="開始時刻（lg 48px）">
        <InputTime id="time-lg" size="lg" defaultValue="09:00" />
      </Field>
    </div>
  ),
};

export const Steps: Story = {
  name: "刻み（stepMinutes）",
  render: () => (
    <div className="flex flex-col gap-4">
      <Field id="step-15" label="打ち合わせの開始時刻" description="15 分刻み（既定）">
        <InputTime
          id="step-15"
          defaultValue="13:30"
          stepMinutes={15}
          aria-describedby="step-15-description"
        />
      </Field>
      <Field id="step-30" label="シフトの開始時刻" description="30 分刻み">
        <InputTime
          id="step-30"
          defaultValue="09:00"
          stepMinutes={30}
          aria-describedby="step-30-description"
        />
      </Field>
      <Field id="step-1" label="作業の記録" description="1 分刻み（実績の記録など）">
        <InputTime
          id="step-1"
          defaultValue="09:07"
          stepMinutes={1}
          aria-describedby="step-1-description"
        />
      </Field>
    </div>
  ),
};

function MeetingTime() {
  const [start, setStart] = useState("13:00");
  const [end, setEnd] = useState("14:30");
  return (
    <div className="flex flex-col gap-4">
      <Field id="meeting-start" label="開始時刻">
        <InputTime id="meeting-start" value={start} max={end} onValueChange={setStart} />
      </Field>
      <Field id="meeting-end" label="終了時刻">
        <InputTime id="meeting-end" value={end} min={start} onValueChange={setEnd} />
      </Field>
      <p className="text-2 text-text-high">
        {start} 〜 {end} で会議室を予約します。
      </p>
    </div>
  );
}

export const Range: Story = {
  name: "開始と終了を並べる（min / max）",
  render: () => <MeetingTime />,
};

export const WithDate: Story = {
  name: "日付と組にする",
  render: () => (
    <div className="flex flex-col gap-4">
      <Field id="visit-date" label="訪問日">
        <InputDate id="visit-date" defaultValue="2026-10-31" />
      </Field>
      <Field id="visit-time" label="訪問時刻">
        <InputTime id="visit-time" defaultValue="10:00" />
      </Field>
    </div>
  ),
};

export const Empty: Story = {
  name: "未入力",
  render: () => (
    <Field id="empty-time" label="退勤時刻" description="退勤したときに入力します">
      <InputTime id="empty-time" defaultValue="" aria-describedby="empty-time-description" />
    </Field>
  ),
};

export const Invalid: Story = {
  name: "エラー（aria-invalid）",
  render: () => (
    <div className="flex w-72 flex-col gap-1.5">
      <label htmlFor="invalid-time" className="text-2 text-text-middle">
        開始時刻
      </label>
      <InputTime id="invalid-time" aria-invalid aria-describedby="invalid-time-error" />
      <p id="invalid-time-error" className="text-1 text-text-negative">
        開始時刻を入力してください
      </p>
    </div>
  ),
};

export const Disabled: Story = {
  name: "disabled / readOnly",
  render: () => (
    <div className="flex flex-col gap-4">
      <Field id="disabled-time" label="開始時刻（変更できません）">
        <InputTime id="disabled-time" disabled defaultValue="09:00" />
      </Field>
      <Field id="readonly-time" label="受付時刻（自動で記録されます）">
        <InputTime id="readonly-time" readOnly defaultValue="09:07" />
      </Field>
    </div>
  ),
};
