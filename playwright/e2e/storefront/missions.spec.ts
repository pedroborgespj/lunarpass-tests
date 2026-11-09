import { test, expect } from '../../support'

import { LunarBase, Mission, Reservation, Ticket } from '../../support/types'

import { cleanAndInsertLunarBase, cleanAndInsertMission, insertReservation, insertTickets } from '../../support/db'
import { formatDate } from '../../support/helpers'

test('should search missions for all available lunar bases', async ({ app }) => {
  // Arrange
  const missions: Mission[] = [
    {
      id: 'LP-0529C',
      rocket: 'Starship',
      baseId: 'aurora',
      departureDate: '2029-05-14',
      returnDate: '2029-05-21',
      price: 1000.00
    },
    {
      id: 'LP-0529A',
      rocket: 'Starship',
      baseId: 'alpha',
      departureDate: '2029-05-10',
      returnDate: '2029-05-17',
      price: 1000.00
    },
    {
      id: 'LP-0529D',
      rocket: 'Starship',
      baseId: 'selene',
      departureDate: '2029-05-16',
      returnDate: '2029-05-23',
      price: 1000.00
    },
    {
      id: 'LP-0529B',
      rocket: 'Starship',
      baseId: 'orion',
      departureDate: '2029-05-12',
      returnDate: '2029-05-19',
      price: 1000.00
    }
  ]

  for (const mission of missions) {
    await cleanAndInsertMission(mission)
  }

  const missionIds = missions.map((mission) => mission.id)

  // Act
  await app.store.homePage.go()
  await app.store.homePage.searchMissions()

  // Assert
  await expect(app.store.missionsPage.basesByMissions(missionIds)).toHaveText([
    'Base Lunar Alpha',
    'Base Lunar Orion',
    'Base Lunar Aurora',
    'Base Lunar Selene'
  ])
  await expect(app.store.missionsPage.departureDatesByMissions(missionIds)).toHaveText([
    formatDate('2029-05-10'),
    formatDate('2029-05-12'),
    formatDate('2029-05-14'),
    formatDate('2029-05-16')
  ])
})

test('should search missions filtering by a specific lunar base', async ({ app }) => {
  // Arrange
  const alphaMission: Mission = {
    id: 'LP-0601A',
    rocket: 'Starship',
    baseId: 'alpha',
    departureDate: '2029-06-10',
    returnDate: '2029-06-17',
    price: 1000.00
  }

  const orionMission: Mission = {
    id: 'LP-0601B',
    rocket: 'Starship',
    baseId: 'orion',
    departureDate: '2029-06-12',
    returnDate: '2029-06-19',
    price: 1000.00
  }

  await cleanAndInsertMission(alphaMission)
  await cleanAndInsertMission(orionMission)

  // Act
  await app.store.homePage.go()
  await app.store.homePage.selectBase('Base Lunar Alpha')
  await app.store.homePage.searchMissions()

  // Assert
  await expect(app.store.missionsPage.mission(alphaMission.id)).toBeVisible()
  await expect(app.store.missionsPage.mission(orionMission.id)).toHaveCount(0)
  await expect(app.store.missionsPage.missionsOutsideBase('Base Lunar Alpha')).toHaveCount(0)

  await expect(app.store.missionsPage.activeFilter('Base Lunar Alpha')).toBeVisible()
  const total = await app.store.missionsPage.items.count()
  await expect(app.store.missionsPage.title).toHaveText(`${total} missões disponíveis`)
})

test('should show sold out mission without booking option', async ({ app }) => {
  // Arrange
  const mission: Mission = {
    id: 'LP-0729D',
    rocket: 'Starship',
    baseId: 'selene',
    departureDate: '2029-07-10',
    returnDate: '2029-07-17',
    price: 1000.00
  }

  const reservation: Reservation = {
    id: 'f47ac10b-58cc-4372-a567-0e02b2c3d479',
    userId: null,
    missionId: mission.id,
    reservationCode: 'SLN729',
    contactEmail: 'papito@teste.com',
    totalPrice: 4000.00,
    status: 'confirmed'
  }

  const tickets: Ticket[] = [
    {
      id: 'c9a646d3-9c61-4cb7-bfcd-ee2522c8f601',
      reservationId: reservation.id,
      missionId: mission.id,
      seat: 'A1',
      fullName: 'Fernando Papito',
      document: 'XP12345'
    },
    {
      id: 'c9a646d3-9c61-4cb7-bfcd-ee2522c8f602',
      reservationId: reservation.id,
      missionId: mission.id,
      seat: 'A2',
      fullName: 'João da Silva',
      document: 'XP2002'
    },
    {
      id: 'c9a646d3-9c61-4cb7-bfcd-ee2522c8f603',
      reservationId: reservation.id,
      missionId: mission.id,
      seat: 'B1',
      fullName: 'Maria da Silva',
      document: 'XP2003'
    },
    {
      id: 'c9a646d3-9c61-4cb7-bfcd-ee2522c8f604',
      reservationId: reservation.id,
      missionId: mission.id,
      seat: 'B2',
      fullName: 'Jose de Alencar',
      document: 'XP2004'
    }
  ]

  await cleanAndInsertMission(mission)
  await insertReservation(reservation)
  await insertTickets(tickets)

  // Act
  await app.store.homePage.go()
  await app.store.homePage.selectBase('Base Lunar Selene')
  await app.store.homePage.searchMissions()

  // Assert
  await expect(app.store.missionsPage.soldOutBadgeByMission(mission.id)).toHaveText('Esgotado')
  await expect(app.store.missionsPage.bookLinkByMission(mission.id)).toBeHidden()
})

test('should show empty state when no missions match the filters', async ({ app }) => {
  // Arrange
  const base: LunarBase = {
    id: 'vesta',
    name: 'Base Lunar Vesta',
    shortName: 'Vesta',
    tagline: 'Mar da Serenidade',
    description: 'Base exclusiva para testes automatizados, sem missões cadastradas.',
    imageUrl: null,
    sortOrder: 50,
    isActive: true
  }

  await cleanAndInsertLunarBase(base)

  // Act
  await app.store.homePage.go()
  await app.store.homePage.selectBase(base.name)
  await app.store.homePage.searchMissions()

  // Assert
  await expect(app.store.missionsPage.emptyState).toContainText('Nenhuma missão programada com esses filtros.')
  await expect(app.store.missionsPage.clearSearchLink).toBeVisible()
})
