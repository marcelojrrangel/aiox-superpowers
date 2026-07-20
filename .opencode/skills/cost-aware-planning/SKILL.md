---
name: cost-aware-planning
description: Use ANTES de iniciar qualquer implementação, workflow ou plano. Mostra estimativa de custo com 3 tiers (econômico/balanceado/premium), comparativo de qualidade, e pede confirmação do usuário antes de prosseguir.
---

# Cost-Aware Planning

## Quando Ativar
- Antes de executar `/aiox-workflow`
- Antes de iniciar um plano de implementação
- Antes de dispatchar subagentes com `subagent-driven-development`
- Quando o usuário pedir análise de custo-benefício
- Sempre que uma tarefa envolver 5+ chamadas de API

## Processo

### Passo 1: Estimar Custo
Use a tool `cost-estimator` com o tipo de tarefa apropriado:
- `quick_edit` — 3 calls, ~$0.001-$0.05
- `feature` — 12 calls, ~$0.05-$0.85
- `refactor` — 15 calls, ~$0.10-$1.50
- `brownfield` — 25 calls, ~$0.30-$3.00
- `greenfield` — 80 calls, ~$1.00-$8.00
- `full_stack` — 100 calls, ~$2.00-$12.00

Call `cost-estimator({ task_type: "feature" })` para ver os 3 tiers.

### Passo 2: Apresentar Opções ao Usuário
Mostre o comparativo dos 3 tiers e PERGUNTE:

```
╔══════════════════════════════════════════════╗
║  Deseja continuar? Escolha o tier de custo:  ║
║                                             ║
║  1. economy   - Grátis (qualidade 4-6/10)   ║
║  2. balanced  - $$ (qualidade 6-8/10)       ║
║  3. premium   - $$$ (qualidade 8-10/10)     ║
║  4. cancelar  - Não executar                ║
╚══════════════════════════════════════════════╝
```

Se o usuário escolher `economy`, use `model-router` com `preferZen: false` e priorize modelos free.
Se `balanced`, use os modelos Go padrão do `model-router`.
Se `premium`, use `preferZen: true` para forçar modelos premium.

### Passo 3: Executar com o Tier Escolhido
- Configure `model-router` com o tier selecionado
- Dispatch subagentes com `subagent-driven-development`
- Monitore custo com `usage-report` após cada lote

### Passo 4: Alerta de Qualidade (opcional)
Se o usuário escolher `economy` para uma tarefa complexa (greenfield, full_stack, refactor):
- Alerte: "Tier econômico para tarefa complexa pode gerar retrabalho. Considere balanced para evitar custo oculto de correções."
- Mostre o custo estimado de retrabalho: ~2x o custo do balanced em correções

Se o usuário escolher `premium` para uma tarefa simples (quick_edit):
- Alerte: "Tier premium para tarefa simples. Economia de ~90% com balanced com perda mínima de qualidade."

## Exemplo de Fluxo

```
Usuário: "Quero implementar a feature X"

Agente:
1. Carrega cost-aware-planning
2. Chama cost-estimator({ task_type: "feature" })
3. Mostra tabela comparativa
4. Pergunta: "Qual tier deseja? (economy/balanced/premium/cancelar)"
5. Usuário: "balanced"
6. Configura model-router para balanced
7. Prossegue com writing-plans + execução
```

## Anti-padrões
- Pular direto para código sem perguntar o tier
- Assumir que usuário sempre quer o tier mais barato
- Usar tier premium sem avisar o custo estimado
- Ignorar o saldo disponível (sempre verifique com `usage-report`)

## Saída
- Tier de custo selecionado
- Modelos que serão usados por categoria
- Custo estimado total
- Saldo restante após a tarefa
