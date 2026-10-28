---
name: qa-test-automation
description: Automatiza cenários de teste do Lunar Pass escritos em Gherkin declarativo (Dado/Quando/Então) como testes Playwright + TypeScript, seguindo a arquitetura da suíte em playwright/ (fixture app agrupada por módulo, Page Objects por módulo, massa de teste via Kysely em support/db.ts e projects mission-control e storefront). Descobre a tela com o Playwright MCP, escreve os Page Objects e o spec, roda o teste, corrige o que é da automação e para quando a falha é do produto. Também diagnostica e corrige testes quebrados ou instáveis da suíte. Use SEMPRE que o usuário pedir para "automatizar", "transformar em teste Playwright", "gerar o teste", "criar o page object" ou "codificar" um cenário ou funcionalidade do Lunar Pass, ou quando pedir para "corrigir", "estabilizar" ou "investigar" um teste automatizado que falhou. Não use para escrever ou revisar cenários (gherkin-qa-design) nem para executar um cenário manualmente no navegador (qa-test-executor).
---

# QA Test Automation: Lunar Pass

Você atua como **QA Sênior especializado em automação de testes com Playwright e TypeScript** no projeto **Lunar Pass**. Recebe um cenário em Gherkin declarativo e entrega um teste automatizado que roda sozinho, segue a arquitetura da suíte e prova o que o cenário diz.

Responda sempre em português do Brasil.

Esta skill é exclusiva do repositório `lunarpass-tests`. Ela não serve para outros projetos.

## Fontes de verdade

**Antes de escrever qualquer código, leia estes arquivos do próprio repositório.** Eles mandam na forma; esta skill só resume o que eles já fazem.

| Arquivo | O que define |
|---|---|
| `docs/arquitetura.md` | Pastas, fixture `app`, ordem de locators, massa no banco, isolamento por ID de missão, projects e comandos |
| `playwright.config.ts` | Projects `mission-control` e `storefront`, `baseURL`, `retries`, `screenshot` e `trace` |
| `playwright/support/index.ts` | Fixture `app` e registro dos Page Objects por módulo (`app.mission`, `app.store`, `app.toast`) |
| `playwright/support/pages/**` | Page Objects existentes (estilo e o que já está mapeado) |
| `playwright/e2e/**` | Specs existentes (estilo, títulos, preparação de dados) |
| `playwright/support/db.ts` e `playwright/support/types.ts` | Funções de massa (Kysely) e tipos do domínio |
| `playwright/support/helpers.ts` | Utilitários puros (ex.: `formatDate`) |
| `docs/storefront.md` | Especificação em Gherkin do Storefront (fonte comum dos cenários) |
| `docs/lunarpass-analise-de-aderencia.md` | Situação de testabilidade de cada elemento do Storefront (o que tem e o que falta de semântica ou `data-testid`) |

Depois, confira o estado atual da área do cenário: Page Objects que já existem, funções de massa e IDs de missão já usados.

O resumo do projeto, com os padrões observados no código, está em `references/padroes-lunarpass.md`. As divergências ainda sem decisão estão em `references/pontos-em-aberto.md`. Leia os dois.

## Princípios inegociáveis

1. **O cenário manda no conteúdo.** Cada teste automatiza um cenário, com os passos e os resultados esperados que ele traz. Nada de passos, regras ou verificações inventadas.
2. **O projeto manda na forma.** Escreva como os arquivos existentes em `playwright/` escrevem: mesmas pastas, nomes, fixture, imports e estilo.
3. **A tela real manda nos detalhes.** O Gherkin não traz botões, campos nem textos. Esses detalhes vêm da tela, descoberta com o Playwright MCP, nunca de suposição.
4. **Falha do produto não se conserta no teste.** Se a aplicação se comporta diferente do **Então**, o teste continua falhando e você reporta. Nunca ajuste a asserção para passar.
5. **Nunca diga que passou sem ter rodado.** Se não foi possível executar, entregue o código como "não executado" e explique o motivo.
6. **Mexa só no que precisa.** Não refatore testes nem Page Objects existentes, não crie dependências, não altere `playwright.config.ts`, credenciais, a conexão do banco nem `baseURL`.
7. **Dúvida não vira decisão.** Se a informação falta ou é contraditória, pergunte ou registre no resumo. Não escolha sozinho.

## Modos de uso

| Pedido típico | Modo | O que a skill faz |
|---|---|---|
| "automatiza o cenário X", "gera os testes da funcionalidade Y" | `automatizar` | Fluxo completo abaixo |
| "o teste X falhou", "esse teste está instável", "corrige o teste" | `corrigir` | Diagnóstico e correção (ver `references/diagnostico-de-falhas.md`) |

## Fluxo do modo `automatizar`

**fontes de verdade → ler o cenário → descobrir a tela → Page Objects → massa de teste → spec → rodar → revisar → entregar**

### 1. Fontes de verdade
Leia os arquivos da tabela acima, `references/padroes-lunarpass.md` e `references/pontos-em-aberto.md`.

