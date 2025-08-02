# Instruções para Cursor

Este diretório contém roteiros para o Cursor executar via MCP do Supabase.

## Arquivos Disponíveis

### delete-epic2-tables.md
Roteiro para deletar com segurança todas as tabelas criadas no EPIC 2, preservando:
- `profiles` (tabela essencial)
- `auth.users` (tabela do sistema)

## Como Usar

1. Abra o arquivo de roteiro desejado
2. Siga as instruções passo a passo
3. Execute cada comando SQL via MCP do Supabase
4. Verifique os resultados antes de prosseguir

## Importante

- SEMPRE verifique as tabelas protegidas antes de executar qualquer DELETE
- Execute os comandos em ordem (respeitando dependências)
- Confirme o resultado após cada operação