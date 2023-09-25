import { test, expect } from '@playwright/test';

test('has title', async ({ page }) => {
  await page.goto('http://localhost:3000');
  await expect(page).toHaveTitle(/DnsBuddy/);
});

test('has main here', async ({ page }) => {
  await page.goto('http://localhost:3000');
  const textElement = await page.$(`text="DNS Lookups, made easy."`);
  expect(textElement).not.toBeNull();
});

test('can toggle light mode', async ({ page }) => {
  await page.goto('http://localhost:3000');
  await page.getByRole('button', { name: 'Turn on lightmode' }).click();

  const lightHtml = await page.evaluate(
    () => document.documentElement.className
  );
  expect(lightHtml).toContain('light');
  await page.getByRole('button', { name: 'Turn on darkmode' }).click();
  const darkHtml = await page.evaluate(
    () => document.documentElement.className
  );
  expect(darkHtml).toContain('dark');
});

test('can use DNS Search', async ({ page }) => {
  await page.goto('http://localhost:3000/');

  await page.getByPlaceholder('example.com').click();
  await page.getByPlaceholder('example.com').fill('example.com');
  await page.getByPlaceholder('example.com').press('Tab');
  await page.locator('[id="\\:Rrddakq\\:-form-item"]').press('ArrowDown');
  await page.getByLabel('A', { exact: true }).press('ArrowDown');
  await page.getByLabel('NS').press('ArrowDown');
  await page.getByLabel('CNAME').press('ArrowDown');
  await page.getByLabel('SOA').press('ArrowDown');
  await page.getByLabel('PTR').press('ArrowDown');
  await page.getByLabel('MX').press('ArrowDown');
  await page.getByLabel('TXT').press('ArrowDown');
  await page.getByLabel('AAAA').press('Enter');
  await page.getByRole('button', { name: 'Dig' }).click();
  await page.waitForTimeout(150000);
  const dnsTable = await page.$('#dns-table');
  expect(dnsTable).not.toBeNull();
});
