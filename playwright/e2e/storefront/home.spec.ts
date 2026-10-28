import { test, expect } from '../../support'

test('should verify the title in the browser tab', async ({ app, page }) => {
  await app.store.homePage.go()

  await expect(page).toHaveTitle("Lunar Pass — Passagens para a Lua")
})

test('should show the slogan in homepage', async ({ app }) => {
  await app.store.homePage.go()

  await expect(app.store.homePage.slogan).toBeVisible()
})
