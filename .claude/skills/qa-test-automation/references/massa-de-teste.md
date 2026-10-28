# Massa de teste

A suíte roda com `fullyParallel: true`, sobre um banco compartilhado (Supabase). Por isso, cada teste usa as próprias missões, com ID exclusivo, preparadas direto no banco pelas funções de `playwright/support/db.ts` (`docs/arquitetura.md`, pilares 3 e 5).

## Funções disponíveis

| Função | O que faz |
|---|---|
| `cleanMission(mission)` | Apaga reservas, tickets e a missão com o ID informado |
| `cleanAndInsertMission(mission)` | `cleanMission` seguido de `insertMission` |
| `insertMission(mission)` | Insere a missão |
| `deleteMission(id)` | Apaga a missão |
| `deleteReservation(missionId)` | Apaga as reservas da missão |
| `deleteTicket(missionId)` | Apaga os tickets da missão |

Tipo da missão (`playwright/support/types.ts`):

```typescript
export interface Mission {
    id: string,
    rocket: string,
    baseId: string,
    departureDate: string,  // 'AAAA-MM-DD'
    returnDate: string,     // 'AAAA-MM-DD'
    price: number
}
```

## Regras

1. **ID exclusivo por teste**, no formato `LP-` + 4 dígitos + letra (`LP-0128A`, `LP-3001A`). Antes de escolher, rode `grep -rn "LP-[0-9]" playwright docs` e não repita nenhum, inclusive `LP-0127A`, citado na documentação.
2. **Estado conhecido antes de agir**, como o projeto faz:
   - a missão será criada pela tela → `await cleanMission(mission)` no Arrange;
   - a missão precisa existir → `await cleanAndInsertMission(mission)` no Arrange.
3. **Nunca limpe depois do teste.** Decisão do projeto: a limpeza acontece só antes de agir. Assim, quando um teste falha, os dados ficam no banco para o QA analisar. Não use `afterEach` (nem `afterAll`) para apagar massa.
4. **Dados válidos para as regras que não estão em teste:** datas futuras, `returnDate` 7 dias depois de `departureDate` (missões de ida e volta de 7 dias, R1 de `docs/storefront.md`), preço positivo, `baseId` existente (`aurora` e `orion` já usados).
5. **Dados inválidos gerados** podem usar `@faker-js/faker`, como em `register.spec.ts`.
6. **No Storefront, nunca verifique contagem total nem posição** de missões. Localize a missão semeada pelo teste e verifique dentro dela.
7. **Não altere dados que o teste não criou:** o usuário `buzz@lunarpass.dev`, as bases lunares e missões de outros testes.

## Quando falta uma função de massa

Se o cenário precisa de um estado que as funções atuais não criam (ex.: reserva, ticket, assento ocupado, missão esgotada):

1. Confirme no código existente quais tabelas e colunas estão envolvidas. Os tipos `Reservation` e `Ticket` hoje só têm `missionId`: isso não basta para inserir. Não invente colunas.
2. Com a estrutura confirmada pelo usuário ou por fonte do projeto, acrescente a função em `db.ts`, na seção do assunto (`// ---- reservations ----`, `// ---- tickets ----`), no estilo das demais (`db.insertInto(...).values(...).execute()`).
3. Complete os tipos em `types.ts` e a interface `Database` de `db.ts`, se precisar.
4. Registre no resumo o que foi acrescentado e por quê.
5. Se não for possível descobrir a estrutura com segurança, pergunte.

Nunca altere a conexão com o banco (`connectionString`, `ssl`) nem a copie para outro lugar. Não acrescente `db.destroy()` nem factories (seção 6 da arquitetura).
