# Feature 2.13: Script de Teste Automatizado com Playwright

## Instruções para Cursor com MCP Playwright

Este documento contém os comandos exatos para testar a Feature 2.13 usando o MCP Playwright.

## Preparação

```
1. Abrir o navegador Playwright
2. Navegar para http://localhost:3001
```

## Cenário 1: Fluxo Completo via Card (Usuário Não Logado)

### Comandos Sequenciais:

```
# 1. Navegar para página de canais
browser_navigate url="http://localhost:3001/canais"
browser_wait_for time=2

# 2. Tirar screenshot da listagem
browser_take_screenshot filename="01-canais-listagem.png"

# 3. Clicar em "Assinar Canal" do primeiro canal
browser_click element="Botão Assinar Canal do primeiro card" ref="button:has-text('Assinar Canal'):first"

# 4. Aguardar página de checkout carregar
browser_wait_for text="Faça login ou crie sua conta"

# 5. Screenshot do step de auth
browser_take_screenshot filename="02-checkout-auth.png"

# 6. Preencher login
browser_type element="Campo de email do login" ref="input[id='email-login']" text="cliente@example.com"
browser_type element="Campo de senha do login" ref="input[id='password-login']" text="password123"
browser_take_screenshot filename="03-login-preenchido.png"

# 7. Clicar em Entrar
browser_click element="Botão Entrar" ref="button:has-text('Entrar')"
browser_wait_for time=2

# 8. Aguardar step de planos
browser_wait_for text="Escolha seu plano de assinatura"
browser_take_screenshot filename="04-selecao-planos.png"

# 9. Selecionar plano trimestral (se existir)
browser_click element="Radio button do plano trimestral" ref="label:has-text('Trimestral')"
browser_wait_for time=1

# 10. Continuar com plano
browser_click element="Botão continuar com plano" ref="button:has-text('Continuar com o plano selecionado')"
browser_wait_for time=1

# 11. Preencher contato
browser_wait_for text="Informações de Contato"
browser_type element="Campo WhatsApp" ref="input[id='whatsapp']" text="11987654321"
browser_type element="Campo Telegram" ref="input[id='telegram']" text="@joaoteste"
browser_take_screenshot filename="05-contato-preenchido.png"

# 12. Continuar
browser_click element="Botão continuar" ref="button:has-text('Continuar'):visible"
browser_wait_for time=1

# 13. Preencher dados de faturamento
browser_wait_for text="Informações de Faturamento"
browser_type element="Campo CPF" ref="input[id='cpf']" text="12345678900"

# 14. Preencher CEP e aguardar busca
browser_type element="Campo CEP" ref="input[id='zipCode']" text="01310100"
browser_wait_for time=2

# 15. Preencher número
browser_type element="Campo número" ref="input[id='number']" text="1000"
browser_type element="Campo complemento" ref="input[id='complement']" text="Apto 101"
browser_take_screenshot filename="06-faturamento-preenchido.png"

# 16. Continuar para pagamento
browser_click element="Botão continuar para pagamento" ref="button:has-text('Continuar para pagamento')"
browser_wait_for time=1

# 17. Preencher cartão
browser_wait_for text="Método de Pagamento"
browser_type element="Campo número do cartão" ref="input[id='number']" text="4111111111111111"
browser_type element="Campo nome no cartão" ref="input[id='holder']" text="JOAO TESTE"
browser_type element="Campo validade" ref="input[id='expiry']" text="1228"
browser_type element="Campo CVV" ref="input[id='cvv']" text="123"
browser_take_screenshot filename="07-pagamento-cartao.png"

# 18. Continuar
browser_click element="Botão continuar" ref="button:has-text('Continuar'):visible"
browser_wait_for time=1

# 19. Página de confirmação
browser_wait_for text="Revise e Confirme sua Assinatura"
browser_take_screenshot filename="08-confirmacao-resumo.png"

# 20. Aceitar termos
browser_click element="Checkbox dos termos" ref="input[id='terms']"

# 21. Confirmar assinatura
browser_click element="Botão confirmar assinatura" ref="button:has-text('Confirmar Assinatura')"

# 22. Aguardar processamento
browser_wait_for text="Validando dados"
browser_wait_for text="Processando pagamento"
browser_wait_for text="Confirmando assinatura"
browser_wait_for time=5

# 23. Screenshot final
browser_take_screenshot filename="09-sucesso-final.png"
```

