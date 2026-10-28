# Diagnóstico de falhas

Usado ao rodar um teste recém-criado (passo 7) e no modo `corrigir`.

## Onde olhar

1. A mensagem de erro no terminal: qual linha, qual locator, o esperado e o recebido.
2. O `error-context.md` da pasta `test-results/` do teste: o estado da página no momento da falha.
3. O screenshot da falha, na mesma pasta.
4. O relatório HTML (`npx playwright show-report`).
5. Se ainda houver dúvida, reproduza o caminho com o Playwright MCP.

## Classifique a causa antes de mexer

| Causa | Sinais típicos | O que fazer |
|---|---|---|
| **Locator** | Elemento não encontrado; locator encontra mais de um elemento; a tela mudou o texto ou o papel | Corrija o locator no Page Object, pela ordem de prioridade |
| **Sincronização** | Passa às vezes; falha ao agir antes da tela terminar de carregar | Espere pelo estado visível certo. Nunca use espera fixa |
| **Dados** | Conflito de identificador, registro inexistente, sobra de execução anterior, dependência de dados de outro teste | Corrija a preparação e a limpeza (ver `massa-de-teste.md`) |
| **Ambiente** | Aplicação fora do ar; banco inacessível (`getaddrinfo ENOTFOUND` no endereço do banco); navegador não instalado (`Executable doesn't exist`) | Não altere o teste nem a conexão. Reporte com a mensagem e entregue como "não executado". Navegador ausente se resolve com `npx playwright install chromium`, com autorização do usuário |
| **Produto** | A tela mostra um resultado diferente do **Então** de forma consistente | Não altere a asserção. Reporte como possível defeito, com esperado e observado |

## Regras da correção

- Corrija só a causa identificada. Uma correção por vez, rodando de novo depois de cada uma.
- **Nunca** altere asserção, valor esperado ou título para o teste passar.
- **Nunca** use `test.skip`, `retries` ou comentários para esconder a falha.
- Teste instável: rode o arquivo algumas vezes seguidas, em série (`--repeat-each=5 --workers=1`), para confirmar a instabilidade antes e a estabilidade depois. Em paralelo, repetições do mesmo teste usam os mesmos identificadores e podem colidir nos dados (ex.: `duplicate key value violates unique constraint`); isso não é instabilidade do teste.
- Se a causa não ficar clara, entregue o diagnóstico com as evidências e as hipóteses, sem alterar o código.
