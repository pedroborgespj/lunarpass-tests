import { Page, Locator } from '@playwright/test'

import { Passenger, Payment } from '../../types'

export class BookingPage {

    readonly page: Page
    readonly stepTitle: Locator
    readonly passengersTitle: Locator
    readonly noSeatsMessage: Locator
    readonly selectedSeatsMessage: Locator
    readonly continueButton: Locator
    readonly totalPrice: Locator
    readonly paymentTitle: Locator
    readonly nameInput: Locator
    readonly passportInput: Locator
    readonly paymentButton: Locator
    readonly contactEmailInput: Locator
    readonly cardNameInput: Locator
    readonly cardNumberInput: Locator
    readonly cardExpiryInput: Locator
    readonly cardCvvInput: Locator
    readonly payButton: Locator
    readonly paymentAlert: Locator
    readonly confirmationTitle: Locator
    readonly reservationCode: Locator
    readonly paymentStatus: Locator
    readonly tickets: Locator
    readonly ticketPassengerNames: Locator
    readonly ticketPassports: Locator
    readonly ticketSeats: Locator

    constructor(page: Page) {
        this.page = page
        this.stepTitle = page.getByRole('heading', { level: 2, name: 'Escolha seus assentos' })
        this.passengersTitle = page.getByRole('heading', { level: 2, name: 'Cadastre os passageiros' })
        this.noSeatsMessage = page.getByText('Nenhum assento selecionado.', { exact: true })
        this.selectedSeatsMessage = page.getByText(/assentos selecionados:/)
        this.continueButton = page.getByRole('button', { name: 'Continuar' })
        this.totalPrice = page.getByTestId('summary-total-price')
        this.paymentTitle = page.getByRole('heading', { level: 2, name: 'Pagamento' })
        this.nameInput = page.getByRole('textbox', { name: 'Nome completo' })
        this.passportInput = page.getByRole('textbox', { name: 'Passaporte' })
        this.paymentButton = page.getByRole('button', { name: 'Ir para pagamento' })
        this.contactEmailInput = page.getByRole('textbox', { name: 'E-mail de contato' })
        this.cardNameInput = page.getByRole('textbox', { name: 'Nome no cartão' })
        this.cardNumberInput = page.getByRole('textbox', { name: 'Número do cartão' })
        this.cardExpiryInput = page.getByRole('textbox', { name: 'Validade' })
        this.cardCvvInput = page.getByRole('textbox', { name: 'CVV' })
        this.payButton = page.getByRole('button', { name: 'Pagar e reservar' })
        this.paymentAlert = page.getByRole('alert')
        this.confirmationTitle = page.getByRole('heading', { level: 2, name: 'Sua reserva está confirmada.' })
        this.reservationCode = page.getByTestId('reservation-code')
        this.paymentStatus = page.getByTestId('reservation-payment-status')
        this.tickets = page.getByTestId('reservation-ticket')
        this.ticketPassengerNames = page.getByTestId('ticket-passenger-name')
        this.ticketPassports = page.getByTestId('ticket-passport')
        this.ticketSeats = page.getByTestId('ticket-seat')
    }

    async submitPassengers(passengers: Passenger[]) {
        for (const passenger of passengers) {
            const card = this.page
                .getByTestId('passenger-card')
                .filter({ hasText: `Assento ${passenger.seat}` })
            await card.getByRole('textbox', { name: 'Nome completo' }).fill(passenger.fullName)
            await card.getByRole('textbox', { name: 'Passaporte' }).fill(passenger.passport)
        }
        await this.paymentButton.click()
    }

    cardBrand(brand: string): Locator {
        return this.page.getByRole('img', { name: `Bandeira ${brand}` })
    }

    async fillPayment(payment: Payment) {
        await this.contactEmailInput.fill(payment.email)
        await this.cardNameInput.fill(payment.cardName)
        await this.cardNumberInput.fill(payment.cardNumber)
        await this.cardExpiryInput.fill(payment.expiry)
        await this.cardCvvInput.fill(payment.cvv)
    }

    async pay(payment: Payment) {
        await this.fillPayment(payment)
        await this.payButton.click()
    }

    fieldError(message: string): Locator {
        return this.page.getByRole('alert').filter({ hasText: message })
    }

    async continue() {
        await this.continueButton.click()
    }

    async submitPassenger(name: string, passport: string) {
        await this.nameInput.fill(name)
        await this.passportInput.fill(passport)
        await this.paymentButton.click()
    }

    occupiedSeatMessage(code: string): Locator {
        return this.page.getByRole('alert').filter({ hasText: `O assento ${code} já está ocupado. Escolha outro.` })
    }

    async go(missionId: string) {
        await this.page.goto(`/booking/${missionId}`)
    }

    seat(code: string): Locator {
        return this.page.getByRole('button', { name: new RegExp(`^Assento ${code},`) })
    }

    async selectSeat(code: string) {
        await this.seat(code).click()
    }

    async tryToSelectSeat(code: string) {
        await this.seat(code).click({ force: true })
    }

    async selectSeats(codes: string[]) {
        for (const code of codes) {
            await this.selectSeat(code)
        }
    }
}
