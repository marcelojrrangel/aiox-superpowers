---
name: executing-plans
description: Use quando o plano está pronto para implementação. Executa tarefas em lotes com checkpoints humanos.
---

# Skill de Executing Plans

## Estratégia de Execução

### Processamento em Lotes
- Execute 3-5 tarefas por lote
- Pause para checkpoint humano após cada lote
- Verifique integração entre lotes

### Ordem de Execução
1. Comece com tarefas fundamentais (modelos de dados, interfaces)
2. Construa funcionalidade principal
3. Adicione pontos de integração
4. Implemente casos extremos
5. Verificação final

## Execução por Tarefa

### Por Tarefa
1. Verifique se dependências foram atendidas
2. Carregue skills relevantes (TDD, debugging, etc.)
3. Implemente com testes
4. Execute checklist de verificação
5. Atualize status da tarefa no plano

### Entre Tarefas
1. Execute suíte completa de testes
2. Verifique conflitos
3. Atualize documentação
4. Faça commit com mensagem clara

## Checkpoints Humanos

### Após Cada Lote
- Mostre o que foi concluído
- Destaque quaisquer problemas encontrados
- Peça aprovação para continuar
- Ajuste o plano se necessário

### Modelo de Checkpoint
```markdown
## Lote N Concluído

### Concluído
- [Tarefa 1] — [descrição breve]
- [Tarefa 2] — [descrição breve]

### Problemas Encontrados
- [Quaisquer problemas e como foram resolvidos]

### Próximo Lote
- [Tarefas a serem completadas]

### Aprovação Necessária
- [ ] Continuar com próximo lote
- [ ] Ajustar plano baseado em descobertas
```

## Acompanhamento de Progresso
Atualize documento do plano com:
- Tarefas concluídas
- Tempo gasto por tarefa
- Problemas encontrados
- Ajustes feitos

## Anti-padrões
- Executar todas as tarefas sem checkpoints
- Não rodar testes entre lotes
- Ignorar problemas de integração
- Apressar sem verificação
