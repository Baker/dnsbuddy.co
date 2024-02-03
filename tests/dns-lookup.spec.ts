import { ProviderToLabelMapping } from "@/lib/constants/api";
import { exampleDNSResponseItem } from "@/tests/mock/api";
import { type Page, expect, test } from "@playwright/test";

// Reusable setup code
const setup = async (page: Page) => {
  await page.goto("http://localhost:3000/tools/dns-lookup");
  await page.getByPlaceholder("example.com").click();
  await page.getByPlaceholder("example.com").fill("example.com");
  const optionToSelect = await page
    .locator("option", { hasText: "TXT" })
    .textContent();
  await page
    .locator("select")
    .selectOption({ label: optionToSelect as string });
};

test("has main here", async ({ page }) => {
  await page.goto("http://localhost:3000/tools/dns-lookup");
  const textElement = await page.$(`text="DNS Lookups, made easy."`);
  expect(textElement).not.toBeNull();
});

test("can toggle light mode", async ({ page }) => {
  await page.goto("http://localhost:3000/tools/dns-lookup");
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

test.describe("verify the table loads", () => {
  test.beforeEach(async ({ page }) => {
    await page.route("/api/**", async (route) => {
      await route.fulfill({
        contentType: "application/json",
        json: exampleDNSResponseItem,
      });
    });

    await setup(page);
    await page.getByRole("button", { name: "Dig" }).click();
    await page.waitForURL(
      "http://localhost:3000/tools/dns-lookup/TXT/example.com",
    );
  });

  test("with proper header & additional options", async ({ page }) => {
    expect(await page.getByText("Status").isVisible()).toBe(true);
    expect(await page.getByText("Provider").isVisible()).toBe(true);
    expect(await page.getByText("Response").isVisible()).toBe(true);
    expect(await page.getByText("Downloads").isVisible()).toBe(true);
    expect(await page.getByText("Columns").isVisible()).toBe(true);
  });

  test("with proper locations", async ({ page }) => {
    const dnsProviders = Object.values(ProviderToLabelMapping);
    for (const dnsProvider in dnsProviders) {
      expect(await page.getByText(dnsProviders[dnsProvider]).isVisible()).toBe(
        true,
      );
    }
  });
});
