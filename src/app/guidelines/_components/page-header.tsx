import NextLink from "next/link";
import type { ReactNode } from "react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export type Crumb = { href?: string; label: string };

export function PageHeader({
  crumbs,
  title,
  description,
  aside,
}: {
  crumbs: Crumb[];
  title: string;
  description?: ReactNode;
  aside?: ReactNode;
}) {
  return (
    <div className="mb-6 flex flex-col gap-3">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <NextLink href="/guidelines/">ガイドライン</NextLink>
            </BreadcrumbLink>
          </BreadcrumbItem>
          {crumbs.map((c) => (
            <BreadcrumbItem key={c.label}>
              <BreadcrumbSeparator />
              {c.href ? (
                <BreadcrumbLink asChild>
                  <NextLink href={c.href}>{c.label}</NextLink>
                </BreadcrumbLink>
              ) : (
                <BreadcrumbPage>{c.label}</BreadcrumbPage>
              )}
            </BreadcrumbItem>
          ))}
        </BreadcrumbList>
      </Breadcrumb>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="font-bold text-7 text-text-high">{title}</h1>
          {description ? <p className="mt-1 text-3 text-text-middle">{description}</p> : null}
        </div>
        {aside}
      </div>
    </div>
  );
}

/** 一覧ページのカード（タイトル・説明・リンク） */
export function IndexCards({
  items,
}: {
  items: { href: string; title: string; description: string; meta?: ReactNode }[];
}) {
  return (
    <ul className="grid list-none gap-4 sm:grid-cols-2">
      {items.map((item) => (
        <li key={item.href}>
          <NextLink
            href={item.href}
            className="block h-full rounded-container outline-none focus-visible:outline-2 focus-visible:outline-border-focus"
          >
            <Card className="h-full transition-colors hover:bg-surface-well">
              <CardHeader>
                <CardTitle>{item.title}</CardTitle>
                <CardDescription>{item.description}</CardDescription>
                {item.meta ? <div className="mt-2">{item.meta}</div> : null}
              </CardHeader>
            </Card>
          </NextLink>
        </li>
      ))}
    </ul>
  );
}
