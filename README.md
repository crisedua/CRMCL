# CRM Pro - Sistema de Gestión de Relaciones con Clientes

Una aplicación CRM moderna y completa construida con Next.js 15, TypeScript, Tailwind CSS y Supabase.

## 🚀 Características

### Autenticación y Seguridad
- ✅ Registro e inicio de sesión con email/contraseña
- ✅ Autenticación segura con Supabase Auth
- ✅ Rutas protegidas y gestión de sesiones
- ✅ Row Level Security (RLS) en todas las tablas

### Gestión de Clientes
- ✅ CRUD completo de clientes
- ✅ Información detallada (nombre, email, teléfono, empresa, cargo)
- ✅ Estados de cliente (activo, inactivo, prospecto)
- ✅ Búsqueda y filtrado avanzado

### Pipeline de Ventas
- ✅ Gestión completa de oportunidades
- ✅ Etapas del pipeline (prospecto → calificado → propuesta → negociación → cerrado)
- ✅ Seguimiento de valor y probabilidad de cierre
- ✅ Métricas y análisis de conversión

### Sistema de Tareas
- ✅ Creación y gestión de tareas
- ✅ Prioridades (alta, media, baja)
- ✅ Estados (pendiente, en progreso, completada, cancelada)
- ✅ Fechas de vencimiento y alertas
- ✅ Vinculación con clientes y oportunidades

### Dashboard y Análisis
- ✅ Dashboard principal con métricas clave
- ✅ Estadísticas en tiempo real
- ✅ Indicadores de rendimiento
- ✅ Resumen de actividades

### Diseño y UX
- ✅ Interfaz moderna y responsiva
- ✅ Diseño limpio y profesional
- ✅ Experiencia móvil optimizada
- ✅ Estados de carga y manejo de errores

## 🛠️ Stack Tecnológico

- **Frontend**: Next.js 15 + TypeScript
- **UI Framework**: Tailwind CSS
- **Base de Datos**: Supabase (PostgreSQL)
- **Autenticación**: Supabase Auth
- **Formularios**: React Hook Form + Zod
- **Iconos**: Lucide React
- **Componentes**: Headless UI

## 📋 Requisitos Previos

- Node.js 18+ 
- npm o yarn
- Cuenta de Supabase

## 🚀 Instalación y Configuración

### 1. Clonar el repositorio
```bash
git clone <repository-url>
cd crm
```

### 2. Instalar dependencias
```bash
npm install
```

### 3. Configurar Supabase

1. Crea un nuevo proyecto en [Supabase](https://supabase.com)
2. Ejecuta el script SQL de `supabase-schema.sql` en el SQL Editor de Supabase
3. Copia las credenciales de tu proyecto

### 4. Variables de entorno

Crea un archivo `.env.local` en la raíz del proyecto:

```env
NEXT_PUBLIC_SUPABASE_URL=tu_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=tu_service_role_key
```

### 5. Ejecutar en desarrollo
```bash
npm run dev
```

La aplicación estará disponible en `http://localhost:3000`

## 📊 Estructura de la Base de Datos

### Tablas Principales

- **profiles**: Perfiles de usuario extendidos
- **clients**: Información de clientes y prospectos
- **opportunities**: Oportunidades de venta
- **tasks**: Tareas y recordatorios
- **interactions**: Historial de interacciones

### Características de Seguridad

- Row Level Security (RLS) habilitado en todas las tablas
- Los usuarios solo pueden acceder a sus propios datos
- Políticas de seguridad granulares
- Validación de datos en frontend y backend

## 🎯 Uso de la Aplicación

### Primer Uso

1. **Registro**: Crea tu cuenta desde la landing page
2. **Dashboard**: Accede al panel principal
3. **Clientes**: Agrega tus primeros clientes
4. **Oportunidades**: Crea oportunidades de venta
5. **Tareas**: Programa actividades y seguimientos

### Flujo de Trabajo Típico

1. **Agregar Cliente**: Registro completo con información de contacto
2. **Crear Oportunidad**: Vinculada al cliente con etapa y valor
3. **Programar Tareas**: Seguimiento y actividades relacionadas
4. **Actualizar Estados**: Mover oportunidades por el pipeline
5. **Revisar Métricas**: Analizar rendimiento en el dashboard

## 🚀 Despliegue

### Netlify (Recomendado)

1. Conecta tu repositorio con Netlify
2. Configura las variables de entorno
3. El build se realizará automáticamente

### Vercel

1. Conecta tu repositorio con Vercel
2. Configura las variables de entorno
3. Despliega automáticamente

### Build Commands

```bash
# Desarrollo
npm run dev

# Build
npm run build

# Inicio en producción
npm start

# Linting
npm run lint
```

## 📁 Estructura del Proyecto

```
src/
├── app/                    # App Router de Next.js
│   ├── auth/              # Páginas de autenticación
│   ├── dashboard/         # Panel principal y páginas internas
│   ├── globals.css        # Estilos globales
│   ├── layout.tsx         # Layout principal
│   └── page.tsx           # Landing page
├── components/            # Componentes reutilizables
│   ├── auth/             # Componentes de autenticación
│   ├── clients/          # Componentes de clientes
│   ├── dashboard/        # Componentes del dashboard
│   ├── opportunities/    # Componentes de oportunidades
│   ├── tasks/           # Componentes de tareas
│   └── ui/              # Componentes base de UI
├── lib/                  # Configuraciones y utilidades
│   ├── api.ts           # Servicios de API
│   ├── auth.ts          # Servicios de autenticación
│   └── supabase.ts      # Configuración de Supabase
├── types/               # Definiciones de TypeScript
├── utils/               # Utilidades y validaciones
└── ...
```

## 🔧 Personalización

### Temas y Colores

Los colores principales se definen en `tailwind.config.js`:

```javascript
colors: {
  primary: {
    50: '#eff6ff',
    500: '#3b82f6',
    600: '#2563eb',
    // ...
  }
}
```

### Componentes UI

Los componentes base están en `src/components/ui/` y se pueden personalizar según necesidades específicas.

## 🤝 Contribución

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📝 Licencia

Este proyecto está bajo la Licencia ISC.

## 🆘 Soporte

Si tienes problemas o preguntas:

1. Revisa la documentación
2. Verifica la configuración de Supabase
3. Consulta los logs de la aplicación
4. Crea un issue en el repositorio

## 🎨 Screenshots

### Landing Page
- Diseño moderno y profesional
- Call-to-action claros
- Información de características

### Dashboard
- Métricas en tiempo real
- Accesos rápidos
- Resumen de actividades

### Gestión de Clientes
- Lista organizada y filtrable
- Tarjetas informativas
- Formularios intuitivos

### Pipeline de Ventas
- Vista por etapas
- Seguimiento de valor
- Análisis de conversión

---

**CRM Pro** - Gestiona tus relaciones comerciales de manera profesional y eficiente.
