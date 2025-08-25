#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🚀 Configurando CRM Pro...\n');

// Verificar si .env.local existe
const envLocalPath = path.join(__dirname, '.env.local');
const envExamplePath = path.join(__dirname, 'env.example');

if (!fs.existsSync(envLocalPath)) {
  if (fs.existsSync(envExamplePath)) {
    console.log('📋 Creando archivo .env.local desde env.example...');
    fs.copyFileSync(envExamplePath, envLocalPath);
    console.log('✅ Archivo .env.local creado exitosamente!');
  } else {
    console.log('❌ No se encontró env.example');
    process.exit(1);
  }
} else {
  console.log('✅ Archivo .env.local ya existe');
}

// Verificar configuración de Supabase
const envContent = fs.readFileSync(envLocalPath, 'utf8');
const hasSupabaseUrl = envContent.includes('NEXT_PUBLIC_SUPABASE_URL=https://');
const hasSupabaseKey = envContent.includes('NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ');

if (hasSupabaseUrl && hasSupabaseKey) {
  console.log('✅ Variables de Supabase configuradas correctamente');
} else {
  console.log('⚠️  Variables de Supabase no configuradas completamente');
  console.log('   Asegúrate de que .env.local contenga:');
  console.log('   - NEXT_PUBLIC_SUPABASE_URL');
  console.log('   - NEXT_PUBLIC_SUPABASE_ANON_KEY');
}

console.log('\n📊 Verificando conexión con Supabase...');

// Test básico de conexión
const { createClient } = require('@supabase/supabase-js');

try {
  // Leer variables de entorno
  require('dotenv').config({ path: envLocalPath });
  
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  
  if (!supabaseUrl || !supabaseKey) {
    console.log('❌ Variables de entorno no cargadas correctamente');
    console.log('   URL:', supabaseUrl ? '✅' : '❌');
    console.log('   Key:', supabaseKey ? '✅' : '❌');
    process.exit(1);
  }
  
  const supabase = createClient(supabaseUrl, supabaseKey);
  
  console.log('✅ Cliente de Supabase creado exitosamente');
  console.log('🎯 Proyecto Supabase:', supabaseUrl.split('//')[1].split('.')[0]);
  
} catch (error) {
  console.log('❌ Error al crear cliente de Supabase:', error.message);
}

console.log('\n🛠️  Próximos pasos:');
console.log('1. Ejecuta: npm run dev');
console.log('2. Ve a: http://localhost:3000');
console.log('3. Regístrate con un email para probar la aplicación');
console.log('4. Si hay errores, verifica la configuración de Supabase en el dashboard');

console.log('\n📚 Documentación:');
console.log('- README.md - Información general');
console.log('- INSTRUCCIONES-SUPABASE.md - Configuración de base de datos');
console.log('- DEPLOYMENT.md - Guía de despliegue');

console.log('\n🎉 Configuración completada!');
