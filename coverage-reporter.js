#!/usr/bin/env node

/**
 * Coverage Reporter Script
 * Genera reportes de cobertura y verifica umbrales
 */

const fs = require('fs');
const path = require('path');

const COVERAGE_DIR = path.join(__dirname, '..', 'coverage');
const COVERAGE_FILE = path.join(COVERAGE_DIR, 'coverage-summary.json');

function loadCoverageData() {
  try {
    const data = fs.readFileSync(COVERAGE_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('❌ Error al cargar datos de cobertura:', error.message);
    console.log('💡 Ejecuta primero: npm run test:coverage');
    process.exit(1);
  }
}

function formatPercentage(value) {
  return `${value.toFixed(2)}%`;
}

function getStatusEmoji(value, threshold) {
  if (value >= threshold) return '✅';
  if (value >= threshold - 5) return '⚠️';
  return '❌';
}

function printCoverageReport(data) {
  console.log('📊 REPORTE DE COBERTURA DE PRUEBAS\n');
  console.log('=' .repeat(50));

  const thresholds = {
    branches: 75,
    functions: 80,
    lines: 80,
    statements: 80
  };

  const total = data.total;

  console.log('📈 COBERTURA GLOBAL:');
  Object.entries(thresholds).forEach(([metric, threshold]) => {
    const value = total[metric].pct;
    const status = getStatusEmoji(value, threshold);
    console.log(`  ${metric.padEnd(12)}: ${formatPercentage(value).padStart(8)} ${status}`);
  });

  console.log('\n📁 COBERTURA POR ARCHIVO:');
  console.log('-'.repeat(50));

  // Ordenar archivos por cobertura total
  const files = Object.entries(data)
    .filter(([key]) => key !== 'total')
    .sort(([, a], [, b]) => (b.lines.pct + b.functions.pct + b.branches.pct) -
                           (a.lines.pct + a.functions.pct + a.branches.pct));

  files.slice(0, 10).forEach(([file, coverage]) => {
    const avgCoverage = (coverage.lines.pct + coverage.functions.pct + coverage.branches.pct) / 3;
    const status = getStatusEmoji(avgCoverage, 75);
    console.log(`${status} ${file}`);
    console.log(`    Lines: ${formatPercentage(coverage.lines.pct)} | Functions: ${formatPercentage(coverage.functions.pct)} | Branches: ${formatPercentage(coverage.branches.pct)}`);
  });

  if (files.length > 10) {
    console.log(`\n... y ${files.length - 10} archivos más`);
  }

  console.log('\n🎯 UMBRALES DE CALIDAD:');
  console.log('-'.repeat(50));

  let allPassed = true;
  Object.entries(thresholds).forEach(([metric, threshold]) => {
    const value = total[metric].pct;
    const passed = value >= threshold;
    const status = passed ? '✅ PASA' : '❌ FALLA';
    console.log(`  ${metric.padEnd(12)}: ${formatPercentage(value).padStart(8)} >= ${formatPercentage(threshold)} ${status}`);
    if (!passed) allPassed = false;
  });

  console.log('\n' + '='.repeat(50));

  if (allPassed) {
    console.log('🎉 ¡TODOS LOS UMBRALES DE COBERTURA CUMPLIDOS!');
  } else {
    console.log('⚠️  Algunos umbrales no se cumplen. Revisa los archivos con baja cobertura.');
  }

  return allPassed;
}

function generateRecommendations(data) {
  console.log('\n💡 RECOMENDACIONES PARA MEJORAR COBERTURA:');
  console.log('-'.repeat(50));

  const total = data.total;
  const recommendations = [];

  if (total.branches.pct < 75) {
    recommendations.push('• Agregar pruebas para caminos alternativos (if/else, switch)');
  }

  if (total.functions.pct < 80) {
    recommendations.push('• Crear pruebas unitarias para funciones no testeadas');
  }

  if (total.lines.pct < 80) {
    recommendations.push('• Revisar líneas de código no ejecutadas en pruebas');
  }

  // Buscar archivos con baja cobertura
  const lowCoverageFiles = Object.entries(data)
    .filter(([key]) => key !== 'total')
    .filter(([, coverage]) => coverage.lines.pct < 70)
    .map(([file]) => file);

  if (lowCoverageFiles.length > 0) {
    recommendations.push(`• Mejorar cobertura en ${lowCoverageFiles.length} archivo(s) con baja cobertura`);
  }

  if (recommendations.length === 0) {
    console.log('✅ La cobertura está en niveles excelentes. ¡Buen trabajo!');
  } else {
    recommendations.forEach(rec => console.log(rec));
  }
}

function main() {
  const coverageData = loadCoverageData();
  const allPassed = printCoverageReport(coverageData);
  generateRecommendations(coverageData);

  console.log('\n📂 Reportes disponibles:');
  console.log('  • HTML: coverage/html/index.html');
  console.log('  • JSON: coverage/coverage-summary.json');
  console.log('  • LCOV: coverage/lcov.info');

  console.log('\n🔧 Comandos útiles:');
  console.log('  • Abrir reporte HTML: npm run coverage:report');
  console.log('  • Ejecutar pruebas: npm run test:all');

  if (!allPassed) {
    console.log('\n⚠️  Para CI/CD: Algunos umbrales no se cumplen.');
    process.exit(1);
  }
}

main();
