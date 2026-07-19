# AIOX Superpowers

Framework híbrido combinando a orquestração multi-agente do **AIOX Core** com a metodologia baseada em skills do **Superpowers** para o [OpenCode CLI](https://opencode.ai).

## O Que É?

Uma fusão de dois frameworks poderosos:

- **Do AIOX Core**: 13 agentes especializados com permissões granulares, workflows de domínio
- **Do Superpowers**: 12 skills core para TDD, debugging, planejamento, code review e mais

**Resultado**: 22 skills + 13 agentes + 6 workflows orquestrados = Metodologia completa de desenvolvimento.

## Início Rápido

```bash
# Criar novo projeto
npx create-aiox-superpowers meu-projeto
cd meu-projeto
opencode

# Ou adicionar a projeto existente
# Adicione ao seu opencode.json:
{
  "instructions": [".opencode/AGENTS.md"]
}
```

## O Que Você Recebe

### 13 Agentes
| Agente | Função |
|--------|--------|
| `@aiox-master` | Orion — Mestre Orquestrador |
| `@aiox-orchestrator` | Orquestrador de Workflows |
| `@aiox-analyst` | Atlas — Analista de Negócios |
| `@aiox-pm` | Morgan — Gerente de Produto |
| `@aiox-architect` | Aria — Arquiteta de Sistemas |
| `@aiox-ux` | Uma — Designer UX/UI |
| `@aiox-sm` | River — Scrum Master |
| `@aiox-dev` | Dex — Desenvolvedor Full Stack |
| `@aiox-qa` | Quinn — Arquiteta de Testes |
| `@aiox-po` | Pax — Product Owner |
| `@aiox-data-engineer` | Dara — Arquiteta de Dados |
| `@aiox-devops` | Gage — Especialista DevOps |
| `@aiox-squad-creator` | Craft — Criador de Squads |

### 22 Skills

#### Skills Core (do Superpowers)
- `brainstorming` — Design antes do código
- `test-driven-development` — Ciclo RED-GREEN-REFACTOR
- `systematic-debugging` — Análise de causa raiz em 4 fases
- `writing-plans` — Divisão em tarefas (2-5 min cada)
- `subagent-driven-development` — Dispatch paralelo
- `verification-before-completion` — Garantir que está pronto
- `using-git-worktrees` — Desenvolvimento isolado
- `finishing-a-development-branch` — Workflow de merge
- `requesting-code-review` — Preparação para review
- `executing-plans` — Execução em lotes
- `loop-engineering` — Ciclos auto-corretivos

#### Skills de Domínio (do AIOX)
- `security-best-practices` — Segurança OWASP/CWE
- `tactical-ddd` — Domain-driven design
- `aws-advisor` — Arquitetura AWS
- `figma` — Design-to-code
- `playwright-skill` — Testes E2E
- `web-quality-audit` — Auditoria de qualidade web
- `tlc-spec-driven` — Desenvolvimento orientado a spec
- `skill-architect` — Criar novas skills
- `codenavi` — Navegação inteligente em codebase
- `sentry` — Monitoramento de erros

### 6 Workflows
| Workflow | Descrição |
|----------|-----------|
| `full-cycle` | Ideia → Design → Implementar → Revisar → Merge |
| `qa-loop` | Debug → Corrigir → Verificar → Documentar |
| `greenfield-fullstack` | Construir app do zero |
| `brownfield-discovery` | Entender codebase existente |
| `auto-worktree` | Desenvolvimento paralelo |
| `story-development` | Ciclo completo de uma user story |

## Comandos

| Comando | Descrição |
|---------|-----------|
| `/aiox-help` | Ajuda do framework |
| `/aiox-init` | Verificar instalação |
| `/aiox-story` | Gerenciar user stories |
| `/aiox-workflow` | Executar workflow de desenvolvimento |
| `/aiox-brainstorm` | Iniciar sessão de brainstorming |
| `/aiox-plan` | Criar plano de implementação |
| `/aiox-review` | Executar code review |
| `/loop-architect` | Loop auto-corretivo |

## Funcionalidades Principais

### Workflows Obrigatórios
As skills são ativadas automaticamente — sem necessidade de ativação manual. O agente verifica skills relevantes antes de cada tarefa.

### TDD Primeiro
Escrever teste que falha → Fazê-lo passar → Refatorar. Inegociável.

### Brainstorm Antes de Codificar
Nunca pular direto para o código sem entender o problema real.

### Execução Paralela
Use `@aiox-orchestrator` com `subagent-driven-development` para execução concorrente de tarefas.

### Permissões Granulares
Apenas `@aiox-devops` pode fazer push para remote. Todos os outros agentes respeitam limites de leitura.

## Estrutura de Diretórios

```
aiox-superpowers/
├── .opencode/
│   ├── AGENTS.md          # Referência do framework
│   ├── skills/            # 22 skills (core + domínio)
│   └── plugins/           # Bootstrap do plugin
├── .aiox-core/
│   └── workflows/         # 6 definições de workflow
├── .agent/
│   └── workflows/         # Arquivos de ativação dos agentes
├── opencode.json          # Config de agentes + comandos
├── package.json
└── README.md
```

## Ambiente

- Node.js >= 18, npm >= 9
- OpenCode CLI (`npm install -g opencode-ai`)
- Git

## Recomendações de Modelos de IA

### Visão dos Planos

| Plano | Preço | Melhor Para |
|-------|-------|-------------|
| **Go** | $5 primeiro mês, depois $10/mês | Uso com alto volume, orçamento apertado |
| **Zen** | Pay-as-you-go ($20 saldo mínimo) | Modelos premium, máxima qualidade |

### Modelos Go (Baixo Custo, Alto Volume)

| Modelo | Requests/5h | Melhor Para |
|--------|-------------|-------------|
| **DeepSeek V4 Flash** | 31.650 | Edições rápidas, tarefas simples, exploração |
| **MiMo-V2.5** | 30.100 | Código geral, tarefas de alto volume |
| **Qwen3.7 Plus** | 4.300 | Equilíbrio qualidade/custo para trabalho diário |
| **DeepSeek V4 Pro** | 3.450 | Raciocínio complexo, arquitetura |
| **MiniMax M3** | 3.200 | Geração de código, refatoração |
| **Kimi K2.7 Code** | 1.350 | Tarefas especializadas de código |
| **GLM-5.2** | 880 | Raciocínio avançado, lógica complexa |
| **Kimi K3** | 110 | Raciocínio de topo (limitado) |
| **Grok 4.5** | 120 | Raciocínio premium (limitado) |

### Modelos Zen (Qualidade Premium)

| Modelo | Preço/1M tokens | Melhor Para |
|--------|-----------------|-------------|
| **Claude Opus 4.8** | $5/$25 | Arquitetura complexa, decisões críticas |
| **Claude Sonnet 5** | $2/$10 | Qualidade equilibrada para a maioria das tarefas |
| **GPT 5.5** | $5/$30 | Raciocínio avançado, codebases grandes |
| **GPT 5.4** | $2.5/$15 | Desenvolvimento geral, bom equilíbrio |
| **GPT 5.4 Mini** | $0.75/$4.50 | Tarefas rápidas, alto volume |
| **Gemini 3.1 Pro** | $2/$12 | Contexto grande, multimodal |
| **Claude Haiku 4.5** | $1/$5 | Respostas rápidas, tarefas simples |

### Modelo Recomendado por Tarefa

#### Para Brainstorming e Design (Skills: brainstorming, tactical-ddd)
- **Go**: `GLM-5.2` ou `Kimi K3` — Melhor raciocínio a baixo custo
- **Zen**: `Claude Opus 4.8` ou `Claude Sonnet 5` — Design thinking superior

#### Para Planejamento e Arquitetura (Skills: writing-plans, tlc-spec-driven)
- **Go**: `DeepSeek V4 Pro` ou `GLM-5.2` — Forte capacidade de planejamento
- **Zen**: `Claude Sonnet 5` ou `GPT 5.4` — Excelente divisão de tarefas

#### Para Implementação de Código (Skills: test-driven-development, loop-engineering)
- **Go**: `Kimi K2.7 Code` ou `Qwen3.7 Plus` — Melhor geração de código
- **Zen**: `Claude Sonnet 5` ou `GPT 5.4` — Qualidade de código superior

#### Para Debugging (Skills: systematic-debugging)
- **Go**: `DeepSeek V4 Pro` ou `GLM-5.2` — Forte pensamento analítico
- **Zen**: `Claude Opus 4.8` — Melhor análise de causa raiz

#### Para Code Review (Skills: verification-before-completion, requesting-code-review)
- **Go**: `GLM-5.2` ou `Kimi K3` — Análise minuciosa
- **Zen**: `Claude Opus 4.8` ou `GPT 5.5` — Reviews mais abrangentes

#### Para Testes (Skills: test-driven-development, playwright-skill)
- **Go**: `Qwen3.7 Plus` ou `DeepSeek V4 Pro` — Geração confiável de testes
- **Zen**: `Claude Sonnet 5` — Melhor pensamento de cobertura de testes

#### Para Revisão de Segurança (Skills: security-best-practices)
- **Go**: `GLM-5.2` — Boa consciência de segurança
- **Zen**: `Claude Opus 4.8` — Análise de segurança mais completa

#### Para Dispatch de Subagents (Skills: subagent-driven-development)
- **Go**: `DeepSeek V4 Flash` ou `MiMo-V2.5` — Alto volume, respostas rápidas
- **Zen**: `GPT 5.4 Mini` ou `Claude Haiku 4.5` — Trabalho paralelo econômico

### Estratégias de Otimização de Custo

1. **Use Go para trabalho diário**: `Qwen3.7 Plus` para tarefas gerais oferece melhor valor
2. **Reserve Zen para momentos críticos**: Decisões de arquitetura, code reviews, auditorias de segurança
3. **Agrupe tarefas similares**: Execute todo planejamento junto, toda implementação junto
4. **Use modelos Flash para exploração**: `DeepSeek V4 Flash` é praticamente grátis no Go
5. **Monitore o uso**: Acompanhe no [console](https://opencode.ai/auth) para evitar surpresas

### Roteamento Automático de Modelos

O framework usa **cascata automática** para nunca parar por falta de saldo. O `model-router` tenta 4 tiers na ordem:

```
Free Zen ($0) → Go Free ($0) → Go Pago (saldo Go) → Zen Pago ($$) → Usuário
```

**Configuração real no `opencode.json`:**

```json
{
  "$schema": "https://opencode.ai/config.json",
  "model": "opencode-go/qwen3.7-plus",
  "small_model": "opencode-go/deepseek-v4-flash",
  "agent": {
    "aiox-master":        { "model": "opencode-go/deepseek-v4-pro" },
    "aiox-orchestrator":  { "model": "opencode-go/deepseek-v4-flash" },
    "aiox-analyst":       { "model": "opencode-go/glm-5.2" },
    "aiox-architect":     { "model": "opencode-go/glm-5.2" },
    "aiox-dev":           { "model": "opencode-go/kimi-k2.7-code" },
    "aiox-qa":            { "model": "opencode-go/glm-5.2" },
    "aiox-devops":        { "model": "opencode-go/qwen3.7-plus" }
  }
}
```

**Tools de roteamento:**
- `model-ping` — Verifica se um modelo está disponível (probe 1 token, timeout 5s, cache 5min)
- `model-router` — Cascata automática por categoria + logging em `.opencode/logs/model-usage.jsonl`

### Trocando Modelos Dinamicamente

O roteamento é automático, mas você pode forçar um modelo específico:
```
Use opencode/claude-opus-4-8 para esta decisão de arquitetura
Mude para opencode-go/deepseek-v4-flash para edições simples
```

## Créditos

- [AIOX Core](https://github.com/marcelojrrangel/aiox-core) — Orquestração multi-agente
- [Superpowers](https://github.com/obra/superpowers) — Metodologia baseada em skills

## Licença

MIT
