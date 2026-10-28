# Exemplo: cupom expirado (loja virtual fictícia)

Exemplo genérico para calibrar a skill. A loja, as telas e os textos são fictícios.

## 1. O cenário

**Funcionalidade:** Cupom de desconto

**Contexto:**
**Dado** que meu carrinho tem R$ 200 em produtos

**Cenário:** Aplicar um cupom expirado
**Quando** eu aplico um cupom que já expirou
**Então** eu sou informado de que o cupom está fora do prazo de validade
**E** o total da minha compra continua R$ 200

## 2. Leitura do cenário

| Parte | Tradução para o teste |
|---|---|
| Contexto | Carrinho com R$ 200 criado pelo mecanismo de massa do projeto, no `beforeEach` |
| Quando | Cupom expirado criado pela massa do teste e aplicado pela tela do carrinho |
| Então | Mensagem de cupom expirado, com o texto exato que a tela mostra |
| E | Total do carrinho igual a R$ 200 |

## 3. Descoberta de tela

Com o Playwright MCP, a tela do carrinho mostra um campo com o rótulo "Cupom", um botão "Aplicar", um alerta com o texto "Este cupom expirou." e o total com o identificador `cart-total`.

## 4. O Page Object

```ts
import { Page, Locator } from '@playwright/test'

export class CartPage {
    readonly page: Page
    readonly couponInput: Locator
    readonly applyButton: Locator
    readonly alert: Locator
    readonly total: Locator

    constructor(page: Page) {
        this.page = page
        this.couponInput = page.getByLabel('Cupom')
        this.applyButton = page.getByRole('button', { name: 'Aplicar' })
        this.alert = page.getByRole('alert')
        this.total = page.getByTestId('cart-total')
    }

    async go(cartId: string) {
        await this.page.goto(`/cart/${cartId}`)
    }

    async applyCoupon(code: string) {
        await this.couponInput.fill(code)
        await this.applyButton.click()
    }
}
```

## 5. O teste

```ts
import { test, expect } from '../support'

import { createCart, deleteCart, createCoupon, deleteCoupon } from '../support/data'

const cart = { id: 'CART-0042', total: 200.00 }
const coupon = { code: 'EXPIRADO42', discount: 10, expiresAt: '2020-01-01' }

test.beforeEach(async () => {
  await deleteCart(cart.id)
  await createCart(cart)
  await deleteCoupon(coupon.code)
  await createCoupon(coupon)
})

test.afterEach(async () => {
  await deleteCart(cart.id)
  await deleteCoupon(coupon.code)
})

test('Aplicar um cupom expirado', async ({ app }) => {
  // Arrange - Dado
  await app.cartPage.go(cart.id)

  // Act - Quando
  await app.cartPage.applyCoupon(coupon.code)

  // Assert - Então
  await expect(app.cartPage.alert).toHaveText('Este cupom expirou.')

  // Assert - E
  await expect(app.cartPage.total).toHaveText('R$ 200,00')
})
```

## 6. O que observar

- O título é o nome do cenário, palavra por palavra.
- Cada **Então** e cada **E** tem exatamente uma asserção.
- Carrinho e cupom são exclusivos do teste, criados antes e removidos depois, mesmo se o teste falhar.
- O Page Object não tem `expect`, dados de teste nem endereço completo.
- "Este cupom expirou." não estava na especificação: é texto observado e vai para o resumo.
