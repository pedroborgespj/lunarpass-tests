import { test, expect } from '@playwright/test'

import { HomePage } from '../../pages/storefront/home.page'

test('should verify the title in the browser tab', async ({ page }) => {
  const homePage = new HomePage(page)
  await homePage.go()

  await expect(page).toHaveTitle("Lunar Pass — Passagens para a Lua")
})

test('should show the slogan in homepage', async ({ page }) => {
  const homePage = new HomePage(page)
  await homePage.go()

  await expect(homePage.slogan).toBeVisible()
})