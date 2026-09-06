import { test, expect } from '@playwright/test'

import { LoginPage } from '../pages/login.page'

let loginPage: LoginPage

test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page)

    // Arrange
    await loginPage.go()
})

test('should authenticate inside missions control', async ({ page }) => {
    // Act
    await loginPage.login('buzz@lunarpass.dev', 'pwd123')

    // Assert
    await loginPage.isLoggedUser()

})

test('should not authenticate with incorrect password', async ({ page }) => {
    await loginPage.login('buzz@lunarpass.dev', 'abc123')

    await expect(loginPage.alert).toHaveText('E-mail ou senha inválidos.')

})

test('should not authenticate with unregistered email', async ({ page }) => {
    await loginPage.login('404@lunarpass.dev', 'pwd123')

    await expect(loginPage.alert).toHaveText('E-mail ou senha inválidos.')

})

test('should not authenticate when password is not set', async ({ page }) => {
    await loginPage.login('buzz@lunarpass.dev', '')

    await expect(loginPage.alert).toHaveText('Informe a senha')

})

test('should not authenticate when email is not set', async ({ page }) => {
    await loginPage.login('', 'pwd123')

    await expect(loginPage.alert).toHaveText('Informe um e-mail válido')

})

test('should not authenticate when email and password are not set', async ({ page }) => {
    await loginPage.login('', '')

    await expect(loginPage.alert).toHaveText('Informe um e-mail válido')

})