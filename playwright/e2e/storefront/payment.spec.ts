import { test, expect } from '../../support'

import { Mission, Reservation, Ticket } from '../../support/types'

import { cleanAndInsertMission, insertReservation, insertTickets } from '../../support/db'

test('should confirm the reservation and issue one ticket per passenger when payment is approved with Visa', async ({ app }) => {
    // Arrange
    const mission: Mission = {
        id: 'LP-0901A',
        rocket: 'Starship',
        baseId: 'alpha',
        departureDate: '2029-10-01',
        returnDate: '2029-10-08',
        price: 1000.00
    }

    await cleanAndInsertMission(mission)
    await app.store.bookingPage.go(mission.id)
    await app.store.bookingPage.selectSeats(['A1', 'A2'])
    await app.store.bookingPage.continue()
    await app.store.bookingPage.submitPassengers([
        { seat: 'A1', fullName: 'Buzz Aldrin', passport: 'XP12345' },
        { seat: 'A2', fullName: 'Neil Armstrong', passport: 'XP67890' }
    ])

    // Act
    await app.store.bookingPage.fillPayment({
        email: 'buzz@lunarpass.dev',
        cardName: 'Buzz Aldrin',
        cardNumber: '4242 4242 4242 4242',
        expiry: '12/30',
        cvv: '123'
    })
    await expect(app.store.bookingPage.cardBrand('Visa')).toBeVisible()
    await app.store.bookingPage.payButton.click()

    // Assert
    await expect(app.store.bookingPage.confirmationTitle).toBeVisible()
    await expect(app.store.bookingPage.reservationCode).toHaveText(/^\S{6}$/)
    await expect(app.store.bookingPage.paymentStatus).toHaveText('Pagamento aprovado! Pode arrumar as malas: a Lua já está esperando por você.')
    await expect(app.store.bookingPage.tickets).toHaveCount(2)
    await expect(app.store.bookingPage.ticketPassengerNames).toHaveText(['Buzz Aldrin', 'Neil Armstrong'])
    await expect(app.store.bookingPage.ticketPassports).toHaveText(['XP12345', 'XP67890'])
    await expect(app.store.bookingPage.ticketSeats).toHaveText(['A1', 'A2'])
})

test('should confirm the reservation and issue one ticket per passenger when payment is approved with a Mastercard', async ({ app }) => {
    // Arrange
    const mission: Mission = {
        id: 'LP-0901D',
        rocket: 'Starship',
        baseId: 'selene',
        departureDate: '2029-10-04',
        returnDate: '2029-10-11',
        price: 1000.00
    }

    await cleanAndInsertMission(mission)
    await app.store.bookingPage.go(mission.id)
    await app.store.bookingPage.selectSeats(['A1', 'A2'])
    await app.store.bookingPage.continue()
    await app.store.bookingPage.submitPassengers([
        { seat: 'A1', fullName: 'Buzz Aldrin', passport: 'XP12345' },
        { seat: 'A2', fullName: 'Neil Armstrong', passport: 'XP67890' }
    ])

    // Act
    await app.store.bookingPage.fillPayment({
        email: 'buzz@lunarpass.dev',
        cardName: 'Buzz Aldrin',
        cardNumber: '5555 5555 5555 4444',
        expiry: '12/30',
        cvv: '123'
    })
    await expect(app.store.bookingPage.cardBrand('Mastercard')).toBeVisible()
    await app.store.bookingPage.payButton.click()

    // Assert
    await expect(app.store.bookingPage.confirmationTitle).toBeVisible()
    await expect(app.store.bookingPage.reservationCode).toHaveText(/^\S{6}$/)
    await expect(app.store.bookingPage.paymentStatus).toHaveText('Pagamento aprovado! Pode arrumar as malas: a Lua já está esperando por você.')
    await expect(app.store.bookingPage.tickets).toHaveCount(2)
    await expect(app.store.bookingPage.ticketPassengerNames).toHaveText(['Buzz Aldrin', 'Neil Armstrong'])
    await expect(app.store.bookingPage.ticketPassports).toHaveText(['XP12345', 'XP67890'])
    await expect(app.store.bookingPage.ticketSeats).toHaveText(['A1', 'A2'])
})

