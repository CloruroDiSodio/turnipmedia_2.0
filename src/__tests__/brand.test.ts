import { readFileSync } from "node:fs";
import { join } from "node:path";
import { brandColors, contrast, textOnWhite } from "../components/pages/Brand/brandColors";

const palette = readFileSync(join(__dirname, "../themes/palette.scss"), "utf8");
const tokens = Object.fromEntries(
  [...palette.matchAll(/(--[\w-]+):\s*(#[0-9A-Fa-f]{6})/g)].map(([, name, hex]) => [name, hex.toUpperCase()])
);

test("the brand guide lists every palette colour with its current value", () => {
  const listed = brandColors.filter(({ token }) => token.startsWith("--"));
  expect(listed.map(({ token }) => token).sort()).toEqual(Object.keys(tokens).sort());
  for (const { token, hex } of listed) expect(hex.toUpperCase()).toBe(tokens[token]);
});

test("contrast matches WCAG reference values", () => {
  expect(contrast("#000000", "#FFFFFF")).toBeCloseTo(21, 5);
  expect(contrast("#018C99", "#FFFFFF")).toBeCloseTo(4.03, 2);
  expect(textOnWhite("#018C99").verdict).toBe("Large text and icons");
  expect(textOnWhite("#2B6F78").verdict).toBe("Any text");
  expect(textOnWhite("#D2BFDA").verdict).toBe("Not for text");
});
