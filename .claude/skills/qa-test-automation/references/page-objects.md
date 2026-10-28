# Page Objects

Um Page Object representa uma tela (ou um componente) e expõe o que o usuário faz nela. O teste deve ler como o cenário.

## Onde fica

| Situação | Pasta | Nome |
|---|---|---|
| Tela de um módulo | `playwright/support/pages/<modulo>/` | `<tela>.page.ts`, classe `<Tela>Page` |
| Componente usado só por um módulo (ex.: barra de navegação) | `playwright/support/pages/<modulo>/` | `<componente>.ts`, classe `<Componente>` |
| Componente usado de fato por dois ou mais módulos | `playwright/support/pages/shared/` | `<componente>.ts`, classe `<Componente>` |

Um componente só vai para `shared/` quando outro módulo **comprovadamente** o usa (`docs/arquitetura.md`, seções 3.2 e 5).

## Registro na fixture

Em `playwright/support/index.ts`:

1. Importe a classe no bloco de imports do módulo.
2. Acrescente a instância no grupo do módulo em `createApp`, com nome em camelCase:

```typescript
store: {
    homePage: new HomePage(page),
    missionsPage: new MissionsPage(page),
},
```

Não crie grupo novo nem mude a estrutura da fixture sem pedido.

## Regras para Page Objects novos

1. **Estilo dos vizinhos:** import `{ Page, Locator } from '@playwright/test'`, 4 espaços, sem ponto e vírgula, aspas simples, linha em branco após `export class`, construtor recebendo `page: Page` e guardando em `this.page`.
2. **Locators que o teste verifica ou usa direto são propriedades `readonly`**, criadas no construtor, na ordem de `descoberta-de-tela.md`.
3. **Ações são métodos** com o nome da ação e dados por parâmetro (`go()`, `login(email, password)`, `submit(mission: Mission)`). Locators usados só dentro de uma ação podem ficar no método, como em `LoginPage.login`.
4. **Massa tipada:** quando a ação recebe uma missão, use o tipo `Mission` de `../../types`.
5. **Elementos que dependem de dado viram método** que devolve `Locator` (ex.: o item de uma missão específica a partir do ID).
6. **Navegação por caminho relativo** (`this.page.goto('/mission-control/...')`), apoiada no `baseURL` (ponto em aberto 2).
7. **Nenhum resultado esperado do cenário dentro do Page Object.** `expect` só como guarda de sincronização dentro de uma ação, como `LoginPage.go` e `RegisterPage.submit` fazem (ponto em aberto 6).
8. **Sem dados de teste nem credenciais** no Page Object.
9. **Sem espera fixa.**
10. **Sem classe base, herança ou abstração nova.**

## Page Objects que já existem

Não os refatore. Eles têm detalhes que esta skill não repete em arquivo novo (URL completa em `go()`), mas que não devem ser corrigidos sem pedido.

Ao completar um Page Object existente:
- Acrescente locators e métodos sem mudar o comportamento dos que existem.
- Mantenha o estilo do arquivo.
- Se precisar mudar algo existente, pergunte antes.

## Reutilizar ou criar?

| Situação | Decisão |
|---|---|
| A tela já tem Page Object | Reutilize e complete |
| Toast de feedback | `app.toast.message` (já existe em `shared/toast.ts`) |
| Botão "Sair" ou outro item da barra do Mission Control | `app.mission.navbar` |
| Elemento que aparece em várias telas de um mesmo módulo | Componente do módulo |
| Tela nova | Page Object novo, registrado no grupo do módulo |
