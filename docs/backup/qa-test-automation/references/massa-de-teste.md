# Massa de teste

Testes automatizados costumam rodar em paralelo e sobre ambientes compartilhados. Por isso, cada teste cria os próprios dados, verifica só os próprios dados e limpa o que criou.

O mecanismo (banco, API, fixture de reset ou tela), as funções disponíveis e a regra de identificadores vêm dos modelos em `assets/projeto/`: o utilitário de massa, os tipos e os specs que já preparam dados.

## Regras

1. **Identificador exclusivo por cenário.** Siga o formato dos identificadores que o projeto já usa. Antes de escolher, procure no repositório os que estão em uso e não repita nenhum.
2. **Estado conhecido antes do teste:** limpe e crie os dados de que o cenário precisa antes de agir.
3. **Limpeza depois do teste:** remova o que o teste criou, inclusive em caso de falha (`test.afterEach` ou bloco de limpeza equivalente).
4. **Dados válidos para as regras que não estão em teste:** datas futuras, valores positivos, referências que existem.
5. **Em listas compartilhadas, nunca verifique contagem total nem posição.** Localize o item do teste pelo identificador e verifique dentro dele.
6. **Não altere dados que o teste não criou**, como usuários de demonstração e cadastros de referência.

## Quando falta uma função de massa

Se o cenário precisa de um estado que as funções atuais não criam:

1. Confirme no código existente quais estruturas estão envolvidas (tabelas, rotas, campos). Não invente.
2. Acrescente a função no utilitário de massa do projeto, no mesmo estilo das demais.
3. Se precisar de campos novos nos tipos, complete os tipos do projeto.
4. Registre no resumo o que foi acrescentado e por quê.
5. Se não for possível descobrir a estrutura com segurança, pergunte.

Nunca altere a conexão com o banco, endereços de API nem credenciais.
