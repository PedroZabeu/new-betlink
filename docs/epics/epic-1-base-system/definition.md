# EPIC 1: Sistema Base com Autenticação e Navegação

## 🎯 Objetivo
Implementar e testar o sistema completo de autenticação com roles, criando todas as páginas do sistema como placeholders e garantindo que o controle de acesso funcione corretamente.

## 📋 Requisitos do EPIC

### Supabase
- [ ] 4 usuários de teste (1 para cada role: master, admin, tipster, client)
- [ ] Tabela `profiles` conectada com `auth.users`
- [ ] Sincronização automática entre `auth.users` e `profiles`

### Páginas
- [ ] Todas as rotas criadas como placeholders
- [ ] Header com logo, login/logout, avatar
- [ ] Navigation bar horizontal com dropdown
- [ ] Páginas de auth (login, signup, esqueci senha)
- [ ] Página de "Access Denied"
- [ ] Página de erro

### Autenticação
- [ ] Sistema completo de Login
- [ ] Sistema completo de Sign-up
- [ ] Sistema de Logout
- [ ] Redirecionamento baseado em roles

## 🔄 Estratégia de Implementação

Seguindo a sugestão de implementar por tipo de usuário:
1. Base + Cliente
2. Tipster
3. Admin
4. Master

## 📝 Features Breakdown

### Feature 1.1: Base Infrastructure
- Setup inicial do projeto
- Configuração do Supabase
- Header e Navigation básicos
- Páginas de erro e access denied

### Feature 1.2: Database Schema + Auth Pages
- Criar tabela profiles
- Trigger de sincronização
- Páginas de login/signup
- Sistema de auth funcionando

### Feature 1.3: Client Pages + Access Control
- Páginas do cliente
- Teste de acesso com todos os roles
- Navigation mostrando todas as páginas

### Feature 1.4: Tipster Pages + Access Control
- Páginas do tipster
- Teste de acesso com todos os roles
- Validação de permissões

### Feature 1.5: Admin Pages + Access Control
- Páginas do admin
- Teste de acesso com todos os roles
- Validação de permissões

### Feature 1.6: Master Pages + Test Users
- Páginas do master
- Criação dos 4 usuários de teste
- Documentação das credenciais

### Feature 1.7: Polish + Final Testing
- Ajustes visuais
- Testes completos de fluxo
- Documentação final