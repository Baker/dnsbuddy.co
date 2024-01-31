import { expect, test } from "@playwright/test";

test("has main here", async ({ page }) => {
  await page.goto("http://localhost:3000/tools");
  const textElement = await page.$(`text="Tools"`);
  expect(textElement).not.toBeNull();
});

test("Feedback box exists.", async ({ page }) => {
  await page.goto("http://localhost:3000/");
  await page.getByRole("link", { name: "Other Tools" }).click();
  await page.waitForURL("http://localhost:3000/tools");
  expect(
    await page
      .getByText(
        "We love feedback, and want to build what you need, so let us know.",
      )
      .isVisible(),
  ).toBe(true);
});

test("Navigate to the bulk FCrDNS page.", async ({ page }) => {
  const expectedUrl = "http://localhost:3000/tools/bulk-fcrdns";
  await page.goto("http://localhost:3000/");
  await page.getByRole("link", { name: "Other Tools" }).click();
  await page.getByRole("link", { name: "Bulk FCrDNS" }).click();
  await page.waitForURL(expectedUrl);
  expect(page.url()).toEqual(expectedUrl);
});

test("Navigate to the bulk DNS Record Lookup page.", async ({ page }) => {
  const expectedUrl = "http://localhost:3000/tools/bulk-dns-lookup";
  await page.goto("http://localhost:3000/");
  await page.getByRole("link", { name: "Other Tools" }).click();
  await page.getByRole("link", { name: "Bulk DNS Record Lookup" }).click();
  await page.waitForURL(expectedUrl);
  expect(page.url()).toEqual(expectedUrl);
});

test("Navigate to the DNS Record Lookup page.", async ({ page }) => {
  const expectedUrl = "http://localhost:3000/tools/dns-lookup";
  await page.goto("http://localhost:3000/");
  await page.getByRole("link", { name: "Other Tools" }).click();
  await page
    .getByRole("link", {
      name: "DNS Record Lookup",
    })
    .first()
    .click();
  await page.waitForURL(expectedUrl);
  expect(page.url()).toEqual(expectedUrl);
});

test("Navigate to the Whois Lookup page.", async ({ page }) => {
  const expectedUrl = "http://localhost:3000/tools/whois";
  await page.goto("http://localhost:3000/");
  await page.getByRole("link", { name: "Other Tools" }).click();
  await page
    .getByRole("link", {
      name: "WHOIS Lookup",
    })
    .click();
  await page.waitForURL(expectedUrl);
  expect(page.url()).toEqual(expectedUrl);
});
