# Feature 2.13: Guia de Teste do Fluxo de Assinatura

## 🎯 Objetivo do Teste
Validar o fluxo completo de assinatura de canal, desde a seleção até a confirmação do pagamento (simulado).

## 📋 Pré-requisitos
1. Servidor rodando em `http://localhost:3000` ou `http://localhost:3001`
2. Navegador aberto em modo incógnito (para testar sem cache)
3. Console do navegador aberto (F12) para ver logs

## 🧪 Cenários de Teste

### Cenário 1: Fluxo Completo via Card (Usuário Não Logado)

#### Passo 1: Acessar a Listagem de Canais
1. Navegue para `http://localhost:3000/canais`
2. **Esperado**: Ver 12 cards de canais com filtros funcionando

#### Passo 2: Iniciar Assinatura via Card
1. Escolha qualquer canal (ex: "Futebol Europeu Premium")
2. Clique no botão **"Assinar Canal"** (botão azul à direita)
3. **Esperado**: Ser redirecionado para `/checkout/futebol-europeu-premium?source=channel-card`

#### Passo 3: Step de Autenticação
1. **Esperado**: Ver formulário de login/cadastro
2. **Teste Login Existente**:
   - Email: `cliente@example.com`
   - Senha: `password123`
   - Clique em "Entrar"
3. **OU Teste Novo Cadastro**:
   - Clique na aba "Criar conta"
   - Nome: `João Teste`
   - Email: `joao.teste@example.com`
   - Senha: `senha123`
   - Repetir senha: `senha123`
   - Clique em "Criar conta"
4. **Esperado**: Avançar automaticamente para próximo step

#### Passo 4: Seleção de Plano
1. **Esperado**: Ver os planos disponíveis do canal
2. Clique em qualquer plano (ex: "Trimestral" com desconto)
3. Note o valor e desconto aplicado
4. Clique em **"Continuar com o plano selecionado"**

#### Passo 5: Informações de Contato
1. **Preencher WhatsApp**: `(11) 98765-4321`
2. **Preencher Telegram**: `@joaoteste`
3. **Esperado**: Máscaras aplicadas automaticamente
4. Clique em **"Continuar"**

#### Passo 6: Dados de Faturamento
1. **CPF**: `123.456.789-00`
2. **CEP**: `01310-100` (aguarde busca automática)
3. **Esperado**: Endereço preenchido automaticamente:
   - Rua: Avenida Paulista
   - Bairro: Bela Vista
   - Cidade: São Paulo
   - Estado: SP
4. **Número**: `1000`
5. **Complemento**: `Apto 101` (opcional)
6. Deixe marcado ✓ "Salvar dados para próximas compras"
7. Clique em **"Continuar para pagamento"**

#### Passo 7: Método de Pagamento
1. **Teste Cartão de Crédito**:
   - Número: `4111 1111 1111 1111`
   - Nome: `JOAO TESTE`
   - Validade: `12/28`
   - CVV: `123`
   - **Esperado**: Detectar bandeira Visa automaticamente
2. **OU Teste PIX**: Clique na aba PIX e depois "Gerar QR Code PIX"
3. **OU Teste Boleto**: Clique na aba Boleto e depois "Gerar Boleto"
4. Clique em **"Continuar"**

#### Passo 8: Confirmação
1. **Esperado**: Ver resumo completo com:
   - Informações do canal
   - Plano selecionado e valor
   - Dados de contato
   - Endereço de faturamento
   - Método de pagamento escolhido
2. Marque ✓ "Li e aceito os termos de uso..."
3. Clique em **"Confirmar Assinatura"**
4. **Esperado**: Ver animações de processamento:
   - "Validando dados..."
   - "Processando pagamento..."
   - "Confirmando assinatura..."
   - "Concluído!"
5. **Resultado Final**: Redirecionamento para `/cliente/dashboard` com toast de sucesso

---

### Cenário 2: Fluxo via Página de Detalhes (Usuário Logado)

