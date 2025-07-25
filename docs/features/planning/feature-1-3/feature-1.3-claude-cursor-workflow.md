# Feature 1.3: Dinâmica de Trabalho Claude-Cursor

## Visão Geral da Colaboração

### Distribuição de Esforço
- **Claude**: 80% - Implementação principal, componentes complexos, lógica
- **Cursor**: 20% - Testes, validações, ajustes visuais, documentação

### Fluxo de Trabalho Paralelo

```
TEMPO  CLAUDE                          CURSOR
─────  ─────────────────────────────  ─────────────────────────────
00:00  Inicia layout.tsx + auth       Aguarda instrução inicial
00:15  Cria ClientLayout component     Instala lucide-react
00:30  Implementa SidebarNav           Testa acesso com cliente
00:45  Cria componentes UI             Testa acesso outros roles  
01:00  Implementa Dashboard page       Documenta resultados teste
01:15  Implementa Assinaturas page     Verifica responsividade
01:30  Implementa Histórico page       Ajusta textos/traduções
01:45  Checkpoint: integração          Testa fluxo completo
02:00  Ajustes finais                  Cria test report
```

## Fases Detalhadas

### FASE 1: Setup Inicial (0-15 min)

**Claude começa:**
1. Criar `/app/cliente/layout.tsx` com verificação de auth
2. Implementar redirecionamento se não autorizado
3. Criar estrutura base do layout

**Cursor em paralelo:**
```markdown
Task 1: Verificar e instalar dependências
- Checar se lucide-react está instalado
- Se não, executar: npm install lucide-react
- Reportar status
```

### FASE 2: Componentes Base (15-45 min)

**Claude desenvolve:**
1. `ClientLayout` - wrapper principal
2. `SidebarNav` - navegação lateral com estado ativo
3. `PageHeader` - header reutilizável com breadcrumb

**Cursor testa (30 min):**
```markdown
Task 2: Testar acesso inicial
- Login como newcliente@betlink.com
- Acessar /cliente/dashboard (deve dar 404 mas não bloquear)
- Documentar comportamento
- Tentar acessar /tipster/dashboard (deve redirecionar)
```

### FASE 3: Componentes UI (45-60 min)

**Claude cria:**
1. `StatsCard` - cards de estatísticas
2. `EmptyState` - estados vazios
3. `PageContainer` - container padrão

**Cursor continua testando:**
```markdown
Task 3: Matriz de testes de acesso
- Testar cada role (master, admin, tipster, cliente)
- Documentar quem acessa o quê
- Capturar erros ou comportamentos inesperados
```

### FASE 4: Páginas (60-90 min)

**Claude implementa:**
1. Dashboard com 3 stats cards
2. Assinaturas com tabs e empty state
3. Histórico com filtros e empty state

**Cursor valida visual:**
```markdown
Task 4: Verificação visual e i18n
- Verificar se todos textos estão em português
- Testar responsividade (mobile/tablet/desktop)
- Ajustar espaçamentos se necessário
- Verificar tema dark/light
```

### FASE 5: Integração Final (90-120 min)

**Claude finaliza:**
1. Ajusta navegação entre páginas
2. Corrige bugs encontrados
3. Garante consistência visual

**Cursor executa testes finais:**
```markdown
Task 5: Teste completo do fluxo
- Login com cada usuário teste
- Navegar por todas as páginas
- Verificar breadcrumbs
- Testar logout de cada página
- Criar relatório final
```

## Pontos de Sincronização

### Checkpoint 1 (30 min)
**Claude pergunta**: "Layout base está pronto, Cursor pode começar testes de acesso?"
**Cursor responde**: "Dependências instaladas, iniciando testes"

### Checkpoint 2 (60 min)
**Claude informa**: "Componentes UI prontos, iniciando páginas"
**Cursor reporta**: "Testes de acesso completos, [lista problemas se houver]"

### Checkpoint 3 (90 min)
**Claude**: "Todas as páginas implementadas"
**Cursor**: "Iniciando validação visual e testes finais"

### Checkpoint 4 (120 min)
**Ambos**: Revisão final e merge de ajustes

## Comunicação de Problemas

### Se Cursor encontrar bugs:
```markdown
Status: ❌ Bug encontrado
Página: /cliente/dashboard
Usuário: newtipster@betlink.com
Erro: [descrição exata]
Console: [copiar erro se houver]
```

### Se Claude precisar de info:
```markdown
@Cursor: Preciso saber se [específico]
Prioridade: [Alta/Média/Baixa]
Impacto: [o que está bloqueado]
```

## Estrutura de Arquivos para Cursor

```
CURSOR DEVE FOCAR EM:
/app/cliente/*           # Testar acesso
/components/layouts/*    # Verificar visual
/.claude-instructions/*  # Criar reports

CURSOR NÃO DEVE MODIFICAR:
/lib/auth/*             # Lógica de auth
/middleware.ts          # Crítico
/lib/supabase/*         # Configs base
```

## Tarefas Específicas por Fase

### Para Cursor - Lista Completa

1. **Instalação (5 min)**
   - Verificar/instalar lucide-react
   - Confirmar build funcionando

2. **Testes de Acesso (30 min)**
   - 4 usuários x 3 rotas = 12 testes
   - Documentar cada resultado

3. **Validação Visual (20 min)**
   - Desktop: 1920x1080
   - Tablet: 768x1024
   - Mobile: 375x667

4. **Internacionalização (15 min)**
   - Procurar textos em inglês
   - Sugerir traduções

5. **Teste Integrado (30 min)**
   - Fluxo completo cada usuário
   - Breadcrumbs funcionando
   - Navegação sem quebrar

6. **Documentação (20 min)**
   - Criar test report
   - Screenshots se possível
   - Lista de issues

## Resultado Esperado

### De Claude:
- 9 componentes funcionais
- 3 páginas completas
- Sistema de navegação
- Controle de acesso funcionando

### De Cursor:
- Relatório de 48 testes de acesso
- Confirmação visual em 3 viewports
- Todos textos em português
- Zero bugs críticos

## Timeline Total: 2 horas

Com trabalho paralelo eficiente, a feature completa em 2 horas ao invés de 3.