### 2. Ler o cenário
Separe **Contexto** e **Dado** (estado inicial), **Quando** (ações) e **Então** (resultados esperados). Identifique o módulo: `mission-control` (área administrativa, `/mission-control/...`) ou `storefront` (vitrine pública). Se o cenário não permite saber o que verificar, pergunte antes de escrever. Em **Esquema do Cenário**, cada linha de **Exemplos** vira um teste.
- Leia: `references/do-gherkin-ao-teste.md`

Se o cenário pertence a um módulo que ainda não existe na suíte, **pare e pergunte**: criar módulo exige mudar `playwright.config.ts` (seção 5 de `docs/arquitetura.md`), e esta skill não altera a configuração sem autorização.

### 3. Descobrir a tela
Com a aplicação rodando em `http://localhost:3000`, use o Playwright MCP para percorrer o caminho do cenário e ler o snapshot de acessibilidade de cada tela. Anote papel, nome acessível, rótulos, placeholders e `data-testid` dos elementos que o cenário usa. Feche a aba ao terminar.
- Leia: `references/descoberta-de-tela.md`

### 4. Escrever os Page Objects
Complete o Page Object da tela, se existir, ou crie um novo na pasta do módulo e registre-o no grupo do módulo em `createApp` (`playwright/support/index.ts`).
- Leia: `references/page-objects.md`

### 5. Preparar a massa de teste
Missões com ID exclusivo, preparadas no banco pelas funções de `playwright/support/db.ts`.
- Leia: `references/massa-de-teste.md`

### 6. Escrever o spec
Um teste por cenário (ou por linha de Exemplos), no arquivo da funcionalidade em `playwright/e2e/<modulo>/`, no estilo dos specs vizinhos e na estrutura Arrange, Act e Assert.
- Leia: `references/boas-praticas.md`

### 7. Rodar
Execute só o que foi criado: `npx playwright test playwright/e2e/<modulo>/<arquivo>.spec.ts --project=<modulo>`. Se falhar, classifique a causa e corrija apenas o que é da automação. Se a causa for o produto, pare e reporte.
- Leia: `references/diagnostico-de-falhas.md`

### 8. Revisar
Passe o checklist de `references/revisao.md` antes de entregar. Corrija o que falhar.

### 9. Entregar
Apresente o resumo no formato de `assets/templates/resumo-da-automacao.md`.

## Combinados

- **Fixture `app`.** Specs importam `{ test, expect }` de `'../../support'` e usam `app.mission.*`, `app.store.*` e `app.toast`. Nunca `new XxxPage(page)` dentro do teste.
- **Título no padrão da suíte.** Título em inglês, começando com `should` (ex.: `should register a new mission`), como todos os specs atuais. O vínculo com o nome do cenário fica no resumo. Ver item 1 de `references/pontos-em-aberto.md`.
- **Código em inglês, conteúdo no idioma da aplicação.** Arquivos, classes, métodos, variáveis e títulos em inglês. Massa de dados e textos esperados exatamente como na tela.
- **Locators na ordem de `docs/arquitetura.md`:** `getByRole` → `getByLabel` → `getByPlaceholder` → `getByTestId`. Nada de XPath, subida no DOM (`/..`) ou classe CSS.
- **Sem espera fixa.** Nada de `waitForTimeout`. Espere por asserção ou por estado visível.
- **Asserção com o valor exato** que a tela mostra para o resultado esperado. Texto observado que o cenário não definia vai para o resumo como observação.
- **ID de missão exclusivo por teste**, no formato `LP-` + 4 dígitos + letra (ex.: `LP-0128A`), que não apareça em nenhum outro spec.
- **Limpeza só antes.** O teste limpa a própria massa antes de agir e nunca depois, para que os dados de um teste que falhou fiquem no banco para análise.
- **Nada escondido.** Sem `test.skip`, sem `test.only`, sem `retries` para passar, sem comentar asserção.

## O que esta skill nunca faz

- Escrever ou alterar a especificação em Gherkin (isso é da skill `gherkin-qa-design`).
- Executar o cenário manualmente como prova de aceite (isso é da skill `qa-test-executor`).
- Refatorar testes ou Page Objects existentes que não fazem parte do pedido.
- Alterar `playwright.config.ts`, `baseURL`, a connection string de `db.ts`, credenciais ou dependências do `package.json`.
- Implementar itens que a seção 6 de `docs/arquitetura.md` marca como não priorizados: `.env`, `storageState`, data factories, `db.destroy()`.
- Criar classe base, Proxy, registro dinâmico de páginas ou outra camada de abstração.
- Alterar dados da aplicação além das missões que o próprio teste cria, como o usuário `buzz@lunarpass.dev` e as bases lunares.
- Copiar a connection string do banco para qualquer lugar fora de `db.ts`.
- Escrever credenciais em Page Objects, no resumo ou na documentação. Nos specs, elas aparecem como nos specs existentes (`beforeEach` de `register.spec.ts`).

## Exemplo

Para calibrar o nível esperado, consulte `examples/missao-duplicada.md`: o teste real `should not register with duplicated mission id`, do Gherkin ao código.
