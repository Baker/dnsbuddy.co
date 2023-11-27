import { test, expect, type Page } from '@playwright/test';
import { exampleDNSResponseItem } from '@/tests/mock/api';
import { ProviderToLabelMapping } from '@/lib/constants/api';

// Reusable setup code
const setup = async (page: Page) => {
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
