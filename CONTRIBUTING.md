# 🤝 Contribuciones al CRM Pro

¡Gracias por tu interés en contribuir al proyecto CRM Pro! Este documento te guiará sobre cómo participar en el desarrollo.

## 🚀 Cómo Contribuir

### 1. Fork del Repositorio
```bash
# Haz un fork desde GitHub y luego clona tu fork
git clone https://github.com/tu-usuario/CRMCL.git
cd CRMCL
```

### 2. Configurar el Entorno
```bash
# Instalar dependencias
npm install

# Configurar variables de entorno
cp env.example .env.local
# Edita .env.local con tus credenciales de Supabase
```

### 3. Crear Rama para tu Feature
```bash
git checkout -b feature/nueva-funcionalidad
# o
git checkout -b fix/correccion-bug
```

### 4. Realizar Cambios
- Sigue las convenciones de código existentes
- Añade comentarios cuando sea necesario
- Asegúrate de que el código sea responsivo
- Verifica que funcione en móvil y escritorio

### 5. Testing
```bash
# Verificar que la aplicación compile
npm run build

# Ejecutar en desarrollo
npm run dev

# Verificar linting
npm run lint
```

### 6. Commit y Push
```bash
# Usar conventional commits
git add .
git commit -m "feat: añadir nueva funcionalidad de reportes"
# o
git commit -m "fix: corregir error en filtro de clientes"

git push origin feature/nueva-funcionalidad
```

### 7. Crear Pull Request
- Ve a GitHub y crea un Pull Request
- Describe claramente los cambios realizados
- Incluye capturas de pantalla si hay cambios visuales
- Menciona si hay breaking changes

## 📋 Tipos de Contribuciones

### 🆕 Nuevas Funcionalidades
- Sistema de notificaciones
- Reportes y analytics avanzados
- Integración con APIs externas
- Plantillas de email
- Automatizaciones

### 🐛 Corrección de Bugs
- Errores de UI/UX
- Problemas de rendimiento
- Bugs en la lógica de negocio
- Problemas de compatibilidad

### 📚 Documentación
- Mejorar README
- Añadir ejemplos de uso
- Documentar APIs
- Traducciones

### 🎨 Mejoras de Diseño
- Nuevos componentes UI
- Mejoras de accesibilidad
- Optimizaciones responsive
- Nuevos temas/colores

## 📏 Estándares de Código

### TypeScript
- Usar tipos explícitos
- Evitar `any` cuando sea posible
- Crear interfaces para objetos complejos

### React/Next.js
- Usar hooks cuando sea apropiado
- Componentes funcionales preferidos
- Usar `'use client'` solo cuando sea necesario

### Estilos
- Usar Tailwind CSS
- Seguir sistema de diseño existente
- Mantener consistencia visual

### Naming Conventions
- Componentes: PascalCase
- Funciones: camelCase
- Archivos: kebab-case
- Constantes: UPPER_SNAKE_CASE

## 🗂️ Estructura de Archivos

```
src/
├── app/                 # App Router de Next.js
│   ├── auth/           # Páginas de autenticación
│   ├── dashboard/      # Dashboard y páginas internas
│   └── page.tsx        # Landing page
├── components/         # Componentes reutilizables
│   ├── ui/            # Componentes base
│   ├── auth/          # Componentes de auth
│   ├── clients/       # Componentes de clientes
│   └── ...
├── lib/               # Configuraciones y servicios
├── types/             # Definiciones TypeScript
└── utils/             # Utilidades y helpers
```

## 🔍 Proceso de Review

### Checklist antes del PR
- [ ] El código compila sin errores
- [ ] No hay warnings de linting
- [ ] La funcionalidad funciona correctamente
- [ ] Es responsive en móvil y escritorio
- [ ] Se mantiene la consistencia de diseño
- [ ] Se han añadido tipos TypeScript apropiados
- [ ] Se ha probado con datos reales

### Lo que evaluamos
- **Funcionalidad**: ¿Funciona como se espera?
- **Código**: ¿Es limpio y mantenible?
- **Diseño**: ¿Se integra bien con el diseño existente?
- **Performance**: ¿No afecta negativamente el rendimiento?
- **Accesibilidad**: ¿Es accesible para todos los usuarios?

## 🚫 Qué NO Hacer

- No hacer cambios masivos sin discusión previa
- No romper funcionalidades existentes
- No ignorar las convenciones de código
- No subir credenciales o datos sensibles
- No hacer commits directamente a main

## 🆘 ¿Necesitas Ayuda?

- Abre un Issue para discutir ideas
- Revisa Issues existentes por trabajo en progreso
- Consulta la documentación en el README

## 🎯 Roadmap

### Próximas Funcionalidades
- [ ] Sistema de notificaciones push
- [ ] Reportes avanzados con gráficos
- [ ] Integración con email marketing
- [ ] App móvil nativa
- [ ] API pública
- [ ] Plantillas personalizables
- [ ] Automatización de workflows

### Mejoras Técnicas
- [ ] Tests automatizados
- [ ] Optimización de performance
- [ ] Internacionalización (i18n)
- [ ] Modo offline
- [ ] Websockets en tiempo real

¡Gracias por contribuir al CRM Pro! 🚀
