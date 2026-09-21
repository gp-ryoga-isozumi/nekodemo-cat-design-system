import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Link } from ".";

const meta = {
  title: "UI/Link",
  component: Link,
  tags: ["autodocs"],
  args: { children: "案件の詳細", href: "#projects" },
  argTypes: {
    external: { control: "boolean" },
    asChild: { control: "boolean" },
  },
} satisfies Meta<typeof Link>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const External: Story = {
  name: "外部リンク",
  args: { children: "ヘルプセンター", href: "https://example.com", external: true },
};

export const InText: Story = {
  name: "文中のリンク",
  render: () => (
    <p className="max-w-96 text-2 text-text-high">
      案件の進め方は <Link href="#guide">運用ガイド</Link> にまとめています。仕様の詳細は{" "}
      <Link href="https://example.com" external>
        ヘルプセンター
      </Link>{" "}
      をご覧ください。
    </p>
  ),
};

export const InList: Story = {
  name: "一覧での使い方",
  render: () => (
    <ul className="flex w-96 flex-col gap-2">
      {[
        { id: "1", name: "山田商事 サイト刷新" },
        { id: "2", name: "佐藤工業 基幹システム更改" },
        { id: "3", name: "鈴木物産 アプリ開発" },
      ].map((project) => (
        <li key={project.id}>
          <Link href={`#projects-${project.id}`}>{project.name}</Link>
        </li>
      ))}
    </ul>
  ),
};

export const AsChild: Story = {
  name: "asChild（Next.js の Link を包む）",
  render: () => (
    <div className="flex flex-col gap-2">
      <Link asChild>
        {/* 実際は <NextLink href="/projects"> を渡します */}
        <a href="#projects">案件一覧</a>
      </Link>
      <Link asChild external>
        <a href="https://example.com">利用規約</a>
      </Link>
    </div>
  ),
};
