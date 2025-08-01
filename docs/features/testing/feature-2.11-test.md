# Testes E2E - Feature 2.11: Refinamento dos Cards de Canal

## Cenário Principal (Happy Path)

### Teste 1: Carregamento Inicial da Página
1. Acessar http://localhost:3000/canais
2. Verificar hero section visível com título "Descubra os Melhores Tipsters"
3. Verificar campo de busca visível e vazio
4. Verificar dropdown de ordenação mostrando "Mais Populares"
5. Verificar contador mostrando "12 canais encontrados"
6. Verificar grid com 12 cards de canal visíveis
7. Verificar botão "Carregar Mais Canais" no final
8. ✓ Página carrega corretamente com todos os elementos

### Teste 2: Métricas Dinâmicas por Janela Temporal
1. Clicar no filtro "Janela Temporal" para expandir
2. Selecionar "7 dias"
3. Verificar que métricas nos cards mudam (ROI, Units, etc)
4. Selecionar "6 meses"
5. Verificar que métricas nos cards mudam novamente
6. Verificar que URL atualiza com ?timeWindow=180d
7. ✓ Métricas são dinâmicas baseadas na janela temporal

## Cenários de Busca

### Teste 3: Busca por Nome do Canal
1. Digitar "Elite" no campo de busca
2. Verificar que apenas canais com "Elite" no nome aparecem
3. Verificar contador atualizado (ex: "3 canais encontrados")
4. Limpar campo de busca
5. Verificar que todos os 12 canais retornam
6. ✓ Busca por nome funciona corretamente

### Teste 4: Busca por Tipster
1. Digitar "Pedro" no campo de busca
2. Verificar que apenas canais do tipster Pedro aparecem
3. Verificar contador atualizado
4. ✓ Busca por tipster funciona

### Teste 5: Busca por Esporte
1. Digitar "NFL" no campo de busca
2. Verificar que apenas canais de NFL aparecem
3. Verificar que tags "NFL" estão destacadas nos cards
4. ✓ Busca por esporte funciona

### Teste 6: Busca sem Resultados
1. Digitar "xyz123" no campo de busca
2. Verificar mensagem "Nenhum canal encontrado com os filtros selecionados"
3. Verificar botão "Limpar Filtros" visível
4. Clicar em "Limpar Filtros"
5. Verificar que todos os canais retornam
6. ✓ Estado vazio funciona corretamente

## Cenários de Filtros

### Teste 7: Filtro de Preço
1. Expandir filtro "Preço Mensal"
2. Mover slider mínimo para R$ 100
3. Verificar que canais abaixo de R$ 100 desaparecem
4. Mover slider máximo para R$ 300
5. Verificar que apenas canais entre R$ 100-300 aparecem
6. ✓ Filtro de preço funciona

### Teste 8: Filtro de Esportes (Multi-seleção)
1. Expandir filtro "Esportes"
2. Marcar checkbox "Futebol"
3. Verificar que apenas canais de Futebol aparecem
4. Marcar também "NBA"
5. Verificar que canais de Futebol OU NBA aparecem
6. Verificar contador "(2)" ao lado de "Esportes"
7. ✓ Filtro de esportes permite múltipla seleção

### Teste 9: Filtro de Casas de Aposta
1. Expandir filtro "Casas de Aposta"
2. Marcar "Bet365"
3. Verificar que apenas canais com tag Bet365 aparecem
4. Marcar também "Pinnacle"
5. Verificar que canais com Bet365 OU Pinnacle aparecem
6. ✓ Filtro de casas funciona

### Teste 10: Filtro de Métodos
1. Expandir filtro "Métodos"
2. Marcar "Model"
3. Verificar que apenas canais com método Model aparecem
4. Verificar tag "model" nos cards filtrados
5. ✓ Filtro de métodos funciona

