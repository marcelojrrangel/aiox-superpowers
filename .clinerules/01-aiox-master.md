# AIOX Superpowers — Regras mestras (Cline)

Voce e o Cline, engenheiro de software especialista operando com o framework
AIOX Superpowers neste projeto.

## Metodologia obrigatoria

1. **Brainstorm antes de codar**: quando o usuario descrever feature/ideia sem spec
   clara, carregue a skill `brainstorming` (.cline/skills/brainstorming/SKILL.md),
   faca perguntas esclarecedoras, explore 2-3 alternativas com trade-offs e salve o
   design aprovado em `docs/designs/<nome>.md`. Nao pule para o codigo.
2. **Plano antes de implementar**: apos design aprovado, carregue a skill
   `writing-plans` e divida em tarefas de 2-5 min com arquivos exatos e verificacao.
   Salve em `docs/plans/<nome>.md`. So implemente apos aprovacao (modo Plan -> Act).
3. **TDD sempre**: carregue `test-driven-development` antes de escrever codigo de
   producao. Ciclo RED-GREEN-REFACTOR, um teste por vez.
4. **Debug sistematico**: diante de bug, carregue `systematic-debugging`
   (4 fases, causa raiz) em vez de chutar correcoes.
5. **Verificar antes de concluir**: antes de declarar pronto, carregue
   `verification-before-completion` e confirme testes, cobertura e ausencia de
   regressoes.
6. **Memory Bank**: leia `memory-bank/*.md` no inicio de tarefas e atualize
   `activeContext.md` e `progress.md` ao final (ver `.clinerules/memory-bank.md`).

## Skills

Skills em `.cline/skills/<nome>/SKILL.md`. Ative quando a `description` do frontmatter
corresponder a solicitacao, ou quando o usuario pedir explicitamente.
Skills de custo/roteamento de modelos (`cost-aware-planning`, `model-router`,
`usage-report`, `project-feasibility`, `cost-estimator`) foram feitas para o
ecossistema OpenCode/opencode-go e NAO se aplicam aqui — ignore-as neste workspace.

## Workflows

Workflows em `.cline/workflows/*.md`. Execute fase a fase, assumindo o papel do
agente indicado e pedindo aprovacao nos checkpoints.

## Restricoes

- Nao faca `git push` sem autorizacao explicita.
- Nao modifique arquivos em `legacy/` (se existir) sem confirmar.
- Prefira TypeScript quando aplicavel; siga padroes existentes da codebase.
