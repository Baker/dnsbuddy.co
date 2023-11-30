import { test, expect, type Page } from '@playwright/test';
import {
  exampleDomainWhoisResponse,
  exampleIpAddressV4WhoisResponse,
  exampleIpAddressV6WhoisResponse,
} from '@/tests/mock/api';

// Reusable setup code
const setup = async (page: Page, input: string, label: string) => {
  await page.goto('http://localhost:3000/tools/whois');
  await page.getByPlaceholder('example.com').click();
  await page.getByPlaceholder('example.com').fill(input);
  const optionToSelect = await page
    .locator('option', { hasText: label })
    .textContent();
  await page
    .locator('select')
    .selectOption({ label: optionToSelect as string });
};

test('can use WHOIS lookup', async ({ page }) => {
  await page.route('*/**/api/whois', async (route) => {
    await route.fulfill({
      contentType: 'application/json',
      json: exampleDomainWhoisResponse,
    });
  });

  await setup(page, 'example.com', 'Domain');
  const digButton = await page.getByRole('button', { name: 'Dig' });
  await digButton.click();
  expect(await digButton.isDisabled()).toBe(true);
});

test('can autofill form with URL params', async ({ page }) => {
  await page.goto(
    'http://localhost:3000/tools/whois?query=test.com&type=DOMAIN'
  );
  const queryInput = await page.getByPlaceholder('example.com');
  expect(await queryInput.inputValue()).toEqual('test.com');
});

test('verifies the page removes invalid type', async ({ page }) => {
  const initialUrl =
    'http://localhost:3000/tools/whois?query=test.com&type=DDD';
  const expectedUrl = 'http://localhost:3000/tools/whois?query=test.com';
  await page.goto(initialUrl);
  await page.waitForURL(expectedUrl);
  expect(page.url()).toEqual(expectedUrl);
});

test.describe('domain', () => {
  test.beforeEach(async ({ page }) => {
    await page.route('/api/whois', async (route) => {
      await route.fulfill({
        contentType: 'application/json',
        json: exampleDomainWhoisResponse,
      });
    });

    await setup(page, 'example.com', 'Domain');
    await page.getByRole('button', { name: 'Dig' }).click();
    await page.waitForURL(
      'http://localhost:3000/tools/whois?query=example.com&type=DOMAIN'
    );
  });

  test('Check for sections, and example text', async ({ page }) => {
    expect(await page.getByText('Registar Information').isVisible()).toBe(true);
    expect(await page.getByText('Registration Information').isVisible()).toBe(
      true
    );
    expect(await page.getByText('Abuse Information').isVisible()).toBe(false);
    expect(await page.getByText('Technical Information').isVisible()).toBe(
      false
    );
    expect(await page.getByText('Routing Information').isVisible()).toBe(false);
  });
});

test.describe('IPv4 Address', () => {
  test.beforeEach(async ({ page }) => {
    await page.route('/api/whois', async (route) => {
      await route.fulfill({
        contentType: 'application/json',
        json: exampleIpAddressV4WhoisResponse,
      });
    });

    await setup(page, '127.0.0.1', 'IP Address');
    await page.getByRole('button', { name: 'Dig' }).click();
    await page.waitForURL(
      'http://localhost:3000/tools/whois?query=127.0.0.1&type=IP_ADDRESS'
    );
  });

  test('Check for sections, and example text', async ({ page }) => {
    expect(await page.getByText('Range Information').isVisible()).toBe(true);
    expect(await page.getByText('Organization Information').isVisible()).toBe(
      true
    );
    expect(await page.getByText('Abuse Information').isVisible()).toBe(false);
    expect(await page.getByText('Technical Information').isVisible()).toBe(
      false
    );
    expect(await page.getByText('Routing Information').isVisible()).toBe(false);
  });
});

test.describe('IPv6 Address', () => {
  test.beforeEach(async ({ page }) => {
    await page.route('/api/whois', async (route) => {
      await route.fulfill({
        contentType: 'application/json',
        json: exampleIpAddressV6WhoisResponse,
      });
    });

    await setup(page, '2001:0000:130F:0000:0000:09C0:876A:130B', 'IP Address');
    await page.getByRole('button', { name: 'Dig' }).click();
    await page.waitForURL(
      'http://localhost:3000/tools/whois?query=2001:0000:130f:0000:0000:09c0:876a:130b&type=IP_ADDRESS'
    );
  });

  test('Check for sections, and example text', async ({ page }) => {
    expect(await page.getByText('Range Information').isVisible()).toBe(true);
    expect(await page.getByText('Organization Information').isVisible()).toBe(
      true
    );
    expect(await page.getByText('Abuse Information').isVisible()).toBe(false);
    expect(await page.getByText('Technical Information').isVisible()).toBe(
      false
    );
    expect(await page.getByText('Routing Information').isVisible()).toBe(false);
  });
});

test('verify required type field', async ({ page }) => {
  await page.goto('http://localhost:3000/tools/whois');
  await page.getByPlaceholder('example.com').click();
  await page.getByPlaceholder('example.com').fill('example.com');
  await page.getByRole('button', { name: 'Dig' }).click();
  expect(await page.getByText('Please select a valid type.').isVisible()).toBe(
    true
  );
});

test('ip address input, domain selected', async ({ page }) => {
  await setup(page, '127.0.0.1', 'Domain');
  await page.getByRole('button', { name: 'Dig' }).click();
  expect(
    await page
      .getByText(
        'The Domain is either an IPv4 or IPv6, please select IP Address below.'
      )
      .isVisible()
  ).toBe(true);
});

test('domain input, ip address selected', async ({ page }) => {
  await setup(page, 'example.com', 'Ip Address');
  await page.getByRole('button', { name: 'Dig' }).click();
  expect(
    await page
      .getByText('The IP Addresss is either an invalid IPv4 or IPv6.')
      .isVisible()
  ).toBe(true);
});
