# Diagnóstico de falhas

Usado ao rodar um teste recém-criado (passo 7) e no modo `corrigir`.

## Onde olhar

1. A mensagem de erro no terminal: qual linha, qual locator, o esperado e o recebido.
2. O `error-context.md` da pasta do teste em `test-results/`: o estado da página no momento da falha.
3. O screenshot da falha, na mesma pasta (`screenshot: 'only-on-failure'`).
4. O relatório HTML: `npx playwright show-report`.
5. Trace só existe em retentativa (`trace: 'on-first-retry'`) e localmente `retries` é 0. Não altere o config para obter trace; se precisar, use `--trace on` na linha de comando e diga no resumo.
6. Se ainda houver dúvida, reproduza o caminho com o Playwright MCP.

## Classifique a causa antes de mexer

| Causa | Sinais típicos | O que fazer |
|---|---|---|
| **Locator** | Elemento não encontrado; locator encontra mais de um elemento (ex.: `getByRole('alert')` ou `getByRole('listitem')` com vários na tela); a tela mudou o texto ou o papel | Corrija o locator no Page Object, pela ordem de `docs/arquitetura.md` |
| **Sincronização** | Passa às vezes; falha ao agir antes da tela terminar de carregar | Espere pelo estado visível certo. Nunca use espera fixa |
| **Dados** | `duplicate key value violates unique constraint`; "Já existe uma missão com este ID." num teste que não esperava; ID repetido em outro spec; missão de outro teste aparecendo na vitrine | Corrija a preparação (`cleanMission` / `cleanAndInsertMission`) e a exclusividade do ID (ver `massa-de-teste.md`) |
| **Ambiente** | Aplicação fora do ar em `localhost:3000` (`net::ERR_CONNECTION_REFUSED`); banco inacessível (`getaddrinfo ENOTFOUND` no endereço do Supabase); navegador não instalado (`Executable doesn't exist`) | Não altere o teste, o config nem a conexão. Reporte com a mensagem e entregue como "não executado". Navegador ausente se resolve com `npx playwright install chromium`, com autorização do usuário |
| **Produto** | A tela mostra um resultado diferente do **Então** de forma consistente | Não altere a asserção. Reporte como possível defeito, com esperado e observado |

## Regras da correção

- Corrija só a causa identificada. Uma correção por vez, rodando de novo depois de cada uma.
- **Nunca** altere asserção, valor esperado ou título para o teste passar.
- **Nunca** use `test.skip`, `retries` ou comentários para esconder a falha.
- Teste instável: rode o arquivo algumas vezes seguidas, em série, para confirmar a instabilidade antes e a estabilidade depois:
  `npx playwright test playwright/e2e/<modulo>/<arquivo>.spec.ts --project=<modulo> --repeat-each=5 --workers=1`.
  Em paralelo, repetições do mesmo teste usam o mesmo ID de missão e colidem no banco; isso não é instabilidade do teste.
- Falha em Page Object existente: corrija o mínimo necessário (normalmente o locator) e cite no resumo. Não aproveite para refatorar (ex.: não troque a URL completa de `go()`).
- Se a causa não ficar clara, entregue o diagnóstico com as evidências e as hipóteses, sem alterar o código.
