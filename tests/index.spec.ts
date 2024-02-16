import { expect, test } from "@playwright/test";

test("can toggle light mode", async ({ page }) => {
  await page.goto("http://localhost:3000");
  await page.getByRole("button", { name: "Turn on lightmode" }).click();

  const lightHtml = await page.evaluate(
    () => document.documentElement.className,
  );
  expect(lightHtml).toContain("light");
});

test("has title", async ({ page }) => {
  await page.goto("http://localhost:3000");
  await expect(page).toHaveTitle(/DnsBuddy/);
});
