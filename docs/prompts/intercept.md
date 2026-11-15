# Documentação — Endpoint de Pagamento

## 1. Endpoint

Realiza o processamento de pagamentos por cartão de crédito utilizando um simulador de pagamentos.

- **Método:** `POST`
- **URL:**
  `https://eabhzggqboxlgzberbpb.supabase.co/functions/v1/stripe-payment`

## 2. Payload da requisição

### Exemplo

```json
{
  "missionId": "LP-0128A",
  "seats": ["B2"],
  "contactEmail": "lauro.resende@dev.com",
  "cardName": "Lauro Resende",
  "cardNumber": "378282246310005",
  "expiry": "12/31",
  "cvv": "342",
  "totalPrice": 1000
}
```

### Descrição dos campos

| Campo | Tipo | Descrição |
|---|---|---|
| `missionId` | String | Identificador da missão. |
| `seats` | Array de strings | Assentos selecionados. |
| `contactEmail` | String | E-mail de contato do cliente. |
| `cardName` | String | Nome impresso no cartão. |
| `cardNumber` | String | Número do cartão de crédito. |
| `expiry` | String | Data de validade do cartão (MM/AA). |
| `cvv` | String | Código de segurança do cartão. |
| `totalPrice` | Number | Valor total do pagamento. |

## 3. Cartões de teste

Utilize os cartões abaixo para simular diferentes cenários de pagamento.

| Número do cartão | Bandeira | Resultado esperado |
|---|---|---|
| `4242 4242 4242 4242` | Visa | Pagamento aprovado. |
| `5555 5555 5555 4444` | Mastercard | Pagamento aprovado. |
| `3782 822463 10005` | American Express | Pagamento aprovado. |
| `4000 0000 0000 0002` | Visa | Pagamento negado pelo simulador. |
| `4000 0000 0000 0127` | Visa | Dados do cartão incorretos. |

## 4. Respostas da API

### 4.1. Pagamento aprovado

**Status:** `approved`

Indica que o pagamento foi processado com sucesso.

**Response:**

```json
{
  "status": "approved",
  "message": "Pagamento aprovado.",
  "brand": "American Express",
  "paymentId": "pi_3Uc4hjDEGZxgCFUp0N4fVJhK"
}
```

### 4.2. Pagamento negado

**Status:** `declined`

Indica que o pagamento foi negado pela operadora do cartão.

**Response:**

```json
{
  "status": "declined",
  "message": "Pagamento negado pela operadora do cartão.",
  "brand": "Visa"
}
```

### 4.3. Dados do cartão incorretos

**Status:** `incorrect_card_data`

Indica que os dados informados para o cartão são inválidos ou incorretos.

**Response:**

```json
{
  "status": "incorrect_card_data",
  "message": "Dados do cartão incorretos.",
  "brand": "Visa"
}
```

## 5. Resumo dos possíveis status

| Status | Descrição |
|---|---|
| `approved` | Pagamento aprovado com sucesso. |
| `declined` | Pagamento negado pela operadora do cartão. |
| `incorrect_card_data` | Dados do cartão incorretos. |

## 6. Fluxo de processamento

1. O cliente seleciona a missão e os assentos desejados.
2. O cliente informa seus dados de contato e do cartão.
3. A aplicação envia uma requisição `POST` para o endpoint de pagamento.
4. A API processa a solicitação e retorna o resultado.
5. A aplicação interpreta o campo `status` da resposta.
6. Conforme o resultado, a aplicação apresenta a confirmação do pagamento ou a mensagem de erro correspondente.

## 7. Observações

- Os cartões apresentados são utilizados para testes no ambiente de simulação.
- O campo `paymentId` é retornado quando o pagamento é aprovado.
- O campo `brand` identifica a bandeira do cartão utilizado.
- A aplicação deve tratar individualmente cada status retornado pela API.
- Os dados sensíveis do cartão, especialmente o CVV e o número completo, não devem ser armazenados em logs ou persistidos desnecessariamente.