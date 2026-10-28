# Boas práticas para o spec

## Estrutura

- Arquivo na pasta de specs do projeto, importando `test` e `expect` como os specs-modelo de `assets/projeto/`.
- **Contexto** do Gherkin em `test.beforeEach`.
- Dentro do teste, as três partes marcadas com comentários: `// Arrange`, `// Act` e `// Assert`, ou o padrão de comentários do projeto.
- Um teste por cenário. Em Esquema do Cenário, uma lista de dados com um `test` por linha.

## Asserções

- Use asserções que esperam sozinhas: `toBeVisible`, `toHaveText`, `toContainText`, `toHaveURL`, `toBeDisabled`, `toHaveCount` (só para elementos do próprio teste).
- Uma asserção para cada **Então** e cada **E** do cenário. Nenhuma a mais, nenhuma a menos.
- Valor exato: o texto ou número que a tela mostra para o resultado esperado.
- Para verificar que algo **não** acontece (ex.: "não permite o avanço"), verifique o estado observável que prova isso: a mensagem exibida, a etapa que continua na tela, o botão desabilitado.

## Esperas

- Nada de `waitForTimeout`.
- O Playwright espera os elementos sozinho em ações e asserções. Se uma operação é lenta, espere pelo resultado visível.
- Evite timeout por teste. Se for inevitável, justifique no resumo.

## Isolamento

- Nenhum teste depende de outro nem da ordem de execução.
- Nenhum teste depende de dados que ele não criou, exceto usuários de demonstração e cadastros de referência, sem alterá-los.

## Nomes

- Variáveis, funções e Page Objects em inglês.
- Títulos, dados de teste e textos esperados como na tela e na especificação.