## Cenário 2: Fluxo via Página de Detalhes (Usuário Logado)

```
# 1. Fazer login primeiro
browser_navigate url="http://localhost:3001/auth/login"
browser_type element="Campo email" ref="input[id='email']" text="cliente@example.com"
browser_type element="Campo senha" ref="input[id='password']" text="password123"
browser_click element="Botão login" ref="button:has-text('Login')"
browser_wait_for time=2

# 2. Ir para canais
browser_navigate url="http://localhost:3001/canais"
browser_wait_for time=2

# 3. Clicar em Ver Detalhes
browser_click element="Botão ver detalhes do primeiro canal" ref="button:has-text('Ver Detalhes'):first"
browser_wait_for time=2

# 4. Screenshot da página de detalhes
browser_take_screenshot filename="10-pagina-detalhes.png"

# 5. Rolar até planos
browser_evaluate function="() => document.getElementById('subscription-plans').scrollIntoView()"

# 6. Clicar em Assinar Agora de um plano
browser_click element="Botão assinar do plano trimestral" ref="button:has-text('Assinar Agora'):nth(1)"

# 7. Verificar que pulou auth
browser_wait_for text="Escolha seu plano de assinatura"
browser_take_screenshot filename="11-checkout-sem-auth.png"

# Continue com os passos de contato em diante...
```

## Cenário 3: Recuperação de Abandono

```
# 1. Iniciar checkout e abandonar
browser_navigate url="http://localhost:3001/canais"
browser_click element="Botão assinar canal" ref="button:has-text('Assinar Canal'):first"
browser_wait_for time=1

# 2. Fazer login
browser_type element="Campo email login" ref="input[id='email-login']" text="cliente@example.com"
browser_type element="Campo senha login" ref="input[id='password-login']" text="password123"
browser_click element="Botão entrar" ref="button:has-text('Entrar')"
browser_wait_for time=2

# 3. Preencher apenas contato
browser_type element="Campo WhatsApp" ref="input[id='whatsapp']" text="11999998888"
browser_type element="Campo Telegram" ref="input[id='telegram']" text="@testeabandon"

# 4. Fechar aba simulando abandono
browser_navigate url="http://localhost:3001"
browser_wait_for time=1

# 5. Voltar ao checkout do mesmo canal
browser_navigate url="http://localhost:3001/canais"
browser_click element="Botão assinar do mesmo canal" ref="button:has-text('Assinar Canal'):first"

# 6. Verificar se dados foram recuperados
browser_wait_for time=2
browser_take_screenshot filename="12-checkout-recuperado.png"
```

## Verificações no Console

```
# Executar no console para verificar dados salvos
browser_evaluate function="() => console.log('Checkout data:', localStorage.getItem('betlink_checkout_data'))"
browser_evaluate function="() => console.log('Captured leads:', localStorage.getItem('captured_leads'))"
browser_evaluate function="() => console.log('Saved billing:', localStorage.getItem('saved_billing_data'))"
```

## Comandos Úteis

```
# Tirar screenshot da página inteira
browser_take_screenshot fullPage=true filename="full-page.png"

# Verificar se elemento existe
browser_snapshot
# Procurar por elementos específicos no snapshot

# Aguardar elemento específico
browser_wait_for text="Texto esperado"

# Verificar URL atual
browser_evaluate function="() => window.location.href"
```

## Validações Importantes

1. **Máscaras**: WhatsApp deve mostrar (11) 98765-4321
2. **CEP**: Deve buscar endereço automaticamente
3. **Cartão**: Deve detectar bandeira Visa
4. **Progress Bar**: Deve mostrar avanço correto
5. **Mobile**: Testar com viewport menor
   ```
   browser_resize width=375 height=812
   ```

## Relatório Final

Após executar todos os testes, gerar relatório:

```
# Listar todos os screenshots
browser_evaluate function="() => console.log('Teste completo em:', new Date().toISOString())"

# Verificar erros no console
browser_console_messages
```

---

**NOTA**: Execute cada comando individualmente e aguarde a resposta antes de prosseguir. Tire screenshots em pontos-chave para documentação.