import { test, expect } from '@playwright/test'

test('should authenticate inside missions control', async ({page}) => {
    // Arrange
    await page.goto('http://localhost:3000/mission-control/login')

    const title = page.getByRole('heading', {name: 'Mission Control'})
    await expect(title).toBeVisible()

    // Act
    await page.getByLabel('E-mail').fill('buzz@lunarpass.dev')
    await page.getByLabel('Senha').fill('pwd123')
    await page.getByRole('button', {name: 'Entrar'}).click()

    // Assert
    const logoutButton = page.getByRole('button', {name: 'Sair'})
    await expect(logoutButton).toBeVisible()

})

test('should not authenticate with incorrect password', async ({page}) => {
    await page.goto('http://localhost:3000/mission-control/login')

    const title = page.getByRole('heading', {name: 'Mission Control'})
    await expect(title).toBeVisible()

    await page.getByLabel('E-mail').fill('buzz@lunarpass.dev')
    await page.getByLabel('Senha').fill('abc123')
    await page.getByRole('button', {name: 'Entrar'}).click()

    const alert = page.getByRole('alert')
    await expect(alert).toHaveText('E-mail ou senha inválidos.')

})

test('should not authenticate with unregistered email', async ({page}) => {
    await page.goto('http://localhost:3000/mission-control/login')

    const title = page.getByRole('heading', {name: 'Mission Control'})
    await expect(title).toBeVisible()

    await page.getByLabel('E-mail').fill('wrongEmail@lunarpass.dev')
    await page.getByLabel('Senha').fill('pwd123')
    await page.getByRole('button', {name: 'Entrar'}).click()

    const alert = page.getByRole('alert')
    await expect(alert).toHaveText('E-mail ou senha inválidos.')

})