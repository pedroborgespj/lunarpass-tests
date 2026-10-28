# Page Objects

Um Page Object representa uma tela e expõe o que o usuário faz nela. O teste deve ler como o cenário.

Pasta, nome dos arquivos, estilo e forma de registro vêm dos modelos em `assets/projeto/` (Page Objects e fixture). As regras abaixo valem para os Page Objects que você cria.

## Regras para Page Objects novos

1. **Um arquivo por tela**, com a classe `<Tela>Page` e o construtor recebendo `page: Page`.
2. **Locators como propriedades `readonly`**, criados no construtor, seguindo a ordem de `descoberta-de-tela.md`.
3. **Elementos que dependem de dado viram método.** Exemplo: o item de um pedido específico vira `orderItem(orderId)`, devolvendo um `Locator`.
4. **Métodos são ações do usuário**, com o nome da ação: `go()`, `applyCoupon(code)`, `continue()`. Recebem dados por parâmetro.
5. **Navegação por caminho relativo**, apoiada no `baseURL` da configuração. Nunca com o endereço completo.
6. **Sem `expect` dentro do Page Object.** As asserções ficam no teste, sobre os locators expostos.
7. **Sem dados de teste nem credenciais** no Page Object.
8. **Sem espera fixa.** Se uma ação precisa aguardar algo, aguarde um estado visível do próprio elemento.
9. Siga a indentação e o estilo dos arquivos vizinhos.

## Page Objects que já existem

Projetos reais têm Page Objects escritos com outros padrões. **Não os refatore.** As regras acima valem para o que você cria.

Ao completar um Page Object existente:
- Acrescente locators e métodos sem mudar o comportamento dos que existem.
- Mantenha o estilo do arquivo.
- Se precisar mudar algo existente, pergunte antes.

## Reutilizar ou criar?

| Situação | Decisão |
|---|---|
| A tela já tem Page Object | Reutilize e complete |
| O elemento é usado por mais de uma área do sistema | Componente compartilhado |
| O elemento aparece em várias telas de uma área (ex.: barra de navegação) | Componente da área |
| Tela nova | Page Object novo, registrado na fixture |

Modelo: os Page Objects de `assets/projeto/`, respeitando as regras acima.
