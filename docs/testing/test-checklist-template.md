# Checklist de Testes - Template para Futuras Features

## Como usar este template

Copie este checklist para cada nova feature e marque os itens conforme realizar os testes. Nem todos os itens se aplicam a todas as features - marque N/A quando não aplicável.

## Informações Básicas

- **Feature**: [Nome da Feature]
- **EPIC**: [Número do EPIC]
- **Data**: [Data do teste]
- **Testador**: [Nome]
- **Ambiente**: [Dev/Staging/Prod]

## 1. Testes Funcionais

### 1.1 Requisitos da Feature
- [ ] Todos os requisitos implementados
- [ ] Funcionalidade principal testada
- [ ] Casos extremos (edge cases) testados
- [ ] Validações funcionando

### 1.2 Integração
- [ ] Integração com features existentes
- [ ] Sem quebra de funcionalidades anteriores
- [ ] APIs respondendo corretamente
- [ ] Dados salvos corretamente no banco

## 2. Testes de Interface

### 2.1 Desktop
- [ ] Layout correto em 1920x1080
- [ ] Layout correto em 1366x768
- [ ] Hover states funcionais
- [ ] Animações suaves

### 2.2 Mobile
- [ ] Layout correto em 375x667 (iPhone SE)
- [ ] Layout correto em 390x844 (iPhone 12)
- [ ] Touch targets adequados (min 44x44px)
- [ ] Sem scroll horizontal

### 2.3 Tablet
- [ ] Layout correto em 768x1024 (iPad)
- [ ] Adaptação desktop/mobile apropriada

## 3. Testes de UX

### 3.1 Usabilidade
- [ ] Fluxo intuitivo
- [ ] Feedback visual para ações
- [ ] Mensagens de erro claras
- [ ] Loading states apropriados

### 3.2 Acessibilidade
- [ ] Navegação por teclado
- [ ] ARIA labels quando necessário
- [ ] Contraste adequado
- [ ] Textos alternativos em imagens

## 4. Testes de Segurança

### 4.1 Autenticação/Autorização
- [ ] Acesso restrito conforme roles
- [ ] Redirecionamentos corretos
- [ ] Sem exposição de dados sensíveis

### 4.2 Validação
- [ ] Inputs sanitizados
- [ ] Proteção contra XSS
- [ ] Validação server-side

## 5. Testes de Performance

- [ ] Tempo de carregamento < 3s
- [ ] Sem memory leaks
- [ ] Otimização de imagens
- [ ] Bundle size aceitável

## 6. Testes de Compatibilidade

### 6.1 Browsers
- [ ] Chrome
- [ ] Firefox
- [ ] Safari
- [ ] Edge

### 6.2 Dispositivos
- [ ] Desktop Windows
- [ ] Desktop Mac
- [ ] Android
- [ ] iOS

## 7. Testes de Logging

- [ ] Eventos importantes logados
- [ ] Erros capturados com contexto
- [ ] Sem console.log em produção
- [ ] Logs de auditoria quando aplicável

## 8. Regressão

- [ ] Login/Logout funcionando
- [ ] Navegação principal intacta
- [ ] Features anteriores funcionais
- [ ] Sem erros no console

## 9. Documentação

- [ ] README atualizado
- [ ] Código comentado quando necessário
- [ ] Guia de uso criado
- [ ] CLAUDE.md atualizado

## 10. Preparação para Deploy

- [ ] Build sem erros
- [ ] Lint sem warnings críticos
- [ ] Variáveis de ambiente documentadas
- [ ] Migrations prontas

## Observações

[Adicione aqui quaisquer observações, problemas encontrados ou sugestões]

## Resultado Final

- [ ] ✅ APROVADO
- [ ] ⚠️ APROVADO COM RESSALVAS
- [ ] ❌ REPROVADO

### Assinatura
**Testador**: ________________
**Data**: ____/____/____