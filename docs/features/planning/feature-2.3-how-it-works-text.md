# Feature 2.3 - Melhoria Seção "Como Funciona"

## 📋 Resumo
Atualizar APENAS os textos da seção "Como Funciona", mantendo todo o layout e design visual intactos.

## 🎯 Objetivos
- Melhorar clareza dos textos dos 3 passos
- Comunicar melhor o processo de uso
- Manter 100% da estrutura visual existente
- Modificar apenas 6 strings de texto

## 📦 Dependências
- Feature 2.2: Seção de Vantagens (em andamento)
- Seção "Como Funciona" existente
- Nenhuma dependência técnica

## 🚨 Guardrails - EXTREMAMENTE CRÍTICO

### APENAS PERMITIDO:
- Modificar strings de texto (títulos e descrições)
- Total de 6 strings: 3 títulos + 3 descrições
- Substituir texto por texto

### ABSOLUTAMENTE PROIBIDO:
- Alterar QUALQUER tag HTML
- Modificar QUALQUER classe CSS
- Adicionar QUALQUER elemento novo
- Remover QUALQUER elemento existente
- Mudar ícones, números (1,2,3), imagens
- Alterar espaçamentos, cores, tamanhos
- Refatorar ou "melhorar" código
- Tocar em animações ou transições
- **ADICIONAR EMOJIS** (nunca usar emojis no app)
- Modificar backgrounds ou cores

## 🔧 Implementação Técnica

### 1. Arquivos a Modificar
```
/app/page.tsx (ou /components/home/how-it-works.tsx)
└── APENAS modificar 6 strings de texto
```

### 2. Novos Textos (EXATOS)

#### Passo 1
- **Título**: "Descubra Profissionais Verificados"
- **Descrição**: "Browse nosso catálogo de tipsters com histórico comprovado e métricas transparentes"

#### Passo 2
- **Título**: "Assine os Melhores Canais"
- **Descrição**: "Escolha entre planos mensais ou anuais e acesse tips exclusivas dos profissionais"

#### Passo 3
- **Título**: "Tips Direto no Telegram"
- **Descrição**: "Receba análises em tempo real e gerencie todas suas assinaturas em um só lugar"

### 3. Estratégias por Tipo de Estrutura

```typescript
// Se for array de objetos:
const steps = [
  {
    title: "Descubra Profissionais Verificados", // MUDAR APENAS ISSO
    description: "Browse nosso catálogo..." // E ISSO
  }
];

// Se for hardcoded:
<h3>Descubra Profissionais Verificados</h3> // MUDAR APENAS O TEXTO
<p>Browse nosso catálogo...</p> // MUDAR APENAS O TEXTO

// Se for componentes:
<StepOne 
  title="Descubra Profissionais Verificados" // MUDAR APENAS O VALOR
  description="Browse nosso catálogo..." // MUDAR APENAS O VALOR
/>
```

## 🧪 Plano de Testes

### Validações Críticas
1. **Antes de modificar**:
   - Contar caracteres atuais vs novos
   - Verificar se cabe no espaço
   - Identificar quebras de linha

2. **Durante modificação**:
   - Apenas texto alterado
   - Nenhuma tag tocada
   - Nenhuma classe modificada

3. **Após modificação**:
   - Layout 100% idêntico
   - Sem overflow de texto
   - Responsividade mantida

### Testes Automatizados
1. Textos antigos removidos
2. Novos textos presentes
3. Estrutura preservada
4. Zero modificações visuais
5. Performance mantida

## 📊 Critérios de Sucesso
- ✅ EXATAMENTE 6 strings modificadas
- ✅ Zero alterações visuais
- ✅ Zero alterações estruturais
- ✅ Layout pixel-perfect mantido
- ✅ Textos mais claros e relevantes
- ✅ Git diff mínimo (apenas textos)

## ⏱️ Estimativa de Tempo
- **Análise**: 35 minutos
- **Implementação**: 30 minutos
- **Testes**: 40 minutos
- **Finalização**: 15 minutos
- **Total**: ~2h

## 📝 Notas de Implementação
- Se o texto não couber, PARAR e discutir
- Se precisar adicionar classes, NÃO FAZER
- Se layout quebrar, reverter imediatamente
- Manter backup dos textos originais
- Fazer mudanças uma por vez

## 🚫 Red Flags - PARAR IMEDIATAMENTE SE:
- Precisa adicionar `<br>` ou `<span>`
- Texto causa overflow
- Precisa modificar CSS
- Layout muda mesmo minimamente
- Encontra lógica complexa

## ⚠️ Checklist de Emergência
SE algo der errado:
1. `git stash` imediatamente
2. Voltar para branch main
3. Reportar o problema
4. NÃO tentar "consertar"

## 🔄 Próximos Passos
Após completar Feature 2.3:
1. Verificar diff mínimo
2. Confirmar apenas 6 mudanças
3. Commit com mensagem clara
4. Atualizar documentação

---

**LEMBRETE CRÍTICO**: Esta é a feature MAIS SIMPLES do projeto. Se parecer complicado, você está fazendo errado. PARE e peça ajuda.