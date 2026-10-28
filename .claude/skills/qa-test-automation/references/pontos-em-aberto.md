# Pontos em aberto

Divergências entre a documentação, o código e as práticas de automação que ainda não têm decisão. Para cada uma, a skill segue o que o projeto faz hoje e **cita o ponto no resumo** quando ele afeta o teste entregue. Quando a equipe decidir, atualize este arquivo e as referências afetadas.

| # | Assunto | O que existe hoje | Divergência | Como a skill age até haver decisão |
|---|---|---|---|---|
| 1 | Título do teste | Todos os specs usam títulos em inglês com `should ...` | Os cenários estão em pt-BR (`docs/storefront.md`). Título em inglês perde a ligação direta com o nome do cenário | Segue o padrão `should ...` e lista, no resumo, a correspondência "cenário → título" |
| 2 | Navegação com URL completa | `LoginPage.go` e `HomePage.go` usam `http://localhost:3000/...` | `baseURL` está configurado nos dois projects e aparece em `docs/arquitetura.md` | Page Object **novo** navega com caminho relativo. Os existentes não são alterados |
| 3 | `baseURL` do Storefront | Igual ao do Mission Control, com `// TODO: confirmar baseURL do storefront` | Não se sabe se o Storefront terá outro endereço | Usa o `baseURL` atual, sem alterar o config. Se a vitrine não responder nele, para e pergunta |
| 4 | `getByText` | Não está na diretriz de seletores de `docs/arquitetura.md` (role → label → placeholder → testId) | `docs/lunarpass-analise-de-aderencia.md` lista `getByText` entre os seletores semânticos | Segue a arquitetura. Se só `getByText` identificar o elemento, usa e registra no resumo como decisão a confirmar |
| 5 | Seletores por atributo | A arquitetura não prevê `page.locator('[atributo=...]')` | A análise de aderência sugere `data-mission-code` e `a[href="/booking/..."]`, mas como pedido ao produto, não como algo que já existe | Só usa se a descoberta de tela mostrar o atributo e nada da diretriz servir; registra no resumo |
| 6 | `expect` em Page Object | `LoginPage.go` e `RegisterPage.submit` usam `expect` como guarda de sincronização | A arquitetura não fala do assunto | Resultado esperado do cenário fica sempre no spec. Guarda de sincronização em ação de Page Object é aceita, no mesmo estilo dos existentes |
| 7 | Comentários AAA | Só `login.spec.ts` (primeiro teste) tem `// Arrange`, `// Act`, `// Assert` | A arquitetura cita AAA, sem exigir comentários | Separa as partes por linha em branco; usa os comentários apenas em arquivo que já os usa |
| 8 | Massa além de missões | `db.ts` só cria missões; reservas e tickets só são apagados | Cenários do Storefront (assento ocupado, missão esgotada, pagamento) precisam de reservas/tickets, cuja estrutura não está tipada | Não inventa colunas: pergunta ou confirma a estrutura antes de criar funções de inserção |
| 9 | Login a cada teste | Mission Control faz login pela tela no `beforeEach` | `storageState` está na seção 6 da arquitetura como não priorizado | Faz login pela tela, como os specs atuais |
| 10 | Massa compartilhada no Storefront | A vitrine mostra missões de todos os testes | Testes do Mission Control rodando em paralelo podem criar missões que aparecem na vitrine | Nunca verifica contagem total nem posição; localiza a missão do próprio teste |
