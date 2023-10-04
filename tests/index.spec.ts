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
});

test('can toggle dark mode', async ({ page }) => {
  await page.goto('http://localhost:3000');
  const lightMode = await page.getByRole('button', { name: 'Turn on lightmode' })
  await lightMode.click()
  await page.waitForLoadState('load')
  const darkMode = await page.getByRole('button', { name: 'Turn on darkmode' })
  await darkMode.click();
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
  const digButton = await page.getByRole('button', { name: 'Dig' });
  await digButton.click()
  expect(await digButton.isDisabled()).toBe(true);
});

test('can autofill form with URL params', async ({ page }) => {
  await page.goto('http://localhost:3000/?query=test.com&record_type=TXT');
  const queryInput = await page.getByPlaceholder('example.com');
  expect(await queryInput.inputValue()).toEqual('test.com');
});

test('verifies the page removes invalid record_types', async ({ page }) => {
  const initialUrl = 'http://localhost:3000/?query=test.com&record_type=DDD';
  const expectedUrl = 'http://localhost:3000/?query=test.com';
  await page.goto(initialUrl);
  await page.waitForURL(expectedUrl);
  expect(page.url()).toEqual(expectedUrl)
});

