# Workflow: full-cycle

Ciclo completo de desenvolvimento da ideia ao merge.
Convertido de `.aiox-core/workflows/full-cycle.yaml` para o Cline.

## Como executar

O usuario diz: "execute o workflow full-cycle para <feature>".
Execute as fases em ordem, assumindo o papel indicado e pedindo aprovacao
nos checkpoints marcados.

## Fase 1 — brainstorm (papel: analista)

- Carregue a skill `brainstorming`.
- Entenda o problema real, explore alternativas, apresente design em partes.
- Saida: `docs/designs/<feature>.md`.
- Checkpoint: so prossiga apos aprovacao total do design.

## Fase 2 — plan (papel: arquiteto)

- Carregue as skills `writing-plans` e `tactical-ddd`.
- Divida em tarefas de 2-5 min com arquivos exatos e verificacao.
- Saida: `docs/plans/<feature>.md`.
- Checkpoint: so implemente apos aprovacao do plano (Plan -> Act).

## Fase 3 — implement (papel: dev)

- Carregue `test-driven-development` (e `subagent-driven-development` se paralelizar).
- Execute o plano com TDD, em lotes com checkpoint apos cada lote.

## Fase 4 — review (papel: QA)

- Carregue `verification-before-completion` e `requesting-code-review`.
- Revise contra o plano; problemas criticos bloqueiam.

## Fase 5 — finish (papel: devops)

- Carregue `finishing-a-development-branch`.
- Merge/PR ou manter branch. Nunca `git push` sem autorizacao.
