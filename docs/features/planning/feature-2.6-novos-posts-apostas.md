# Feature 2.6 - Criar 4 Novos Posts sobre Apostas (Planning)

## 📋 Resumo da Feature
Criar estrutura de posts em Markdown e adicionar 4 novos posts educacionais sobre apostas esportivas, mantendo o sistema visual atual do blog.

## 🎯 Objetivo
Adicionar conteúdo educacional de qualidade sobre apostas esportivas, criando uma base sólida para o sistema de blog baseado em arquivos Markdown.

## 🚨 Guardrails Específicos

### DEVE FAZER:
- Criar diretório `/_posts` na raiz do projeto
- Escrever 4 posts completos em Markdown
- Cada post com mínimo 1000 palavras
- Front matter YAML completo em cada post
- Conteúdo educacional e profissional
- Usar estrutura hierárquica (H1-H3)

### NÃO PODE:
- Modificar o design visual do blog
- Alterar componentes existentes
- Criar novo sistema de renderização (por enquanto)
- Adicionar imagens externas
- Copiar conteúdo de outros sites

## 📁 Estrutura de Arquivos

### Arquivos a criar:
```
/betlink-platform
├── /_posts                        # NOVO diretório
│   ├── metricas-essenciais.md
│   ├── entendendo-ev-positivo.md
│   ├── estrategias-contas-ativas.md
│   └── montando-carteira-tipsters.md
```

### Formato do Front Matter:
```yaml
---
title: "Título do Post"
excerpt: "Descrição breve do conteúdo (150-200 caracteres)"
coverImage: "/images/blog/nome-da-imagem.jpg"
date: "2025-01-30"
author:
  name: "BetLink Team"
  picture: "/images/authors/betlink.jpg"
category: "educacional"
tags: ["tag1", "tag2", "tag3"]
readingTime: 8
featured: false
---
```

## 📝 Conteúdo dos Posts

### Post 1: Métricas Essenciais nas Apostas Esportivas
```markdown
---
title: "Métricas Essenciais nas Apostas Esportivas: ROI, Yield e Mais"
excerpt: "Entenda as principais métricas para avaliar performance em apostas: ROI, Yield, Taxa de Acerto, e como interpretar cada uma corretamente"
category: "educacional"
tags: ["iniciantes", "métricas", "roi", "yield", "análise"]
---

# Conteúdo:
1. Introdução às métricas
2. ROI (Return on Investment)
   - O que é e como calcular
   - Exemplos práticos
   - Interpretação correta
3. Yield
   - Diferença para ROI
   - Por que é importante
   - Benchmarks do mercado
4. Taxa de Acerto (Strike Rate)
   - Mitos e verdades
   - Relação com odds médias
5. Outras métricas importantes
   - Drawdown máximo
   - Desvio padrão
   - Lucro absoluto vs relativo
6. Como usar métricas para escolher tipsters
7. Conclusão e próximos passos
```

### Post 2: Entendendo o EV+ (Expected Value Positivo)
```markdown
---
title: "Expected Value Positivo: O Conceito Mais Importante das Apostas"
excerpt: "Descubra o que é EV+, como identificar apostas de valor e por que este conceito separa apostadores recreativos dos profissionais"
category: "estrategias"
tags: ["avançado", "ev+", "value betting", "matemática", "estratégia"]
---

# Conteúdo:
1. O que é Expected Value (EV)
2. A matemática por trás do EV
3. Como calcular o EV de uma aposta
4. Identificando apostas com EV+
5. Exemplos práticos no futebol
6. Ferramentas para encontrar value
7. Armadilhas comuns
8. EV+ no longo prazo
```

### Post 3: Estratégias para Manter Contas Ativas
```markdown
---
title: "Como Evitar Limitações em Casas de Apostas: Guia Completo"
excerpt: "Aprenda estratégias legítimas para manter suas contas ativas por mais tempo e evitar limitações prematuras nas casas de apostas"
category: "gestao-banca"
tags: ["gestão", "limitação", "casas de apostas", "estratégia", "longevidade"]
---

# Conteúdo:
1. Por que casas limitam apostadores
2. Perfil do apostador limitado
3. Estratégias de camuflagem
4. Gestão de stakes inteligente
5. Diversificação de mercados
6. Timing das apostas
7. Uso responsável de bônus
8. Quando aceitar a limitação
```

### Post 4: Montando sua Carteira de Tipsters
```markdown
---
title: "Como Montar uma Carteira Diversificada de Tipsters"
excerpt: "Guia prático para selecionar e combinar diferentes tipsters, criando uma carteira balanceada para maximizar lucros e minimizar riscos"
category: "ferramentas"
tags: ["tipsters", "diversificação", "gestão", "portfolio", "risco"]
---

# Conteúdo:
1. Por que diversificar tipsters
2. Critérios de seleção
3. Análise de correlação
4. Alocação de banca
5. Número ideal de tipsters
6. Monitoramento e ajustes
7. Red flags para evitar
8. Caso prático de sucesso
```

## ✅ Checklist de Implementação

### Preparação
- [ ] Criar diretório `/_posts` na raiz
- [ ] Definir template de front matter
- [ ] Pesquisar conteúdo relevante
- [ ] Estruturar outline de cada post

### Criação dos Posts
- [ ] Post 1: Métricas Essenciais (1000+ palavras)
- [ ] Post 2: EV+ (1000+ palavras)
- [ ] Post 3: Evitar Limitações (1000+ palavras)
- [ ] Post 4: Carteira de Tipsters (1000+ palavras)

### Qualidade
- [ ] Revisar ortografia e gramática
- [ ] Verificar front matter completo
- [ ] Confirmar categorias e tags
- [ ] Adicionar readingTime calculado

### Validação
- [ ] Markdown válido em todos os posts
- [ ] Front matter YAML sem erros
- [ ] Conteúdo educacional e útil
- [ ] Sem promoção direta de apostas

## 🎯 Critérios de Sucesso

1. **Estrutura**:
   - Diretório `/_posts` criado ✓
   - 4 arquivos .md completos ✓
   - Front matter padronizado ✓

2. **Conteúdo**:
   - Mínimo 1000 palavras por post ✓
   - Linguagem profissional ✓
   - Informações precisas ✓
   - Valor educacional ✓

3. **Técnico**:
   - Markdown válido ✓
   - YAML sem erros ✓
   - UTF-8 encoding ✓
   - Nomes de arquivo em kebab-case ✓

## ⏱️ Estimativa
4-5 horas (1h+ por post)

## 🚫 Erros Comuns a Evitar

1. **Conteúdo superficial**: Cada post deve ser aprofundado
2. **Promoção de apostas**: Foco educacional, não promocional
3. **Informações incorretas**: Verificar fatos e cálculos
4. **Front matter incompleto**: Todos os campos são obrigatórios
5. **Formatação inconsistente**: Manter padrão em todos os posts

## 💡 Notas Importantes

- Posts devem ser atemporais (evitar "este mês", "hoje")
- Usar exemplos práticos mas genéricos
- Citar fontes quando apropriado
- Manter tom profissional mas acessível
- Considerar diferentes níveis de conhecimento

---

**Próximo passo**: Após criar os posts, implementar Feature 2.7 (Sistema de Tags e Categorias) para organizá-los.