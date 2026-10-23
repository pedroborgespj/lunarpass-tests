import { test, expect } from '../support'
import { faker } from '@faker-js/faker'

import { Mission } from '../support/types'

import { cleanAndInsertMission, cleanMission } from '../support/db'

test.beforeEach(async ({ app }) => {
    await app.loginPage.go()
    await app.loginPage.login('buzz@lunarpass.dev', 'pwd123')
    await expect(app.navbar.logout).toBeVisible()

    await app.dashPage.addButton.click()
    await expect(app.registerPage.title).toBeVisible()
})

test('should register a new mission', async ({ app }) => {

    const mission: Mission = {
        id: 'LP-0128A',
        rocket: 'Starship',
        baseId: 'aurora',
        departureDate: '2028-01-20',
        returnDate: '2028-01-27',
        price: 1000.00
    }

    await cleanMission(mission)

    await app.registerPage.submit(mission)

    await expect(app.toast.message).toContainText('A nova missão foi adicionada ao catálogo e já está disponível para reservas.')
})

test('should not register with incorrect mission id format', async ({ app }) => {

    const mission: Mission = {
        id: faker.string.alphanumeric({length: {min: 5, max: 5}, casing: 'upper'}),
        rocket: 'Starship',
        baseId: 'aurora',
        departureDate: '2028-01-20',
        returnDate: '2028-01-27',
        price: 1000.00
    }

    await app.registerPage.submit(mission)

    await expect(app.registerPage.alert).toHaveText('Use o formato LP-0000')
})

test('should not register with duplicated mission id', async ({ app }) => {

    const mission: Mission = {
        id: 'LP-3001A',
        rocket: 'Starship',
        baseId: 'orion',
        departureDate: '2030-01-20',
        returnDate: '2030-01-27',
        price: 500.00
    }

    await cleanAndInsertMission(mission)

    await app.registerPage.submit(mission)

    await expect(app.registerPage.alert).toHaveText('Já existe uma missão com este ID.')
})