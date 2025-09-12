#!/usr/bin/env node

/**
 * Test Runner Script
 * Ejecuta la suite completa de pruebas con diferentes opciones
 */

const { execSync } = require('child_process');
const path = require('path');

const args = process.argv.slice(2);
const command = args[0] || 'all';

console.log('🚀 Ejecutando suite de pruebas...\n');

// Configuración de comandos
const commands = {
  all: {
    cmd: 'npm run test:run',
    description: 'Ejecutar todas las pruebas'
  },
  coverage: {
    cmd: 'npm run test:coverage',
    description: 'Ejecutar pruebas con reporte de cobertura'
  },
  watch: {
    cmd: 'npm run test',
    description: 'Ejecutar pruebas en modo watch'
  },
  auth: {
    cmd: 'npm run test:run -- src/test/__tests__/auth.test.ts',
    description: 'Ejecutar solo pruebas de autenticación'
  },
  db: {
    cmd: 'npm run test:run -- src/test/__tests__/db.test.ts',
    description: 'Ejecutar solo pruebas de base de datos'
  },
  api: {
    cmd: 'npm run test:run -- src/test/__tests__/api.test.ts',
    description: 'Ejecutar solo pruebas de API'
  },
  components: {
    cmd: 'npm run test:run -- src/test/__tests__/components/',
    description: 'Ejecutar solo pruebas de componentes'
  },
  middleware: {
    cmd: 'npm run test:run -- src/test/__tests__/middleware.test.ts',
    description: 'Ejecutar solo pruebas de middleware'
  },
  validation: {
    cmd: 'npm run test:run -- src/test/__tests__/validation.test.ts',
    description: 'Ejecutar solo pruebas de validación'
  }
};

function showHelp() {
  console.log('📋 Comandos disponibles:\n');
  Object.entries(commands).forEach(([key, { description }]) => {
    console.log(`  ${key.padEnd(12)} - ${description}`);
  });
  console.log('\n📝 Ejemplos de uso:');
  console.log('  node test-runner.js all');
  console.log('  node test-runner.js coverage');
  console.log('  node test-runner.js auth');
  console.log('  node test-runner.js components');
}

function runCommand(cmd, description) {
  try {
    console.log(`📦 ${description}...`);
    console.log(`🔧 Ejecutando: ${cmd}\n`);

    const result = execSync(cmd, {
      stdio: 'inherit',
      cwd: path.join(__dirname, '..')
    });

    console.log(`✅ ${description} completado exitosamente!\n`);
    return true;
  } catch (error) {
    console.error(`❌ Error ejecutando ${description}:`);
    console.error(error.message);
    return false;
  }
}

async function main() {
  if (command === 'help' || command === '--help' || command === '-h') {
    showHelp();
    return;
  }

  const selectedCommand = commands[command];

  if (!selectedCommand) {
    console.error(`❌ Comando '${command}' no encontrado.`);
    console.log('\nComandos disponibles:');
    Object.keys(commands).forEach(cmd => console.log(`  - ${cmd}`));
    console.log('\nEjecuta "node test-runner.js help" para más información.');
    process.exit(1);
  }

  const success = runCommand(selectedCommand.cmd, selectedCommand.description);

  if (!success) {
    console.log('\n💡 Sugerencias para solucionar problemas:');
    console.log('  - Verifica que todas las dependencias estén instaladas: npm install');
    console.log('  - Revisa los archivos de configuración de Vitest');
    console.log('  - Verifica que los mocks estén correctamente configurados');
    console.log('  - Ejecuta "npm run type-check" para verificar tipos TypeScript');
    process.exit(1);
  }

  console.log('🎉 Suite de pruebas ejecutada exitosamente!');
}

// Ejecutar el script
main().catch(error => {
  console.error('💥 Error fatal:', error);
  process.exit(1);
});
