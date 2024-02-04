import {
  exampleASNWhoisResponse,
  exampleDomainWhoisResponse,
  exampleIpAddressV4WhoisResponse,
  exampleIpAddressV6WhoisResponse,
} from "@/tests/mock/api";
import { expect, test } from "@playwright/test";

test("can autofill form with URL params", async ({ page }) => {
  await page.goto("http://localhost:3000/tools/whois/DOMAIN/test.com/");
  const queryInput = await page.getByPlaceholder("example.com");
  expect(await queryInput.inputValue()).toEqual("test.com");
});

test("has main header", async ({ page }) => {
  await page.goto("http://localhost:3000/tools/whois/", { waitUntil: "load" });
  const textElement = await page.getByRole("heading", { name: "WHOIS Lookup" });
  expect(textElement).not.toBeNull();
});

test("has IP header without object", async ({ page }) => {
  await page.goto("http://localhost:3000/tools/whois/IP/", {
    waitUntil: "load",
  });
  const textElement = await page.getByRole("heading", {
    name: "Lookup IP Address whois..",
  });
  expect(textElement).not.toBeNull();
});

test("has IP header with IPv6 object", async ({ page }) => {
  await page.goto(
    "http://localhost:3000/tools/whois/IP/2001:0000:130F:0000:0000:09C0:876A:130B/",
    { waitUntil: "load" },
  );
  const textElement = await page.getByRole("heading", {
    name: "Lookup IP Address whois..",
  });
  expect(textElement).not.toBeNull();
});

test("has IP header with IPv4 object", async ({ page }) => {
  await page.goto("http://localhost:3000/tools/whois/IP/167.89.0.12", {
    waitUntil: "load",
  });
  const textElement = await page.getByRole("heading", {
    name: "Lookup IP Address whois for 167.89.0.12..",
  });
  expect(textElement).not.toBeNull();
});

test("has Domain header with object", async ({ page }) => {
  await page.goto("http://localhost:3000/tools/whois/DOMAIN/example.com", {
    waitUntil: "load",
  });
  const textElement = await page.getByRole("heading", {
    name: "Lookup Domain whois for example.com..",
  });
  expect(textElement).not.toBeNull();
});

test("has Domain header without object", async ({ page }) => {
  await page.goto(
    "await expect(page.getByRole('heading', { name: 'Abuse Information' })).toBeVisible();",
    {
      waitUntil: "load",
    },
  );
  const textElement = await page.getByRole("heading", {
    name: "Lookup Domain whois..",
  });
  expect(textElement).not.toBeNull();
});

test("Domain - Checker Headers", async ({ page }) => {
  await page.goto("http://localhost:3000/tools/whois/domain/example.com");
  await expect(
    page.getByRole("heading", { name: "Registar Information" }),
  ).toBeVisible();
  await expect(
    page.getByRole("heading", { name: "Nameservers" }),
  ).toBeVisible();
  await expect(
    page.getByRole("heading", { name: "Registration Information" }),
  ).toBeVisible();
});

test("IPv4 Address - Checker Headers", async ({ page }) => {
  await page.goto("http://localhost:3000/tools/whois/IP/167.89.0.12");
  await expect(
    page.getByRole("heading", { name: "Organization Information" }),
  ).toBeVisible();
  await expect(
    page.getByRole("heading", { name: "Range Information" }),
  ).toBeVisible();
  await expect(
    page.getByRole("heading", { name: "Technical Information" }),
  ).toBeVisible();
  await expect(
    page.getByRole("heading", { name: "Abuse Information" }),
  ).toBeVisible();
});

test("IPv6 Address - Checker Headers", async ({ page }) => {
  await page.goto(
    "http://localhost:3000/tools/whois/IP/2001:0000:130f:0000:0000:09c0:876a:130b/",
  );
  await expect(
    page.getByRole("heading", { name: "Range Information" }),
  ).toBeVisible();
  await expect(
    page.getByRole("heading", { name: "Organization Information" }),
  ).toBeVisible();
  await expect(
    page.getByRole("heading", { name: "Technical Information" }),
  ).toBeVisible();
  await expect(
    page.getByRole("heading", { name: "Abuse Information" }),
  ).toBeVisible();
});

test("ASN - Checker Headers", async ({ page }) => {
  await page.goto("http://localhost:3000/tools/whois/ASN/as123/");
  await expect(
    page.getByRole("heading", { name: "ASN Information" }),
  ).toBeVisible();
  await expect(
    page.getByRole("heading", { name: "Organization Information" }),
  ).toBeVisible();
  await expect(
    page.getByRole("heading", { name: "Technical Information" }),
  ).toBeVisible();
  await expect(
    page.getByRole("heading", { name: "Abuse Information" }),
  ).toBeVisible();
});

test("verify required type field", async ({ page }) => {
  await page.goto("http://localhost:3000/tools/whois/");
  await page.getByPlaceholder("example.com").click();
  await page.getByPlaceholder("example.com").fill("example.com");
  await page.getByRole("button", { name: "Dig" }).click();
  expect(await page.getByText("Please select a valid type.").isVisible()).toBe(
    true,
  );
});

test("ip address input, domain selected", async ({ page }) => {
  await page.goto("http://localhost:3000/tools/whois/");
  await page.getByPlaceholder("example.com").click();
  await page.getByPlaceholder("example.com").fill("127.0.0.1");
  await page.selectOption("select", "Domain");
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
  await page.goto("http://localhost:3000/tools/whois/");
  await page.getByPlaceholder("example.com").click();
  await page.getByPlaceholder("example.com").fill("example.com");
  await page.selectOption("select", "IP Address");
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
  await page.goto("http://localhost:3000/tools/whois/");
  await page.getByPlaceholder("example.com").click();
  await page.getByPlaceholder("example.com").fill("example.com");
  await page.selectOption("select", "ASN");
  await page.getByRole("button", { name: "Dig" }).click();
  expect(
    await page
      .getByText(
        "This input is not the expected ASN format, example of a valid ASN is AS123.",
      )
      .isVisible(),
  ).toBe(true);
});
