# Feature 2.15: Adicionar Campos Faltantes - CURSOR TASK

## 🎯 Objetivo
Adicionar os campos `tipster_name` e `total_tips` na tabela `channels` para alcançar 100% de sincronização.

## 📋 Tarefas para Executar

### 1. Adicionar Campos na Tabela channels
```sql
-- Adicionar campo tipster_name
ALTER TABLE channels 
ADD COLUMN tipster_name VARCHAR(255);

-- Adicionar campo total_tips  
ALTER TABLE channels 
ADD COLUMN total_tips INTEGER DEFAULT 0;
```

### 2. Popular o campo tipster_name com os dados corretos
```sql
UPDATE channels SET tipster_name = 'Carlos Silva' WHERE id = 1;
UPDATE channels SET tipster_name = 'Michael Johnson' WHERE id = 2;
UPDATE channels SET tipster_name = 'Roberto Lima' WHERE id = 3;
UPDATE channels SET tipster_name = 'Jake Williams' WHERE id = 4;
UPDATE channels SET tipster_name = 'Pedro Costa' WHERE id = 5;
UPDATE channels SET tipster_name = 'Liu Chang' WHERE id = 6;
UPDATE channels SET tipster_name = 'João Silva' WHERE id = 7;
UPDATE channels SET tipster_name = 'Ana Santos' WHERE id = 8;
UPDATE channels SET tipster_name = 'Kevin Park' WHERE id = 9;
UPDATE channels SET tipster_name = 'David Thompson' WHERE id = 10;
UPDATE channels SET tipster_name = 'Felipe Oliveira' WHERE id = 11;
UPDATE channels SET tipster_name = 'Marcus Lee' WHERE id = 12;
```

### 3. Popular o campo total_tips com os valores do mock
```sql
UPDATE channels SET total_tips = 2847 WHERE id = 1;
UPDATE channels SET total_tips = 3156 WHERE id = 2;
UPDATE channels SET total_tips = 4231 WHERE id = 3;
UPDATE channels SET total_tips = 1892 WHERE id = 4;
UPDATE channels SET total_tips = 892 WHERE id = 5;
UPDATE channels SET total_tips = 2876 WHERE id = 6;
UPDATE channels SET total_tips = 4512 WHERE id = 7;
UPDATE channels SET total_tips = 3789 WHERE id = 8;
UPDATE channels SET total_tips = 2134 WHERE id = 9;
UPDATE channels SET total_tips = 3654 WHERE id = 10;
UPDATE channels SET total_tips = 1567 WHERE id = 11;
UPDATE channels SET total_tips = 2987 WHERE id = 12;
```

### 4. Verificar os dados
```sql
-- Verificar se todos os campos foram adicionados e populados
SELECT 
  id,
  name,
  tipster_name,
  total_tips,
  base_price
FROM channels
ORDER BY id;
```

## 📝 Reportar para Claude

Criar arquivo `.claude-instructions/feature-2.15-fields-added.md` com:

1. Confirmação de que os campos foram adicionados
2. Confirmação de que os dados foram populados
3. Resultado da query de verificação

## 🎯 Resultado Esperado

Após executar:
- Campo `tipster_name` adicionado e populado para os 12 canais
- Campo `total_tips` adicionado e populado com valores do mock
- Pronto para Claude ajustar o código de comparação

## 📍 Notas

- Project ID: `c7c87d83-da72-44cf-967f-f4f0d887cf08`
- Executar na ordem especificada
- Confirmar cada etapa antes de prosseguir