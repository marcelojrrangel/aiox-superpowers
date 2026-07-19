---
name: finishing-a-development-branch
description: Use quando todas as tarefas de uma branch estão prontas. Guia decisão de merge/PR, limpeza e integração.
---

# Skill de Finishing a Development Branch

## Checklist Pré-Merge

### 1. Verificar Todas as Tarefas Prontas
- [ ] Todas as tarefas planejadas implementadas
- [ ] Todos os testes passam
- [ ] Sem TODO/FIXME pendentes
- [ ] Documentação atualizada

### 2. Qualidade do Código
- [ ] Self-review concluído
- [ ] Sem conflitos de merge
- [ ] Branch está atualizada com main
- [ ] Sem dados sensíveis commitados

### 3. Testes
- [ ] Testes unitários passam
- [ ] Testes de integração passam
- [ ] Teste manual concluído
- [ ] Sem regressões identificadas

## Decisão: Merge, PR ou Manter

### Opção A: Merge Direto
Use quando:
- Mudança pequena e isolada
- Todos os testes passam
- Sem necessidade de review
- Você tem permissões de merge

```bash
git checkout main
git merge feature-branch
git push origin main
git worktree remove ../feature-branch
git branch -d feature-branch
```

### Opção B: Pull Request
Use quando:
- Mudança significativa
- Review seria valioso
- Múltiplos arquivos afetados
- Possíveis mudanças quebradoras

```bash
git push origin feature-branch
# Criar PR com descrição
# Aguardar review e CI
# Merge após aprovação
```

### Opção C: Manter Branch
Use quando:
- Trabalho incompleto
- Precisa de mais testes
- Aguardando dependências
- Feature experimental

```bash
git push origin feature-branch
# Documentar o que falta fazer
# Criar issue para trabalho restante
```

## Limpeza
Após merge:
```bash
# Remover worktree
git worktree remove ../feature-branch

# Deletar branch local
git branch -d feature-branch

# Deletar branch remota (se PR foi merged)
git push origin --delete feature-branch

# Limpar referências de worktree obsoletas
git worktree prune
```

## Documentação
Atualize:
- CHANGELOG.md com as mudanças
- README.md se novas features foram adicionadas
- Quaisquer docs/ relevantes
