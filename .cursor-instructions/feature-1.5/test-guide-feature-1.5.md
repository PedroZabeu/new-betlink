# 🧪 Guia de Testes - Feature 1.5: Admin Area Unificada

**IMPORTANTE**: Execute estes testes após implementar as 3 páginas (clientes, canais, configurações)

## 📋 Checklist Pré-Testes

Antes de começar, verifique:
- [ ] `/app/admin/clientes/page.tsx` implementado
- [ ] `/app/admin/canais/page.tsx` implementado
- [ ] `/app/admin/configuracoes/page.tsx` implementado
- [ ] Servidor Next.js rodando (`npm run dev`)
- [ ] Console do navegador aberto (F12)

## 🔐 Teste 1: Matriz de Controle de Acesso

### Usuários de Teste
```
Cliente: newcliente@betlink.com (senha: password123)
Tipster: newtipster@betlink.com (senha: password123)
Admin: newadmin@betlink.com (senha: password123)
Master: newmaster@betlink.com (senha: password123)
```

### Matriz de Testes

| Passo | Usuário | URL | Resultado Esperado | Status |
|-------|---------|-----|-------------------|---------|
| 1.1 | Não logado | `/admin/dashboard` | Redireciona para `/auth/login` | [ ] |
| 1.2 | Cliente | `/admin/dashboard` | Redireciona para `/access-denied` | [ ] |
| 1.3 | Tipster | `/admin/dashboard` | Redireciona para `/access-denied` | [ ] |
| 1.4 | Admin | `/admin/dashboard` | ✅ Acessa normalmente | [ ] |
| 1.5 | Master | `/admin/dashboard` | ✅ Acessa normalmente | [ ] |

### Teste Específico: Página de Admins (Master Only)

| Passo | Usuário | URL | Resultado Esperado | Status |
|-------|---------|-----|-------------------|---------|
| 2.1 | Admin | `/admin/admins` | Redireciona para `/access-denied` | [ ] |
| 2.2 | Master | `/admin/admins` | ✅ Acessa normalmente | [ ] |

## 🎨 Teste 2: Navegação Condicional

### Como Admin (newadmin@betlink.com):
1. Acesse `/admin/dashboard`
2. Verifique o menu lateral:
   - [ ] NÃO deve aparecer "Administradores"
   - [ ] Deve aparecer: Dashboard, Tipsters, Clientes, Canais, Configurações

### Como Master (newmaster@betlink.com):
1. Acesse `/admin/dashboard`
2. Verifique o menu lateral:
   - [ ] DEVE aparecer "Administradores" entre Canais e Configurações
   - [ ] Ícone do Shield visível

## ⚙️ Teste 3: Configurações Condicionais

### Como Admin (newadmin@betlink.com):
1. Acesse `/admin/configuracoes`
2. Verifique seções visíveis:
   - [ ] ✅ Configurações Gerais
   - [ ] ✅ Limites do Sistema
   - [ ] ❌ NÃO deve ver: Gestão de Admins
   - [ ] ❌ NÃO deve ver: Integrações
   - [ ] ❌ NÃO deve ver: Manutenção

### Como Master (newmaster@betlink.com):
1. Acesse `/admin/configuracoes`
2. Verifique TODAS as seções:
   - [ ] ✅ Configurações Gerais
   - [ ] ✅ Limites do Sistema
   - [ ] ✅ Gestão de Admins
   - [ ] ✅ Integrações
   - [ ] ✅ Manutenção

## 🔍 Teste 4: Funcionalidades das Páginas

### Página de Clientes (`/admin/clientes`)
- [ ] Busca por nome/email funciona
- [ ] Filtros de status (Todos/Ativos/Inativos)
- [ ] Tabela mostra dados mockados
- [ ] Responsivo em mobile

### Página de Canais (`/admin/canais`)
- [ ] Tabs funcionam (Pendentes/Ativos/Suspensos)
- [ ] Cards de canais aparecem corretamente
- [ ] Botões de ação visíveis
- [ ] Estados vazios quando não há dados

### Página de Configurações (`/admin/configuracoes`)
- [ ] Todos os inputs estão desabilitados (mock)
- [ ] Seções condicionais aparecem/desaparecem corretamente
- [ ] Visual consistente com outras páginas

## 📱 Teste 5: Responsividade

Teste em 3 tamanhos:
- [ ] Desktop (1920px): Layout em 2 colunas onde aplicável
- [ ] Tablet (768px): Layout ajustado
- [ ] Mobile (375px): Menu vira drawer, cards empilham

## 🐛 Teste 6: Console e Performance

- [ ] Sem erros no console
- [ ] Sem warnings de React
- [ ] Páginas carregam rapidamente
- [ ] Navegação fluida entre páginas

## 📝 Como Reportar

Crie o arquivo: `/mnt/c/Users/pedro/Projetos/new-betlink/.claude-instructions/feature-1.5/feature-1.5-test-report.md`

### Template do Relatório:
```markdown
# Relatório de Testes - Feature 1.5

## Resumo
- Total de testes: X
- Passou: X
- Falhou: X

## Detalhes dos Testes

### 1. Controle de Acesso
[Descreva os resultados]

### 2. Navegação Condicional
[Descreva os resultados]

### 3. Configurações Condicionais
[Descreva os resultados]

### 4. Bugs Encontrados
[Liste qualquer bug com detalhes]

### 5. Observações
[Qualquer observação relevante]

## Screenshots (se houver problemas)
[Descreva o problema visual]
```

## 🚀 Dicas para Testes Eficientes

1. **Use abas anônimas** para testar diferentes usuários
2. **Limpe o cache** entre testes de usuários diferentes
3. **Verifique o Network tab** para confirmar redirecionamentos
4. **Tire screenshots** de qualquer comportamento inesperado
5. **Teste em ordem** - alguns testes dependem de outros

---

**Boa sorte com os testes! Quando terminar, reporte os resultados no arquivo especificado.**