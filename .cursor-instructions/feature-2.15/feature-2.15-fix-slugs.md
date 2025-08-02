# Feature 2.15: Investigar e Corrigir Slugs - CURSOR TASK

## 🎯 Objetivo
Investigar por que 3 canais estão mostrando "0 Differences" mas 0% sync. Suspeita: slugs incorretos.

## 📋 Canais Problemáticos

1. **Arbitragem Tênis ATP** (ID: 3)
   - Slug esperado: `arbitragem-tenis-atp`
   
2. **Basquete Asiático Pro** (ID: 6)
   - Slug esperado: `basquete-asiatico-pro`
   
3. **Cartões Vermelhos Pro** (ID: 11)
   - Slug esperado: `cartoes-vermelhos-pro`

## 🔍 Investigação

### 1. Verificar os slugs atuais desses canais
```sql
SELECT id, name, slug 
FROM channels 
WHERE id IN (3, 6, 11)
ORDER BY id;
```

### 2. Listar TODOS os slugs para comparação
```sql
SELECT id, name, slug 
FROM channels 
ORDER BY id;
```

### 3. Verificar se há caracteres especiais ou espaços
```sql
-- Verificar comprimento e caracteres
SELECT 
  id,
  name,
  slug,
  LENGTH(slug) as slug_length,
  slug LIKE '% %' as has_spaces,
  slug ~ '[^a-z0-9-]' as has_special_chars
FROM channels
WHERE id IN (3, 6, 11);
```

## 🛠️ Correção (se necessário)

### Se os slugs estiverem incorretos:
```sql
-- Corrigir slugs específicos
UPDATE channels SET slug = 'arbitragem-tenis-atp' WHERE id = 3;
UPDATE channels SET slug = 'basquete-asiatico-pro' WHERE id = 6;
UPDATE channels SET slug = 'cartoes-vermelhos-pro' WHERE id = 11;
```

### Se houver espaços ou caracteres especiais:
```sql
-- Limpar slugs
UPDATE channels 
SET slug = LOWER(REPLACE(REPLACE(slug, ' ', '-'), 'ê', 'e'))
WHERE id IN (3, 6, 11);
```

## 📝 Reportar para Claude

Criar arquivo `.claude-instructions/feature-2.15-slugs-fixed.md` com:

1. **Slugs encontrados vs esperados**
```markdown
| ID | Nome | Slug Atual | Slug Esperado | Match? |
|----|------|------------|---------------|---------|
| 3  | Arbitragem Tênis ATP | ??? | arbitragem-tenis-atp | ??? |
| 6  | Basquete Asiático Pro | ??? | basquete-asiatico-pro | ??? |
| 11 | Cartões Vermelhos Pro | ??? | cartoes-vermelhos-pro | ??? |
```

2. **Ações tomadas**
- [ ] Slugs verificados
- [ ] Problemas identificados: ___________
- [ ] Correções aplicadas: ___________
- [ ] Teste de verificação executado

3. **Resultado final**
- Todos os 12 canais agora têm slugs corretos? SIM/NÃO

## 🎯 Resultado Esperado

Após correção:
- Os 3 canais devem mostrar 100% sync
- Não deve haver mais canais com "0 Differences" e 0%
- Overall sync deve chegar próximo a 100%

## 📍 Notas

- Project ID: `c7c87d83-da72-44cf-967f-f4f0d887cf08`
- Foco nos IDs: 3, 6, 11
- Verificar caracteres especiais (ê, ã, ç)