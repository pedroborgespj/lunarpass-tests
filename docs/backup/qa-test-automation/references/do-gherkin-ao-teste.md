# Do Gherkin ao teste

O Gherkin declarativo descreve o comportamento de negócio, sem telas, cliques ou campos. A automação traduz cada parte para o código sem mudar o que foi especificado.

A especificação pode estar num arquivo do projeto ou ser colada pelo usuário na conversa. As palavras-chave podem aparecer em texto puro, em **negrito** (Markdown) ou num arquivo `.feature`.

## Como cada parte vira código

| Gherkin | No teste | Como |
|---|---|---|
| **Contexto** | `test.beforeEach` do arquivo | Estado comum a todos os cenários da funcionalidade |
| **Dado** | Arrange | De preferência pelo mecanismo de massa do projeto (banco, API ou fixture), mais rápido e estável que preparar pela tela. Pela tela só quando o próprio cenário pede a navegação |
| **Quando** | Act | Ações do usuário, sempre por métodos do Page Object |
| **Então** / **E** | Assert | Uma asserção para cada resultado esperado, sobre localizadores do Page Object |
| **Esquema do Cenário** + **Exemplos** | Um teste por linha | Lista de dados percorrida com um `test` por item |
| Anotações de rastreabilidade (regra de origem, IDs) | Nada | Servem para rastrear, não viram código |

## Título do teste

Regra da skill, que vale mesmo quando os testes antigos do projeto usam outro padrão (não renomeie os antigos):

- Cenário: o nome exato, palavra por palavra. `Cenário: Aplicar um cupom expirado` vira `test('Aplicar um cupom expirado', ...)`.
- Esquema do Cenário: o nome seguido da identificação da linha, por exemplo `Validar o tamanho do nome | caracteres: 2`.
- Um arquivo de spec por funcionalidade.

## Quando o cenário não é suficiente

| Situação | O que fazer |
|---|---|
| O **Então** não diz o que verificar (ex.: "o sistema reage adequadamente") | Pergunte antes de escrever |
| O **Então** descreve uma mensagem sem o texto exato | Use o texto que a tela mostra e registre no resumo: "texto observado, não definido na especificação" |
| O **Quando** é uma ação que a tela impede (ex.: botão desabilitado) | Não force o clique. Verifique o estado que impede a ação (`toBeDisabled`) e explique em comentário no Act |
| O **Então** não tem correspondência clara na tela (ex.: o cenário fala em instrução e a tela só mostra um status) | Automatize o que é verificável, use o elemento mais próximo e registre a divergência no resumo como pergunta: especificação, requisito ou produto? |
| O **Dado** exige um estado que o projeto não consegue criar | Pergunte. Não simule o estado de outro jeito sem combinar |
| O cenário depende de uma decisão de negócio em aberto | Não automatize. Registre como pendente |
| A tela se comporta diferente do **Então** | O teste fica falhando. Reporte como possível defeito do produto |
