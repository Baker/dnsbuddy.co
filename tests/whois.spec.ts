import {
  exampleASNWhoisResponse,
  exampleDomainWhoisResponse,
  exampleIpAddressV4WhoisResponse,
  exampleIpAddressV6WhoisResponse,
} from "@/tests/mock/api";
import { type Page, expect, test } from "@playwright/test";

// Reusable setup code
const setup = async (page: Page, input: string, label: string) => {
  await page.goto("http://localhost:3000/tools/whois");
  await page.getByPlaceholder("example.com").click();
  await page.getByPlaceholder("example.com").fill(input);
  const optionToSelect = await page
    .locator("option", { hasText: label })
    .textContent();
  await page
    .locator("select")
    .selectOption({ label: optionToSelect as string });
};

test("can use WHOIS lookup", async ({ page }) => {
  await page.route("*/**/api/whois", async (route) => {
    await route.fulfill({
      contentType: "application/json",
      json: exampleDomainWhoisResponse,
    });
  });

  await setup(page, "example.com", "Domain");
  const digButton = await page.getByRole("button", { name: "Dig" });
  await digButton.click();
  expect(await digButton.isDisabled()).toBe(true);
});

test("can autofill form with URL params", async ({ page }) => {
  await page.goto("http://localhost:3000/tools/whois/DOMAIN/test.com");
  const queryInput = await page.getByPlaceholder("example.com");
  expect(await queryInput.inputValue()).toEqual("test.com");
});

test.describe("domain", () => {
  test.beforeEach(async ({ page }) => {
    await page.route("/api/whois", async (route) => {
      await route.fulfill({
        contentType: "application/json",
        json: exampleDomainWhoisResponse,
      });
    });

    await setup(page, "example.com", "Domain");
    await page.getByRole("button", { name: "Dig" }).click();
    await page.waitForURL(
      "http://localhost:3000/tools/whois/DOMAIN/example.com",
    );
  });

  test("Check for sections, and example text", async ({ page }) => {
    expect(await page.getByText("Registar Information").isVisible()).toBe(true);
    expect(await page.getByText("Registration Information").isVisible()).toBe(
      true,
    );
    expect(await page.getByText("Abuse Information").isVisible()).toBe(false);
    expect(await page.getByText("Technical Information").isVisible()).toBe(
      false,
    );
    expect(await page.getByText("Routing Information").isVisible()).toBe(false);
  });
});

test.describe("IPv4 Address", () => {
  test.beforeEach(async ({ page }) => {
    await page.route("/api/whois", async (route) => {
      await route.fulfill({
        contentType: "application/json",
        json: exampleIpAddressV4WhoisResponse,
      });
    });

    await setup(page, "127.0.0.1", "IP Address");
    await page.getByRole("button", { name: "Dig" }).click();
    await page.waitForURL("http://localhost:3000/tools/whois/IP/127.0.0.1");
  });

  test("Check for sections, and example text", async ({ page }) => {
    expect(await page.getByText("Range Information").isVisible()).toBe(true);
    expect(await page.getByText("Organization Information").isVisible()).toBe(
      true,
    );
    expect(await page.getByText("Abuse Information").isVisible()).toBe(false);
    expect(await page.getByText("Technical Information").isVisible()).toBe(
      false,
    );
    expect(await page.getByText("Routing Information").isVisible()).toBe(false);
  });
});

test.describe("IPv6 Address", () => {
  test.beforeEach(async ({ page }) => {
    await page.route("/api/whois", async (route) => {
      await route.fulfill({
        contentType: "application/json",
        json: exampleIpAddressV6WhoisResponse,
      });
    });

    await setup(page, "2001:0000:130F:0000:0000:09C0:876A:130B", "IP Address");
    await page.getByRole("button", { name: "Dig" }).click();
    await page.waitForURL(
      "http://localhost:3000/tools/whois/IP/2001:0000:130f:0000:0000:09c0:876a:130b",
    );
  });

  test("Check for sections, and example text", async ({ page }) => {
    expect(await page.getByText("Range Information").isVisible()).toBe(true);
    expect(await page.getByText("Organization Information").isVisible()).toBe(
      true,
    );
    expect(await page.getByText("Abuse Information").isVisible()).toBe(false);
    expect(await page.getByText("Technical Information").isVisible()).toBe(
      false,
    );
    expect(await page.getByText("Routing Information").isVisible()).toBe(false);
  });
});

test.describe("ASN", () => {
  test.beforeEach(async ({ page }) => {
    await page.route("/api/whois", async (route) => {
      await route.fulfill({
        contentType: "application/json",
        json: exampleASNWhoisResponse,
      });
    });

    await setup(page, "AS111", "ASN");
    await page.getByRole("button", { name: "Dig" }).click();
    await page.waitForURL("http://localhost:3000/tools/whois/ASN/as111");
  });

  test("Check for sections, and example text", async ({ page }) => {
    expect(await page.getByText("ASN Information").isVisible()).toBe(true);
    expect(await page.getByText("Organization Information").isVisible()).toBe(
      true,
    );
    expect(await page.getByText("Abuse Information").isVisible()).toBe(false);
    expect(await page.getByText("Technical Information").isVisible()).toBe(
      false,
    );
    expect(await page.getByText("Routing Information").isVisible()).toBe(false);
  });
});

test("verify required type field", async ({ page }) => {
  await page.goto("http://localhost:3000/tools/whois");
  await page.getByPlaceholder("example.com").click();
  await page.getByPlaceholder("example.com").fill("example.com");
  await page.getByRole("button", { name: "Dig" }).click();
  expect(await page.getByText("Please select a valid type.").isVisible()).toBe(
    true,
  );
});

test("ip address input, domain selected", async ({ page }) => {
  await setup(page, "127.0.0.1", "Domain");
  await page.getByRole("button", { name: "Dig" }).click();
  expect(
    await page
      .getByText(
        "This input is not the expected Domain format. Example of a valid submission: google.com",
      )
      .isVisible(),
  ).toBe(true);
});

test("domain input, ip address selected", async ({ page }) => {
  await setup(page, "example.com", "Ip Address");
  await page.getByRole("button", { name: "Dig" }).click();
  expect(
    await page
      .getByText(
        "This input is not the expected IP Address format. Example of a valid submission: 127.0.0.1 OR 2001:0000:130F:0000:0000:09C0:876A:130B.",
      )
      .isVisible(),
  ).toBe(true);
});

test("domain input, asn selected", async ({ page }) => {
  await setup(page, "example.com", "ASN");
  await page.getByRole("button", { name: "Dig" }).click();
  expect(
    await page
      .getByText(
        "This input is not the expected ASN format, example of a valid ASN is AS123.",
      )
      .isVisible(),
  ).toBe(true);
});
