# Revisão antes de entregar

Passe por todos os itens. Corrija o que falhar e só então entregue.

## Fidelidade ao cenário

- [ ] Existe uma asserção para cada **Então** e cada **E**, e nenhuma além delas.
- [ ] Nenhum passo, regra ou resultado foi inventado.
- [ ] O resumo traz a correspondência entre o nome de cada cenário e o título do teste.
- [ ] Textos observados na tela e não definidos na especificação estão listados no resumo.

## Arquitetura

- [ ] O spec está em `playwright/e2e/<modulo>/` e importa `{ test, expect }` de `'../../support'`.
- [ ] Nenhum `new XxxPage(page)` no spec: tudo passa por `app.mission`, `app.store` ou `app.toast`.
- [ ] Page Objects novos estão em `playwright/support/pages/<modulo>/` (ou `shared/`, só se dois módulos usam) e registrados no grupo do módulo em `createApp`.
- [ ] Page Objects novos não têm resultado esperado do cenário, dados de teste nem URL completa.
- [ ] Nenhum teste ou Page Object existente foi refatorado sem pedido.
- [ ] `playwright.config.ts`, `package.json`, a conexão de `db.ts` e credenciais não foram alterados.
- [ ] Estilo igual ao dos vizinhos: títulos `should ...`, aspas simples, sem ponto e vírgula, indentação do arquivo.

## Locators e esperas

- [ ] Locators seguem a ordem de `docs/arquitetura.md` (role → label → placeholder → testId); exceções estão no resumo.
- [ ] Não há XPath, subida no DOM nem classe CSS.
- [ ] Não há `waitForTimeout`.
- [ ] Cada asserção de estado foi confirmada com a contraprova na tela.

## Dados

- [ ] Cada teste usa ID de missão exclusivo (`LP-0000A`), que não aparece em nenhum outro arquivo de `playwright/` nem em `docs/`.
- [ ] Cada teste prepara o próprio estado com `cleanMission` ou `cleanAndInsertMission` antes de agir.
- [ ] Não há `afterEach` nem `afterAll` apagando massa.
- [ ] No Storefront, nenhuma asserção depende de contagem total ou posição.
- [ ] Funções novas em `db.ts` e campos novos em `types.ts`, se houver, estão listados no resumo.

## Execução

- [ ] O teste foi executado com `--project=<modulo>`, e o resultado no resumo é o que realmente aconteceu.
- [ ] Rodou mais de uma vez, em série (`--repeat-each=3 --workers=1`), sem variar o resultado.
- [ ] Falhas atribuídas ao produto estão reportadas com esperado e observado, sem asserção alterada.
- [ ] Nenhum `test.only`, `test.skip` ou asserção comentada ficou no código.
- [ ] Pontos em aberto que afetam o teste entregue estão citados no resumo.
