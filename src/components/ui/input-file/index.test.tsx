import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { ComponentProps } from "react";
import { describe, expect, it, vi } from "vitest";
import { InputFile } from ".";

function pdf(name = "a.pdf") {
  return new File(["x"], name, { type: "application/pdf" });
}

function largePdf(name = "big.pdf") {
  // 2 MB（maxSizeMB={1} を超える）
  return new File([new Uint8Array(2 * 1024 * 1024)], name, { type: "application/pdf" });
}

function AttachmentField(props: Omit<ComponentProps<typeof InputFile>, "id">) {
  return (
    <div>
      <label htmlFor="attachment">添付ファイル</label>
      <InputFile id="attachment" {...props} />
    </div>
  );
}

describe("InputFile", () => {
  it("表示: defaultValue で既存の添付を出し、非制御のまま外せる", async () => {
    render(<InputFile id="files" aria-label="添付ファイル" defaultValue={[pdf("契約書.pdf")]} />);
    expect(screen.getByText("契約書.pdf")).toBeInTheDocument();
    await userEvent.click(screen.getByRole("button", { name: "契約書.pdf を外す" }));
    expect(screen.queryByText("契約書.pdf")).not.toBeInTheDocument();
  });

  it("表示: ドロップ領域と「ファイルを選ぶ」、受け付ける条件が出る", () => {
    const { container } = render(<AttachmentField accept=".pdf,image/*" maxSizeMB={10} />);
    expect(container.querySelector('[data-slot="input-file"]')).toBeInTheDocument();
    expect(container.querySelector('[data-slot="input-file-dropzone"]')).toBeInTheDocument();
    expect(screen.getByText(/ここにファイルをドロップ、または/)).toBeInTheDocument();
    expect(screen.getByText("ファイルを選ぶ")).toBeInTheDocument();
    expect(screen.getByText(".pdf / image/*、10 MB まで")).toBeInTheDocument();

    const input = screen.getByLabelText("添付ファイル");
    expect(input).toHaveAttribute("type", "file");
    expect(input).toHaveAttribute("accept", ".pdf,image/*");
    expect(input).not.toHaveAttribute("multiple");
    // まだ何も選んでいないので一覧は出ない
    expect(container.querySelector('[data-slot="input-file-list"]')).not.toBeInTheDocument();
  });

  it("表示: 文言は dropText / buttonText で変えられる", () => {
    render(<AttachmentField dropText="請求書をここにドロップ、または" buttonText="請求書を選ぶ" />);
    expect(screen.getByText(/請求書をここにドロップ、または/)).toBeInTheDocument();
    expect(screen.getByText("請求書を選ぶ")).toBeInTheDocument();
  });

  it("操作: ファイルを選ぶと一覧に名前とサイズが出て onValueChange が呼ばれる", async () => {
    const onValueChange = vi.fn();
    const { container } = render(<AttachmentField onValueChange={onValueChange} />);
    const input = screen.getByLabelText("添付ファイル");

    await userEvent.upload(input, pdf("見積書_山田商事.pdf"));

    expect(onValueChange).toHaveBeenCalledTimes(1);
    expect(onValueChange.mock.calls[0][0]).toHaveLength(1);
    expect(onValueChange.mock.calls[0][0][0].name).toBe("見積書_山田商事.pdf");

    const list = container.querySelector('[data-slot="input-file-list"]');
    expect(list).toBeInTheDocument();
    expect(within(list as HTMLElement).getByText("見積書_山田商事.pdf")).toBeInTheDocument();
    expect(within(list as HTMLElement).getByText("1 B")).toBeInTheDocument();
  });

  it("操作: multiple なら追加で選んだファイルが一覧に足される", async () => {
    const onValueChange = vi.fn();
    render(<AttachmentField multiple maxFiles={5} onValueChange={onValueChange} />);
    const input = screen.getByLabelText("添付ファイル");

    await userEvent.upload(input, [pdf("見積書.pdf"), pdf("仕様書.pdf")]);
    expect(screen.getByText("見積書.pdf")).toBeInTheDocument();
    expect(screen.getByText("仕様書.pdf")).toBeInTheDocument();

    await userEvent.upload(input, pdf("議事録.pdf"));
    expect(onValueChange).toHaveBeenLastCalledWith([
      expect.objectContaining({ name: "見積書.pdf" }),
      expect.objectContaining({ name: "仕様書.pdf" }),
      expect.objectContaining({ name: "議事録.pdf" }),
    ]);
    expect(screen.getAllByRole("listitem")).toHaveLength(3);
  });

  it("操作: 同じファイル（名前・サイズ・更新日時が同じ）を 2 回入れても 1 件のまま", async () => {
    const onValueChange = vi.fn();
    render(<InputFile id="dup" multiple aria-label="添付ファイル" onValueChange={onValueChange} />);
    const input = screen.getByLabelText("添付ファイル");
    const same = pdf("見積書.pdf");
    await userEvent.upload(input, same);
    await userEvent.upload(input, same);
    expect(screen.getAllByText("見積書.pdf")).toHaveLength(1);
    expect(onValueChange).toHaveBeenCalledTimes(1);
  });

  it("操作: 受け付けない種類・サイズ・件数は onReject に理由付きで渡る", async () => {
    const onReject = vi.fn();
    const onValueChange = vi.fn();
    const { unmount } = render(
      <AttachmentField accept=".pdf" onReject={onReject} onValueChange={onValueChange} />,
    );
    // accept で弾かれるファイルも部品側の検証に渡すため、user-event の accept 適用は切る
    const user = userEvent.setup({ applyAccept: false });
    await user.upload(
      screen.getByLabelText("添付ファイル"),
      new File(["x"], "メモ.txt", { type: "text/plain" }),
    );
    expect(onReject).toHaveBeenLastCalledWith(
      expect.objectContaining({ name: "メモ.txt" }),
      "type",
    );
    expect(onValueChange).not.toHaveBeenCalled();
    unmount();

    onReject.mockClear();
    const { unmount: unmountSize } = render(
      <AttachmentField maxSizeMB={1} onReject={onReject} onValueChange={onValueChange} />,
    );
    await userEvent.upload(screen.getByLabelText("添付ファイル"), largePdf("大きな見積書.pdf"));
    expect(onReject).toHaveBeenLastCalledWith(
      expect.objectContaining({ name: "大きな見積書.pdf" }),
      "size",
    );
    expect(onValueChange).not.toHaveBeenCalled();
    unmountSize();

    onReject.mockClear();
    render(<AttachmentField multiple maxFiles={1} onReject={onReject} />);
    await userEvent.upload(screen.getByLabelText("添付ファイル"), [
      pdf("見積書.pdf"),
      pdf("仕様書.pdf"),
    ]);
    expect(onReject).toHaveBeenLastCalledWith(
      expect.objectContaining({ name: "仕様書.pdf" }),
      "count",
    );
    expect(screen.getAllByRole("listitem")).toHaveLength(1);
    expect(screen.getByText("見積書.pdf")).toBeInTheDocument();
  });

  it("操作: 「外す」を押すと一覧から消え、onValueChange に残りが渡る", async () => {
    const onValueChange = vi.fn();
    render(<AttachmentField multiple maxFiles={5} onValueChange={onValueChange} />);
    const input = screen.getByLabelText("添付ファイル");
    await userEvent.upload(input, [pdf("a.pdf"), pdf("b.pdf")]);
    expect(screen.getAllByRole("listitem")).toHaveLength(2);

    await userEvent.click(screen.getByRole("button", { name: "a.pdf を外す" }));
    expect(onValueChange).toHaveBeenLastCalledWith([expect.objectContaining({ name: "b.pdf" })]);
    expect(screen.queryByText("a.pdf")).not.toBeInTheDocument();
    expect(screen.getAllByRole("listitem")).toHaveLength(1);
  });

  it("disabled: ファイルを選べず、一覧の「外す」も無効になる", async () => {
    const onValueChange = vi.fn();
    const { rerender } = render(<AttachmentField multiple onValueChange={onValueChange} />);
    const input = screen.getByLabelText("添付ファイル");
    await userEvent.upload(input, pdf("見積書.pdf"));
    expect(screen.getAllByRole("listitem")).toHaveLength(1);

    onValueChange.mockClear();
    rerender(
      <div>
        <label htmlFor="attachment">添付ファイル</label>
        <InputFile
          id="attachment"
          multiple
          disabled
          value={[pdf("見積書.pdf")]}
          onValueChange={onValueChange}
        />
      </div>,
    );
    const disabledInput = screen.getByLabelText("添付ファイル");
    expect(disabledInput).toBeDisabled();
    await userEvent.upload(disabledInput, pdf("仕様書.pdf"));
    expect(onValueChange).not.toHaveBeenCalled();

    const remove = screen.getByRole("button", { name: "見積書.pdf を外す" });
    expect(remove).toBeDisabled();
    await userEvent.click(remove);
    expect(onValueChange).not.toHaveBeenCalled();
  });

  it("アクセシブルネーム: label htmlFor が file input に結び付き、外すボタンはファイル名で引ける", async () => {
    render(
      <div>
        <label htmlFor="attachment">添付ファイル</label>
        <InputFile id="attachment" multiple aria-describedby="attachment-description" />
        <p id="attachment-description">PDF か画像を添付できます</p>
      </div>,
    );
    const input = screen.getByLabelText("添付ファイル");
    expect(input).toHaveAttribute("id", "attachment");
    expect(input).toHaveAccessibleDescription("PDF か画像を添付できます");

    await userEvent.upload(input, pdf("見積書_山田商事.pdf"));
    expect(screen.getByRole("button", { name: "見積書_山田商事.pdf を外す" })).toHaveAccessibleName(
      "見積書_山田商事.pdf を外す",
    );
  });
});
