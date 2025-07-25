# Protocolo de Colaboração Claude-Cursor

## Divisão de Responsabilidades

### Claude (Líder)
- **Coordenação geral** do desenvolvimento
- **Planejamento** de features e arquitetura
- **Implementação** de código principal
- **Code review** do trabalho do Cursor
- **Git operations** (commits, push)
- **Documentação** principal

### Cursor (Suporte)
- **Execução de MCPs** (Playwright, Supabase)
- **Testes automatizados** e manuais
- **Implementação** de features de menor complexidade
- **Validação** de funcionalidades
- **Relatórios de teste** e bugs

## Fluxo de Trabalho

### 1. Início de Feature
```markdown
Claude → .cursor-instructions/task-{feature-id}.md
- Descrição da tarefa
- Arquivos a criar/modificar
- Testes esperados
- Critérios de aceitação
```

### 2. Durante Desenvolvimento
```markdown
Cursor → .claude-instructions/status-{feature-id}.md
- Status atual
- Problemas encontrados
- Resultados de testes
- Sugestões
```

### 3. Finalização
```markdown
Claude → .cursor-instructions/review-{feature-id}.md
- Code review
- Próximos passos
- Aprovação/correções
```

## Comunicação de Erros

### Formato de Reporte (Cursor → Claude)
```markdown
## Error Report - {timestamp}

### Context
- Feature: {feature-id}
- File: {filepath}
- Operation: {what was being done}

### Error
```
{error message}
```

### Steps to Reproduce
1. {step 1}
2. {step 2}

### Expected vs Actual
- Expected: {what should happen}
- Actual: {what happened}

### Screenshots/Logs
{attach if relevant}
```

## Tarefas Paralelas

### Adequadas para Cursor
- Criação de componentes UI simples
- Testes de integração com Supabase
- Validação de fluxos de autenticação
- Testes E2E com Playwright
- Documentação de testes

### Reservadas para Claude
- Arquitetura de sistema
- Lógica de negócio complexa
- Configuração de middleware
- Integração de pagamentos
- Decisões de design

## Checkpoints de Sincronização

1. **Início do dia**: Claude cria plano diário
2. **Meio da feature**: Status check
3. **Pré-commit**: Review final
4. **Fim do dia**: Resumo de progresso

## Padrões de Nomenclatura

### Arquivos de Instrução
```
.claude-instructions/
  - status-{feature-id}-{YYYYMMDD}.md
  - error-{feature-id}-{YYYYMMDD}.md
  - complete-{feature-id}.md

.cursor-instructions/
  - task-{feature-id}-{YYYYMMDD}.md
  - review-{feature-id}-{YYYYMMDD}.md
  - test-{feature-id}.md
```

### Branches (se necessário)
```
feature/{epic-number}-{feature-number}-{brief-description}
fix/{issue-description}
test/{feature-being-tested}
```