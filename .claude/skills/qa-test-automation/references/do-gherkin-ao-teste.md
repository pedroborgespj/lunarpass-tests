# Do Gherkin ao teste

O Gherkin declarativo descreve o comportamento de negócio, sem telas, cliques ou campos. A automação traduz cada parte para o código sem mudar o que foi especificado.

No Lunar Pass, a especificação do Storefront está em `docs/storefront.md` (palavras-chave em **negrito**, anotações `*Regra de origem: Rn*`). O usuário também pode colar o cenário na conversa.

## Como cada parte vira código

| Gherkin | No teste | Como |
|---|---|---|
| **Contexto** | `test.beforeEach` do arquivo | Estado comum a todos os cenários do arquivo (ex.: login e abertura do formulário, como em `register.spec.ts`) |
| **Dado** | Arrange | Missões pelo banco, com as funções de `playwright/support/db.ts`. Pela tela só quando o cenário pede a navegação ou não há função de massa (ver `massa-de-teste.md`) |
| **Quando** | Act | Ações do usuário por métodos ou locators do Page Object, via `app.<modulo>.<pagina>` |
| **Então** / **E** | Assert | Uma asserção para cada resultado esperado, sobre locators do Page Object |
| **Esquema do Cenário** + **Exemplos** | Um teste por linha | Lista de dados percorrida com um `test` por item, título com a identificação da linha |
| `*Regra de origem: Rn*` | Nada no código | Vai para o resumo, na tabela de rastreabilidade |

## Arquivo e título

- Um spec por funcionalidade, em `playwright/e2e/<modulo>/<funcionalidade>.spec.ts` (nome curto em inglês, como `login.spec.ts`, `register.spec.ts`, `home.spec.ts`). Se o spec da funcionalidade já existe, acrescente os testes nele.
- Título em inglês começando com `should`, como os specs atuais (ponto em aberto 1). Exemplo: `Cenário: Missão esgotada aparece nos resultados sem opção de reserva` pode virar `should show sold out mission without booking option`.
- Em Esquema do Cenário, acrescente a identificação da linha ao título, por exemplo `should validate passenger data limits | name: 3, passport: 5`.
- O resumo lista a correspondência entre o nome de cada cenário e o título do teste.

## Quando o cenário não é suficiente

| Situação | O que fazer |
|---|---|
| O **Então** não diz o que verificar (ex.: "o sistema reage adequadamente") | Pergunte antes de escrever |
| O **Então** descreve uma mensagem sem o texto exato | Use o texto que a tela mostra e registre no resumo: "texto observado, não definido na especificação" |
| O **Quando** é uma ação que a tela impede (ex.: botão desabilitado) | Não force o clique. Verifique o estado que impede a ação (`toBeDisabled`) e explique em comentário no Act |
| O **Então** não tem correspondência clara na tela | Automatize o que é verificável, use o elemento mais próximo e registre a divergência no resumo como pergunta: especificação, requisito ou produto? |
| O **Dado** exige um estado que `db.ts` não cria (reserva, ticket, assento ocupado) | Siga "Quando falta uma função de massa" em `massa-de-teste.md`. Se a estrutura não estiver clara, pergunte |
| O cenário depende de ponto em aberto da especificação (ex.: R9 e R10 de `docs/storefront.md`, marcadas "A investigar") | Não automatize. Registre como pendente |
| O cenário é de um módulo sem pasta e sem project na suíte | Pare e pergunte (criar módulo altera `playwright.config.ts`) |
| A tela se comporta diferente do **Então** | O teste fica falhando. Reporte como possível defeito do produto |
