# System Patterns — <nome-do-projeto>

## Arquitetura do framework adaptado

- **Skills** (`.cline/skills/<nome>/SKILL.md`): instrucoes sob demanda, frontmatter
  `name` + `description`.
- **Rules** (`.clinerules/*.md`): instrucoes persistentes (mestre AIOX, memory-bank, TDD).
- **Workflows** (`.cline/workflows/*.md`): fases com papel + skills + checkpoints.
- **Memory Bank** (`memory-bank/*.md`): contexto persistente entre sessoes.
- **AGENTS.md** (raiz): indice legivel por Cline e outras ferramentas.

## Padrao de execucao

Papel emulado por fase (analista/arquiteto/dev/QA/devops) + skill carregada +
checkpoint de aprovacao antes de avancar.
