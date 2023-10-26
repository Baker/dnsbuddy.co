import { test, expect } from '@playwright/test';

test('has main here', async ({ page }) => {
    await page.goto('http://localhost:3000/tools');
    const textElement = await page.$(`text="Tools"`);
    expect(textElement).not.toBeNull();
});

test('Navigate to the feedback page.', async ({ page }) => {
    await page.goto('http://localhost:3000/');
    await page.getByRole('link', { name: 'Other Tools' }).click();
    await page.getByRole('link', { name: 'Suggestion' }).click();
    const textElement = await page.$(`text="We love feedback, and want to build what you need, so let us know."`);
    expect(page.url()).toContain(textElement);
})

test('Navigate to the bulk FCrDNS page.', async ({ page }) => {
    const expectedUrl = 'http://localhost:3000/tools/bulk-fcrdns'
    await page.goto('http://localhost:3000/');
    await page.getByRole('link', { name: 'Other Tools' }).click();
    await page.getByRole('link', { name: 'Bulk FCrDNS' }).click();
    expect(page.url()).toEqual(expectedUrl);
})
