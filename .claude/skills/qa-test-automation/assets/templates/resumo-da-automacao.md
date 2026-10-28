# Resumo da automação

**Funcionalidade:** <nome da funcionalidade>
**Módulo:** mission-control | storefront
**Resultado geral:** Passou | Falhou (possível defeito do produto) | Não executado

## Rastreabilidade

| Cenário (Gherkin) | Regra de origem | Título do teste | Arquivo | Resultado |
|---|---|---|---|---|
| <nome do cenário> | <Rn ou —> | `should ...` | `playwright/e2e/<modulo>/<arquivo>.spec.ts` | Passou / Falhou / Não executado |

## Arquivos

| Arquivo | Ação | O que mudou |
|---|---|---|
| `playwright/e2e/<modulo>/<arquivo>.spec.ts` | criado / alterado | <testes acrescentados> |
| `playwright/support/pages/<modulo>/<tela>.page.ts` | criado / alterado | <locators e métodos> |
| `playwright/support/index.ts` | alterado | <registro em app.<grupo>> |
| `playwright/support/db.ts` / `types.ts` | alterado | <função ou campo novo e por quê> |

## Massa de teste

- IDs de missão usados: `LP-....`
- Preparação: <cleanMission / cleanAndInsertMission>

## Execução

- Comando: `npx playwright test <arquivo> --project=<modulo>`
- Repetição: `--repeat-each=3 --workers=1` → <resultado>
- Se não executado: <motivo, com a mensagem de erro>

## Observações

- **Textos observados, não definidos na especificação:** <texto> em <cenário>
- **Possíveis defeitos do produto:** <cenário> — esperado: <...>; observado: <...>
- **Divergências entre especificação e tela:** <pergunta: especificação, requisito ou produto?>
- **Sugestões de testabilidade:** <elemento sem papel, rótulo ou data-testid estável>
- **Pontos em aberto que afetam este teste:** <número e assunto de references/pontos-em-aberto.md>
