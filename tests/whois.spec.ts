import { test, expect, type Page } from '@playwright/test';
import { exampleDomainWhoisResponse, exampleIpAddressV4WhoisResponse } from '@/tests/mock/api';

// Reusable setup code
const domainSetup = async (page: Page) => {
  await page.goto('http://localhost:3000/tools/whois');
  await page.getByPlaceholder('example.com').click();
  await page.getByPlaceholder('example.com').fill('example.com');
  const optionToSelect = await page
    .locator('option', { hasText: 'Domain' })
    .textContent();
  await page
    .locator('select')
    .selectOption({ label: optionToSelect as string });
};

const ipSetup = async (page: Page) => {
  await page.goto('http://localhost:3000/tools/whois');
  await page.getByPlaceholder('example.com').click();
  await page.getByPlaceholder('example.com').fill('127.0.0.1');
  const optionToSelect = await page
    .locator('option', { hasText: 'IP Address' })
    .textContent();
  await page
    .locator('select')
    .selectOption({ label: optionToSelect as string });
};

test('can use WHOIS lookup', async({ page }) => {
    await page.route('*/**/api/whois', async (route) => {
        await route.fulfill({
            contentType: 'application/json',
            json: exampleDomainWhoisResponse,
        });
    });

    await domainSetup(page);
    const digButton = await page.getByRole('button', { name: 'Dig' });
    await digButton.click();
    expect(await digButton.isDisabled()).toBe(true);
})

test('can autofill form with URL params', async ({ page }) => {
    await page.goto('http://localhost:3000/tools/whois?query=test.com&type=DOMAIN');
    const queryInput = await page.getByPlaceholder('example.com');
    expect(await queryInput.inputValue()).toEqual('test.com');
});

test('verifies the page removes invalid type', async ({ page }) => {
    const initialUrl = 'http://localhost:3000/tools/whois?query=test.com&type=DDD';
    const expectedUrl = 'http://localhost:3000/tools/whois?query=test.com';
    await page.goto(initialUrl);
    await page.waitForURL(expectedUrl);
    expect(page.url()).toEqual(expectedUrl);
});

test.describe('verify the domain WHOIS data loads', () => {
    test.beforeEach(async ({ page }) => {
      await page.route('*/**/api/whois', async (route) => {
        await route.fulfill({
          contentType: 'application/json',
          json: exampleDomainWhoisResponse,
        });
      });

      await domainSetup(page);
      await page.getByRole('button', { name: 'Dig' }).click();
      await page.waitForURL(
        'http://localhost:3000/tools/whois?query=example.com&type=DOMAIN'
      );
    });

    test('Check for sections, and example text', async ({ page }) => {
      expect(await page.getByText('Registar Information').isVisible()).toBe(true);
      expect(await page.getByText('Registration Information').isVisible()).toBe(true);
      expect(await page.getByText('Nameservers').isVisible()).toBe(true);
    });
});


test.describe('verify the IPv4 Address WHOIS data loads', () => {
  test.beforeEach(async ({ page }) => {
    await page.route('*/**/api/whois', async (route) => {
      await route.fulfill({
        contentType: 'application/json',
        json: exampleIpAddressV4WhoisResponse,
      });
    });

    await ipSetup(page);
    await page.getByRole('button', { name: 'Dig' }).click();
    await page.waitForURL(
      'http://localhost:3000/tools/whois?query=127.0.0.1&type=IP_ADDRESS'
    );
  });

  test('Check for sections, and example text', async ({ page }) => {
    expect(await page.getByText('Range Information').isVisible()).toBe(true);
    expect(await page.getByText('Organization Information').isVisible()).toBe(true);
  });
});
