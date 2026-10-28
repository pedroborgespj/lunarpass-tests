# Descoberta de tela com o Playwright MCP

O cenário diz **o que** acontece; a tela diz **como**. Antes de escrever o Page Object, percorra o caminho do cenário na aplicação e anote os elementos reais.

## Procedimento

1. Confirme que a aplicação responde no `baseURL` da configuração do projeto. Se não responder, não invente a tela: siga apenas com o que já existe nos Page Objects e entregue como "não executado".
2. Abra a página inicial do caminho do cenário pelo Playwright MCP.
3. Leia o **snapshot de acessibilidade** de cada tela. Ele mostra papel, nome acessível e estado de cada elemento, que é exatamente o que os locators usam.
4. Execute as ações do **Quando** para ver as telas seguintes e o resultado do **Então** (mensagens, alertas, mudanças de estado).
5. Anote, por tela: o caminho da URL, cada elemento usado e o melhor locator para ele.
6. Feche a aba ao terminar.

## Cuidados

- A descoberta pode precisar de dados. Use a massa que o teste vai criar (ver `massa-de-teste.md`) e limpe ao final, ou use dados de demonstração sem alterá-los.
- Não conclua compras, cadastros ou envios com dados reais só para explorar.
- Credenciais de acesso vêm do que o projeto já usa nos testes existentes. Não invente usuários.

## Escolha do locator

Use a ordem do documento de arquitetura do projeto, se ele definir uma. Sem definição, a ordem recomendada pelo Playwright:

| Prioridade | Locator | Quando |
|---|---|---|
| 1 | `getByRole(papel, { name })` | Botões, links, títulos, campos com nome acessível, alertas |
| 2 | `getByLabel(rótulo)` | Campos associados a um rótulo |
| 3 | `getByPlaceholder(texto)` | Campos identificados pelo texto de ajuda |
| 4 | `getByText(texto)` | Textos sem papel, como mensagens de status |
| 5 | `getByTestId(id)` | Quando nada acima identifica o elemento de forma estável |

Evite XPath, subidas no DOM (`/..`) e classes CSS. Elemento sem papel nem identificador estável vira sugestão de testabilidade no resumo.

## Estados que a descoberta precisa revelar

- **Botões desabilitados:** o snapshot nem sempre mostra que um botão está desabilitado. Verifique o estado antes de planejar um clique.
- **Mensagens dinâmicas:** textos de status mudam conforme a interação. Anote o texto de cada estado que o cenário usa.
- **Contraprova:** quando a asserção verifica um estado (botão desabilitado, mensagem de vazio), confirme na tela que o estado oposto existe (o botão habilita, a mensagem muda). Assim a asserção prova algo e não passa por acaso.
