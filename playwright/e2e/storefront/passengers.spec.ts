import { test, expect } from '../../support'

import { Mission } from '../../support/types'

import { cleanAndInsertMission } from '../../support/db'

test('should accept a 3-character name and a 5-character passport', async ({ app }) => {
    // Arrange
    const mission: Mission = {
        id: 'LP-0802A',
        rocket: 'Starship',
        baseId: 'alpha',
        departureDate: '2029-09-01',
        returnDate: '2029-09-08',
        price: 1000.00
    }

    await cleanAndInsertMission(mission)
    await app.store.bookingPage.go(mission.id)
    await app.store.bookingPage.selectSeat('A1')
    await app.store.bookingPage.continue()

    // Act
    await app.store.bookingPage.submitPassenger('Ana', 'XP123')

    // Assert
    await expect(app.store.bookingPage.paymentTitle).toBeVisible()
})

test('should accept a 120-character name and a 30-character passport', async ({ app }) => {
    // Arrange
    const mission: Mission = {
        id: 'LP-0802B',
        rocket: 'Starship',
        baseId: 'orion',
        departureDate: '2029-09-02',
        returnDate: '2029-09-09',
        price: 1000.00
    }

    await cleanAndInsertMission(mission)
    await app.store.bookingPage.go(mission.id)
    await app.store.bookingPage.selectSeat('A1')
    await app.store.bookingPage.continue()

    // Act
    await app.store.bookingPage.submitPassenger('A'.repeat(120), 'X'.repeat(30))

    // Assert
    await expect(app.store.bookingPage.paymentTitle).toBeVisible()
})

test('should not accept a 2-character name', async ({ app }) => {
    // Arrange
    const mission: Mission = {
        id: 'LP-0802C',
        rocket: 'Starship',
        baseId: 'aurora',
        departureDate: '2029-09-03',
        returnDate: '2029-09-10',
        price: 1000.00
    }

    await cleanAndInsertMission(mission)
    await app.store.bookingPage.go(mission.id)
    await app.store.bookingPage.selectSeat('A1')
    await app.store.bookingPage.continue()

    // Act
    await app.store.bookingPage.submitPassenger('Ab', 'X'.repeat(15))

    // Assert
    await expect(app.store.bookingPage.fieldError('O nome deve ter pelo menos 3 caracteres')).toBeVisible()
    await expect(app.store.bookingPage.nameInput).toBeFocused()
    await expect(app.store.bookingPage.paymentTitle).not.toBeVisible()
})

test('should not accept a 121-character name', async ({ app }) => {
    // Arrange
    const mission: Mission = {
        id: 'LP-0802D',
        rocket: 'Starship',
        baseId: 'selene',
        departureDate: '2029-09-04',
        returnDate: '2029-09-11',
        price: 1000.00
    }

    await cleanAndInsertMission(mission)
    await app.store.bookingPage.go(mission.id)
    await app.store.bookingPage.selectSeat('A1')
    await app.store.bookingPage.continue()

    // Act
    await app.store.bookingPage.submitPassenger('A'.repeat(121), 'X'.repeat(15))

    // Assert
    await expect(app.store.bookingPage.fieldError('O nome deve ter no máximo 120 caracteres')).toBeVisible()
    await expect(app.store.bookingPage.nameInput).toBeFocused()
    await expect(app.store.bookingPage.paymentTitle).not.toBeVisible()
})

test('should not accept a 4-character passport', async ({ app }) => {
    // Arrange
    const mission: Mission = {
        id: 'LP-0802E',
        rocket: 'Starship',
        baseId: 'alpha',
        departureDate: '2029-09-05',
        returnDate: '2029-09-12',
        price: 1000.00
    }

    await cleanAndInsertMission(mission)
    await app.store.bookingPage.go(mission.id)
    await app.store.bookingPage.selectSeat('A1')
    await app.store.bookingPage.continue()

    // Act
    await app.store.bookingPage.submitPassenger('A'.repeat(30), 'XP12')

    // Assert
    await expect(app.store.bookingPage.fieldError('O passaporte deve ter pelo menos 5 caracteres')).toBeVisible()
    await expect(app.store.bookingPage.passportInput).toBeFocused()
    await expect(app.store.bookingPage.paymentTitle).not.toBeVisible()
})

test('should not accept a 31-character passport', async ({ app }) => {
    // Arrange
    const mission: Mission = {
        id: 'LP-0802F',
        rocket: 'Starship',
        baseId: 'orion',
        departureDate: '2029-09-06',
        returnDate: '2029-09-13',
        price: 1000.00
    }

    await cleanAndInsertMission(mission)
    await app.store.bookingPage.go(mission.id)
    await app.store.bookingPage.selectSeat('A1')
    await app.store.bookingPage.continue()

    // Act
    await app.store.bookingPage.submitPassenger('A'.repeat(30), 'X'.repeat(31))

    // Assert
    await expect(app.store.bookingPage.fieldError('O passaporte deve ter no máximo 30 caracteres')).toBeVisible()
    await expect(app.store.bookingPage.passportInput).toBeFocused()
    await expect(app.store.bookingPage.paymentTitle).not.toBeVisible()
})
