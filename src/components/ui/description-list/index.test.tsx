import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { DescriptionItem, DescriptionList } from ".";

describe("DescriptionList", () => {
  it("表示: dl / dt / dd で組まれ、columns と layout / density が反映される", () => {
    const { container } = render(
      <DescriptionList columns={3} layout="horizontal" density="sm">
        <DescriptionItem label="取引先">山田商事</DescriptionItem>
        <DescriptionItem label="受注金額">1,200,000 円</DescriptionItem>
      </DescriptionList>,
    );
    const list = container.querySelector("dl");
    expect(list).toHaveAttribute("data-slot", "description-list");
    expect(list).toHaveAttribute("data-layout", "horizontal");
    expect(list).toHaveAttribute("data-density", "sm");
    expect(list).toHaveClass("sm:grid-cols-3");

    const terms = container.querySelectorAll("dt");
    const details = container.querySelectorAll("dd");
    expect(terms).toHaveLength(2);
    expect(details).toHaveLength(2);
    expect(terms[0]).toHaveTextContent("取引先");
    expect(details[0]).toHaveTextContent("山田商事");
    expect(details[1]).toHaveTextContent("1,200,000 円");
  });

  it("表示: 既定は 2 列・vertical で、columns={1} ではグリッドの列指定が付かない", () => {
    const { container, rerender } = render(
      <DescriptionList>
        <DescriptionItem label="取引先">山田商事</DescriptionItem>
      </DescriptionList>,
    );
    const list = container.querySelector("dl");
    expect(list).toHaveAttribute("data-layout", "vertical");
    expect(list).toHaveAttribute("data-density", "md");
    expect(list).toHaveClass("sm:grid-cols-2");

    rerender(
      <DescriptionList columns={1}>
        <DescriptionItem label="取引先">山田商事</DescriptionItem>
      </DescriptionList>,
    );
    const single = container.querySelector("dl");
    expect(single).not.toHaveClass("sm:grid-cols-2");
    expect(single).not.toHaveClass("sm:grid-cols-3");
  });

  it("表示: 値が空の項目も行が残り、dd に「—」と data-empty=true が付く", () => {
    const { container } = render(
      <DescriptionList>
        <DescriptionItem label="検収日">{null}</DescriptionItem>
        <DescriptionItem label="請求番号">{""}</DescriptionItem>
        <DescriptionItem label="備考">{undefined}</DescriptionItem>
        <DescriptionItem label="次回の連絡日" emptyText="未定" />
        <DescriptionItem label="受注金額">1,200,000 円</DescriptionItem>
      </DescriptionList>,
    );
    const details = Array.from(container.querySelectorAll("dd"));
    expect(details).toHaveLength(5);
    for (const dd of details.slice(0, 3)) {
      expect(dd).toHaveAttribute("data-empty", "true");
      expect(dd).toHaveTextContent("—");
      expect(dd).toHaveClass("text-text-placeholder");
    }
    expect(details[3]).toHaveAttribute("data-empty", "true");
    expect(details[3]).toHaveTextContent("未定");
    expect(details[4]).not.toHaveAttribute("data-empty");
    expect(details[4]).toHaveTextContent("1,200,000 円");
    // 項目名は値が空でも消えない
    expect(screen.getByText("検収日")).toBeInTheDocument();
  });

  it("表示: span を付けた項目だけが複数列で全幅になる", () => {
    const { container } = render(
      <DescriptionList columns={2}>
        <DescriptionItem label="取引先">山田商事</DescriptionItem>
        <DescriptionItem label="備考" span>
          検収は 2026-11-05 に実施します。
        </DescriptionItem>
      </DescriptionList>,
    );
    const items = container.querySelectorAll('[data-slot="description-item"]');
    expect(items).toHaveLength(2);
    expect(items[0]).not.toHaveClass("sm:col-span-full");
    expect(items[1]).toHaveClass("sm:col-span-full");
  });

  it("操作: 値に置いたリンクやボタンをそのまま押せる", async () => {
    const onClick = vi.fn();
    render(
      <DescriptionList>
        <DescriptionItem label="請求書">
          <button type="button" onClick={onClick}>
            請求書をダウンロードする
          </button>
        </DescriptionItem>
      </DescriptionList>,
    );
    await userEvent.click(screen.getByRole("button", { name: "請求書をダウンロードする" }));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it("disabled: 値に置いた無効な操作は押せず、項目名と値の行はそのまま残る", async () => {
    const onClick = vi.fn();
    const { container } = render(
      <DescriptionList>
        <DescriptionItem label="請求書">
          <button type="button" disabled onClick={onClick}>
            請求書をダウンロードする
          </button>
        </DescriptionItem>
      </DescriptionList>,
    );
    const button = screen.getByRole("button", { name: "請求書をダウンロードする" });
    expect(button).toBeDisabled();
    await userEvent.click(button);
    expect(onClick).not.toHaveBeenCalled();
    expect(screen.getByText("請求書")).toBeInTheDocument();
    expect(container.querySelectorAll("dd")).toHaveLength(1);
  });

  it("アクセシブルネーム: 1 項目は dt → dd の順で並び、読み上げ順が崩れない", () => {
    const { container } = render(
      <DescriptionList>
        <DescriptionItem label="取引先">山田商事</DescriptionItem>
        <DescriptionItem label="担当者">佐藤 花子</DescriptionItem>
      </DescriptionList>,
    );
    const items = Array.from(container.querySelectorAll('[data-slot="description-item"]'));
    for (const item of items) {
      expect(item.firstElementChild?.tagName).toBe("DT");
      expect(item.lastElementChild?.tagName).toBe("DD");
    }
    expect(items[0].firstElementChild).toHaveAttribute("data-slot", "description-term");
    expect(items[0].lastElementChild).toHaveAttribute("data-slot", "description-details");

    // dt / dd の並び順がそのまま読み上げ順になる
    const texts = Array.from(container.querySelectorAll("dt, dd")).map((el) => el.textContent);
    expect(texts).toEqual(["取引先", "山田商事", "担当者", "佐藤 花子"]);
  });
});
