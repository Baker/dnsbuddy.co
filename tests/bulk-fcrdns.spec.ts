import { test, expect } from '@playwright/test';

test('has main here', async ({ page }) => {
  await page.goto('http://localhost:3000/tools/bulk-fcrdns');
  const textElement = await page.$(`text="Bulk FCrDNS Lookup"`);
  expect(textElement).not.toBeNull();
});
