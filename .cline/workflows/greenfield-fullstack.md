# Workflow: greenfield-fullstack

Construir aplicacao full-stack nova do zero.
Convertido de `.aiox-core/workflows/greenfield-fullstack.yaml`.

## Como executar

"execute o greenfield-fullstack para <projeto>".

1. **brainstorm** (papel: analista) — skill `brainstorming`: visao e requisitos.
   Saida: `docs/designs/visao-do-projeto.md`.
2. **architecture** (papel: arquiteto) — skills `tactical-ddd`, `writing-plans`,
   `aws-advisor`. Saida: `docs/architecture.md`.
3. **setup** (papel: devops) — skill `using-git-worktrees`: estrutura e CI/CD.
4. **implement-backend** (papel: dev) — `test-driven-development` (+ paralelo).
5. **implement-frontend** (papel: dev) — `test-driven-development` + `figma`.
6. **integration** (papel: dev) — `test-driven-development`.
7. **quality** (papel: QA) — `web-quality-audit` + `security-best-practices`.
8. **deploy** (papel: devops) — `aws-advisor`.
