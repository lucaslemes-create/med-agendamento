-- =============================================
-- SISTEMA MÉDICO DE AGENDAMENTO
-- Dr. Rafael Rocha Milani
-- =============================================

-- Tabela de pacientes
CREATE TABLE IF NOT EXISTS pacientes (
  id          SERIAL PRIMARY KEY,
  nome        VARCHAR(255) NOT NULL,
  telefone    VARCHAR(20)  NOT NULL,
  email       VARCHAR(255) NOT NULL UNIQUE,
  criado_em   TIMESTAMP DEFAULT NOW()
);

-- Tabela de horários disponíveis
CREATE TABLE IF NOT EXISTS horarios (
  id          SERIAL PRIMARY KEY,
  data_hora   TIMESTAMP NOT NULL UNIQUE,
  disponivel  BOOLEAN DEFAULT TRUE,
  criado_em   TIMESTAMP DEFAULT NOW()
);

-- Tabela de agendamentos
CREATE TABLE IF NOT EXISTS agendamentos (
  id            SERIAL PRIMARY KEY,
  paciente_id   INTEGER NOT NULL REFERENCES pacientes(id),
  horario_id    INTEGER NOT NULL REFERENCES horarios(id),
  motivo        TEXT,
  status        VARCHAR(20) DEFAULT 'pendente'
                CHECK (status IN ('pendente', 'confirmada', 'cancelada')),
  criado_em     TIMESTAMP DEFAULT NOW()
);

-- =============================================
-- ÍNDICES para melhorar performance
-- =============================================
CREATE INDEX IF NOT EXISTS idx_agendamentos_paciente ON agendamentos(paciente_id);
CREATE INDEX IF NOT EXISTS idx_agendamentos_horario  ON agendamentos(horario_id);
CREATE INDEX IF NOT EXISTS idx_agendamentos_status   ON agendamentos(status);
CREATE INDEX IF NOT EXISTS idx_horarios_data_hora    ON horarios(data_hora);

-- =============================================
-- DADOS INICIAIS para teste
-- =============================================
INSERT INTO pacientes (nome, telefone, email) VALUES
  ('Maria Aparecida Silva', '(67) 99999-1111', 'maria@email.com'),
  ('João Carlos Souza',     '(67) 99999-2222', 'joao@email.com'),
  ('Ana Paula Ferreira',    '(67) 99999-3333', 'ana@email.com')
ON CONFLICT (email) DO NOTHING;

INSERT INTO horarios (data_hora, disponivel) VALUES
  ('2025-01-20 08:00:00', FALSE),
  ('2025-01-20 09:00:00', FALSE),
  ('2025-01-20 10:00:00', TRUE),
  ('2025-01-20 11:00:00', TRUE),
  ('2025-01-20 14:00:00', TRUE),
  ('2025-01-20 15:00:00', TRUE)
ON CONFLICT (data_hora) DO NOTHING;

INSERT INTO agendamentos (paciente_id, horario_id, motivo, status) VALUES
  (1, 1, 'Consulta de rotina',      'confirmada'),
  (2, 2, 'Dor de cabeça frequente', 'pendente')
ON CONFLICT DO NOTHING;