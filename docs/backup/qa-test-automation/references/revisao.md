# Revisão antes de entregar

Passe por todos os itens. Corrija o que falhar e só então entregue.

## Fidelidade ao cenário

- [ ] O título de cada teste é o nome do cenário (ou cenário + linha de Exemplos).
- [ ] Existe uma asserção para cada **Então** e cada **E**, e nenhuma além delas.
- [ ] Nenhum passo, regra ou resultado foi inventado.
- [ ] Textos observados na tela e não definidos na especificação estão listados no resumo.

## Arquitetura

- [ ] Page Objects novos estão na pasta que os modelos de `assets/projeto/` indicam e registrados na fixture como o modelo mostra.
- [ ] O spec está na pasta que os modelos indicam e importa `test` e `expect` como os specs-modelo.
- [ ] Page Objects novos não têm `expect`, dados de teste nem endereço completo.
- [ ] Nenhum teste ou Page Object existente foi refatorado sem pedido.

## Locators e esperas

- [ ] Locators seguem a ordem do documento de arquitetura do projeto (ou a padrão da skill).
- [ ] Não há XPath, subida no DOM nem classe CSS.
- [ ] Não há `waitForTimeout`.
- [ ] Cada asserção de estado foi confirmada com a contraprova na tela.

## Dados

- [ ] Cada teste usa identificador exclusivo, que não aparece em nenhum outro teste.
- [ ] Cada teste prepara o próprio estado e limpa o que criou, inclusive em caso de falha.
- [ ] Em listas compartilhadas, nenhuma asserção depende de contagem total ou posição.

## Execução

- [ ] O teste foi executado, e o resultado no resumo é o que realmente aconteceu.
- [ ] Rodou mais de uma vez, em série (`--repeat-each=3 --workers=1`), sem variar o resultado.
- [ ] Falhas atribuídas ao produto estão reportadas com esperado e observado, sem asserção alterada.
- [ ] Nenhum `test.only`, `test.skip` ou asserção comentada ficou no código.
