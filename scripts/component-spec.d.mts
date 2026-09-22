// scripts/component-spec.mjs の型（ガイドラインサイトから import するため）
export type SpecOption = { options: string[]; default: string | null; from: string };
export type SpecMetric = {
  name: string;
  height: number | null;
  paddingX: number | null;
  text: { step: number; px: number | null } | null;
  classes: string;
};
export type SpecState = { key: string; label: string };
export type ComponentSpec = {
  options: Record<string, SpecOption>;
  metrics: SpecMetric[];
  states: SpecState[];
};

export function stringLiterals(source: string): string[];
export function classTokens(source: string): string[];
export function cvaVariants(
  source: string,
): Record<
  string,
  { variants: Record<string, Record<string, string>>; defaults: Record<string, string> }
>;
export function metricsFromSize(sizeOptions: Record<string, string | number>): SpecMetric[];
export function statesFromTokens(tokens: string[], source?: string): SpecState[];
export function sizeMaps(source: string): Record<string, Record<string, string | number>>;
export function densityMetrics(source: string): Record<string, number>;
export function defaultValues(source: string): Record<string, string>;
export function constMapKeys(source: string): Record<string, string[]>;
export function unionProps(source: string): Record<string, SpecOption>;
export function extractSpec(source: string): ComponentSpec;
export function specFor(slug: string, root?: string): ComponentSpec | null;
