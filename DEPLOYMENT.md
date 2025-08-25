# 🚀 Guía de Despliegue - CRM Pro

## 📋 Opciones de Despliegue

### 🌐 Netlify (Recomendado)

#### Opción 1: Despliegue Automático desde GitHub

1. **Conectar Repositorio**:
   - Ve a [netlify.com](https://netlify.com)
   - Haz clic en "New site from Git"
   - Conecta tu cuenta de GitHub
   - Selecciona el repositorio `crisedua/CRMCL`

2. **Configurar Build**:
   - **Build command**: `npm run build`
   - **Publish directory**: `out`
   - **Node version**: `18`

3. **Variables de Entorno**:
   ```
   NEXT_PUBLIC_SUPABASE_URL=tu_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_supabase_anon_key
   ```

4. **Configurar Redirects**:
   - El archivo `netlify.toml` ya está configurado
   - Manejará las rutas de SPA automáticamente

#### Opción 2: Deploy Manual

```bash
# Clonar repositorio
git clone https://github.com/crisedua/CRMCL.git
cd CRMCL

# Instalar dependencias
npm install

# Configurar variables de entorno
cp env.example .env.local
# Editar .env.local con tus credenciales

# Build para producción
npm run build

# Deploy manual en Netlify
npx netlify deploy --prod --dir=out
```

### ▲ Vercel

1. **Importar Proyecto**:
   - Ve a [vercel.com](https://vercel.com)
   - Haz clic en "New Project"
   - Importa desde GitHub: `crisedua/CRMCL`

2. **Configurar Variables**:
   ```
   NEXT_PUBLIC_SUPABASE_URL=tu_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_supabase_anon_key
   ```

3. **Deploy**:
   - Vercel detectará automáticamente Next.js
   - El deploy será automático

### 🐳 Docker

```dockerfile
# Dockerfile ya incluido
FROM node:18-alpine

WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

EXPOSE 3000
CMD ["npm", "start"]
```

```bash
# Build y run
docker build -t crm-pro .
docker run -p 3000:3000 crm-pro
```

## 🔧 Configuración de Supabase para Producción

### 1. URLs Permitidas

En tu proyecto Supabase, ve a **Authentication > Settings**:

```
Site URL: https://tu-dominio.netlify.app
Redirect URLs: 
- https://tu-dominio.netlify.app/auth/callback
- https://tu-dominio.netlify.app
```

### 2. Variables de Entorno de Producción

```bash
# Producción
NEXT_PUBLIC_SUPABASE_URL=https://tu-proyecto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_clave_publica
```

### 3. CORS y Dominios

Asegúrate de que tu dominio esté en la lista de dominios permitidos en Supabase.

## 🔄 CI/CD Automático

### GitHub Actions ya configurado

El archivo `.github/workflows/deploy.yml` incluye:
- ✅ Build automático en cada push a main
- ✅ Deploy automático a Netlify
- ✅ Verificación de tipos TypeScript
- ✅ Linting automático

### Configurar Secrets en GitHub

Ve a tu repositorio > Settings > Secrets and variables > Actions:

```
NETLIFY_AUTH_TOKEN=tu_token_netlify
NETLIFY_SITE_ID=tu_site_id
NEXT_PUBLIC_SUPABASE_URL=tu_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_supabase_anon_key
```

## 🌍 Custom Domain

### Netlify
1. Ve a Domain settings en tu site de Netlify
2. Add custom domain
3. Configura DNS:
   ```
   CNAME www tu-site.netlify.app
   ALIAS @ tu-site.netlify.app
   ```

### SSL/HTTPS
- Netlify y Vercel proporcionan HTTPS automático
- Para dominios custom, el certificado se genera automáticamente

## 📊 Monitoreo y Analytics

### Netlify Analytics
```toml
# netlify.toml ya incluye configuración básica
[build]
  publish = "out"
  command = "npm run build"
```

### Logs y Debugging
```bash
# Ver logs de build
netlify logs

# Deploy con debug
netlify deploy --debug
```

## 🔒 Seguridad en Producción

### Headers de Seguridad
El archivo `netlify.toml` incluye:
- X-Frame-Options: DENY
- X-XSS-Protection: 1; mode=block
- X-Content-Type-Options: nosniff
- Referrer-Policy: strict-origin-when-cross-origin

### Variables de Entorno
- ✅ Nunca subas archivos `.env.local` al repositorio
- ✅ Usa variables de entorno específicas para cada ambiente
- ✅ Rota las claves regularmente

## 🚨 Troubleshooting

### Error: "Build failed"
```bash
# Verificar build local
npm run build

# Limpiar cache
rm -rf .next node_modules
npm install
npm run build
```

### Error: "Supabase connection"
- Verifica URLs en variables de entorno
- Confirma que el dominio está permitido en Supabase
- Revisa las claves de API

### Error: "Routes not working"
- Verifica que `netlify.toml` tenga los redirects correctos
- Para SPA: `/* /index.html 200`

### Error: "Environment variables not found"
- En Netlify: Site settings > Environment variables
- En Vercel: Project settings > Environment Variables
- Asegúrate de que empiecen con `NEXT_PUBLIC_`

## 📈 Performance

### Optimizaciones incluidas
- ✅ Compresión automática
- ✅ Imágenes optimizadas
- ✅ Code splitting
- ✅ Static generation
- ✅ CSS optimizado

### Métricas
- Lighthouse score: >90
- First Contentful Paint: <2s
- Time to Interactive: <3s

¡Tu CRM Pro está listo para producción! 🎉
