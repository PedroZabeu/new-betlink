-- Migration: Atualizar nomenclatura de status das tips para padrão brasileiro
-- Green/Red ao invés de Won/Lost, com suporte a Half Green/Half Red

-- 1. Adicionar coluna temporária para partial_percentage (para casos parciais)
ALTER TABLE tips 
ADD COLUMN IF NOT EXISTS partial_percentage DECIMAL(5,2) DEFAULT 100 
CHECK (partial_percentage >= 0 AND partial_percentage <= 100);

COMMENT ON COLUMN tips.partial_percentage IS 'Porcentagem do stake afetada (100 = completo, 50 = half, etc)';

-- 2. Criar função para calcular profit_loss automaticamente
CREATE OR REPLACE FUNCTION calculate_tip_profit_loss()
RETURNS TRIGGER AS $$
BEGIN
  -- Calcular profit_loss baseado no status e partial_percentage
  CASE NEW.status
    WHEN 'green' THEN
      NEW.profit_loss := NEW.stake * (NEW.odds - 1);
      
    WHEN 'half_green' THEN
      -- Half green: metade do stake ganha, metade é devolvida
      NEW.profit_loss := (NEW.stake * (NEW.partial_percentage / 100)) * (NEW.odds - 1);
      
    WHEN 'red' THEN
      NEW.profit_loss := -NEW.stake;
      
    WHEN 'half_red' THEN
      -- Half red: apenas parte do stake é perdida
      NEW.profit_loss := -(NEW.stake * (NEW.partial_percentage / 100));
      
    WHEN 'void', 'cancelled' THEN
      NEW.profit_loss := 0;
      
    WHEN 'pending' THEN
      NEW.profit_loss := NULL;
      
    ELSE
      -- Caso não reconhecido, manter NULL
      NEW.profit_loss := NULL;
  END CASE;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 3. Criar novo tipo ENUM para status (melhor performance e validação)
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'tip_status') THEN
    CREATE TYPE tip_status AS ENUM (
      'pending',    -- Aguardando resultado
      'green',      -- Vitória completa
      'half_green', -- Vitória parcial
      'void',       -- Anulada pelo bookmaker
      'cancelled',  -- Cancelada pelo tipster
      'red',        -- Derrota completa
      'half_red'    -- Derrota parcial
    );
  END IF;
END $$;

-- 4. Adicionar coluna nova com tipo ENUM
ALTER TABLE tips 
ADD COLUMN IF NOT EXISTS status_new tip_status DEFAULT 'pending';

-- 5. Migrar dados existentes para nova nomenclatura
UPDATE tips 
SET 
  status_new = CASE 
    WHEN status = 'won' THEN 'green'::tip_status
    WHEN status = 'lost' THEN 'red'::tip_status
    WHEN status = 'void' THEN 'void'::tip_status
    WHEN status = 'partial' THEN 'half_green'::tip_status
    WHEN status = 'pending' THEN 'pending'::tip_status
    ELSE 'pending'::tip_status
  END,
  partial_percentage = CASE
    WHEN status = 'partial' THEN 50  -- Assumir 50% para partial existente
    WHEN status IN ('won', 'lost') THEN 100
    ELSE 100
  END;

-- 6. Remover constraint antiga e coluna antiga
ALTER TABLE tips DROP CONSTRAINT IF EXISTS tips_status_check;
ALTER TABLE tips DROP COLUMN IF EXISTS status;

-- 7. Renomear coluna nova
ALTER TABLE tips RENAME COLUMN status_new TO status;

-- 8. Criar trigger para calcular profit_loss automaticamente
DROP TRIGGER IF EXISTS calculate_profit_loss_trigger ON tips;
CREATE TRIGGER calculate_profit_loss_trigger
  BEFORE INSERT OR UPDATE OF status, odds, stake, partial_percentage
  ON tips
  FOR EACH ROW
  EXECUTE FUNCTION calculate_tip_profit_loss();

-- 9. Recalcular profit_loss para todas as tips existentes
UPDATE tips 
SET profit_loss = CASE 
  WHEN status = 'green' THEN stake * (odds - 1)
  WHEN status = 'half_green' THEN (stake * (partial_percentage / 100)) * (odds - 1)
  WHEN status = 'red' THEN -stake
  WHEN status = 'half_red' THEN -(stake * (partial_percentage / 100))
  WHEN status IN ('void', 'cancelled') THEN 0
  ELSE NULL
END
WHERE status != 'pending';

-- 10. Criar índice para melhor performance
CREATE INDEX IF NOT EXISTS idx_tips_status_new ON tips(status);
CREATE INDEX IF NOT EXISTS idx_tips_partial ON tips(partial_percentage) WHERE partial_percentage != 100;

-- 11. Adicionar comentários para documentação
COMMENT ON COLUMN tips.status IS 'Status da tip: pending, green, half_green, void, cancelled, red, half_red';
COMMENT ON FUNCTION calculate_tip_profit_loss() IS 'Calcula automaticamente o profit_loss baseado no status e partial_percentage';