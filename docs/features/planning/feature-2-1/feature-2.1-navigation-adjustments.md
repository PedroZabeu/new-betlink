# Feature 2.1 - Ajustes na Navegação

## 📋 Resumo
Adicionar comportamento de underline na navegação principal para indicar página ativa e hover, melhorando a UX.

## 🎯 Objetivos
- Indicar visualmente em qual página o usuário está
- Fornecer feedback visual no hover
- Manter consistência com o design existente

## 📦 Dependências
- Feature 1.1: Landing Page e Header Base (✅ Completa)
- Componente de navegação existente em `/components/header-client.tsx`

## 🚨 Guardrails - CRÍTICO
### NUNCA MODIFICAR:
- Sistema de autenticação (`/middleware.ts`, `/lib/auth/*`, `/lib/supabase/*`)
- Logo/marca BetLink
- UserNav/Avatar
- Botões Entrar/Cadastrar
- Cores, fontes, tamanhos existentes
- Estrutura HTML da navegação
- Funcionalidades de login/logout
- Menu mobile existente

### APENAS MODIFICAR:
- Comportamento de underline nos links de navegação
- Classes CSS relacionadas ao estado active/hover
- Lógica para detectar página ativa

## 🔧 Implementação Técnica

### 1. Arquivos a Modificar
```
/components/header-client.tsx
└── Adicionar lógica de detecção de rota ativa
└── Adicionar classes CSS condicionais para underline
```

### 2. Mudanças Necessárias
```typescript
// Importar hook do Next.js
import { usePathname } from 'next/navigation'

// Detectar página ativa
const pathname = usePathname()

// Aplicar classes condicionais nos links
className={cn(
  "text-sm font-medium transition-all duration-200 border-b-2 border-transparent",
  pathname === href && "border-current",
  pathname !== href && "hover:border-current hover:opacity-50"
)}
```

### 3. Comportamento Esperado
- **Link Ativo**: Underline sólido (border-current)
- **Link Hover**: Underline com 50% opacity
- **Transição**: Suave de 200ms
- **Espessura**: 2px consistente

## 🧪 Plano de Testes

### Testes Manuais (15 min)
1. **Navegação entre páginas**:
   - [ ] Home (/) - underline aparece
   - [ ] Explorar Canais (/canais) - underline muda
   - [ ] Sobre (/sobre) - underline muda
   - [ ] Blog (/blog) - underline muda

2. **Comportamento de Hover**:
   - [ ] Hover em link não ativo mostra underline com opacity
   - [ ] Remover hover remove underline
   - [ ] Link ativo não muda no hover

3. **Responsividade**:
   - [ ] Desktop (1440px) - underline funciona
   - [ ] Tablet (768px) - underline funciona
   - [ ] Mobile (375px) - navegação mobile intacta

4. **Regressão**:
   - [ ] Login continua funcionando
   - [ ] UserNav aparece quando logado
   - [ ] Botões Entrar/Cadastrar funcionam
   - [ ] Menu mobile abre/fecha

### Testes Automatizados - Playwright (25 min)
```typescript
// Testes a implementar:
1. Active page tem classe border-current
2. Apenas um link ativo por vez
3. Hover adiciona classes corretas
4. Navegação preserva funcionalidade
5. Responsividade mantida
6. Performance < 3s
```

## 📊 Critérios de Sucesso
- ✅ Underline aparece apenas na página ativa
- ✅ Hover mostra underline com 50% opacity
- ✅ Transições são suaves (200ms)
- ✅ Nenhuma funcionalidade quebrada
- ✅ Mobile continua funcionando perfeitamente
- ✅ Performance não afetada
- ✅ Código limpo e maintível

## ⏱️ Estimativa de Tempo
- **Implementação**: 45 minutos
- **Testes Manuais**: 15 minutos
- **Testes Automatizados**: 25 minutos
- **Documentação**: 10 minutos
- **Total**: ~1h35min

## 📝 Notas de Implementação
- Usar `usePathname` do Next.js para detecção de rota
- Aplicar classes com `cn()` utility do shadcn/ui
- Não criar novos componentes
- Manter código simples e direto
- Preservar acessibilidade existente

## 🚫 Anti-patterns a Evitar
- Não usar JavaScript vanilla para manipular classes
- Não adicionar state desnecessário
- Não modificar estrutura de dados
- Não adicionar animações complexas
- Não criar CSS global

## 🔄 Próximos Passos
Após completar Feature 2.1:
1. Commit com mensagem descritiva
2. Atualizar progress tracking
3. Iniciar Feature 2.2 - Seção de Vantagens