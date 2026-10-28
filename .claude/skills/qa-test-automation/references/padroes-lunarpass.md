# Padrões do Lunar Pass

Resumo do que a suíte faz hoje, tirado de `docs/arquitetura.md` e do código em `playwright/`. Se algo aqui divergir do repositório, **o repositório manda**: confira o arquivo e registre a diferença no resumo.

## Stack

- Playwright (`@playwright/test`) + TypeScript.
- Banco PostgreSQL (Supabase) acessado com Kysely + `pg`, com `CamelCasePlugin` (colunas `snake_case` no banco, campos `camelCase` no código).
- `@faker-js/faker` já está instalado e é usado em `register.spec.ts` para gerar dados inválidos.
- Gerenciador de pacotes: Yarn (`yarn.lock`). Comandos do Playwright com `npx`, como em `docs/arquitetura.md`.
- Não há `.env`: `baseURL` fica no `playwright.config.ts` e a conexão do banco em `db.ts`. Isso é conhecido e está fora de escopo (seção 6 da arquitetura).

## Pastas

```plaintext
playwright/
├── e2e/
│   ├── mission-control/     # specs do Mission Control (login, register)
│   └── storefront/          # specs do Storefront (home)
└── support/
    ├── index.ts             # fixture app
    ├── db.ts                # massa via Kysely
    ├── types.ts             # Mission, Reservation, Ticket
    ├── helpers.ts           # funções puras (formatDate)
    └── pages/
        ├── mission-control/ # *.page.ts e componentes do módulo (navbar.ts)
        ├── storefront/      # *.page.ts e componentes do módulo
        └── shared/          # só o que dois ou mais módulos usam (toast.ts)
```

## Módulos e projects

| Módulo | Grupo na fixture | Pasta de specs | Project | `baseURL` | Rotas conhecidas |
|---|---|---|---|---|---|
| Mission Control | `app.mission` | `playwright/e2e/mission-control/` | `mission-control` | `http://localhost:3000` | `/mission-control/login` |
| Storefront | `app.store` | `playwright/e2e/storefront/` | `storefront` | `http://localhost:3000` (com `TODO` no config) | `/` |
| Compartilhado | `app.toast` | — | — | — | — |

Rotas do Storefront citadas em `docs/lunarpass-analise-de-aderencia.md`: `/missions` (resultados) e `/booking/<ID da missão>` (reserva). Confirme na tela antes de usar.

## Fixture

```typescript
const createApp = (page: Page) => ({
    mission: { loginPage, dashPage, registerPage, navbar },
    store: { homePage },
    toast: new Toast(page),
})
```

Novo Page Object entra no grupo do seu módulo, com nome em camelCase (`registerPage`, `navbar`), e o import fica no bloco do módulo, no topo de `index.ts`.

## Page Objects

Padrão dos arquivos atuais:

```typescript
import { Page, Locator } from '@playwright/test'

export class DashPage {

    readonly page: Page
    readonly addButton: Locator

    constructor(page: Page) {
        this.page = page
        this.addButton = page.getByRole('link', { name: 'Nova missão' })
    }
}
```

- Arquivo `<tela>.page.ts` com classe `<Tela>Page`. Componente sem `.page` (`navbar.ts` → `Navbar`, `toast.ts` → `Toast`).
- Indentação de 4 espaços, sem ponto e vírgula, aspas simples.
- Linha em branco depois de `export class X {`.
- Propriedades `readonly` para o que o teste verifica ou clica direto (`title`, `alert`, `addButton`, `logout`, `message`, `slogan`).
- Métodos de ação recebem dados por parâmetro (`login(email, password)`, `submit(mission: Mission)`). Locators usados só dentro de uma ação podem ficar no próprio método, como em `LoginPage.login` e `RegisterPage.submit`.
- `expect` aparece em Page Object apenas como **guarda de sincronização** dentro de ações (`LoginPage.go` espera o título; `RegisterPage.submit` espera a data de retorno calculada). Os resultados esperados do cenário são sempre verificados no spec.

## Specs

```typescript
import { test, expect } from '../../support'
import { faker } from '@faker-js/faker'

import { Mission } from '../../support/types'

import { cleanAndInsertMission, cleanMission } from '../../support/db'
```

- Sem `test.describe`: os testes ficam no nível do arquivo.
- `test.beforeEach` para o estado comum (ex.: login e navegação até o formulário em `register.spec.ts`).
- Títulos em inglês começando com `should`.
- Massa de missão declarada como `const mission: Mission = { ... }` dentro do teste.
- Limpeza só antes de agir (`cleanMission` / `cleanAndInsertMission`), nunca em `afterEach`: se o teste falhar, os dados ficam no banco para análise.
- Separação Arrange / Act / Assert por linhas em branco. Os comentários `// Arrange`, `// Act`, `// Assert` aparecem só em `login.spec.ts`; use-os se o arquivo que você está editando já os usa.
- Mission Control e specs de suporte usam 4 espaços; `home.spec.ts` usa 2. Siga o arquivo que você está editando; em arquivo novo, use 4.

## Dados conhecidos

| Dado | Valor | Onde aparece |
|---|---|---|
| Usuário do Mission Control | `buzz@lunarpass.dev` (senha nos specs existentes) | `login.spec.ts`, `register.spec.ts` |
| IDs de missão em uso | `LP-0128A`, `LP-3001A` | `register.spec.ts` |
| ID citado na documentação | `LP-0127A` | `docs/lunarpass-analise-de-aderencia.md` (não use) |
| `baseId` usados | `aurora`, `orion` | `register.spec.ts` |
| Bases lunares (spec) | Alpha, Orion, Aurora, Selene | `docs/storefront.md` |

Antes de escolher um ID, procure de novo: `grep -rn "LP-[0-9]" playwright docs`.

## Comandos

```bash
npx playwright test playwright/e2e/<modulo>/<arquivo>.spec.ts --project=<modulo>
npx playwright test playwright/e2e/<modulo>/<arquivo>.spec.ts --project=<modulo> --repeat-each=3 --workers=1
npx playwright test --list --project=<modulo>
npx playwright show-report
```

Configuração relevante: `retries` é 0 localmente (2 só no CI), `screenshot: 'only-on-failure'`, `trace: 'on-first-retry'` (localmente não há trace) e `reporter: 'html'`.
