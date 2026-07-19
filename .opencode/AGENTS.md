# AIOX Superpowers — Framework Híbrido

Fusão da orquestração multi-agente do [AIOX Core](https://github.com/marcelojrrangel/aiox-core) com a metodologia baseada em skills do [Superpowers](https://github.com/obra/superpowers).

## Arquitetura

| Camada | Origem | Propósito |
|--------|--------|-----------|
| **Agentes** | AIOX Core | 13 agentes especializados com permissões granulares |
| **Skills** | Superpowers + AIOX | Skills composáveis para TDD, debugging, planejamento, expertise de domínio |
| **Workflows** | Ambos | Pipelines orquestrados combinando dispatch de agentes com ativação de skills |
| **Plugin** | Superpowers | Injeção de bootstrap e registro de skills via plugin OpenCode |

## Agentes (@aiox-*)

| Agente | Função | Skills Principais |
|--------|--------|-------------------|
| `@aiox-master` | Orion — Mestre Orquestrador | brainstorming, writing-skills |
| `@aiox-orchestrator` | Coordenador de Workflows | subagent-driven-development, dispatching-parallel-agents |
| `@aiox-analyst` | Atlas — Analista de Negócios | brainstorming, pesquisa de mercado |
| `@aiox-pm` | Morgan — Gerente de Produto | writing-plans, priorização de features |
| `@aiox-architect` | Aria — Arquiteta de Sistemas | tactical-ddd, writing-plans |
| `@aiox-ux` | Uma — Designer UX/UI | figma, sistemas de design |
| `@aiox-sm` | River — Scrum Master | writing-plans, validação de stories |
| `@aiox-dev` | Dex — Desenvolvedor Full Stack | test-driven-development, systematic-debugging |
| `@aiox-qa` | Quinn — Arquiteta de Testes | verification-before-completion, code review |
| `@aiox-po` | Pax — Product Owner | gestão de backlog, critérios de aceitação |
| `@aiox-data-engineer` | Dara — Arquiteta de Dados | design de schema, otimização de queries |
| `@aiox-devops` | Gage — Especialista DevOps | CI/CD, git ops (ÚNICO agente autorizado a push) |
| `@aiox-squad-creator` | Craft — Criador de Squads | gestão de squads |

## Comandos

| Comando | Descrição |
|---------|-----------|
| `/aiox-help` | Ajuda completa do framework |
| `/aiox-init` | Verificar instalação |
| `/aiox-story` | Criar/gerenciar user stories (brainstorming → TDD) |
| `/aiox-workflow` | Executar workflow de desenvolvimento |
| `/aiox-brainstorm` | Iniciar sessão de brainstorming |
| `/aiox-plan` | Criar plano de implementação |
| `/aiox-review` | Executar code review com gates de qualidade |
| `/loop-architect` | Loop auto-corretivo de desenvolvimento |
| `/aiox-status` | Status do projeto: consumo Go, saldo restante, viabilidade |

## Skills (22 no total)

### Skills Core (do Superpowers)
- `brainstorming` — Refinamento socrático do design antes de codar
- `test-driven-development` — Ciclo RED-GREEN-REFACTOR
- `systematic-debugging` — Análise de causa raiz em 4 fases
- `writing-plans` — Divisão em tarefas pequenas (2-5 min cada)
- `executing-plans` — Execução em lotes com checkpoints
- `subagent-driven-development` — Dispatch paralelo com review em duas etapas
- `requesting-code-review` — Checklist pré-review
- `receiving-code-review` — Respondendo a feedback
- `using-git-worktrees` — Desenvolvimento em branches isoladas
- `finishing-a-development-branch` — Workflow de merge/PR
- `verification-before-completion` — Garantir que está realmente pronto (inclui checks de resiliência/SAGA)
- `writing-skills` — Criar novas skills

### Skills de Domínio (do AIOX)
- `tlc-spec-driven` — Planejamento em 4 fases
- `security-best-practices` — Revisão de segurança OWASP/CWE
- `playwright-skill` — Automação de testes E2E
- `tactical-ddd` — Modelagem domain-driven design
- `figma` — Design-to-code a partir do Figma
- `web-quality-audit` — Auditoria completa de qualidade web
- `aws-advisor` — Arquitetura AWS (custo, segurança, performance)
- `skill-architect` — Criar skills para o framework
- `codenavi` — Navegação inteligente em codebase (3 camadas: estrutura → assinaturas → detalhe)
- `sentry` — Integração com monitoramento de erros
- `loop-engineering` — Ciclo auto-corretivo (roadmap → código → teste → correção)

## Convenções Principais

1. **Skills ativam automaticamente** — O agente verifica skills relevantes antes de qualquer tarefa. Workflows obrigatórios, não sugestões.
2. **TDD é obrigatório** — Escrever teste que falha, vê-lo falhar, escrever código mínimo, vê-lo passar.
3. **Brainstorm antes de codar** — Nunca pular direto para o código sem entender o problema real.
4. **Dispatch de subagentes** — Use `@aiox-orchestrator` para execução paralela de tarefas.
5. **Apenas `@aiox-devops` pode fazer push** — Todos os outros agentes são read-only no git push.
6. **Regra dos 2 minutos** — Se uma tarefa leva mais de 5 minutos, divida-a mais.
7. **Otimização de tokens no brownfield** — Use a skill `codenavi` em 3 camadas (estrutura → assinaturas → detalhe) ao explorar codebases existentes. Nunca leia arquivos brutos sem antes mapear assinaturas.
8. **Resiliência é obrigatória** — Quando o código envolver transações distribuídas, SAGA ou mensageria, a skill `verification-before-completion` deve validar cenários de falha (queda de rede, timeout, mensagens duplicadas).
9. **Roteamento automático de modelos** — O framework usa cascata de modelos para nunca parar por falta de saldo. Use `model-router` antes de dispatchar subagentes. Fluxo: Free Zen → Go Free → Go Pago → Zen Pago → Usuário. Troca dinâmica via prompt continua disponível ("Use opencode/claude-opus-4-8 para esta decisão").
10. **Status automático do projeto** — Ao iniciar sessão ou primeira tarefa, mostrar `/aiox-status` (consumo Go, saldo restante, viabilidade). Se viabilidade for VERMELHO, alertar mas NÃO bloquear — o dev decide. Use `project-feasibility` antes de tarefas significativas.

## Roteamento de Modelos

### Cascata Automática

O `model-router` tenta 4 tiers na ordem antes de perguntar ao usuário:

| Tier | Provider | Custo | Quando Usar |
|------|----------|-------|-------------|
| 1. Free Zen | `opencode/` | $0 | Sempre tentar primeiro |
| 2. Go Free | `opencode-go/` | $0 (rate-limited) | Se Free Zen falhar |
| 3. Go Pago | `opencode-go/` | Tokens do saldo Go | Trabalho especializado |
| 4. Zen Pago | `opencode/` | $$/1M tokens | Decisões críticas |
| 5. Usuário | — | — | Último recurso |

### Modelos por Categoria

| Categoria | Free Zen | Go Free | Go Pago | Zen Pago |
|-----------|----------|---------|---------|----------|
| Orquestração | `claude-haiku-4.5` | `deepseek-v4-flash` | `deepseek-v4-pro` | `claude-sonnet-5` |
| Brainstorming | `claude-haiku-4.5` | `deepseek-v4-flash` | `glm-5.2` | `claude-sonnet-5` |
| Planejamento | `claude-haiku-4.5` | `deepseek-v4-flash` | `glm-5.2` | `claude-sonnet-5` |
| Implementação | `claude-haiku-4.5` | `mimo-v2.5` | `kimi-k2.7-code` | `claude-sonnet-5` |
| Review/QA | `claude-haiku-4.5` | `deepseek-v4-flash` | `glm-5.2` | `claude-opus-4-8` |
| Testes | `claude-haiku-4.5` | `mimo-v2.5` | `qwen3.7-plus` | `claude-sonnet-5` |
| Documentação | `claude-haiku-4.5` | `deepseek-v4-flash` | `qwen3.7-plus` | `claude-haiku-4.5` |
| DevOps | `claude-haiku-4.5` | `deepseek-v4-flash` | `qwen3.7-plus` | `claude-haiku-4.5` |

### Tools de Roteamento

| Tool | Função |
|------|--------|
| `model-ping` | Verifica se um modelo está disponível (probe 1 token, timeout 5s, cache 5min) |
| `model-router` | Cascata automática por categoria + logging em `.opencode/logs/model-usage.jsonl` |
| `usage-report` | Relatório de consumo Go ($12/5h, $30/semana, $60/mês) com barras $, reset timer e modelos Free |
| `project-feasibility` | Análise de viabilidade de tarefa: custo estimado vs saldo, verde/amarelo/vermelho |

### Uso

```
# O orchestrator usa automaticamente:
model-router({ category: "brainstorming" })
→ Retorna: { selected_model: "opencode-go/glm-5.2", tier: "go_pago" }

# Troca manual via prompt:
"Use opencode/claude-opus-4-8 para esta decisão de arquitetura"

# Ver relatório de consumo:
usage-report({ period: "session" })  # ou "today" ou "all"
```

## Estrutura de Diretórios

```
.aiox-core/           # Workflows e definições de tarefas do AIOX
.opencode/
  AGENTS.md           # Este arquivo
  skills/             # 22 skills (core + domínio)
  tools/              # Custom tools (model-ping, model-router, usage-report)
  logs/               # Logs de uso de modelos (model-usage.jsonl)
  plugins/            # Bootstrap do plugin Superpowers
.agent/workflows/     # Instruções de ativação dos agentes
opencode.json         # Definições de agentes + comandos + modelos
package.json          # Metadados do pacote
```

## Início Rápido

```bash
# Instalar
npx create-aiox-superpowers meu-projeto
cd meu-projeto
opencode

# Ou adicionar a projeto existente
# Adicione ao seu opencode.json:
# "instructions": [".opencode/AGENTS.md"]
```

## Ambiente

- Node.js >= 18, npm >= 9
- OpenCode CLI (`npm install -g opencode-ai`)
- Git
