# Boas práticas para o spec

## Estrutura

- Arquivo em `playwright/e2e/<modulo>/<funcionalidade>.spec.ts`.
- Imports na ordem dos specs existentes:

```typescript
import { test, expect } from '../../support'
import { faker } from '@faker-js/faker'          // só se usar

import { Mission } from '../../support/types'     // só se usar

import { cleanAndInsertMission, cleanMission } from '../../support/db'   // só se usar
```

- Testes no nível do arquivo, sem `test.describe`, como os specs atuais.
- **Contexto** do Gherkin em `test.beforeEach(async ({ app }) => { ... })`.
- Acesso às telas sempre por `app.mission.*`, `app.store.*` ou `app.toast`. `page` só para asserções sobre a página inteira (ex.: `toHaveTitle` em `home.spec.ts`).
- Arrange, Act e Assert separados por linha em branco; comentários `// Arrange`, `// Act`, `// Assert` só se o arquivo já os usa (ponto em aberto 7).
- Um teste por cenário. Em Esquema do Cenário, uma lista de dados com um `test` por linha.

## Asserções

- Use asserções que esperam sozinhas: `toBeVisible`, `toHaveText`, `toContainText`, `toHaveURL`, `toHaveTitle`, `toBeDisabled`, `toHaveCount` (só para elementos do próprio teste).
- Padrões já usados: `toHaveText` para alertas de validação (`app.mission.registerPage.alert`), `toContainText` para o toast (`app.toast.message`), `toBeVisible` para confirmar que a tela chegou (`app.mission.navbar.logout`).
- Uma asserção para cada **Então** e cada **E** do cenário. Nenhuma a mais, nenhuma a menos. Guardas de sincronização no `beforeEach` (ex.: `await expect(app.mission.registerPage.title).toBeVisible()`) fazem parte do Contexto, não contam como asserção do cenário.
- Valor exato: o texto ou número que a tela mostra para o resultado esperado. Datas exibidas podem usar `formatDate` de `helpers.ts`.
- Para verificar que algo **não** acontece, verifique o estado observável que prova isso: a mensagem exibida, a etapa que continua na tela, o botão desabilitado.

## Esperas

- Nada de `waitForTimeout`.
- O Playwright espera os elementos sozinho em ações e asserções. Se uma operação é lenta, espere pelo resultado visível.
- Evite timeout por teste. Se for inevitável, justifique no resumo.

## Isolamento

- Nenhum teste depende de outro nem da ordem de execução (`fullyParallel: true`).
- Nenhum teste depende de missões que ele não criou. O usuário `buzz@lunarpass.dev` e as bases lunares podem ser usados sem alteração.

## Nomes e estilo

- Variáveis e funções em inglês; títulos em inglês com `should` (ponto em aberto 1).
- Massa e textos esperados como na tela e na especificação.
- 4 espaços em arquivo novo; no arquivo existente, a indentação dele (`home.spec.ts` usa 2).
- Aspas simples e sem ponto e vírgula.
