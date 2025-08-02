import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase credentials in .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function listAllTables() {
  console.log('🔍 Mapeando todas as tabelas no Supabase...\n');
  console.log(`📍 URL: ${supabaseUrl}\n`);

  try {
    // Query para listar todas as tabelas públicas
    const { data, error } = await supabase.rpc('get_all_tables');

    if (error) {
      // Se a função não existir, vamos criar e tentar novamente
      console.log('⚙️  Criando função auxiliar...');
      
      const { error: createError } = await supabase.rpc('execute_sql', {
        sql: `
          CREATE OR REPLACE FUNCTION get_all_tables()
          RETURNS TABLE (
            table_name text,
            row_count bigint
          ) 
          LANGUAGE plpgsql
          SECURITY DEFINER
          AS $$
          DECLARE
            r RECORD;
            count_result bigint;
          BEGIN
            FOR r IN 
              SELECT tablename 
              FROM pg_tables 
              WHERE schemaname = 'public' 
              ORDER BY tablename
            LOOP
              EXECUTE format('SELECT COUNT(*) FROM %I', r.tablename) INTO count_result;
              table_name := r.tablename;
              row_count := count_result;
              RETURN NEXT;
            END LOOP;
          END;
          $$;
        `
      });

      if (createError) {
        console.error('❌ Erro ao criar função:', createError);
        
        // Fallback: tentar listar tabelas conhecidas
        console.log('\n📋 Tentando listar tabelas conhecidas...\n');
        await checkKnownTables();
        return;
      }

      // Tentar novamente
      const { data: retryData, error: retryError } = await supabase.rpc('get_all_tables');
      
      if (retryError) {
        console.error('❌ Erro ao listar tabelas:', retryError);
        await checkKnownTables();
        return;
      }

      displayTables(retryData);
    } else {
      displayTables(data);
    }

  } catch (err) {
    console.error('❌ Erro geral:', err);
    await checkKnownTables();
  }
}

function displayTables(tables: any[] | null) {
  if (!tables || tables.length === 0) {
    console.log('⚠️  Nenhuma tabela encontrada no schema public');
    return;
  }

  console.log('📊 Tabelas encontradas no schema public:\n');
  console.log('┌─────────────────────────────┬────────────┐');
  console.log('│ Tabela                      │ Registros  │');
  console.log('├─────────────────────────────┼────────────┤');
  
  tables.forEach(table => {
    const tableName = table.table_name.padEnd(27);
    const rowCount = table.row_count.toString().padStart(10);
    console.log(`│ ${tableName} │ ${rowCount} │`);
  });
  
  console.log('└─────────────────────────────┴────────────┘');

  // Identificar tabelas para deletar
  console.log('\n🗑️  Tabelas que podem ser deletadas (exceto profiles):');
  const tablesToDelete = tables.filter(t => t.table_name !== 'profiles');
  
  if (tablesToDelete.length === 0) {
    console.log('✅ Apenas a tabela profiles existe - nada para deletar!');
  } else {
    tablesToDelete.forEach(table => {
      console.log(`   - ${table.table_name} (${table.row_count} registros)`);
    });
  }
}

async function checkKnownTables() {
  const knownTables = [
    'profiles',
    'channels',
    'channel_metrics',
    'channel_tags',
    'subscription_plans',
    'tips',
    'channel_reviews',
    'captured_leads',
    'subscriptions',
    'waitlist'
  ];

  console.log('📊 Verificando tabelas conhecidas:\n');

  for (const tableName of knownTables) {
    try {
      const { count, error } = await supabase
        .from(tableName)
        .select('*', { count: 'exact', head: true });

      if (!error) {
        console.log(`✅ ${tableName.padEnd(20)} - Existe (${count || 0} registros)`);
      } else {
        console.log(`❌ ${tableName.padEnd(20)} - Não existe`);
      }
    } catch (err) {
      console.log(`❌ ${tableName.padEnd(20)} - Erro ao verificar`);
    }
  }
}

async function deleteTables(tablesToDelete: string[]) {
  console.log('\n🗑️  Deletando tabelas...\n');

  // Tabelas protegidas que NUNCA devem ser deletadas
  const protectedTables = ['profiles', 'users', 'auth.users'];

  for (const tableName of tablesToDelete) {
    if (protectedTables.includes(tableName.toLowerCase())) {
      console.log(`🛡️  PROTEGIDA: ${tableName} (NUNCA será deletada)`);
      continue;
    }

    try {
      const { error } = await supabase.rpc('execute_sql', {
        sql: `DROP TABLE IF EXISTS ${tableName} CASCADE;`
      });

      if (error) {
        console.error(`❌ Erro ao deletar ${tableName}:`, error);
      } else {
        console.log(`✅ Tabela ${tableName} deletada com sucesso`);
      }
    } catch (err) {
      console.error(`❌ Erro ao deletar ${tableName}:`, err);
    }
  }
}

// Menu interativo
async function main() {
  console.log('🚀 Gerenciador de Tabelas Supabase\n');

  const args = process.argv.slice(2);
  
  if (args.includes('--list')) {
    await listAllTables();
  } else if (args.includes('--delete-all')) {
    console.log('⚠️  ATENÇÃO: Isso irá deletar TODAS as tabelas exceto profiles!');
    console.log('   Para confirmar, execute: npm run manage-tables -- --delete-all --confirm\n');
    
    if (args.includes('--confirm')) {
      // Primeiro listar para saber o que deletar
      const tables = ['channels', 'channel_metrics', 'channel_tags', 'subscription_plans', 'tips', 'channel_reviews', 'captured_leads', 'subscriptions', 'waitlist'];
      await deleteTables(tables);
    }
  } else {
    console.log('Uso: npm run manage-tables -- [opção]\n');
    console.log('Opções:');
    console.log('  --list          Lista todas as tabelas');
    console.log('  --delete-all    Deleta todas as tabelas (exceto profiles)');
    console.log('  --help          Mostra esta ajuda\n');
  }
}

// Criar função execute_sql se não existir
async function ensureExecuteSqlFunction() {
  const { error } = await supabase.rpc('execute_sql', {
    sql: 'SELECT 1'
  }).single();

  if (error?.message?.includes('function') && error?.message?.includes('does not exist')) {
    console.log('⚙️  Criando função execute_sql...');
    
    // Esta função precisa ser criada via SQL Editor no Supabase Dashboard
    console.log('\n📝 Por favor, execute o seguinte SQL no Supabase Dashboard:\n');
    console.log(`
CREATE OR REPLACE FUNCTION execute_sql(sql text)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  result json;
BEGIN
  EXECUTE sql;
  RETURN json_build_object('success', true);
EXCEPTION
  WHEN OTHERS THEN
    RETURN json_build_object('success', false, 'error', SQLERRM);
END;
$$;
    `);
    process.exit(1);
  }
}

// Executar
main().catch(console.error);