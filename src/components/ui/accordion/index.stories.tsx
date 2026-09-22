import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import type { ComponentProps } from "react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from ".";

// Accordion の props は type="single" / "multiple" の union なので、
// Storybook の args 型が never にならないよう single 側を取り出して meta の型にする
type AccordionStoryProps = Extract<ComponentProps<typeof Accordion>, { type: "single" }>;

const meta = {
  title: "UI/Accordion",
  component: Accordion,
  tags: ["autodocs"],
  args: {
    type: "single",
    collapsible: true,
    children: (
      <>
        <AccordionItem value="notify">
          <AccordionTrigger>通知の詳細</AccordionTrigger>
          <AccordionContent>
            納期の 3 日前と当日に、担当者へメールで通知します。通知先は担当者の登録アドレスです。
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="export">
          <AccordionTrigger>書き出しの形式</AccordionTrigger>
          <AccordionContent>
            CSV（UTF-8）と Excel 形式で書き出せます。1 回に書き出せるのは 10,000 件までです。
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="retention">
          <AccordionTrigger>データの保持期間</AccordionTrigger>
          <AccordionContent>
            完了した案件は 5 年間保持し、その後は自動で削除します。削除した案件は復元できません。
          </AccordionContent>
        </AccordionItem>
      </>
    ),
  },
  argTypes: {
    type: { control: "radio", options: ["single", "multiple"] },
    collapsible: { control: "boolean" },
  },
  parameters: { layout: "padded" },
  decorators: [
    (Story) => (
      <div className="max-w-2xl">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<AccordionStoryProps>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { name: "既定（single / collapsible）" };

export const DefaultOpen: Story = {
  name: "最初から開いておく（defaultValue）",
  render: () => (
    <Accordion type="single" collapsible defaultValue="notify">
      <AccordionItem value="notify">
        <AccordionTrigger>通知の詳細</AccordionTrigger>
        <AccordionContent>納期の 3 日前と当日に、担当者へメールで通知します。</AccordionContent>
      </AccordionItem>
      <AccordionItem value="export">
        <AccordionTrigger>書き出しの形式</AccordionTrigger>
        <AccordionContent>CSV（UTF-8）と Excel 形式で書き出せます。</AccordionContent>
      </AccordionItem>
    </Accordion>
  ),
};

export const Multiple: Story = {
  name: "複数を同時に開く（multiple）",
  render: () => (
    <Accordion type="multiple" defaultValue={["notify", "export"]}>
      <AccordionItem value="notify">
        <AccordionTrigger>通知の詳細</AccordionTrigger>
        <AccordionContent>納期の 3 日前と当日に、担当者へメールで通知します。</AccordionContent>
      </AccordionItem>
      <AccordionItem value="export">
        <AccordionTrigger>書き出しの形式</AccordionTrigger>
        <AccordionContent>CSV（UTF-8）と Excel 形式で書き出せます。</AccordionContent>
      </AccordionItem>
      <AccordionItem value="retention">
        <AccordionTrigger>データの保持期間</AccordionTrigger>
        <AccordionContent>完了した案件は 5 年間保持します。</AccordionContent>
      </AccordionItem>
    </Accordion>
  ),
};

export const Disabled: Story = {
  name: "開けない項目（disabled）",
  render: () => (
    <Accordion type="single" collapsible>
      <AccordionItem value="notify">
        <AccordionTrigger>通知の詳細</AccordionTrigger>
        <AccordionContent>納期の 3 日前と当日に、担当者へメールで通知します。</AccordionContent>
      </AccordionItem>
      <AccordionItem value="billing" disabled>
        <AccordionTrigger>請求の詳細（権限がありません）</AccordionTrigger>
        <AccordionContent>請求の設定は管理者だけが確認できます。</AccordionContent>
      </AccordionItem>
    </Accordion>
  ),
};

export const Faq: Story = {
  name: "FAQ",
  render: () => (
    <Accordion type="single" collapsible>
      <AccordionItem value="change-customer">
        <AccordionTrigger>請求先を変更するには</AccordionTrigger>
        <AccordionContent>
          案件の詳細画面で「編集する」を押し、請求先を選び直してください。請求書の発行後は変更できません。
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="browsers">
        <AccordionTrigger>対応ブラウザ</AccordionTrigger>
        <AccordionContent>
          最新版の Chrome / Edge / Safari / Firefox に対応しています。
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="restore">
        <AccordionTrigger>削除した案件を元に戻すには</AccordionTrigger>
        <AccordionContent>
          削除した案件は 30 日間はごみ箱に残ります。ごみ箱の一覧から「元に戻す」を押してください。
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  ),
};

export const InSettings: Story = {
  name: "設定画面での使い方",
  render: () => (
    <div className="flex flex-col gap-4">
      <p className="text-2 text-text-low">
        普段は触らない項目を畳んでおき、必要なときだけ開きます。
      </p>
      <Accordion type="multiple">
        <AccordionItem value="advanced">
          <AccordionTrigger>高度な設定</AccordionTrigger>
          <AccordionContent>
            案件番号の採番規則と、外部システムとの連携キーを設定できます。設定を変えると、以後に作成する案件から適用されます。
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="notify">
          <AccordionTrigger>通知の詳細</AccordionTrigger>
          <AccordionContent>
            納期の 3
            日前と当日に、担当者へメールで通知します。通知の停止は担当者ごとに設定できます。
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="retention">
          <AccordionTrigger>データの保持期間</AccordionTrigger>
          <AccordionContent>
            完了した案件は 5 年間保持し、その後は自動で削除します。削除した案件は復元できません。
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  ),
};
