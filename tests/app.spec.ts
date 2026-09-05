import { test, expect } from '@playwright/test'

test('should show the slogan in homepage', async ({ page }) => {
  await page.goto('http://localhost:3000/')

  await expect(page).toHaveTitle("Lunar Pass — Passagens para a Lua");
})