test('should confirm the reservation and issue one ticket per passenger when payment is approved with an American Express', async ({ app }) => {
    // Arrange
    const mission: Mission = {
        id: 'LP-0901E',
        rocket: 'Starship',
        baseId: 'alpha',
        departureDate: '2029-10-05',
        returnDate: '2029-10-12',
        price: 1000.00
    }

    await cleanAndInsertMission(mission)
    await app.store.bookingPage.go(mission.id)
    await app.store.bookingPage.selectSeats(['A1', 'A2'])
    await app.store.bookingPage.continue()
    await app.store.bookingPage.submitPassengers([
        { seat: 'A1', fullName: 'Buzz Aldrin', passport: 'XP12345' },
        { seat: 'A2', fullName: 'Neil Armstrong', passport: 'XP67890' }
    ])

    // Act
    await app.store.bookingPage.fillPayment({
        email: 'buzz@lunarpass.dev',
        cardName: 'Buzz Aldrin',
        cardNumber: '3782 822463 10005',
        expiry: '12/30',
        cvv: '1234'
    })
    await expect(app.store.bookingPage.cardBrand('American Express')).toBeVisible()
    await app.store.bookingPage.payButton.click()

    // Assert
    await expect(app.store.bookingPage.confirmationTitle).toBeVisible()
    await expect(app.store.bookingPage.reservationCode).toHaveText(/^\S{6}$/)
    await expect(app.store.bookingPage.paymentStatus).toHaveText('Pagamento aprovado! Pode arrumar as malas: a Lua já está esperando por você.')
    await expect(app.store.bookingPage.tickets).toHaveCount(2)
    await expect(app.store.bookingPage.ticketPassengerNames).toHaveText(['Buzz Aldrin', 'Neil Armstrong'])
    await expect(app.store.bookingPage.ticketPassports).toHaveText(['XP12345', 'XP67890'])
    await expect(app.store.bookingPage.ticketSeats).toHaveText(['A1', 'A2'])
})

test('should keep the data on the payment step when payment is declined', async ({ app }) => {
    // Arrange
    const mission: Mission = {
        id: 'LP-0901B',
        rocket: 'Starship',
        baseId: 'orion',
        departureDate: '2029-10-02',
        returnDate: '2029-10-09',
        price: 1000.00
    }

    await cleanAndInsertMission(mission)
    await app.store.bookingPage.go(mission.id)
    await app.store.bookingPage.selectSeat('A1')
    await app.store.bookingPage.continue()
    await app.store.bookingPage.submitPassenger('Buzz Aldrin', 'XP12345')

    // Act
    await app.store.bookingPage.pay({
        email: 'buzz@lunarpass.dev',
        cardName: 'Buzz Aldrin',
        cardNumber: '4000 0000 0000 0127',
        expiry: '12/30',
        cvv: '123'
    })

    // Assert
    await expect(app.store.bookingPage.paymentAlert).toContainText('Dados do cartão incorretos.')
    await expect(app.store.bookingPage.confirmationTitle).not.toBeVisible()
    await expect(app.store.bookingPage.paymentTitle).toBeVisible()
    await expect(app.store.bookingPage.contactEmailInput).toHaveValue('buzz@lunarpass.dev')
    await expect(app.store.bookingPage.cardNameInput).toHaveValue('Buzz Aldrin')
    await expect(app.store.bookingPage.cardNumberInput).toHaveValue('4000 0000 0000 0127')
    await expect(app.store.bookingPage.cardExpiryInput).toHaveValue('12/30')
    await expect(app.store.bookingPage.cardCvvInput).toHaveValue('123')
})

test('should block the reservation when the seat was taken by someone else during payment', async ({ app }) => {
    // Arrange
    const mission: Mission = {
        id: 'LP-0901C',
        rocket: 'Starship',
        baseId: 'aurora',
        departureDate: '2029-10-03',
        returnDate: '2029-10-10',
        price: 1000.00
    }

    const reservation: Reservation = {
        id: 'f47ac10b-58cc-4372-a567-0e02b2c3d901',
        userId: null,
        missionId: mission.id,
        reservationCode: 'ALP901',
        contactEmail: 'papito@teste.com',
        totalPrice: 1000.00,
        status: 'confirmed'
    }

    const ticket: Ticket = {
        id: 'c9a646d3-9c61-4cb7-bfcd-ee2522c8f901',
        reservationId: reservation.id,
        missionId: mission.id,
        seat: 'A1',
        fullName: 'Fernando Papito',
        document: 'XP12345'
    }

    await cleanAndInsertMission(mission)
    await app.store.bookingPage.go(mission.id)
    await app.store.bookingPage.selectSeat('A1')
    await app.store.bookingPage.continue()
    await app.store.bookingPage.submitPassenger('Buzz Aldrin', 'XP12345')

    await insertReservation(reservation)
    await insertTickets([ticket])

    // Act
    await app.store.bookingPage.pay({
        email: 'buzz@lunarpass.dev',
        cardName: 'Buzz Aldrin',
        cardNumber: '4242 4242 4242 4242',
        expiry: '12/30',
        cvv: '123'
    })

    // Assert
    await expect(app.store.bookingPage.paymentAlert).toContainText('Um dos assentos acabou de ser reservado. Escolha outro.')
    await expect(app.store.bookingPage.confirmationTitle).not.toBeVisible()
})
