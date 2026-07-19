---
name: subagent-driven-development
description: Use com plano aprovado. Despacha subagente novo para cada tarefa com review em duas etapas (conformidade com spec, depois qualidade do código).
---

# Skill de Subagent-Driven Development

## Processo de Dispatch

### Etapa 1: Preparação da Tarefa
Para cada tarefa no plano:
1. Verifique se as dependências foram concluídas
2. Prepare contexto: arquivos relevantes, dados de teste, critérios de aceitação
3. Crie branch de isolamento se necessário

### Etapa 2: Dispatch do Subagente
Use a ferramenta `task` com `subagent_type: "general"`:

```
Despache um subagente para a Tarefa N: [título]

Contexto:
- [Arquivos relevantes e seus conteúdos]
- [Casos de teste a passar]
- [Critérios de aceitação]

Instruções:
1. Escreva teste falhando para [comportamento]
2. Implemente código mínimo para passar
3. Execute testes e verifique
4. Retorne: arquivos alterados, resultados de testes, quaisquer problemas
```

### Etapa 3: Review em Duas Etapas

#### Review 1: Conformidade com Spec
- A implementação corresponde à descrição da tarefa?
- Todos os critérios de aceitação foram atendidos?
- Os testes verificam o comportamento especificado?

#### Review 2: Qualidade do Código
- O código está limpo e legível?
- Existem code smells?
- O tratamento de erros é apropriado?
- É consistente com os padrões da codebase?

### Etapa 4: Integração
- Execute a suíte completa de testes
- Verifique conflitos com outras tarefas
- Faça merge se todas as verificações passarem

## Execução Paralela
- Tarefas sem dependências podem rodar em paralelo
- Use a skill `dispatching-parallel-agents` para trabalho concorrente
- Máximo de subagentes paralelos: 3-5 (dependendo da complexidade)

## Tratamento de Falhas
Se o subagente falhar:
1. Captura a saída de erro
2. Analise o que deu errado
3. Corrija o problema (pode precisar de abordagem diferente)
4. Redispar com contexto atualizado
5. Se 3 falhas, escale para humano

## Anti-padrões
- Disparar sem definição clara de tarefa
- Não revisar saída do subagente
- Permitir que subagentes modifiquem estado compartilhado
- Disparar muitos agentes em paralelo
