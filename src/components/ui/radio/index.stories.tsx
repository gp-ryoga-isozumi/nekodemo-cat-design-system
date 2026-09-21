import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { RadioGroup, RadioItem } from ".";

const meta = {
  title: "UI/Radio",
  component: RadioGroup,
  tags: ["autodocs"],
} satisfies Meta<typeof RadioGroup>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  name: "既定（公開範囲）",
  render: () => (
    <RadioGroup defaultValue="internal" aria-label="公開範囲">
      <div className="flex items-center gap-2">
        <RadioItem value="internal" id="scope-internal" />
        <label htmlFor="scope-internal" className="text-2 text-text-high">
          社内のみ
        </label>
      </div>
      <div className="flex items-center gap-2">
        <RadioItem value="partner" id="scope-partner" />
        <label htmlFor="scope-partner" className="text-2 text-text-high">
          取引先にも公開する
        </label>
      </div>
      <div className="flex items-center gap-2">
        <RadioItem value="public" id="scope-public" />
        <label htmlFor="scope-public" className="text-2 text-text-high">
          全体に公開する
        </label>
      </div>
    </RadioGroup>
  ),
};

export const Horizontal: Story = {
  name: "横並び",
  render: () => (
    <RadioGroup defaultValue="isozumi" aria-label="担当者" className="flex gap-4">
      <div className="flex items-center gap-2">
        <RadioItem value="isozumi" id="owner-isozumi" />
        <label htmlFor="owner-isozumi" className="text-2 text-text-high">
          五十棲
        </label>
      </div>
      <div className="flex items-center gap-2">
        <RadioItem value="yamada" id="owner-yamada" />
        <label htmlFor="owner-yamada" className="text-2 text-text-high">
          山田
        </label>
      </div>
    </RadioGroup>
  ),
};

export const WithDescription: Story = {
  name: "補足付き",
  render: () => (
    <RadioGroup defaultValue="internal" aria-label="公開範囲（補足付き）">
      <div className="flex items-start gap-2">
        <RadioItem
          value="internal"
          id="scope-desc-internal"
          aria-describedby="scope-desc-internal-help"
          className="mt-0.5"
        />
        <div className="flex flex-col gap-0.5">
          <label htmlFor="scope-desc-internal" className="text-2 text-text-high">
            社内のみ
          </label>
          <p id="scope-desc-internal-help" className="text-1 text-text-low">
            五十棲さんと山田さんのように社内のメンバーだけが閲覧できます。
          </p>
        </div>
      </div>
      <div className="flex items-start gap-2">
        <RadioItem
          value="partner"
          id="scope-desc-partner"
          aria-describedby="scope-desc-partner-help"
          className="mt-0.5"
        />
        <div className="flex flex-col gap-0.5">
          <label htmlFor="scope-desc-partner" className="text-2 text-text-high">
            取引先にも公開する
          </label>
          <p id="scope-desc-partner-help" className="text-1 text-text-low">
            案件に招待した取引先の担当者も閲覧できます。
          </p>
        </div>
      </div>
    </RadioGroup>
  ),
};

export const DisabledItem: Story = {
  name: "選択肢を無効にする",
  render: () => (
    <RadioGroup defaultValue="internal" aria-label="公開範囲（一部無効）">
      <div className="flex items-center gap-2">
        <RadioItem value="internal" id="scope-di-internal" />
        <label htmlFor="scope-di-internal" className="text-2 text-text-high">
          社内のみ
        </label>
      </div>
      <div className="flex items-center gap-2">
        <RadioItem value="public" id="scope-di-public" disabled />
        <label htmlFor="scope-di-public" className="text-2 text-text-disabled">
          全体に公開する（管理者のみ設定できます）
        </label>
      </div>
    </RadioGroup>
  ),
};

export const Disabled: Story = {
  name: "disabled（グループ全体）",
  render: () => (
    <RadioGroup defaultValue="internal" aria-label="公開範囲（無効）" disabled>
      <div className="flex items-center gap-2">
        <RadioItem value="internal" id="scope-d-internal" />
        <label htmlFor="scope-d-internal" className="text-2 text-text-disabled">
          社内のみ
        </label>
      </div>
      <div className="flex items-center gap-2">
        <RadioItem value="public" id="scope-d-public" />
        <label htmlFor="scope-d-public" className="text-2 text-text-disabled">
          全体に公開する
        </label>
      </div>
    </RadioGroup>
  ),
};

export const Invalid: Story = {
  name: "invalid（エラー）",
  render: () => (
    <div className="flex flex-col gap-2">
      <RadioGroup aria-label="公開範囲（未選択）" aria-describedby="scope-error">
        <div className="flex items-center gap-2">
          <RadioItem value="internal" id="scope-iv-internal" aria-invalid />
          <label htmlFor="scope-iv-internal" className="text-2 text-text-high">
            社内のみ
          </label>
        </div>
        <div className="flex items-center gap-2">
          <RadioItem value="public" id="scope-iv-public" aria-invalid />
          <label htmlFor="scope-iv-public" className="text-2 text-text-high">
            全体に公開する
          </label>
        </div>
      </RadioGroup>
      <p id="scope-error" className="text-1 text-text-negative">
        公開範囲を選択してください。
      </p>
    </div>
  ),
};
