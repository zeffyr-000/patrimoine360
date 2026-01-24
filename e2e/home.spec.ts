import { test, expect } from '@playwright/test';

test.describe('Home Page', () => {
  test('should display welcome title', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('h1')).toContainText('Patrimoine360');
  });

  test('should have navigation menu', async ({ page }) => {
    await page.goto('/');
    const menuButton = page.locator('button[aria-label="Toggle navigation menu"]');
    await expect(menuButton).toBeVisible();
  });
});
