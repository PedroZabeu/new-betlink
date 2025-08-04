-- Feature 2.18: Criar tabela tips para métricas dinâmicas

-- Criar tabela tips
CREATE TABLE IF NOT EXISTS tips (
  -- Sistema
  id SERIAL PRIMARY KEY,
  channel_id INTEGER NOT NULL REFERENCES channels(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Do Tipster (o que ele envia)
  description TEXT NOT NULL,
  event_date TIMESTAMPTZ NOT NULL,
  odds DECIMAL(5,2) NOT NULL CHECK (odds > 1),
  stake DECIMAL(10,2) NOT NULL CHECK (stake > 0),
  
  -- Resultado (atualizado depois)
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'win', 'loss', 'void')),
  profit_loss DECIMAL(10,2)
);

-- Criar índices para performance
CREATE INDEX idx_tips_channel_date ON tips(channel_id, event_date DESC);
CREATE INDEX idx_tips_status ON tips(status);
CREATE INDEX idx_tips_created ON tips(created_at DESC);

-- RLS Policies
ALTER TABLE tips ENABLE ROW LEVEL SECURITY;

-- Policy SELECT: público para canais ativos
CREATE POLICY "Tips são públicas para canais ativos" ON tips
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM channels c 
      WHERE c.id = tips.channel_id 
      AND c.status = 'active'
    )
  );

-- Policy INSERT: apenas tipsters em seus canais
CREATE POLICY "Tipsters podem inserir tips em seus canais" ON tips
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM channels c
      WHERE c.id = tips.channel_id
      AND c.tipster_id = auth.uid()
    )
  );

-- Policy UPDATE: apenas tipster pode atualizar status/resultado
CREATE POLICY "Tipsters podem atualizar suas tips" ON tips
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM channels c
      WHERE c.id = tips.channel_id
      AND c.tipster_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM channels c
      WHERE c.id = tips.channel_id
      AND c.tipster_id = auth.uid()
    )
  );

-- Policy DELETE: bloqueado (histórico permanente)
-- Não criamos policy de DELETE, mantendo histórico permanente

-- Comentário na tabela
COMMENT ON TABLE tips IS 'Histórico de apostas/tips dos canais para cálculo de métricas dinâmicas';
COMMENT ON COLUMN tips.description IS 'Descrição da aposta (ex: Barcelona vs Real Madrid - Over 2.5 gols)';
COMMENT ON COLUMN tips.event_date IS 'Data/hora do evento';
COMMENT ON COLUMN tips.odds IS 'Odds da aposta';
COMMENT ON COLUMN tips.stake IS 'Valor apostado em unidades';
COMMENT ON COLUMN tips.status IS 'Status da aposta: pending, win, loss, void';
COMMENT ON COLUMN tips.profit_loss IS 'Lucro/prejuízo calculado: (odds-1)*stake para win, -stake para loss';