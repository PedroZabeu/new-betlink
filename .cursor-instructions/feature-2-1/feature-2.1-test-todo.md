# 🧪 TODO de Testes para Feature 2.1 - Navegação com Underline

## ✅ Status da Implementação
**PRONTO PARA TESTAR!** A Feature 2.1 foi implementada com sucesso.

## 📋 Arquivo Modificado
- `/components/header-client.tsx` - Adicionado "Home" na navegação e comportamento de underline para links ativos

## 🎯 TODO List de Testes para Cursor MCP

### 1. [ ] Iniciar servidor de desenvolvimento
- Execute: `npm run dev`
- Aguarde servidor estar pronto em http://localhost:3000

### 2. [ ] Teste: Navegação Desktop
- Verifique que a navegação agora tem 4 itens: "Home", "Explorar Canais", "Sobre", "Blog"
- O logo BetLink NÃO deve ter underline ou hover
- O logo deve ser clicável e redirecionar para home

### 3. [ ] Teste: Active Page Underline
- Na home (/): apenas link "Home" tem underline
- Em /canais: apenas link "Explorar Canais" tem underline
- Em /sobre: apenas link "Sobre" tem underline
- Em /blog: apenas link "Blog" tem underline
- Em cada página, confirme que APENAS o link ativo tem underline

### 4. [ ] Teste: Hover Behavior
- Na página home, passe o mouse sobre "Explorar Canais", "Sobre" e "Blog"
- Verifique que aparece underline com opacity reduzida
- Remova o mouse e confirme que underline desaparece
- O link ativo NÃO deve mudar ao fazer hover
- O logo NÃO deve ter nenhum efeito visual no hover

### 5. [ ] Teste: Mobile Menu
- Redimensione para mobile (375px)
- Clique no menu hamburger
- Verifique que "Home" aparece como primeiro item do menu
- Verifique que link ativo tem underline no menu mobile
- Teste navegação pelos 4 links no menu mobile

### 6. [ ] Teste: Responsividade
- Desktop (1440px): 4 links visíveis na horizontal
- Tablet (768px): Links ainda visíveis
- Mobile (375px): Apenas menu hamburger visível

### 7. [ ] Teste: Performance e Regressão
- Página carrega em < 3s
- Login/Cadastrar continuam funcionando
- Logo BetLink continua clicável (sem underline ou hover)
- Clique no logo redireciona para home
- Nenhum erro no console

## 📊 Checklist Final
- [ ] Todos os 7 grupos de testes passaram
- [ ] Underline aparece corretamente em todas as páginas
- [ ] Hover funciona em todos os links não ativos
- [ ] Mobile menu funciona perfeitamente
- [ ] Nenhuma funcionalidade foi quebrada

## 🚨 Se Algum Teste Falhar
1. Descreva exatamente qual teste falhou
2. Capture screenshot se possível
3. Reporte o erro específico

## ✅ Quando Todos os Testes Passarem
Reporte: "Feature 2.1 testada e aprovada - todos os testes passaram com sucesso!"

---

**EXECUTE AGORA** os testes acima usando Playwright MCP!