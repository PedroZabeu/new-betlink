# Posts em Desenvolvimento - Arquivos TXT

Esta pasta contém os rascunhos dos posts em formato .txt que serão convertidos para .md com front matter.

## 📁 Estrutura

Salve seus arquivos .txt com os seguintes nomes:

```
/content-drafts/posts-txt/
├── metricas-essenciais.txt         # Post sobre ROI, Yield, métricas
├── entendendo-ev-positivo.txt      # Post sobre Expected Value
├── estrategias-contas-ativas.txt   # Post sobre evitar limitações
├── montando-carteira-tipsters.txt  # Post sobre diversificação
└── README.md                       # Este arquivo
```

## ✍️ Como Usar

1. **Escreva o conteúdo** dos posts em arquivos .txt simples
2. **Não inclua** front matter YAML nos arquivos .txt
3. **Use Markdown** normal (headers, listas, etc.)
4. **Mínimo 1000 palavras** por post
5. **Notifique o Claude** quando estiver pronto para conversão

## 📝 Template de Conteúdo

Cada arquivo .txt deve seguir esta estrutura:

```markdown
# Título Principal do Post

Introdução do post explicando o que será abordado...

## Seção 1: Conceito Principal

Explicação detalhada...

### Subseção 1.1

Detalhes específicos...

## Seção 2: Exemplos Práticos

Casos de uso reais...

## Seção 3: Como Aplicar

Passos práticos...

## Conclusão

Resumo e próximos passos...
```

## 🎯 Posts a Criar

### 1. metricas-essenciais.txt
**Tema**: Métricas Essenciais nas Apostas Esportivas
**Conteúdo**: ROI, Yield, Taxa de Acerto, Drawdown, Como interpretar

### 2. entendendo-ev-positivo.txt  
**Tema**: Expected Value Positivo
**Conteúdo**: Conceito de EV, matemática, como identificar, exemplos práticos

### 3. estrategias-contas-ativas.txt
**Tema**: Como Evitar Limitações em Casas de Apostas
**Conteúdo**: Por que limitam, estratégias legítimas, gestão de stakes

### 4. montando-carteira-tipsters.txt
**Tema**: Montando uma Carteira de Tipsters
**Conteúdo**: Diversificação, critérios de seleção, alocação de banca

## 🔄 Processo de Conversão

Quando terminar de escrever os arquivos .txt:

1. Informe ao Claude que os arquivos estão prontos
2. Claude irá:
   - Ler cada arquivo .txt
   - Adicionar front matter YAML apropriado
   - Converter para .md na pasta `/_posts`
   - Validar estrutura e formatação
   - Aplicar categorias e tags corretas

## 📊 Métricas Alvo

- **Palavras por post**: 1000-1500
- **Seções principais**: 4-6 por post  
- **Subseções**: 2-3 por seção principal
- **Exemplos práticos**: Pelo menos 2 por post
- **Tom**: Educacional e profissional

---

**Pasta criada**: `/content-drafts/posts-txt/`
**Próximo passo**: Escrever os 4 arquivos .txt