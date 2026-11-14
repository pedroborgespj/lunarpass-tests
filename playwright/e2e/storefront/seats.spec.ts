import { test, expect } from '../../support'

import { Mission, Reservation, Ticket } from '../../support/types'

import { cleanAndInsertMission, insertReservation, insertTickets } from '../../support/db'

test('should not allow to proceed without selecting a seat', async ({ app }) => {
    const mission: Mission = {
        id: 'LP-0801A',
        rocket: 'Starship',
        baseId: 'alpha',
        departureDate: '2029-08-10',
        returnDate: '2029-08-17',
        price: 1000.00
    }

    await cleanAndInsertMission(mission)

    await app.store.bookingPage.go(mission.id)
    await expect(app.store.bookingPage.stepTitle).toBeVisible()

    await expect(app.store.bookingPage.continueButton).toBeDisabled()
    await expect(app.store.bookingPage.noSeatsMessage).toBeVisible()
})

test('should proceed with the maximum number of seats selected', async ({ app }) => {
    const mission: Mission = {
        id: 'LP-0801B',
        rocket: 'Starship',
        baseId: 'alpha',
        departureDate: '2029-08-12',
        returnDate: '2029-08-19',
        price: 1000.00
    }

    await cleanAndInsertMission(mission)

    await app.store.bookingPage.go(mission.id)
    await app.store.bookingPage.selectSeats(['A1', 'A2', 'B1', 'B2'])

    await expect(app.store.bookingPage.selectedSeatsMessage).toHaveText('4 de 4 assentos selecionados: A1, A2, B1, B2.')
    await expect(app.store.bookingPage.totalPrice).toHaveText('USD 4,000.00')

    await app.store.bookingPage.continueButton.click()

    await expect(app.store.bookingPage.passengersTitle).toBeVisible()
})

test('should not select an already occupied seat', async ({ app }) => {
    const mission: Mission = {
        id: 'LP-0801C',
        rocket: 'Starship',
        baseId: 'alpha',
        departureDate: '2029-08-14',
        returnDate: '2029-08-21',
        price: 1000.00
    }

    const reservation: Reservation = {
        id: 'f47ac10b-58cc-4372-a567-0e02b2c3d801',
        userId: null,
        missionId: mission.id,
        reservationCode: 'ALP801',
        contactEmail: 'papito@teste.com',
        totalPrice: 1000.00,
        status: 'confirmed'
    }

    const ticket: Ticket = {
        id: 'c9a646d3-9c61-4cb7-bfcd-ee2522c8f801',
        reservationId: reservation.id,
        missionId: mission.id,
        seat: 'A1',
        fullName: 'Fernando Papito',
        document: 'XP12345'
    }

    await cleanAndInsertMission(mission)
    await insertReservation(reservation)
    await insertTickets([ticket])

    await app.store.bookingPage.go(mission.id)
    await app.store.bookingPage.tryToSelectSeat('A1')

    await expect(app.store.bookingPage.occupiedSeatMessage('A1')).toBeVisible()
    await expect(app.store.bookingPage.seat('A1')).toHaveAttribute('aria-label', /Ocupado/)
    await expect(app.store.bookingPage.seat('A1')).toHaveAttribute('aria-pressed', 'false')
    await expect(app.store.bookingPage.noSeatsMessage).toBeVisible()
    await expect(app.store.bookingPage.continueButton).toBeDisabled()
})
