#!/usr/bin/env node

const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

// Colores para la consola
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m'
};

// Función para imprimir con colores
function colorLog(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

// Función para ejecutar comandos
function runCommand(command, args, cwd, description) {
  return new Promise((resolve, reject) => {
    colorLog(`\n🚀 ${description}`, 'cyan');
    colorLog(`📁 Directorio: ${cwd}`, 'blue');
    colorLog(`⚡ Comando: ${command} ${args.join(' ')}`, 'yellow');
    
    const child = spawn(command, args, {
      cwd,
      stdio: 'inherit',
      shell: true
    });

    child.on('close', (code) => {
      if (code === 0) {
        colorLog(`✅ ${description} - Completado exitosamente`, 'green');
        resolve();
      } else {
        colorLog(`❌ ${description} - Falló con código ${code}`, 'red');
        reject(new Error(`Command failed with exit code ${code}`));
      }
    });

    child.on('error', (error) => {
      colorLog(`❌ Error ejecutando ${description}: ${error.message}`, 'red');
      reject(error);
    });
  });
}

// Función para verificar si existe un directorio
function directoryExists(dir) {
  try {
    return fs.statSync(dir).isDirectory();
  } catch (error) {
    return false;
  }
}

// Función para instalar dependencias si es necesario
async function installDependencies(testDir, type) {
  const packageJsonPath = path.join(testDir, 'package.json');
  const nodeModulesPath = path.join(testDir, 'node_modules');
  
  if (fs.existsSync(packageJsonPath) && !directoryExists(nodeModulesPath)) {
    colorLog(`📦 Instalando dependencias para tests de ${type}...`, 'magenta');
    await runCommand('npm', ['install'], testDir, `Instalación de dependencias - ${type}`);
  }
}

// Función principal
async function runTests() {
  const currentDir = process.cwd();
  // Si estamos en el directorio test, usar el directorio actual
  // Si estamos en el directorio raíz, usar el subdirectorio test
  const testDir = path.basename(currentDir) === 'test' ? currentDir : path.join(currentDir, 'test');
  const backendTestDir = path.join(testDir, 'backend');
  const frontendTestDir = path.join(testDir, 'frontend');

  colorLog('🧪 EJECUTOR DE TESTS - PLATAFORMA E-LEARNING', 'bright');
  colorLog('=' .repeat(50), 'cyan');

  try {
    // Verificar que existan los directorios de tests
    if (!directoryExists(testDir)) {
      throw new Error(`Directorio de tests no encontrado: ${testDir}`);
    }

    // Obtener argumentos de línea de comandos
    const args = process.argv.slice(2);
    const testType = args[0]; // 'backend', 'frontend', 'all', o undefined
    const testMode = args[1]; // 'watch', 'coverage', o undefined

    // Determinar qué tests ejecutar
    let runBackend = false;
    let runFrontend = false;

    switch (testType) {
      case 'backend':
        runBackend = true;
        break;
      case 'frontend':
        runFrontend = true;
        break;
      case 'all':
      case undefined:
        runBackend = directoryExists(backendTestDir);
        runFrontend = directoryExists(frontendTestDir);
        break;
      default:
        throw new Error(`Tipo de test inválido: ${testType}. Use: backend, frontend, o all`);
    }

    // Ejecutar tests del backend
    if (runBackend && directoryExists(backendTestDir)) {
      await installDependencies(backendTestDir, 'Backend');
      
      let backendArgs = [];
      switch (testMode) {
        case 'watch':
          backendArgs = ['run', 'test:watch'];
          break;
        case 'coverage':
          backendArgs = ['run', 'test:coverage'];
          break;
        default:
          backendArgs = ['test'];
      }
      
      await runCommand('npm', backendArgs, backendTestDir, 'Tests del Backend');
    }

    // Ejecutar tests del frontend
    if (runFrontend && directoryExists(frontendTestDir)) {
      await installDependencies(frontendTestDir, 'Frontend');
      
      let frontendArgs = [];
      switch (testMode) {
        case 'watch':
          frontendArgs = ['run', 'test:watch'];
          break;
        case 'coverage':
          frontendArgs = ['run', 'test:coverage'];
          break;
        default:
          frontendArgs = ['test'];
      }
      
      await runCommand('npm', frontendArgs, frontendTestDir, 'Tests del Frontend');
    }

    colorLog('\n🎉 TODOS LOS TESTS COMPLETADOS EXITOSAMENTE', 'green');
    colorLog('=' .repeat(50), 'green');

  } catch (error) {
    colorLog(`\n💥 ERROR: ${error.message}`, 'red');
    colorLog('=' .repeat(50), 'red');
    process.exit(1);
  }
}

// Mostrar ayuda si se solicita
if (process.argv.includes('--help') || process.argv.includes('-h')) {
  colorLog('🧪 EJECUTOR DE TESTS - PLATAFORMA E-LEARNING', 'bright');
  colorLog('=' .repeat(50), 'cyan');
  colorLog('\nUso:', 'yellow');
  colorLog('  node test/run-tests.js [tipo] [modo]', 'white');
  colorLog('\nTipos de test:', 'yellow');
  colorLog('  backend   - Solo tests del backend', 'white');
  colorLog('  frontend  - Solo tests del frontend', 'white');
  colorLog('  all       - Todos los tests (por defecto)', 'white');
  colorLog('\nModos:', 'yellow');
  colorLog('  watch     - Modo watch (re-ejecuta al cambiar archivos)', 'white');
  colorLog('  coverage  - Genera reporte de cobertura', 'white');
  colorLog('  (ninguno) - Ejecuta tests una vez (por defecto)', 'white');
  colorLog('\nEjemplos:', 'yellow');
  colorLog('  node test/run-tests.js', 'green');
  colorLog('  node test/run-tests.js backend', 'green');
  colorLog('  node test/run-tests.js frontend watch', 'green');
  colorLog('  node test/run-tests.js all coverage', 'green');
  colorLog('\n');
  process.exit(0);
}

// Ejecutar tests
runTests();