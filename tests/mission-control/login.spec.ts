import { test, expect } from '../../support'

test.beforeEach(async ({ app }) => {
    // Arrange
    await app.loginPage.go()
})

test('should authenticate inside missions control', async ({ app }) => {
    // Act
    await app.loginPage.login('buzz@lunarpass.dev', 'pwd123')

    // Assert
    await expect(app.navbar.logout).toBeVisible()

})

test('should not authenticate with incorrect password', async ({ app }) => {
    await app.loginPage.login('buzz@lunarpass.dev', 'abc123')

    await expect(app.loginPage.alert).toHaveText('E-mail ou senha inválidos.')

})

test('should not authenticate with unregistered email', async ({ app }) => {
    await app.loginPage.login('404@lunarpass.dev', 'pwd123')

    await expect(app.loginPage.alert).toHaveText('E-mail ou senha inválidos.')

})

test('should not authenticate when password is not set', async ({ app }) => {
    await app.loginPage.login('buzz@lunarpass.dev', '')

    await expect(app.loginPage.alert).toHaveText('Informe a senha')

})

test('should not authenticate when email is not set', async ({ app }) => {
    await app.loginPage.login('', 'pwd123')

    await expect(app.loginPage.alert).toHaveText('Informe um e-mail válido')

})

test('should not authenticate when email and password are not set', async ({ app }) => {
    await app.loginPage.login('', '')

    await expect(app.loginPage.alert).toHaveText('Informe um e-mail válido')

})