import { notFound } from "next/navigation";
import { MarkdownContent } from "../../_components/markdown";
import { PageHeader } from "../../_components/page-header";
import { FOUNDATIONS, findDoc, readDoc } from "../../_lib/content";

export const dynamicParams = false;

export function generateStaticParams() {
  return FOUNDATIONS.map((p) => ({ slug: p.slug }));
}

export default async function FoundationPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const page = findDoc(FOUNDATIONS, slug);
  if (!page) notFound();
  return (
    <>
      <PageHeader
        crumbs={[{ href: "/guidelines/foundations/", label: "Foundations" }, { label: page.title }]}
        title={page.title}
        description={page.description}
      />
      <MarkdownContent source={readDoc(page)} />
    </>
  );
}
