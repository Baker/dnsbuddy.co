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

test('can use DNS Search', async ({ page }) => {
  await page.goto('http://localhost:3000/');
  await page.getByPlaceholder('example.com').click();
  await page.getByPlaceholder('example.com').fill('example.com');
  const optionToSelect = await page.locator('option', { hasText: 'TXT' }).textContent();
  await page.locator('select').selectOption({ label: optionToSelect });
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

test('verify the table loads with proper header', async ({ page }) => {
  await page.goto('http://localhost:3000/');
  await page.getByPlaceholder('example.com').click();
  await page.getByPlaceholder('example.com').fill('example.com');
  const optionToSelect = await page.locator('option', { hasText: 'TXT' }).textContent();
  await page.locator('select').selectOption({ label: optionToSelect });
  await page.getByRole('button', { name: 'Dig' }).click();
  await page.waitForURL('http://localhost:3000/?query=example.com&record_type=TXT')

  expect(await page.getByText('Status').isVisible()).toBe(true);
  expect(await page.getByText('Location').isVisible()).toBe(true);
  expect(await page.getByText('Response').isVisible()).toBe(true);
})


test('verify the download works & proper filetype', async ({ page }) => {
  await page.goto('http://localhost:3000/');
  await page.getByPlaceholder('example.com').click();
  await page.getByPlaceholder('example.com').fill('example.com');
  const optionToSelect = await page.locator('option', { hasText: 'TXT' }).textContent();
  await page.locator('select').selectOption({ label: optionToSelect });
  await page.getByRole('button', { name: 'Dig' }).click();
  await page.waitForURL('http://localhost:3000/?query=example.com&record_type=TXT')

  expect(await page.getByText('Status').isVisible()).toBe(true);
  expect(await page.getByText('Location').isVisible()).toBe(true);
  expect(await page.getByText('Response').isVisible()).toBe(true);

  const downloadPromise = page.waitForEvent('download');
  await page.getByRole('link', { name: 'Download' }).click();
  const download = await downloadPromise;
  const suggestedFilename = download.suggestedFilename();
  expect(suggestedFilename.includes('csv')).toBe(true);
})
