-- Script para deletar tabelas do EPIC 2 (exceto profiles e users)
-- ATENÇÃO: Este script irá DELETAR permanentemente as tabelas listadas
-- Execute com cuidado no SQL Editor do Supabase

-- Primeiro, vamos listar o que será deletado
DO $$
BEGIN
    RAISE NOTICE '';
    RAISE NOTICE '🗑️  TABELAS QUE SERÃO DELETADAS:';
    RAISE NOTICE '================================';
    RAISE NOTICE '- channels';
    RAISE NOTICE '- channel_metrics';
    RAISE NOTICE '- channel_tags';
    RAISE NOTICE '- subscription_plans';
    RAISE NOTICE '- tips';
    RAISE NOTICE '- channel_reviews';
    RAISE NOTICE '- captured_leads';
    RAISE NOTICE '- subscriptions';
    RAISE NOTICE '- waitlist';
    RAISE NOTICE '';
    RAISE NOTICE '🛡️  TABELAS PROTEGIDAS (não serão tocadas):';
    RAISE NOTICE '============================================';
    RAISE NOTICE '- profiles';
    RAISE NOTICE '- auth.users';
    RAISE NOTICE '';
END $$;

-- Deletar tabelas em ordem reversa de dependências
DROP TABLE IF EXISTS waitlist CASCADE;
DROP TABLE IF EXISTS subscriptions CASCADE;
DROP TABLE IF EXISTS captured_leads CASCADE;
DROP TABLE IF EXISTS channel_reviews CASCADE;
DROP TABLE IF EXISTS tips CASCADE;
DROP TABLE IF EXISTS subscription_plans CASCADE;
DROP TABLE IF EXISTS channel_tags CASCADE;
DROP TABLE IF EXISTS channel_metrics CASCADE;
DROP TABLE IF EXISTS channels CASCADE;

-- Confirmar o que sobrou
DO $$
DECLARE
    table_count INTEGER;
BEGIN
    SELECT COUNT(*) INTO table_count 
    FROM pg_tables 
    WHERE schemaname = 'public';
    
    RAISE NOTICE '';
    RAISE NOTICE '✅ Limpeza concluída!';
    RAISE NOTICE 'Tabelas restantes no schema public: %', table_count;
    RAISE NOTICE '';
END $$;

-- Verificar se profiles ainda existe
SELECT 
    'profiles' as tabela,
    COUNT(*) as registros,
    '✅ PROTEGIDA - Não foi tocada' as status
FROM profiles
UNION ALL
SELECT 
    'auth.users' as tabela,
    COUNT(*) as registros,
    '✅ PROTEGIDA - Não foi tocada' as status
FROM auth.users;