# Guia de Teste Humano - Feature 1.1: Base Infrastructure

## 📋 Checklist de Teste

### 1. Preparação
- [ ] Executar `npm run dev`
- [ ] Abrir http://localhost:3000
- [ ] Abrir DevTools (F12) para verificar erros no console

### 2. Landing Page
- [ ] **Logo BetLink** aparece no header
- [ ] **Hero Section** com texto em português
- [ ] **Botões CTA**:
  - [ ] "Explorar Tipsters" visível
  - [ ] "Começar Gratuitamente" visível
- [ ] **Estatísticas** (500+ Tipsters, 85% Taxa, 24/7 Suporte)
- [ ] **Seção "Como Funciona"** com 3 passos
- [ ] **Footer** com links e theme switcher

### 3. Header e Navegação
- [ ] **Logo clicável** (volta para home)
- [ ] **Links do menu** (desktop):
  - [ ] Explorar Canais
  - [ ] Sobre
  - [ ] Blog
- [ ] **Botões de autenticação** (não logado):
  - [ ] Botão "Entrar"
  - [ ] Botão "Cadastrar"

### 4. Teste com Usuário Logado
- [ ] Fazer login em `/auth/login`
- [ ] **Dropdown do usuário** aparece no lugar dos botões
- [ ] **Dropdown mostra**:
  - [ ] Email do usuário
  - [ ] Dashboard
  - [ ] Minhas Assinaturas
  - [ ] Perfil
  - [ ] Sair
- [ ] Clicar em "Sair" desloga corretamente

### 5. Páginas de Erro
- [ ] Acessar `/error`:
  - [ ] Mostra página 500
  - [ ] Header presente
  - [ ] Botões funcionam
- [ ] Acessar `/access-denied`:
  - [ ] Mostra página 403
  - [ ] Header presente
  - [ ] Botões funcionam

### 6. Responsividade
- [ ] **Desktop (1920px)**:
  - [ ] Layout correto
  - [ ] Menu horizontal
- [ ] **Tablet (768px)**:
  - [ ] Layout adaptado
  - [ ] Conteúdo legível
- [ ] **Mobile (375px)**:
  - [ ] Layout mobile
  - [ ] Menu ainda visível (TODO: menu hamburguer)

### 7. Theme Switcher
- [ ] Clicar no theme switcher no footer
- [ ] Alterna entre light/dark mode
- [ ] Todas as cores se adaptam corretamente

### 8. Performance e Erros
- [ ] **Console sem erros** JavaScript
- [ ] **Página carrega < 3s**
- [ ] **Navegação suave** entre páginas
- [ ] **Sem warnings** de React

### 9. Estrutura de Pastas (após Cursor)
Verificar se Cursor criou:
- [ ] `/app/cliente/` existe
- [ ] `/app/tipster/` existe
- [ ] `/app/admin/` existe
- [ ] `/app/master/` existe

### 10. Build de Produção
```bash
npm run build
npm run start
```
- [ ] Build completa sem erros
- [ ] Site funciona em http://localhost:3000

## 🚨 Critérios de Aprovação

✅ **APROVADO** se:
- Todos os itens acima marcados
- Nenhum erro crítico encontrado
- Visual profissional e consistente

❌ **REPROVADO** se:
- Erros no console
- Links quebrados
- Visual inconsistente
- Features principais não funcionam

## 📝 Notas de Teste

Espaço para anotar problemas encontrados:

```
Data: ___/___/___
Testador: _____________

Problemas encontrados:
1. 
2. 
3. 

Status: [ ] Aprovado [ ] Reprovado
```

## 🔄 Ações Corretivas

Se reprovado, listar correções necessárias:

1. 
2. 
3. 

---

**Lembrete**: Só prosseguir para Feature 1.2 após TODOS os testes passarem!