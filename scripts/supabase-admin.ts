import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import { readFileSync } from 'fs';
import { join } from 'path';

// Load environment variables
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase credentials');
  console.error('   Please add SUPABASE_SERVICE_ROLE_KEY to your .env.local file');
  process.exit(1);
}

// Create admin client with service role key
const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

// Helper function to execute raw SQL
async function executeSql(sql: string): Promise<any> {
  const { data, error } = await supabaseAdmin.rpc('exec_sql', { 
    query: sql 
  }).single();

  if (error) {
    // If the function doesn't exist, try direct execution
    const { data: directData, error: directError } = await supabaseAdmin
      .from('_sql')
      .select('*')
      .single();

    if (directError) {
      throw new Error(`SQL Error: ${directError.message}`);
    }
    return directData;
  }

  return data;
}

// List all tables in public schema
async function listTables(): Promise<any[]> {
  const query = `
    SELECT 
      t.tablename,
      obj_description(c.oid, 'pg_class') as comment,
      pg_size_pretty(pg_total_relation_size(c.oid)) as size,
      '0' as row_count
    FROM pg_tables t
    JOIN pg_class c ON c.relname = t.tablename
    JOIN pg_namespace n ON n.oid = c.relnamespace
    WHERE t.schemaname = 'public'
      AND n.nspname = 'public'
    ORDER BY t.tablename;
  `;

  try {
    // Try using direct query first
    const { data, error } = await supabaseAdmin
      .rpc('get_tables_with_counts', {})
      .single();

    if (error) {
      console.log('⚠️  Function not found, creating it...');
      
      // Create the function
      const createFunction = `
        CREATE OR REPLACE FUNCTION get_tables_with_counts()
        RETURNS TABLE (
          tablename text,
          row_count bigint,
          size text
        ) AS $$
        DECLARE
          r RECORD;
          count_val bigint;
        BEGIN
          FOR r IN 
            SELECT 
              t.tablename,
              pg_size_pretty(pg_total_relation_size(c.oid)) as size
            FROM pg_tables t
            JOIN pg_class c ON c.relname = t.tablename
            JOIN pg_namespace n ON n.oid = c.relnamespace
            WHERE t.schemaname = 'public'
              AND n.nspname = 'public'
          LOOP
            EXECUTE format('SELECT COUNT(*) FROM %I', r.tablename) INTO count_val;
            tablename := r.tablename;
            row_count := count_val;
            size := r.size;
            RETURN NEXT;
          END LOOP;
        END;
        $$ LANGUAGE plpgsql SECURITY DEFINER;
      `;

      // For now, we'll use a simpler approach
      const tables = await getTablesSimple();
      return tables;
    }

    return data;
  } catch (err) {
    return await getTablesSimple();
  }
}

// Simpler approach to get tables
async function getTablesSimple(): Promise<any[]> {
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

  const tables = [];
  
  for (const tableName of knownTables) {
    try {
      const { count, error } = await supabaseAdmin
        .from(tableName)
        .select('*', { count: 'exact', head: true });

      if (!error) {
        tables.push({
          tablename: tableName,
          row_count: count || 0,
          exists: true
        });
      }
    } catch (err) {
      // Table doesn't exist
    }
  }

  return tables;
}

// Delete tables safely
async function deleteTables(tablesToDelete: string[]) {
  const protectedTables = ['profiles', 'users', 'auth.users'];
  const results = [];

  for (const table of tablesToDelete) {
    if (protectedTables.includes(table.toLowerCase())) {
      results.push({
        table,
        status: 'PROTECTED',
        message: 'Tabela protegida - não será deletada'
      });
      continue;
    }

    try {
      // Try to drop the table using raw SQL through RPC
      await supabaseAdmin.rpc('drop_table_cascade', { 
        table_name: table 
      });

      results.push({
        table,
        status: 'DELETED',
        message: 'Tabela deletada com sucesso'
      });
    } catch (error: any) {
      // If RPC doesn't exist, we'll need to use SQL Editor
      results.push({
        table,
        status: 'ERROR',
        message: `Requer SQL Editor: DROP TABLE IF EXISTS ${table} CASCADE;`
      });
    }
  }

  return results;
}

// Create the drop_table_cascade function
async function createDropTableFunction() {
  const sql = `
    CREATE OR REPLACE FUNCTION drop_table_cascade(table_name text)
    RETURNS void AS $$
    BEGIN
      EXECUTE format('DROP TABLE IF EXISTS %I CASCADE', table_name);
    END;
    $$ LANGUAGE plpgsql SECURITY DEFINER;
  `;

  try {
    await supabaseAdmin.rpc('exec_sql', { query: sql });
    console.log('✅ Função drop_table_cascade criada');
  } catch (error) {
    console.log('⚠️  Não foi possível criar a função automaticamente');
    console.log('   Execute o seguinte SQL no Supabase Dashboard:');
    console.log(sql);
  }
}

// Main execution
async function main() {
  console.log('🚀 Supabase Admin Tool\n');
  console.log(`📍 URL: ${supabaseUrl}\n`);

  const command = process.argv[2];

  switch (command) {
    case 'list':
      console.log('📊 Listando tabelas...\n');
      const tables = await listTables();
      
      if (tables.length === 0) {
        console.log('⚠️  Nenhuma tabela encontrada');
        return;
      }

      console.log('┌─────────────────────────┬────────────┬───────────┐');
      console.log('│ Tabela                  │ Registros  │ Status    │');
      console.log('├─────────────────────────┼────────────┼───────────┤');
      
      tables.forEach(table => {
        const name = table.tablename.padEnd(23);
        const count = (table.row_count || '0').toString().padStart(10);
        const status = table.tablename === 'profiles' ? '🛡️ PROTEGIDA' : '  Pode deletar';
        console.log(`│ ${name} │ ${count} │ ${status} │`);
      });
      
      console.log('└─────────────────────────┴────────────┴───────────┘');
      break;

    case 'delete-all':
      if (process.argv[3] !== '--confirm') {
        console.log('⚠️  ATENÇÃO: Isso deletará TODAS as tabelas exceto profiles!');
        console.log('   Para confirmar, execute:');
        console.log('   npm run supabase-admin delete-all --confirm\n');
        return;
      }

      console.log('🗑️  Deletando tabelas...\n');
      
      // Get current tables
      const currentTables = await listTables();
      const tablesToDelete = currentTables
        .map(t => t.tablename)
        .filter(t => t !== 'profiles');

      // Try to create the function first
      await createDropTableFunction();

      // Delete tables
      const results = await deleteTables(tablesToDelete);
      
      results.forEach(result => {
        const icon = result.status === 'DELETED' ? '✅' : 
                    result.status === 'PROTECTED' ? '🛡️' : '❌';
        console.log(`${icon} ${result.table}: ${result.message}`);
      });

      // If some tables couldn't be deleted automatically
      const requiresManual = results.filter(r => r.status === 'ERROR');
      if (requiresManual.length > 0) {
        console.log('\n📝 Execute o seguinte SQL no Supabase Dashboard:\n');
        requiresManual.forEach(r => {
          console.log(r.message);
        });
      }
      break;

    case 'create-functions':
      console.log('🔧 Criando funções auxiliares...\n');
      await createDropTableFunction();
      break;

    default:
      console.log('Comandos disponíveis:\n');
      console.log('  npm run supabase-admin list              - Lista todas as tabelas');
      console.log('  npm run supabase-admin delete-all        - Deleta tabelas (exceto profiles)');
      console.log('  npm run supabase-admin create-functions  - Cria funções auxiliares\n');
  }
}

// Run
main().catch(console.error);