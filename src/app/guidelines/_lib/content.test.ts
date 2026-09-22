// @vitest-environment node
import { existsSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import {
  FOUNDATIONS,
  findComponent,
  listComponents,
  note,
  PATTERNS,
  readDoc,
  sectionStatus,
  THEMES,
} from "./content";

describe("guidelines content", () => {
  it("Foundations / Themes / Patterns の md がすべて存在し、サイドパネルを含む", () => {
    for (const p of [...FOUNDATIONS, ...THEMES, ...PATTERNS]) {
      expect(existsSync(join(process.cwd(), p.file)), p.file).toBe(true);
      expect(readDoc(p)).toMatch(/^# /);
    }
    expect(PATTERNS.map((p) => p.slug)).toContain("side-panel");
  });

  it("Button は実装から選択肢・寸法・状態が取れ、README の Do / Don't と手書き節がそろう", () => {
    const button = findComponent("button");
    expect(button).toBeDefined();
    if (!button) return;
    expect(button.spec.options.variant?.options).toContain("primary");
    expect(button.spec.options.size).toMatchObject({ options: ["sm", "md", "lg"], default: "md" });
    expect(button.spec.metrics.find((m) => m.name === "md")?.height).toBe(40);
    expect(button.spec.states.map((s) => s.key)).toEqual(
      expect.arrayContaining(["hover", "focus", "disabled", "loading"]),
    );
    expect(button.antiPatterns.length).toBeGreaterThan(0);
    expect(note(button, "振る舞い")).not.toBe("");
    expect(note(button, "参考文献")).toMatch(/https:\/\//);
    const status = sectionStatus(button);
    expect(status.anatomy).toBe("done");
    expect(status.options).toBe("done");
    expect(status.states).toBe("done");
    expect(status.metrics).toBe("done");
    expect(status.behaviors).toBe("done");
    expect(status.references).toBe("done");
  });

  it("全部品に item.json の title と README の概要があり、関連部品はページのある部品だけを指す", () => {
    const all = listComponents();
    const slugs = new Set(all.map((c) => c.slug));
    expect(all.length).toBeGreaterThanOrEqual(37);
    for (const c of all) {
      expect(c.title, c.slug).not.toBe("");
      expect(c.overview, c.slug).not.toBe("");
      for (const d of [...c.dependsOn, ...c.usedBy])
        expect(slugs.has(d), `${c.slug} -> ${d}`).toBe(true);
    }
  });
});
