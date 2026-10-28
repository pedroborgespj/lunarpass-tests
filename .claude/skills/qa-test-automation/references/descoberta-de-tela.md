# Descoberta de tela com o Playwright MCP

O cenário diz **o que** acontece; a tela diz **como**. Antes de escrever o Page Object, percorra o caminho do cenário na aplicação e anote os elementos reais.

## Procedimento

1. Confirme que a aplicação responde em `http://localhost:3000` (o `baseURL` dos dois projects). Se não responder, não invente a tela: siga apenas com o que já existe nos Page Objects e entregue como "não executado".
2. Abra pelo Playwright MCP a página inicial do caminho: `/` no Storefront, `/mission-control/login` no Mission Control.
3. Leia o **snapshot de acessibilidade** de cada tela. Ele mostra papel, nome acessível e estado de cada elemento, que é o que os locators usam.
4. Execute as ações do **Quando** para ver as telas seguintes e o resultado do **Então** (alertas, toasts, mudanças de estado).
5. Anote, por tela: o caminho da URL, cada elemento usado e o melhor locator para ele.
6. Antes de mapear um elemento, veja se ele já existe em algum Page Object do módulo ou em `shared/` (ex.: `app.toast.message` para toasts, `alert` em `LoginPage` e `RegisterPage`).
7. Feche a aba ao terminar.

## Cuidados

- A descoberta pode precisar de dados. Use a massa que o teste vai criar (ver `massa-de-teste.md`). Não precisa apagar ao final: o teste limpa antes de rodar.
- Mission Control: entre com o usuário que os specs existentes já usam (`buzz@lunarpass.dev`). Não crie nem altere usuários.
- Não conclua reservas ou pagamentos sobre missões que o teste não criou.
- `docs/lunarpass-analise-de-aderencia.md` descreve o que a vitrine tinha e o que foi pedido ao produto (ex.: `data-testid` em datas, assentos, resumo). Pedido não é garantia: confirme na tela se o atributo existe.

## Escolha do locator

Ordem da diretriz de seletores de `docs/arquitetura.md`:

| Prioridade | Locator | Quando | Exemplo no projeto |
|---|---|---|---|
| 1 | `getByRole(papel, { name })` | Botões, links, títulos, campos com nome acessível, alertas, listas | `getByRole('textbox', { name: 'ID da missão' })`, `getByRole('alert')`, `getByRole('listitem')` |
| 2 | `getByLabel(rótulo)` | Campos associados a um rótulo | `getByLabel('Base lunar')` |
| 3 | `getByPlaceholder(texto)` | Campos identificados pelo texto de ajuda | `getByPlaceholder('Informe seu email')` |
| 4 | `getByTestId(id)` | Quando a semântica de acessibilidade não basta | `getByTestId('mission-form-return-date')` |

- Proibido: XPath, subida no DOM (`/..`) e dependência exclusiva de classe CSS.
- `getByText` e seletores por atributo (`locator('[...]')`) não estão na diretriz: veja os pontos em aberto 4 e 5.
- Elemento sem papel, rótulo nem `data-testid` estável vira sugestão de testabilidade no resumo, no estilo de `docs/lunarpass-analise-de-aderencia.md`.
- Em lista compartilhada (vitrine de missões), restrinja a busca ao item da missão do teste antes de verificar qualquer coisa dentro dele.

## Estados que a descoberta precisa revelar

- **Botões desabilitados:** o snapshot nem sempre mostra que um botão está desabilitado. Verifique o estado antes de planejar um clique.
- **Mensagens dinâmicas:** alertas e toasts mudam conforme a interação. Anote o texto de cada estado que o cenário usa.
- **Campos calculados:** como a data de retorno do formulário de missão (`mission-form-return-date`), que a tela calcula a partir da partida. Anote o formato exibido (ver `formatDate` em `helpers.ts`).
- **Contraprova:** quando a asserção verifica um estado (botão desabilitado, mensagem de vazio), confirme na tela que o estado oposto existe. Assim a asserção prova algo e não passa por acaso.
