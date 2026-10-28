# Exemplo: missão com ID duplicado (Mission Control)

Exemplo para calibrar a skill, montado a partir do código real de `playwright/e2e/mission-control/register.spec.ts` e `playwright/support/pages/mission-control/register.page.ts`. O Gherkin abaixo foi escrito só para ilustrar: não está em `docs/`.

## 1. O cenário

**Funcionalidade:** Cadastro de missões

**Contexto:**
**Dado** que estou autenticado no Mission Control
**E** estou no formulário de nova missão

**Cenário:** Impedir o cadastro de missão com ID já existente
**Dado** que já existe uma missão com o ID que vou informar
**Quando** eu cadastro uma missão com esse mesmo ID
**Então** sou informado de que já existe uma missão com este ID

## 2. Leitura do cenário

| Parte | Tradução para o teste |
|---|---|
| Contexto | `beforeEach`: login com `buzz@lunarpass.dev`, clique em "Nova missão" e espera pelo título "Programar missão" |
| Dado | Missão `LP-3001A` gravada no banco com `cleanAndInsertMission` |
| Quando | `app.mission.registerPage.submit(mission)` com a mesma missão |
| Então | Alerta com o texto exato "Já existe uma missão com este ID." |

## 3. Descoberta de tela

O snapshot do formulário mostra: título `heading` "Programar missão", campos `textbox` "ID da missão", "Foguete" e "Data de partida", `combobox` com rótulo "Base lunar", `spinbutton` "Preço por passagem (USD)", botão "Salvar missão", data de retorno calculada sem papel próprio (`data-testid="mission-form-return-date"`) e mensagens de validação em `alert`.

## 4. O Page Object

`playwright/support/pages/mission-control/register.page.ts`:

```typescript
import { Page, Locator, expect } from '@playwright/test'

import { Mission } from '../../types'

import { formatDate } from '../../helpers'

export class RegisterPage {

    readonly page: Page
    readonly title: Locator
    readonly alert: Locator

    constructor(page: Page) {
        this.page = page
        this.title = page.getByRole('heading', { name: 'Programar missão' })
        this.alert = page.getByRole('alert')
    }

    async submit(mission: Mission) {
        await this.page.getByRole('textbox', { name: 'ID da missão' }).fill(mission.id)
        await this.page.getByRole('textbox', { name: 'Foguete' }).fill(mission.rocket)
        await this.page.getByLabel('Base lunar').selectOption(mission.baseId)
        await this.page.getByRole('textbox', { name: 'Data de partida' }).fill(mission.departureDate)
        await expect(this.page.getByTestId('mission-form-return-date')).toContainText(formatDate(mission.returnDate))
        await this.page.getByRole('spinbutton', { name: 'Preço por passagem (USD)' }).fill(mission.price.toString())
        await this.page.getByRole('button', { name: 'Salvar missão' }).click()
    }
}
```

Registro em `playwright/support/index.ts`: `registerPage: new RegisterPage(page)` no grupo `mission`.

## 5. O teste

Trecho de `playwright/e2e/mission-control/register.spec.ts` (só os imports e o `beforeEach` que este teste usa):

```typescript
import { test, expect } from '../../support'

import { Mission } from '../../support/types'

import { cleanAndInsertMission } from '../../support/db'

test.beforeEach(async ({ app }) => {
    await app.mission.loginPage.go()
    await app.mission.loginPage.login('buzz@lunarpass.dev', 'pwd123')
    await expect(app.mission.navbar.logout).toBeVisible()

    await app.mission.dashPage.addButton.click()
    await expect(app.mission.registerPage.title).toBeVisible()
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

    await app.mission.registerPage.submit(mission)

    await expect(app.mission.registerPage.alert).toHaveText('Já existe uma missão com este ID.')
})
```

## 6. O que observar

- O teste usa `app.mission.*`, nunca `new RegisterPage(page)`.
- Título em inglês com `should`; o vínculo com o nome do cenário fica no resumo.
- O ID `LP-3001A` é exclusivo deste teste. A missão é preparada no banco, não pela tela.
- A data de retorno é 7 dias depois da partida, e o preço é positivo: dados válidos para as regras que não estão em teste.
- O `Então` tem uma asserção, com o texto exato da tela. As asserções do `beforeEach` são guardas do Contexto.
- O `expect` dentro de `submit` é guarda de sincronização (espera a data calculada), não o resultado do cenário.
- A limpeza acontece só antes (`cleanAndInsertMission`). Se o teste falhar, `LP-3001A` fica no banco para análise.

## 7. Trecho do resumo

| Cenário (Gherkin) | Regra de origem | Título do teste | Arquivo | Resultado |
|---|---|---|---|---|
| Impedir o cadastro de missão com ID já existente | — | `should not register with duplicated mission id` | `playwright/e2e/mission-control/register.spec.ts` | Passou |

- **Textos observados, não definidos na especificação:** "Já existe uma missão com este ID."
- **Pontos em aberto que afetam este teste:** 1 (título).