#### Passo 1: Login Prévio
1. Faça login com `cliente@example.com` / `password123`

#### Passo 2: Acessar Detalhes do Canal
1. Vá para `/canais`
2. Clique em **"Ver Detalhes"** de qualquer canal
3. **Esperado**: Ver página completa com gráfico, métricas, planos

#### Passo 3: Selecionar Plano Específico
1. Na seção "Planos de Assinatura", escolha um plano
2. Clique em **"Assinar Agora"** do plano escolhido
3. **Esperado**: Ir direto para checkout com plano pré-selecionado

#### Passo 4: Fluxo Reduzido
1. **Esperado**: Pular step de autenticação (já logado)
2. Ver plano já selecionado
3. Continuar do Step 2 (Contato) em diante
4. Seguir mesmos passos do Cenário 1

---

### Cenário 3: Recuperação de Checkout Abandonado

#### Passo 1: Iniciar e Abandonar
1. Comece qualquer fluxo de checkout
2. Preencha até o Step 3 (Contato)
3. Feche a aba/navegador

#### Passo 2: Recuperar Checkout
1. Volte ao mesmo canal
2. Clique em "Assinar Canal" novamente
3. **Esperado**: 
   - Ver toast "Recuperamos seus dados anteriores!"
   - Dados preenchidos automaticamente
   - Continuar de onde parou

---

## 🔍 Pontos de Validação

### Visual/UX
- [ ] Progress bar mostra avanço correto
- [ ] Animações suaves entre steps
- [ ] Sidebar visível no desktop com resumo
- [ ] Mobile: steps em tela cheia
- [ ] Loading states durante validações

### Funcionalidades
- [ ] Máscaras funcionando (WhatsApp, CPF, Cartão)
- [ ] Busca CEP automática
- [ ] Detecção de bandeira do cartão
- [ ] Validações bloqueiam avanço se campos inválidos
- [ ] Botão voltar funciona em todos os steps

### Dados
- [ ] Plano pré-selecionado quando vem da página de detalhes
- [ ] Dados salvos para "próximas compras"
- [ ] Recovery de checkout abandonado
- [ ] Leads capturados no localStorage

### Edge Cases
- [ ] Canal com apenas 1 plano
- [ ] Canal com 4 planos diferentes
- [ ] CPF inválido mostra erro
- [ ] CEP não encontrado permite preencher manual
- [ ] Cartão expirado mostra erro

---

## 📊 Verificação no Console

Abra o Console (F12) e verifique no localStorage:

```javascript
// Ver dados do checkout em andamento
localStorage.getItem('betlink_checkout_data')

// Ver leads capturados após conclusão
localStorage.getItem('captured_leads')

// Ver dados salvos de faturamento
localStorage.getItem('saved_billing_data')
```

---

## ❌ Bugs Conhecidos para Reportar

Se encontrar algum destes comportamentos, anote:

1. **Erro de navegação**: Não consegue acessar checkout
2. **Validação quebrada**: Campo aceita dados inválidos
3. **Loading infinito**: Fica travado em algum step
4. **Dados não salvos**: Recovery não funciona
5. **Mobile quebrado**: Layout não responsivo

---

## ✅ Critérios de Aprovação

O teste está aprovado se:

1. ✓ Conseguiu completar fluxo do início ao fim
2. ✓ Viu mensagem de sucesso final
3. ✓ Foi redirecionado para dashboard
4. ✓ Dados foram capturados (verificar console)
5. ✓ Não encontrou erros críticos
6. ✓ Performance aceitável (sem travamentos)

---

## 📝 Template de Reporte

```
TESTE FEATURE 2.13 - FLUXO DE ASSINATURA

Data: __/__/____
Testador: ___________

Cenários Testados:
[ ] Cenário 1 - Card (não logado)
[ ] Cenário 2 - Detalhes (logado)  
[ ] Cenário 3 - Recovery

Bugs Encontrados:
1. 
2.

Observações:


Status: [ ] Aprovado [ ] Reprovado
```