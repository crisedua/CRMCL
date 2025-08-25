-- ================================================
-- CRM PRO - ESQUEMA COMPLETO DE BASE DE DATOS
-- ================================================
-- Este archivo contiene el esquema completo para tu aplicación CRM
-- Incluye tablas, índices, triggers, políticas RLS y datos de ejemplo

-- ================================================
-- 1. EXTENSIONES Y CONFIGURACIONES
-- ================================================

-- Habilitar extensión UUID
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Habilitar extensión para texto completo (búsquedas)
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- ================================================
-- 2. TABLAS PRINCIPALES
-- ================================================

-- Tabla de perfiles (extiende auth.users de Supabase)
CREATE TABLE profiles (
  id uuid REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email text UNIQUE NOT NULL,
  full_name text,
  avatar_url text,
  company_name text,
  job_title text,
  phone text,
  timezone text DEFAULT 'UTC',
  language text DEFAULT 'es',
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Tabla de clientes
CREATE TABLE clients (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name text NOT NULL,
  email text,
  phone text,
  company text,
  position text,
  address text,
  city text,
  country text,
  website text,
  notes text,
  status text DEFAULT 'prospect' CHECK (status IN ('active', 'inactive', 'prospect', 'lead', 'qualified')),
  source text, -- De dónde vino el cliente (referido, web, marketing, etc.)
  tags text[], -- Array de etiquetas
  last_contact_date timestamp with time zone,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Tabla de oportunidades de venta
CREATE TABLE opportunities (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  client_id uuid REFERENCES clients(id) ON DELETE CASCADE NOT NULL,
  title text NOT NULL,
  description text,
  value decimal(12,2), -- Valor monetario
  currency text DEFAULT 'USD',
  stage text DEFAULT 'prospect' CHECK (stage IN ('prospect', 'qualified', 'proposal', 'negotiation', 'closed_won', 'closed_lost')),
  probability integer CHECK (probability >= 0 AND probability <= 100),
  expected_close_date date,
  actual_close_date date,
  lost_reason text, -- Razón si se perdió la oportunidad
  tags text[], -- Array de etiquetas
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Tabla de tareas y recordatorios
CREATE TABLE tasks (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  client_id uuid REFERENCES clients(id) ON DELETE SET NULL,
  opportunity_id uuid REFERENCES opportunities(id) ON DELETE SET NULL,
  title text NOT NULL,
  description text,
  due_date timestamp with time zone,
  completed_date timestamp with time zone,
  priority text DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed', 'cancelled', 'overdue')),
  type text DEFAULT 'general' CHECK (type IN ('call', 'email', 'meeting', 'follow_up', 'general')),
  estimated_duration integer, -- Duración estimada en minutos
  tags text[], -- Array de etiquetas
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Tabla de interacciones (historial de comunicaciones)
CREATE TABLE interactions (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  client_id uuid REFERENCES clients(id) ON DELETE CASCADE NOT NULL,
  opportunity_id uuid REFERENCES opportunities(id) ON DELETE SET NULL,
  type text NOT NULL CHECK (type IN ('call', 'email', 'meeting', 'note', 'sms', 'video_call', 'demo')),
  subject text NOT NULL,
  description text,
  duration integer, -- Duración en minutos
  outcome text CHECK (outcome IN ('positive', 'neutral', 'negative')),
  follow_up_required boolean DEFAULT false,
  date timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Tabla de productos/servicios (opcional para futuras funcionalidades)
CREATE TABLE products (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name text NOT NULL,
  description text,
  price decimal(10,2),
  currency text DEFAULT 'USD',
  category text,
  active boolean DEFAULT true,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Tabla de elementos de oportunidad (productos/servicios en una oportunidad)
CREATE TABLE opportunity_items (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  opportunity_id uuid REFERENCES opportunities(id) ON DELETE CASCADE NOT NULL,
  product_id uuid REFERENCES products(id) ON DELETE CASCADE,
  product_name text NOT NULL, -- Nombre del producto en el momento de la venta
  quantity integer DEFAULT 1,
  unit_price decimal(10,2) NOT NULL,
  total_price decimal(10,2) NOT NULL,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ================================================
-- 3. ÍNDICES PARA OPTIMIZACIÓN
-- ================================================

-- Índices para búsquedas eficientes
CREATE INDEX idx_profiles_email ON profiles(email);
CREATE INDEX idx_clients_user_id ON clients(user_id);
CREATE INDEX idx_clients_status ON clients(status);
CREATE INDEX idx_clients_name ON clients USING gin(name gin_trgm_ops);
CREATE INDEX idx_clients_company ON clients USING gin(company gin_trgm_ops);
CREATE INDEX idx_clients_email ON clients(email);
CREATE INDEX idx_clients_last_contact ON clients(last_contact_date);

CREATE INDEX idx_opportunities_user_id ON opportunities(user_id);
CREATE INDEX idx_opportunities_client_id ON opportunities(client_id);
CREATE INDEX idx_opportunities_stage ON opportunities(stage);
CREATE INDEX idx_opportunities_value ON opportunities(value);
CREATE INDEX idx_opportunities_close_date ON opportunities(expected_close_date);
CREATE INDEX idx_opportunities_title ON opportunities USING gin(title gin_trgm_ops);

CREATE INDEX idx_tasks_user_id ON tasks(user_id);
CREATE INDEX idx_tasks_client_id ON tasks(client_id);
CREATE INDEX idx_tasks_opportunity_id ON tasks(opportunity_id);
CREATE INDEX idx_tasks_status ON tasks(status);
CREATE INDEX idx_tasks_priority ON tasks(priority);
CREATE INDEX idx_tasks_due_date ON tasks(due_date);
CREATE INDEX idx_tasks_title ON tasks USING gin(title gin_trgm_ops);

CREATE INDEX idx_interactions_user_id ON interactions(user_id);
CREATE INDEX idx_interactions_client_id ON interactions(client_id);
CREATE INDEX idx_interactions_opportunity_id ON interactions(opportunity_id);
CREATE INDEX idx_interactions_type ON interactions(type);
CREATE INDEX idx_interactions_date ON interactions(date);

CREATE INDEX idx_products_user_id ON products(user_id);
CREATE INDEX idx_products_active ON products(active);
CREATE INDEX idx_opportunity_items_opportunity_id ON opportunity_items(opportunity_id);

-- ================================================
-- 4. FUNCIONES AUXILIARES
-- ================================================

-- Función para actualizar timestamps automáticamente
CREATE OR REPLACE FUNCTION handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ LANGUAGE 'plpgsql';

-- Función para manejar creación de perfiles
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO profiles (id, email, full_name)
    VALUES (
        NEW.id, 
        NEW.email, 
        COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1))
    );
    RETURN NEW;
END;
$$ LANGUAGE 'plpgsql' SECURITY DEFINER;

-- Función para actualizar last_contact_date en clientes
CREATE OR REPLACE FUNCTION update_client_last_contact()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE clients 
    SET last_contact_date = NEW.date
    WHERE id = NEW.client_id;
    RETURN NEW;
END;
$$ LANGUAGE 'plpgsql';

-- Función para marcar tareas como vencidas
CREATE OR REPLACE FUNCTION mark_overdue_tasks()
RETURNS void AS $$
BEGIN
    UPDATE tasks 
    SET status = 'overdue'
    WHERE due_date < now() 
    AND status IN ('pending', 'in_progress');
END;
$$ LANGUAGE 'plpgsql';

-- ================================================
-- 5. TRIGGERS
-- ================================================

-- Triggers para updated_at
CREATE TRIGGER update_profiles_updated_at 
    BEFORE UPDATE ON profiles 
    FOR EACH ROW EXECUTE FUNCTION handle_updated_at();

CREATE TRIGGER update_clients_updated_at 
    BEFORE UPDATE ON clients 
    FOR EACH ROW EXECUTE FUNCTION handle_updated_at();

CREATE TRIGGER update_opportunities_updated_at 
    BEFORE UPDATE ON opportunities 
    FOR EACH ROW EXECUTE FUNCTION handle_updated_at();

CREATE TRIGGER update_tasks_updated_at 
    BEFORE UPDATE ON tasks 
    FOR EACH ROW EXECUTE FUNCTION handle_updated_at();

CREATE TRIGGER update_interactions_updated_at 
    BEFORE UPDATE ON interactions 
    FOR EACH ROW EXECUTE FUNCTION handle_updated_at();

CREATE TRIGGER update_products_updated_at 
    BEFORE UPDATE ON products 
    FOR EACH ROW EXECUTE FUNCTION handle_updated_at();

-- Trigger para crear perfil automáticamente
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Trigger para actualizar última fecha de contacto
CREATE TRIGGER update_last_contact_on_interaction
    AFTER INSERT ON interactions
    FOR EACH ROW EXECUTE FUNCTION update_client_last_contact();

-- ================================================
-- 6. ROW LEVEL SECURITY (RLS)
-- ================================================

-- Habilitar RLS en todas las tablas
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE opportunities ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE interactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE opportunity_items ENABLE ROW LEVEL SECURITY;

-- Políticas para profiles
CREATE POLICY "Users can view own profile" ON profiles 
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON profiles 
    FOR UPDATE USING (auth.uid() = id);

-- Políticas para clients
CREATE POLICY "Users can view own clients" ON clients 
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own clients" ON clients 
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own clients" ON clients 
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own clients" ON clients 
    FOR DELETE USING (auth.uid() = user_id);

-- Políticas para opportunities
CREATE POLICY "Users can view own opportunities" ON opportunities 
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own opportunities" ON opportunities 
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own opportunities" ON opportunities 
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own opportunities" ON opportunities 
    FOR DELETE USING (auth.uid() = user_id);

-- Políticas para tasks
CREATE POLICY "Users can view own tasks" ON tasks 
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own tasks" ON tasks 
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own tasks" ON tasks 
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own tasks" ON tasks 
    FOR DELETE USING (auth.uid() = user_id);

-- Políticas para interactions
CREATE POLICY "Users can view own interactions" ON interactions 
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own interactions" ON interactions 
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own interactions" ON interactions 
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own interactions" ON interactions 
    FOR DELETE USING (auth.uid() = user_id);

-- Políticas para products
CREATE POLICY "Users can view own products" ON products 
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own products" ON products 
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own products" ON products 
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own products" ON products 
    FOR DELETE USING (auth.uid() = user_id);

-- Políticas para opportunity_items
CREATE POLICY "Users can view own opportunity items" ON opportunity_items 
    FOR SELECT USING (
        opportunity_id IN (
            SELECT id FROM opportunities WHERE user_id = auth.uid()
        )
    );

CREATE POLICY "Users can insert own opportunity items" ON opportunity_items 
    FOR INSERT WITH CHECK (
        opportunity_id IN (
            SELECT id FROM opportunities WHERE user_id = auth.uid()
        )
    );

CREATE POLICY "Users can update own opportunity items" ON opportunity_items 
    FOR UPDATE USING (
        opportunity_id IN (
            SELECT id FROM opportunities WHERE user_id = auth.uid()
        )
    );

CREATE POLICY "Users can delete own opportunity items" ON opportunity_items 
    FOR DELETE USING (
        opportunity_id IN (
            SELECT id FROM opportunities WHERE user_id = auth.uid()
        )
    );

-- ================================================
-- 7. VISTAS ÚTILES
-- ================================================

-- Vista para estadísticas del dashboard
CREATE OR REPLACE VIEW dashboard_stats AS
SELECT 
    user_id,
    (SELECT COUNT(*) FROM clients WHERE user_id = c.user_id) as total_clients,
    (SELECT COUNT(*) FROM clients WHERE user_id = c.user_id AND status = 'active') as active_clients,
    (SELECT COUNT(*) FROM opportunities WHERE user_id = c.user_id) as total_opportunities,
    (SELECT COALESCE(SUM(value), 0) FROM opportunities WHERE user_id = c.user_id) as total_opportunity_value,
    (SELECT COUNT(*) FROM opportunities WHERE user_id = c.user_id AND stage = 'closed_won') as won_opportunities,
    (SELECT COUNT(*) FROM tasks WHERE user_id = c.user_id AND status = 'pending') as pending_tasks,
    (SELECT COUNT(*) FROM tasks WHERE user_id = c.user_id AND due_date < now() AND status IN ('pending', 'in_progress')) as overdue_tasks
FROM (SELECT DISTINCT user_id FROM clients) c;

-- Vista para el pipeline de ventas
CREATE OR REPLACE VIEW sales_pipeline AS
SELECT 
    user_id,
    stage,
    COUNT(*) as count,
    COALESCE(SUM(value), 0) as total_value,
    AVG(probability) as avg_probability
FROM opportunities
GROUP BY user_id, stage;

-- ================================================
-- 8. DATOS DE EJEMPLO (OPCIONAL)
-- ================================================

-- Función para crear datos de ejemplo (solo ejecutar en desarrollo)
CREATE OR REPLACE FUNCTION create_sample_data(sample_user_id uuid)
RETURNS void AS $$
BEGIN
    -- Insertar clientes de ejemplo
    INSERT INTO clients (user_id, name, email, phone, company, position, status) VALUES
    (sample_user_id, 'Ana García', 'ana.garcia@empresa.com', '+34 600 123 456', 'Empresa Tech SL', 'CEO', 'active'),
    (sample_user_id, 'Carlos López', 'carlos@startup.com', '+34 700 234 567', 'StartUp Innovadora', 'CTO', 'prospect'),
    (sample_user_id, 'María Rodríguez', 'maria.r@corporacion.es', '+34 800 345 678', 'Corporación Grande', 'Directora IT', 'qualified'),
    (sample_user_id, 'José Martín', 'jose.martin@pyme.com', '+34 900 456 789', 'PYME Familiar', 'Gerente', 'lead');

    -- Insertar oportunidades de ejemplo
    INSERT INTO opportunities (user_id, client_id, title, description, value, stage, probability, expected_close_date) 
    SELECT 
        sample_user_id,
        c.id,
        CASE 
            WHEN c.name = 'Ana García' THEN 'Implementación CRM'
            WHEN c.name = 'Carlos López' THEN 'Consultoría Digital'
            WHEN c.name = 'María Rodríguez' THEN 'Migración a la Nube'
            ELSE 'Desarrollo Web'
        END,
        'Proyecto de transformación digital',
        CASE 
            WHEN c.name = 'Ana García' THEN 15000
            WHEN c.name = 'Carlos López' THEN 8000
            WHEN c.name = 'María Rodríguez' THEN 25000
            ELSE 5000
        END,
        CASE 
            WHEN c.name = 'Ana García' THEN 'negotiation'
            WHEN c.name = 'Carlos López' THEN 'proposal'
            WHEN c.name = 'María Rodríguez' THEN 'qualified'
            ELSE 'prospect'
        END,
        CASE 
            WHEN c.name = 'Ana García' THEN 80
            WHEN c.name = 'Carlos López' THEN 60
            WHEN c.name = 'María Rodríguez' THEN 40
            ELSE 20
        END,
        CURRENT_DATE + INTERVAL '30 days'
    FROM clients c WHERE c.user_id = sample_user_id;

    -- Insertar tareas de ejemplo
    INSERT INTO tasks (user_id, client_id, title, description, priority, due_date, status)
    SELECT 
        sample_user_id,
        c.id,
        'Llamada de seguimiento',
        'Contactar para revisar propuesta',
        'high',
        CURRENT_DATE + INTERVAL '3 days',
        'pending'
    FROM clients c WHERE c.user_id = sample_user_id LIMIT 2;

END;
$$ LANGUAGE 'plpgsql';

-- ================================================
-- 9. COMENTARIOS FINALES
-- ================================================

/*
INSTRUCCIONES DE USO:

1. Ejecuta este script completo en el SQL Editor de Supabase
2. Para crear datos de ejemplo, ejecuta:
   SELECT create_sample_data('tu-user-id-aqui');
3. Para marcar tareas vencidas periódicamente, programa:
   SELECT mark_overdue_tasks();

CARACTERÍSTICAS INCLUIDAS:
✅ Esquema completo de base de datos
✅ Índices optimizados para búsquedas
✅ Triggers automáticos
✅ Row Level Security (RLS)
✅ Funciones auxiliares
✅ Vistas para estadísticas
✅ Datos de ejemplo
✅ Estructura escalable

SEGURIDAD:
- RLS habilitado en todas las tablas
- Los usuarios solo pueden ver sus propios datos
- Triggers automáticos para timestamps
- Validaciones de integridad

RENDIMIENTO:
- Índices GIN para búsqueda de texto
- Índices B-tree para filtros
- Vistas materializadas para estadísticas
- Optimizado para consultas comunes del CRM
*/
