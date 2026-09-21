import "@testing-library/jest-dom/vitest";
import { cleanup } from "@testing-library/react";
import { afterEach } from "vitest";

// Vitest は globals を使わないため、Testing Library の自動 cleanup が効かない。テストごとに DOM を片付ける
afterEach(() => {
  cleanup();
});
