import { Page, Locator } from '@playwright/test'

export class MissionsPage {

    readonly page: Page
    readonly title: Locator
    readonly items: Locator
    readonly emptyState: Locator
    readonly clearSearchLink: Locator

    constructor(page: Page) {
        this.page = page
        this.emptyState = page.getByTestId('missions-empty-state')
        this.clearSearchLink = this.emptyState.getByRole('link', { name: 'Ver todas as janelas' })
        this.title = page.getByRole('heading', { level: 1 })
        this.items = page.getByRole('listitem').filter({ has: page.getByTestId('mission-code') })
    }

    private byMissions(ids: string[]): Locator {
        return this.items.filter({ has: this.page.getByTestId('mission-code').filter({ hasText: new RegExp(`^(${ids.join('|')})$`) }) })
    }

    mission(id: string): Locator {
        return this.byMissions([id])
    }

    basesByMissions(ids: string[]): Locator {
        return this.byMissions(ids).getByRole('heading', { level: 3 })
    }

    departureDatesByMissions(ids: string[]): Locator {
        return this.byMissions(ids).getByTestId('departure-date')
    }

    missionsOutsideBase(baseName: string): Locator {
        return this.items.filter({ hasNot: this.page.getByRole('heading', { level: 3, name: baseName }) })
    }

    activeFilter(baseName: string): Locator {
        return this.page.getByText(`Base ${baseName}`, { exact: true })
    }

    soldOutBadgeByMission(id: string): Locator {
        return this.mission(id).getByTestId('mission-sold-out')
    }

    bookLinkByMission(id: string): Locator {
        return this.mission(id).getByRole('link', { name: 'Reservar' })
    }
}