### Teste 11: Filtro de Liquidez
1. Expandir filtro "Liquidez"
2. Marcar "alta"
3. Verificar que apenas canais com liquidez alta aparecem
4. Marcar também "média"
5. Verificar que canais com liquidez alta OU média aparecem
6. ✓ Filtro de liquidez funciona

### Teste 12: Filtro de Disponibilidade
1. Expandir filtro "Disponibilidade"
2. Selecionar "Com vagas"
3. Verificar que apenas canais com vagas aparecem (barra de ocupação não cheia)
4. Selecionar "Lista de espera"
5. Verificar que apenas canais lotados aparecem (barra vermelha, botão "Lista de Espera")
6. ✓ Filtro de disponibilidade funciona

### Teste 13: Combinação de Múltiplos Filtros
1. Selecionar janela temporal "30 dias"
2. Definir preço entre R$ 100-200
3. Marcar esporte "Futebol"
4. Marcar casa "Bet365"
5. Selecionar "Com vagas"
6. Verificar que apenas canais que atendem TODOS os critérios aparecem
7. Verificar badge com número total de filtros ativos (ex: "(5)")
8. ✓ Múltiplos filtros funcionam em conjunto

## Cenários de Ordenação

### Teste 14: Ordenar por ROI
1. Clicar no dropdown de ordenação
2. Selecionar "Maior ROI"
3. Verificar que canais são reordenados com maior ROI primeiro
4. Verificar que primeiro canal tem ROI maior que o segundo
5. ✓ Ordenação por ROI funciona

### Teste 15: Ordenar por Preço
1. Selecionar "Menor Preço" no dropdown
2. Verificar que canais são ordenados do menor para maior preço
3. Selecionar "Maior Preço"
4. Verificar que ordem inverte (maior preço primeiro)
5. ✓ Ordenação por preço funciona

### Teste 16: Ordenação Preserva Filtros
1. Aplicar filtro de esporte "NBA"
2. Ordenar por "Maior ROI"
3. Verificar que apenas canais de NBA aparecem, ordenados por ROI
4. ✓ Ordenação e filtros funcionam juntos

## Testes Mobile/Responsivos

### Teste 17: Layout Mobile (360px)
1. Redimensionar navegador para 360px largura
2. Verificar que filtros desktop somem
3. Verificar botão "Filtros" visível
4. Verificar cards em coluna única
5. Verificar que busca e ordenação continuam visíveis
6. ✓ Layout mobile funciona

### Teste 18: Drawer de Filtros Mobile
1. Em mobile, clicar botão "Filtros"
2. Verificar drawer abre pela esquerda
3. Verificar todos os filtros disponíveis no drawer
4. Aplicar alguns filtros
5. Fechar drawer (clicar fora ou X)
6. Verificar que filtros foram aplicados
7. Verificar contador de filtros no botão "Filtros (3)"
8. ✓ Drawer mobile funciona

### Teste 19: Layout Tablet (768px)
1. Redimensionar para 768px
2. Verificar cards em 2 colunas
3. Verificar que funcionalidades continuam acessíveis
4. ✓ Layout tablet funciona

### Teste 20: Layout Desktop (1440px)
1. Redimensionar para 1440px
2. Verificar filtros na lateral esquerda
3. Verificar cards em 2 colunas na área principal
4. ✓ Layout desktop funciona

## Testes de Performance

### Teste 21: Tempo de Carregamento
1. Recarregar página e cronometrar
2. Verificar que página carrega em < 3 segundos
3. Verificar que não há layout shift durante carregamento
4. ✓ Performance adequada

### Teste 22: Filtros Responsivos
1. Aplicar múltiplos filtros rapidamente
2. Verificar que interface não trava
3. Verificar que resultados atualizam suavemente
4. ✓ Filtros são responsivos

### Teste 23: Busca em Tempo Real
1. Digitar rapidamente no campo de busca
2. Verificar que resultados atualizam conforme digita
3. Verificar que não há delay perceptível
4. ✓ Busca é responsiva

