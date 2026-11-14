import { Page, Locator } from '@playwright/test'

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
