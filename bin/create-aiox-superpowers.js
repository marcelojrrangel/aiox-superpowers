#!/usr/bin/env node
'use strict';

const fs = require('fs');
const path = require('path');

const SOURCE_ROOT = path.resolve(__dirname, '..');

function printUsage() {
  console.log('Uso: npx create-aiox-superpowers <nome-do-projeto>');
  console.log('Ou:   npx github:marcelojrrangel/aiox-superpowers <nome-do-projeto>');
}

function validateProjectName(name) {
  if (!name) {
    console.error('Erro: Nome do projeto é obrigatório.');
    printUsage();
    process.exit(1);
  }
  if (!/^[a-zA-Z0-9_-]+$/.test(name)) {
    console.error('Erro: Nome do projeto deve conter apenas letras, números, hífens e underscores.');
    process.exit(1);
  }
}

function ensureDir(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

function copyDir(src, dst) {
  ensureDir(dst);
  const entries = fs.readdirSync(src, { withFileTypes: true });
  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const dstPath = path.join(dst, entry.name);
    if (entry.isDirectory()) {
      copyDir(srcPath, dstPath);
    } else {
      fs.copyFileSync(srcPath, dstPath);
    }
  }
}

function copyFile(src, dst) {
  if (fs.existsSync(src)) {
    fs.copyFileSync(src, dst);
    return true;
  }
  return false;
}

function mergeOpencodeJson(srcFile, dstFile) {
  if (!fs.existsSync(dstFile)) {
    copyFile(srcFile, dstFile);
    return;
  }

  const src = JSON.parse(fs.readFileSync(srcFile, 'utf8'));
  const dst = JSON.parse(fs.readFileSync(dstFile, 'utf8'));

  if (!dst.instructions) dst.instructions = [];
  if (!dst.instructions.includes('.opencode/AGENTS.md')) {
    dst.instructions.push('.opencode/AGENTS.md');
  }

  if (src.agent) {
    if (!dst.agent) dst.agent = {};
    for (const [k, v] of Object.entries(src.agent)) {
      if (!dst.agent[k]) dst.agent[k] = v;
    }
  }

  if (src.command) {
    if (!dst.command) dst.command = {};
    for (const [k, v] of Object.entries(src.command)) {
      if (!dst.command[k]) dst.command[k] = v;
    }
  }

  fs.writeFileSync(dstFile, JSON.stringify(dst, null, 2) + '\n');
}

function main() {
  const args = process.argv.slice(2);

  if (args.includes('--help') || args.includes('-h')) {
    printUsage();
    process.exit(0);
  }

  const projectName = args[0];
  validateProjectName(projectName);

  const targetDir = path.resolve(process.cwd(), projectName);

  if (fs.existsSync(targetDir)) {
    console.error(`Erro: O diretório "${projectName}" já existe.`);
    process.exit(1);
  }

  const DIRS_TO_COPY = [
    '.opencode/skills',
    '.opencode/tools',
    '.opencode/plugins',
    '.aiox-core',
  ];

  const FILES_TO_COPY = [
    '.opencode/AGENTS.md',
    'opencode.json',
  ];

  const DIRS_TO_CREATE = [
    '.opencode/logs',
    'docs/designs',
    'docs/plans',
    '.agent/workflows',
  ];

  console.log('');
  console.log('========================================');
  console.log(' AIOX Superpowers - Criando projeto...');
  console.log('========================================');
  console.log('');

  ensureDir(targetDir);

  console.log('>> Criando diretórios...');
  for (const dir of DIRS_TO_CREATE) {
    ensureDir(path.join(targetDir, dir));
  }

  console.log('>> Copiando diretórios...');
  for (const dir of DIRS_TO_COPY) {
    const src = path.join(SOURCE_ROOT, dir);
    const dst = path.join(targetDir, dir);
    if (fs.existsSync(src)) {
      copyDir(src, dst);
      console.log(`  ${dir} -> ${dir}`);
    }
  }

  console.log('>> Copiando arquivos...');
  for (const file of FILES_TO_COPY) {
    const src = path.join(SOURCE_ROOT, file);
    const dst = path.join(targetDir, file);
    if (file === 'opencode.json') {
      mergeOpencodeJson(src, dst);
      console.log('  opencode.json -> opencode.json (merge)');
    } else if (copyFile(src, dst)) {
      console.log(`  ${file} -> ${file}`);
    }
  }

  const opencodePackageJson = path.join(targetDir, '.opencode', 'package.json');
  if (!fs.existsSync(opencodePackageJson)) {
    fs.writeFileSync(
      opencodePackageJson,
      JSON.stringify({ dependencies: { '@opencode-ai/plugin': '1.17.18' } }, null, 2) + '\n'
    );
    console.log('  .opencode/package.json -> .opencode/package.json');
  }

  const opencodeLock = path.join(SOURCE_ROOT, '.opencode', 'package-lock.json');
  const dstLock = path.join(targetDir, '.opencode', 'package-lock.json');
  if (fs.existsSync(opencodeLock)) {
    copyFile(opencodeLock, dstLock);
    console.log('  .opencode/package-lock.json -> .opencode/package-lock.json');
  }

  console.log('');
  console.log('========================================');
  console.log(' AIOX Superpowers instalado com sucesso!');
  console.log('========================================');
  console.log('');
  console.log(` Projeto : ${targetDir}`);
  console.log('');
  console.log(' Estrutura adicionada:');
  console.log('   .opencode/AGENTS.md   - Instrucoes mestre');
  console.log('   .opencode/skills/     - 22 skills');
  console.log('   .opencode/tools/      - 5 tools');
  console.log('   .opencode/plugins/    - Plugin bootstrap');
  console.log('   .aiox-core/workflows/ - 6 workflows');
  console.log('');
   console.log(' Proximos passos:');
   console.log(`   1. Acesse o projeto:  cd ${projectName}`);
   console.log('   2. Instale dependencias:  cd .opencode && npm install');
   console.log('   3. Abra o projeto:     opencode');
   console.log('   4. Execute:            /aiox-init');
   console.log('   5. Veja ajuda:        /aiox-help');
  console.log('');
  console.log(' Comandos disponiveis:');
  console.log('   /aiox-help       - Ajuda do framework');
  console.log('   /aiox-brainstorm - Sessao de brainstorming');
  console.log('   /aiox-plan       - Criar plano de implementacao');
  console.log('   /aiox-workflow   - Executar workflow');
  console.log('   /aiox-story      - Gerenciar user stories');
  console.log('   /aiox-review     - Code review');
  console.log('   /aiox-status     - Status do projeto');
  console.log('========================================');
}

main();
