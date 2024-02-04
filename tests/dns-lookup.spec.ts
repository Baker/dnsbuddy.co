import { ProviderToLabelMapping } from "@/constants/api";
import { exampleDNSResponseItem } from "@/tests/mock/api";
import { CommonRecordTypes } from "@/types/record-types";
import { type Page, expect, test } from "@playwright/test";

// Reusable setup code
const setup = async (page: Page) => {
  await page.goto("http://localhost:3000/tools/dns-lookup/");
  await page.getByPlaceholder("example.com").click();
  await page.getByPlaceholder("example.com").fill("example.com");
  await page.selectOption("select", "TXT");
};

test("has main here", async ({ page }) => {
  await page.goto("http://localhost:3000/tools/dns-lookup/");
  const textElement = await page.getByRole("heading", {
    name: "DNS Lookups, made easy.",
  });
  expect(textElement).not.toBeNull();
});

for (const recordType of Object.keys(CommonRecordTypes)) {
  test(`has ${recordType} main here`, async ({ page }) => {
    await page.goto(`http://localhost:3000/tools/dns-lookup/${recordType}/`);
    const textElement = await page.getByRole("heading", {
      name: `Lookup a ${recordType.toUpperCase()} record..`,
    });
    expect(textElement).not.toBeNull();
  });
}

test("can toggle light mode", async ({ page }) => {
  await page.goto("http://localhost:3000/tools/dns-lookup/");
  await page.getByRole("button", { name: "Turn on lightmode" }).click();

  const lightHtml = await page.evaluate(
    () => document.documentElement.className,
  );
  expect(lightHtml).toContain("light");
});

test("can use DNS Search", async ({ page }) => {
  await page.route("/api/**", async (route) => {
    await route.fulfill({
      contentType: "application/json",
      json: exampleDNSResponseItem,
    });
  });

  await setup(page);
  const digButton = await page.getByRole("button", { name: "Dig" });
  await digButton.click();
  expect(await digButton.isDisabled()).toBe(true);
});

test("can autofill form with URL params", async ({ page }) => {
  await page.goto("http://localhost:3000/tools/dns-lookup/TXT/test.com");
  const queryInput = await page.getByPlaceholder("example.com");
  expect(await queryInput.inputValue()).toEqual("test.com");
});

test("redirect invalid record types", async ({ page }) => {
  await page.goto("http://localhost:3000/tools/dns-lookup/INVALID/");
  expect(page.url()).toBe("http://localhost:3000/tools/dns-lookup/");
});

test("table visible", async ({ page }) => {
  await page.goto("http://localhost:3000/tools/dns-lookup/TXT/example.com");
  await expect(page.getByRole("button", { name: "Status" })).toBeVisible();
  await expect(page.getByRole("button", { name: "Provider" })).toBeVisible();
  await expect(page.getByRole("cell", { name: "Response" })).toBeVisible();
  await expect(page.getByRole("button", { name: "Download" })).toBeVisible();
});
