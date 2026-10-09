# AIOX Superpowers para Cline

Este projeto usa o framework hibrido AIOX Superpowers (13 agentes + 22 skills + 6 workflows),
adaptado para o Cline (eu, seu assistente de codigo neste workspace).

## Como eu (Cline) uso este framework

1. **Skills**: estao em `.cline/skills/<nome>/SKILL.md` (formato compativel com Cline).
   Quando sua solicitacao corresponder a descricao (`description`) de uma skill,
   eu carrego o `SKILL.md` e sigo as instrucoes. Voce tambem pode pedir
   explicitamente: "use a skill brainstorming".
2. **Workflows**: estao em `.cline/workflows/*.md`.
   Cada workflow descreve fases (brainstorm -> plano -> implementacao -> review -> finish).
   Para executar, diga por exemplo: "execute o workflow full-cycle para <feature>".
3. **Rules**: estao em `.clinerules/` e `.cline/rules/`.
   Sao instrucoes persistentes que sigo automaticamente em toda conversa.
4. **Modos Plan/Act**: sigo o padrao do Cline — primeiro planejo (Plan),
   so implemento apos sua aprovacao (Act).

## Comandos (equivalentes aos /aiox-* do OpenCode)

O Cline nao tem comandos customizados com `/` alem dos nativos (`/newtask`, `/smol`,
`/newrule`, `/deep-planning`). Use estes gatilhos em linguagem natural:

| OpenCode | No Cline (diga) |
|----------|-----------------|
| `/aiox-help` | "mostre a ajuda do framework AIOX" |
| `/aiox-brainstorm` | "inicie um brainstorm sobre <ideia>" (skill `brainstorming`) |
| `/aiox-plan` | "crie um plano de implementacao para <design>" (skill `writing-plans`) |
| `/aiox-workflow` | "execute o workflow <nome> para <tarefa>" (ex: full-cycle) |
| `/aiox-story` | "desenvolva a user story <descricao>" (workflow story-development) |
| `/aiox-review` | "fac um code review de <arquivos>" (skill `requesting-code-review`) |
| `/aiox-status` | "mostre o status do projeto" (leia memory-bank/progress.md) |
| `/loop-architect` | "execute o loop de engenharia para <tarefa>" (skill `loop-engineering`) |

## Skills disponiveis (22)

aws-advisor, brainstorming, codenavi, cost-aware-planning, executing-plans, figma,
finishing-a-development-branch, loop-engineering, playwright-skill,
requesting-code-review, security-best-practices, sentry, skill-architect,
subagent-driven-development, systematic-debugging, tactical-ddd,
test-driven-development, tlc-spec-driven, using-git-worktrees,
verification-before-completion, web-quality-audit, writing-plans.

## Workflows disponiveis (6)

auto-worktree, brownfield-discovery, full-cycle, greenfield-fullstack, qa-loop,
story-development. Detalhes em `.cline/workflows/`.

## Agentes AIOX

Os 13 agentes (@aiox-*) sao definicoes do OpenCode (`opencode.json`).
No Cline nao ha multi-agentes nativos com esse formato — eu emulo os papeis:
ao executar um workflow, assumo o papel do agente da fase (ex: analista no
brainstorm, arquiteto no plano, dev no TDD, QA no review) e registro isso no chat.
