---
name: using-git-worktrees
description: Use após aprovação do design. Cria workspace isolado em nova branch, executa setup do projeto, verifica baseline limpa de testes.
---

# Skill de Using Git Worktrees

## Quando Usar
- Iniciando uma nova feature
- Precisa trabalhar em múltiplas features simultaneamente
- Quer experimentar sem afetar a branch principal
- Desenvolvimento paralelo por múltiplos agentes

## Processo

### 1. Criar Worktree
```bash
# Criar worktree com nova branch
git worktree add ../nome-feature -b nome-feature

# Ou criar com branch existente
git worktree add ../nome-feature branch-feature
```

### 2. Configurar Ambiente Isolado
```bash
cd ../nome-feature
npm install  # ou setup apropriado
npm test    # verificar baseline limpa
```

### 3. Trabalhar em Isolamento
- Faça mudanças no worktree
- Faça commits frequentes com mensagens claras
- Execute testes regularmente
- Faça push da branch quando pronta para review

### 4. Integração
```bash
# Do repositório principal
git worktree remove ../nome-feature
git merge nome-feature
# ou criar PR
```

## Gerenciamento de Worktrees
```bash
# Listar worktrees
git worktree list

# Mover worktree
git worktree move <antigo> <novo>

# Remover worktree
git worktree remove <caminho>

# Limpar worktrees obsoletos
git worktree prune
```

## Convenção de Nomes
- `../feature-autenticacao-usuario`
- `../fix-bug-login`
- `../refatorar-camada-api`

## Anti-padrões
- Trabalhar na worktree principal para novas features
- Não limpar worktrees após merge
- Esquecer de instalar dependências no novo worktree
- Não verificar baseline de testes antes de começar