## Testes de URL e Navegação

### Teste 24: Persistência de Estado via URL
1. Aplicar filtros: timeWindow=7d, sortBy=roi, q=futebol
2. Verificar URL: /canais?timeWindow=7d&sortBy=roi&q=futebol
3. Copiar URL e abrir em nova aba
4. Verificar que filtros são restaurados corretamente
5. ✓ Estado persiste via URL

### Teste 25: Botões Voltar/Avançar
1. Aplicar alguns filtros
2. Aplicar outros filtros
3. Usar botão voltar do navegador
4. Verificar que filtros anteriores são restaurados
5. Usar botão avançar
6. Verificar que filtros posteriores são restaurados
7. ✓ Navegação do browser funciona

## Cenários de Edge Cases

### Teste 26: Todos os Filtros Aplicados
1. Aplicar TODOS os filtros possíveis
2. Verificar que ainda mostra alguns resultados ou mensagem apropriada
3. Verificar performance ainda aceitável
4. ✓ Sistema suporta filtros extremos

### Teste 27: Limpar Filtros Individual vs Total
1. Aplicar vários filtros
2. Clicar "Limpar Filtros" no painel
3. Verificar que TODOS os filtros são limpos
4. Aplicar filtros novamente
5. Remover um filtro individual (desmarcar checkbox)
6. Verificar que apenas aquele filtro é removido
7. ✓ Limpeza de filtros funciona corretamente

### Teste 28: Filtros Contraditórios
1. Definir preço máximo R$ 100
2. Buscar por "Premium" (canais caros)
3. Verificar mensagem de nenhum resultado
4. ✓ Sistema lida com filtros contraditórios

## Verificações Visuais

### Checklist Visual
- [ ] Cards têm hover effect suave
- [ ] Badges de tags têm cores consistentes
- [ ] Barra de ocupação tem gradiente correto (verde→amarelo→vermelho)
- [ ] Ícones são nítidos e alinhados
- [ ] Tipografia é legível em todos os tamanhos
- [ ] Espaçamentos são consistentes
- [ ] Animações do collapsible são suaves
- [ ] Drawer mobile tem overlay escuro
- [ ] Estados de loading/skeleton aparecem durante carregamento
- [ ] Botões têm estados hover/active/disabled apropriados

## Dados de Teste

### Inputs Válidos de Busca
- Nome parcial: "Elite", "Pro", "Model"
- Nome completo: "Elite Sports Betting"
- Tipster: "Pedro", "Carlos", "Ana"
- Esporte: "Futebol", "NBA", "NFL"
- Case insensitive: "ELITE", "elite", "ELiTe"

### Inputs Inválidos de Busca
- Caracteres especiais: "@#$%", "<<<>"
- SQL injection: "'; DROP TABLE--"
- XSS: "<script>alert('xss')</script>"
- Strings muito longas: 500+ caracteres

### Combinações de Filtros para Testar
1. Timeframe curto + ROI alto (pode ter poucos resultados)
2. Preço baixo + Premium (contraditório)
3. Esporte único + Multi casas
4. Todos os métodos + liquidez alta
5. Lista de espera + ordenar por preço baixo

## Notas de Implementação

### Features Funcionando
- ✅ 12 canais mock com dados realistas
- ✅ Filtros colapsáveis com contadores
- ✅ Busca em tempo real
- ✅ Ordenação por 4 critérios
- ✅ URL sync para persistência
- ✅ Design responsivo com drawer mobile
- ✅ Métricas dinâmicas por timeframe
- ✅ Estados de vazio

### Limitações Conhecidas
- Botão "Carregar Mais Canais" ainda não implementado (TODO)
- Dados são mock, não vêm do banco
- Sem paginação real ainda

### Tempo Estimado
- Teste completo: 45-60 minutos
- Teste rápido (happy path): 15 minutos
- Teste mobile específico: 10 minutos