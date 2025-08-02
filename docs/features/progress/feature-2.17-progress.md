# Feature 2.17: Resolver Tech Debt da Feature 2.16 - Progress

## 📊 Status Geral: 🟦 IN PROGRESS

**Iniciado em**: 02/08/2025  
**Executor**: Claude + Cursor (suporte)  
**Tempo estimado**: 6 horas
**Tempo real**: -

## 📋 Checklist de Tarefas

### Parte 1: Criar Tipsters Reais (0/4)
- [ ] Criar tipster João Silva via sign-up
- [ ] Criar tipster Maria Santos via sign-up
- [ ] Criar tipster Pedro Costa via sign-up
- [ ] Criar tipster Ana Oliveira via sign-up
- [ ] Atualizar test-credentials.md

### Parte 2: Atualizar Dados no Banco (0/4)
- [ ] Criar documento para Cursor alterar roles
- [ ] Executar SQL para atualizar roles
- [ ] Conectar tipsters aos canais
- [ ] Popular campos NULL em channel_metrics

### Parte 3: Migrar Página de Detalhes (0/4)
- [ ] Criar queries Supabase para detalhes
- [ ] Substituir dados mockados
- [ ] Implementar troca de período
- [ ] Testar consistência

### Parte 4: Validação e Testes (0/3)
- [ ] Criar guia de teste para tipsters
- [ ] Executar testes E2E
- [ ] Documentar resultados

## 🔄 Progresso Atual

### Tarefas em Andamento
1. **Preparação da documentação**
   - [x] Criar plano detalhado da feature
   - [x] Listar todos os problemas identificados
   - [x] Criar instruções para Cursor
   - [ ] Iniciar criação dos tipsters

### Próximas Ações
1. Usar Playwright MCP para criar os 4 tipsters
2. Documentar credenciais em test-credentials.md
3. Criar instrução detalhada para Cursor fazer updates SQL

## 📝 Notas de Implementação

### Tipsters a serem criados:
| Nome | Email | Senha | Canais |
|------|-------|-------|--------|
| João Silva | joao.silva@betlink.com | Test@123! | 3 canais |
| Maria Santos | maria.santos@betlink.com | Test@123! | 3 canais |
| Pedro Costa | pedro.costa@betlink.com | Test@123! | 3 canais |
| Ana Oliveira | ana.oliveira@betlink.com | Test@123! | 3 canais |

### Problemas identificados:
1. **UI**: Botões cortados e sobreposição resolvidos ✅
2. **Dados**: channel_tipsters vazia (0 registros)
3. **Métricas**: profit_units, mdd, avg_odds são NULL
4. **Inconsistência**: Página detalhes usando mock, listagem usando Supabase

## 🚨 Bloqueadores
- Nenhum até o momento

## 📊 Métricas
- **Features completas**: 0/4 partes
- **Tipsters criados**: 0/4
- **Campos NULL resolvidos**: 0/3
- **Consistência**: 50% (apenas listagem migrada)

---

*Última atualização: 02/08/2025 - Iniciando implementação*