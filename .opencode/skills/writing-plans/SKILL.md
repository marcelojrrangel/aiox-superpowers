---
name: writing-plans
description: Use após aprovação do design. Divide o trabalho em tarefas pequenas (2-5 min cada) com caminhos de arquivo exatos, código completo e passos de verificação.
---

# Skill de Writing Plans

## Regras de Divisão de Tarefas

### Restrições de Tamanho
- Cada tarefa: 2-5 minutos de trabalho
- Se for maior, divida mais
- Cada tarefa produz uma incremento testável

### Estrutura da Tarefa
Cada tarefa deve incluir:
```
## Tarefa N: [Título Claro]

### Contexto
- O que foi feito antes
- O que esta tarefa accomplisha

### Arquivos a Criar/Modificar
- caminho/arquivo1.ts — [o que muda]
- caminho/arquivo2.ts — [o que muda]

### Passos
1. [Passo exato com trecho de código]
2. [Passo exato com trecho de código]
3. [Passo exato com trecho de código]

### Verificação
- [ ] Teste X passa
- [ ] Feature Y funciona como esperado
- [ ] Sem regressões em Z

### Dependências
- Depende da: Tarefa N-1
- Habilita: Tarefa N+1
```

## Princípios de Planejamento

### YAGNI (You Aren't Gonna Need It)
- Só construa o que está na spec
- Sem adições "enquanto estamos nisso"
- Resista à otimização prematura

### DRY (Don't Repeat Yourself)
- Extraia padrões comuns cedo
- Mas não abstraia cedo demais (veja YAGNI)

### TDD Primeiro
- Toda tarefa inclui escrever testes
- Testes vêm antes da implementação
- Verificação é parte de toda tarefa

## Formato do Documento de Plano
Salve em `docs/plans/<nome-da-feature>.md`:
- Visão geral da feature
- Lista de tarefas com dependências
- Tempo total estimado
- Avaliação de risco
- Estratégia de rollback

## Checklist de Verificação
Antes de finalizar o plano:
- [ ] Toda tarefa tem 2-5 minutos
- [ ] Toda tarefa tem passos de verificação
- [ ] Tarefas estão em ordem de dependência
- [ ] Nenhuma tarefa depende de suposições não comprovadas
- [ ] Estimativa total é realista
