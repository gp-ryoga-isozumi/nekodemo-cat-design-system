// docs/*.md を nekodemo の役割トークンで描画する。表は Table 部品、リンクは Link 部品に置き換える。
import NextLink from "next/link";
import type { ComponentProps, ReactNode } from "react";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Link } from "@/components/ui/link";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { BASE_PATH, REPO_URL } from "../_lib/content";

/** docs 内の相対リンクをサイト内のルートか GitHub の URL に直す */
function resolveHref(href: string, base: string): string {
  // Storybook は Next のルートではないので basePath を付けた素のリンクにする
  if (href.startsWith("/storybook/")) return `${BASE_PATH}${href}`;
  if (/^https?:/.test(href) || href.startsWith("#") || href.startsWith("/")) return href;
  const guideline = /^\.\/(0\d)-([a-z-]+)\.md(#.*)?$/.exec(href);
  if (guideline) {
    const map: Record<string, string> = {
      "01": "/guidelines/patterns/screen-patterns/",
      "02": "/guidelines/patterns/states/",
      "03": "/guidelines/patterns/actions/",
      "04": "/guidelines/foundations/writing/",
      "05": "/guidelines/foundations/spacing-and-color/",
      "06": "/guidelines/foundations/cat-flavor/",
      "07": "/guidelines/foundations/accessibility/",
    };
    return `${map[guideline[1]] ?? "/guidelines/"}${guideline[3] ?? ""}`;
  }
  if (href === "./README.md" || href === "README.md") return "/guidelines/";
  const path = href.startsWith("./") ? `${base}/${href.slice(2)}` : `${base}/${href}`;
  return `${REPO_URL}/blob/main/${path.replace(/^\/+/, "")}`;
}

function slugify(text: ReactNode): string | undefined {
  if (typeof text !== "string") return undefined;
  return text
    .toLowerCase()
    .replace(/[^\p{L}\p{N}]+/gu, "-")
    .replace(/^-|-$/g, "");
}

export function MarkdownContent({
  source,
  base = "docs/guidelines",
  /** 先頭の h1 を省く（ページ側で見出しを出すため） */
  skipTitle = true,
}: {
  source: string;
  base?: string;
  skipTitle?: boolean;
}) {
  const text = skipTitle ? source.replace(/^# .+\n+/, "") : source;
  return (
    <div data-slot="markdown" className="flex flex-col gap-4 text-3 text-text-high leading-7">
      <Markdown
        remarkPlugins={[remarkGfm]}
        components={{
          h1: ({ children }) => <h1 className="font-bold text-7 text-text-high">{children}</h1>,
          h2: ({ children }) => (
            <h2
              id={slugify(children)}
              className="mt-6 scroll-mt-20 border-border-low border-b pb-2 font-bold text-5 text-text-high"
            >
              {children}
            </h2>
          ),
          h3: ({ children }) => (
            <h3 id={slugify(children)} className="mt-4 font-bold text-4 text-text-high">
              {children}
            </h3>
          ),
          h4: ({ children }) => <h4 className="font-bold text-3 text-text-high">{children}</h4>,
          p: ({ children }) => <p>{children}</p>,
          ul: ({ children }) => <ul className="list-disc space-y-1 pl-6">{children}</ul>,
          ol: ({ children }) => <ol className="list-decimal space-y-1 pl-6">{children}</ol>,
          li: ({ children }) => <li>{children}</li>,
          strong: ({ children }) => <strong className="font-bold">{children}</strong>,
          blockquote: ({ children }) => (
            <blockquote className="border-border-primary border-l-4 bg-surface-primary-subtle px-4 py-2 text-text-middle">
              {children}
            </blockquote>
          ),
          hr: () => <hr className="border-border-low" />,
          a: ({ href, children }) => {
            const resolved = resolveHref(href ?? "", base);
            const external = /^https?:/.test(resolved) || resolved.includes("/storybook/");
            return external ? (
              <Link href={resolved} external>
                {children}
              </Link>
            ) : (
              <Link asChild>
                <NextLink href={resolved}>{children}</NextLink>
              </Link>
            );
          },
          code: ({
            node: _node,
            className,
            children,
            ...props
          }: ComponentProps<"code"> & { node?: unknown }) => {
            const block = typeof className === "string" && className.startsWith("language-");
            return block ? (
              <code className={className} {...props}>
                {children}
              </code>
            ) : (
              <code className="rounded-notice bg-surface-well px-1 py-0.5 font-mono text-2 text-text-high">
                {children}
              </code>
            );
          },
          pre: ({ children }) => (
            <pre className="overflow-x-auto rounded-action border border-border-low bg-surface-well p-4 font-mono text-2 leading-6">
              {children}
            </pre>
          ),
          table: ({ children }) => <Table density="xs">{children}</Table>,
          thead: ({ children }) => <TableHeader>{children}</TableHeader>,
          tbody: ({ children }) => <TableBody>{children}</TableBody>,
          tr: ({ children }) => <TableRow>{children}</TableRow>,
          th: ({ children }) => <TableHead className="whitespace-normal">{children}</TableHead>,
          td: ({ children }) => (
            <TableCell className="h-auto whitespace-normal py-2 align-top">{children}</TableCell>
          ),
        }}
      >
        {text}
      </Markdown>
    </div>
  );
}
