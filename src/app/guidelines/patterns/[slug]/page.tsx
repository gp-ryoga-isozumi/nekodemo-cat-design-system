import { notFound } from "next/navigation";
import { MarkdownContent } from "../../_components/markdown";
import { PageHeader } from "../../_components/page-header";
import { findDoc, PATTERNS, readDoc } from "../../_lib/content";

export const dynamicParams = false;

export function generateStaticParams() {
  return PATTERNS.map((p) => ({ slug: p.slug }));
}

export default async function PatternPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const page = findDoc(PATTERNS, slug);
  if (!page) notFound();
  return (
    <>
      <PageHeader
        crumbs={[{ href: "/guidelines/patterns/", label: "Patterns" }, { label: page.title }]}
        title={page.title}
        description={page.description}
      />
      <MarkdownContent source={readDoc(page)} />
    </>
  );
}
