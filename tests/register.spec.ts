import { test, expect } from '@playwright/test'
import { faker } from '@faker-js/faker'

import { LoginPage } from '../pages/login.page'
import { DashPage } from '../pages/dash.page'
import { RegisterPage } from '../pages/register.page'

import { Navbar } from '../pages/components/navbar'
import { Toast } from '../pages/components/toast'

import { Mission } from '../support/mission'

test('should register a new mission', async ({ page }) => {

    const mission: Mission = {
        id: 'LP-' + faker.string.alphanumeric({length: {min: 5, max: 5}, casing: 'upper'}),
        rocket: 'Starship',
        lunarBase: 'aurora',
        departureDate: '2028-01-20',
        returnDate: '27 de jan. de 2028',
        price: '1000'
    }

    const loginPage = new LoginPage(page)
    const dashPage = new DashPage(page)
    const registerPage = new RegisterPage(page)
    
    const navbar = new Navbar(page)
    const toast = new Toast(page)

    await loginPage.go()
    await loginPage.login('buzz@lunarpass.dev', 'pwd123')
    await expect(navbar.logout).toBeVisible()

    await dashPage.addButton.click()
    await expect(registerPage.title).toBeVisible()
    await registerPage.submit(mission)

    await expect(toast.message).toContainText('A nova missão foi adicionada ao catálogo e já está disponível para reservas.')
})