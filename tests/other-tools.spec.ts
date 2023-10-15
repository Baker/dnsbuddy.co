import { test, expect } from '@playwright/test';

test('Navigate to the feedback page.', async ({ page }) => {
    const expectedUrl = 'https://github.com/Baker/dnsbuddy.co/issues/new?assignees=&labels=enhancement&projects=&template=feature_request.md&title=%5BFB%5D'
    await page.goto('http://localhost:3000/');
    await page.getByRole('link', { name: 'Other Tools' }).click();
    await page.getByRole('link', { name: 'Suggestion' }).click();
    await page.waitForURL(expectedUrl);
    expect(page.url()).toEqual(expectedUrl);
})

test('Navigate to the bulk FCrDNS page.', async ({ page }) => {
    const expectedUrl = 'http://localhost:3000/tools/bulk-fcrdns'
    await page.goto('http://localhost:3000/');
    await page.getByRole('link', { name: 'Other Tools' }).click();
    await page.getByRole('link', { name: 'Bulk FCrDNS' }).click();
    await page.waitForURL(expectedUrl);
    expect(page.url()).toEqual(expectedUrl);
})
