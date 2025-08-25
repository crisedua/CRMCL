# 🗄️ Configuración de Base de Datos - Supabase

## 📋 Pasos para Configurar tu CRM

### 1. Crear Proyecto en Supabase

1. Ve a [supabase.com](https://supabase.com)
2. Inicia sesión o crea una cuenta
3. Haz clic en "New Project"
4. Completa los datos:
   - **Name**: CRM Pro
   - **Database Password**: (elige una contraseña segura)
   - **Region**: Selecciona la más cercana a ti
5. Haz clic en "Create new project"
6. Espera 2-3 minutos a que se complete la configuración

### 2. Ejecutar el Schema SQL

1. En tu proyecto de Supabase, ve a **SQL Editor** (icono de datos en el menú lateral)
2. Haz clic en "New Query"
3. Copia **TODO** el contenido del archivo `supabase-schema-completo.sql`
4. Pégalo en el editor
5. Haz clic en **"Run"** (botón verde)
6. Verifica que aparezca "Success. No rows returned" 

### 3. Verificar Tablas Creadas

Ve a **Table Editor** y verifica que se crearon estas tablas:
- ✅ `profiles`
- ✅ `clients`
- ✅ `opportunities`
- ✅ `tasks`
- ✅ `interactions`
- ✅ `products`
- ✅ `opportunity_items`

### 4. Configurar Variables de Entorno

1. En Supabase, ve a **Settings** → **API**
2. Copia estos valores:

```env
# Crea archivo .env.local en la raíz del proyecto
NEXT_PUBLIC_SUPABASE_URL=https://tu-proyecto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu-clave-publica-aqui
SUPABASE_SERVICE_ROLE_KEY=tu-clave-servicio-aqui
```

### 5. Configurar Autenticación

1. Ve a **Authentication** → **Settings**
2. En **Site URL**, añade: `http://localhost:3000`
3. En **Redirect URLs**, añade:
   - `http://localhost:3000/auth/callback`
   - `https://tu-dominio.netlify.app/auth/callback` (para producción)

### 6. Configurar Storage (Opcional)

Si quieres subir avatares:
1. Ve a **Storage**
2. Crea un bucket llamado "avatars"
3. Haz el bucket público

## 🧪 Datos de Prueba

Para crear datos de ejemplo y probar la aplicación:

```sql
-- Ejecuta esto en SQL Editor después de registrar tu primera cuenta
-- Reemplaza 'tu-user-id' con tu ID real de usuario
SELECT create_sample_data('tu-user-id-aqui');
```

Para encontrar tu user ID:
```sql
-- Ejecuta esto para ver tu ID de usuario
SELECT id, email FROM auth.users;
```

## 🔧 Configuraciones Adicionales

### Configurar Row Level Security (RLS)

El RLS ya está configurado automáticamente. Cada usuario solo puede ver sus propios datos.

### Configurar Webhooks (Opcional)

Si quieres notificaciones en tiempo real:
1. Ve a **Database** → **Webhooks**
2. Configura webhooks para las tablas que necesites

### Backup Automático

Supabase hace backups automáticos, pero puedes configurar backups adicionales en **Settings** → **Database**.

## 🚀 Verificar Funcionamiento

1. Ejecuta `npm run dev` en tu proyecto
2. Ve a `http://localhost:3000`
3. Regístrate con un email
4. Deberías poder acceder al dashboard
5. Prueba crear un cliente, oportunidad y tarea

## 🔍 Troubleshooting

### Error: "supabaseUrl is required"
- Verifica que el archivo `.env.local` existe
- Reinicia el servidor de desarrollo

### Error: "Row Level Security"
- Verifica que ejecutaste todo el SQL
- Comprueba que las políticas RLS están activas

### Error: "Failed to fetch"
- Verifica las URLs en la configuración
- Comprueba la conexión a internet

### No puedo ver mis datos
- Verifica que estás usando el mismo email para registro
- Comprueba que las políticas RLS están configuradas

## 📊 Consultas Útiles

```sql
-- Ver estadísticas de tu CRM
SELECT * FROM dashboard_stats WHERE user_id = auth.uid();

-- Ver pipeline de ventas
SELECT * FROM sales_pipeline WHERE user_id = auth.uid();

-- Marcar tareas vencidas
SELECT mark_overdue_tasks();

-- Ver todas las tablas
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public';
```

## 🎯 Próximos Pasos

Una vez configurado todo:
1. ✅ Registra tu cuenta
2. ✅ Crea algunos clientes de prueba
3. ✅ Agrega oportunidades
4. ✅ Programa tareas
5. ✅ Revisa el dashboard

¡Tu CRM estará listo para usar! 🎉
