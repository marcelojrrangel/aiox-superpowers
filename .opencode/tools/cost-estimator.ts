import { tool } from "@opencode-ai/plugin"
import path from "path"
import fs from "fs"
import {
  calculateWindowSpend,
  calculateWeekSpend,
  calculateMonthSpend,
  GO_LIMITS,
  formatCost,
} from "./usage-report"

interface UsageEntry {
  timestamp: string
  category: string
  selected_model: string | null
  tier: string
  latency_ms: number
}

const LOG_FILE = "model-usage.jsonl"
const LOG_DIR = ".opencode/logs"

const TASK_ESTIMATES: Record<string, { calls: number }> = {
  quick_edit: { calls: 3 },
  feature: { calls: 12 },
  refactor: { calls: 15 },
  brownfield: { calls: 25 },
  greenfield: { calls: 80 },
  full_stack: { calls: 100 },
}

const MODEL_QUALITY: Record<string, { quality: number; tier: string }> = {
  "deepseek-v4-flash-free": { quality: 5, tier: "free" },
  "mimo-v2.5-free": { quality: 4, tier: "free" },
  "north-mini-code-free": { quality: 5, tier: "free" },
  "nemotron-3-ultra-free": { quality: 6, tier: "free" },
  "deepseek-v4-flash": { quality: 6, tier: "go_free" },
  "mimo-v2.5": { quality: 5, tier: "go_free" },
  "qwen3.7-plus": { quality: 7, tier: "go_pago" },
  "deepseek-v4-pro": { quality: 8, tier: "go_pago" },
  "glm-5.2": { quality: 7, tier: "go_pago" },
  "kimi-k2.7-code": { quality: 8, tier: "go_pago" },
  "minimax-m3": { quality: 7, tier: "go_pago" },
  "kimi-k3": { quality: 9, tier: "go_pago" },
  "grok-4.5": { quality: 9, tier: "go_pago" },
  "claude-sonnet-5": { quality: 9, tier: "zen_pago" },
  "claude-opus-4-8": { quality: 10, tier: "zen_pago" },
  "gpt-5.5": { quality: 9, tier: "zen_pago" },
  "gpt-5.4": { quality: 8, tier: "zen_pago" },
}

const COST_TIERS: Record<string, {
  label: string
  description: string
  cost_mult: number
  quality_range: [number, number]
  models_by_category: Record<string, string[]>
}> = {
  economy: {
    label: "Econômico",
    description: "Apenas modelos free (zero custo). Ideal para exploração, tarefas simples e aprendizado.",
    cost_mult: 0,
    quality_range: [4, 6],
    models_by_category: {
      brainstorming: ["deepseek-v4-flash-free", "north-mini-code-free"],
      planning: ["deepseek-v4-flash-free", "nemotron-3-ultra-free"],
      implementation: ["mimo-v2.5-free", "deepseek-v4-flash-free"],
      review: ["deepseek-v4-flash-free", "north-mini-code-free"],
      testing: ["mimo-v2.5-free", "deepseek-v4-flash-free"],
      documentation: ["deepseek-v4-flash-free", "nemotron-3-ultra-free"],
      devops: ["deepseek-v4-flash-free"],
    },
  },
  balanced: {
    label: "Balanceado",
    description: "Modelos Go com melhor custo-benefício. Ideal para desenvolvimento diário.",
    cost_mult: 1,
    quality_range: [6, 8],
    models_by_category: {
      brainstorming: ["glm-5.2", "deepseek-v4-flash"],
      planning: ["glm-5.2", "deepseek-v4-pro"],
      implementation: ["kimi-k2.7-code", "qwen3.7-plus"],
      review: ["glm-5.2", "deepseek-v4-flash"],
      testing: ["qwen3.7-plus", "mimo-v2.5"],
      documentation: ["qwen3.7-plus", "deepseek-v4-flash"],
      devops: ["qwen3.7-plus", "deepseek-v4-flash"],
    },
  },
  premium: {
    label: "Premium",
    description: "Máxima qualidade com modelos Zen. Ideal para decisões críticas e arquitetura.",
    cost_mult: 5,
    quality_range: [8, 10],
    models_by_category: {
      brainstorming: ["claude-sonnet-5", "glm-5.2"],
      planning: ["claude-sonnet-5", "deepseek-v4-pro"],
      implementation: ["claude-sonnet-5", "kimi-k2.7-code"],
      review: ["claude-opus-4-8", "glm-5.2"],
      testing: ["claude-sonnet-5", "qwen3.7-plus"],
      documentation: ["claude-haiku-4.5", "qwen3.7-plus"],
      devops: ["claude-haiku-4.5", "qwen3.7-plus"],
    },
  },
}

const CATEGORIES = ["brainstorming", "planning", "implementation", "review", "testing", "documentation", "devops"]

const GO_COST_PER_REQUEST: Record<string, number> = {
  "deepseek-v4-flash": 0.00038,
  "mimo-v2.5": 0.0000047,
  "qwen3.7-plus": 0.000093,
  "deepseek-v4-pro": 0.000043,
  "glm-5.2": 0.0000136,
  "kimi-k2.7-code": 0.000074,
  "kimi-k3": 0.000455,
  "grok-4.5": 0.000417,
  "minimax-m3": 0.0000375,
}

function estimateCost(calls: number, tierName: string): { total: number; per_call: number; models_used: string[] } {
  const tier = COST_TIERS[tierName]
  if (!tier) return { total: 0, per_call: 0, models_used: [] }

  if (tierName === "economy") {
    return { total: 0, per_call: 0, models_used: ["deepseek-v4-flash-free"] }
  }

  const models = new Set<string>()
  Object.values(tier.models_by_category).forEach((m) => m.forEach((model) => models.add(model)))
  const modelList = Array.from(models)

  const avgCost = modelList
    .filter((m) => GO_COST_PER_REQUEST[m])
    .reduce((sum, m) => sum + (GO_COST_PER_REQUEST[m] || 0), 0) / Math.max(1, modelList.filter((m) => GO_COST_PER_REQUEST[m]).length)

  const total = avgCost * calls * (tierName === "premium" ? 1.5 : 1)

  return {
    total,
    per_call: avgCost,
    models_used: modelList,
  }
}

function qualityLabel(score: number): string {
  if (score >= 9) return "Excelente"
  if (score >= 7) return "Bom"
  if (score >= 5) return "Razoável"
  return "Baixo"
}

function qualityBar(score: number, width: number = 10): string {
  const filled = Math.round((score / 10) * width)
  const empty = width - filled
  const colors = score >= 7 ? "🟢" : score >= 5 ? "🟡" : "🔴"
  return `${colors} [${"█".repeat(filled)}${"░".repeat(empty)}]`
}

function readLog(worktree: string): UsageEntry[] {
  const logPath = path.join(worktree, LOG_DIR, LOG_FILE)
  if (!fs.existsSync(logPath)) return []
  const content = fs.readFileSync(logPath, "utf-8")
  return content
    .split("\n")
    .filter((l) => l.trim())
    .map((l) => { try { return JSON.parse(l) } catch { return null } })
    .filter(Boolean) as UsageEntry[]
}

export default tool({
  description:
    "Estima custo e qualidade de uma tarefa em 3 tiers (economy/balanced/premium). Mostra comparativo entre tiers, modelos sugeridos e alerta de qualidade. Use ANTES de iniciar qualquer plano ou workflow.",
  args: {
    task_type: tool.schema
      .enum(["quick_edit", "feature", "refactor", "brownfield", "greenfield", "full_stack"])
      .describe("Tipo da tarefa"),
    cost_tier: tool.schema
      .enum(["economy", "balanced", "premium"])
      .optional()
      .describe("Tier de custo desejado (padrão: exibe todos para comparação)"),
  },
  async execute(args, context) {
    const worktree = context.worktree || context.directory || "."
    const taskType = args.task_type
    const estimate = TASK_ESTIMATES[taskType]
    const specificTier = args.cost_tier

    if (!estimate) {
      return JSON.stringify({ error: `Tipo desconhecido: ${taskType}`, valid_options: Object.keys(TASK_ESTIMATES) })
    }

    const allEntries = readLog(worktree)
    const windowSpend = calculateWindowSpend(allEntries, new Date(Date.now() - 5 * 60 * 60 * 1000))
    const weekSpend = calculateWeekSpend(allEntries)
    const monthSpend = calculateMonthSpend(allEntries)
    const windowRemaining = Math.max(0, GO_LIMITS.per_5h - windowSpend)
    const weekRemaining = Math.max(0, GO_LIMITS.per_week - weekSpend)
    const monthRemaining = Math.max(0, GO_LIMITS.per_month - monthSpend)

    const tiersToShow = specificTier ? [specificTier] : Object.keys(COST_TIERS)
    const comparisons: any[] = []

    for (const tierName of tiersToShow) {
      const tier = COST_TIERS[tierName]
      const cost = estimateCost(estimate.calls, tierName)
      comparisons.push({
        tier: tierName,
        label: tier.label,
        description: tier.description,
        quality_range: tier.quality_range,
        quality_label: `${qualityLabel(tier.quality_range[0])} ~ ${qualityLabel(tier.quality_range[1])}`,
        estimated_cost_usd: cost.total,
        per_call_usd: cost.per_call,
        models_used: cost.models_used,
        calls_estimate: estimate.calls,
      })
    }

    const report: string[] = []
    report.push("╔══════════════════════════════════════════════════╗")
    report.push("║         ESTIMADOR DE CUSTO E QUALIDADE          ║")
    report.push("╚══════════════════════════════════════════════════╝")
    report.push("")
    report.push(`Tarefa: ${taskType.toUpperCase().replace("_", " ")}`)
    report.push(`Chamadas estimadas: ~${estimate.calls}`)
    report.push("")

    report.push("┌─────────────────────────────────────────────────┐")
    report.push("│  COMPARATIVO DE TIERS                           │")
    report.push("├─────────────────────────────────────────────────┤")

    for (const comp of comparisons) {
      const costStr = comp.estimated_cost_usd === 0
        ? "Grátis"
        : formatCost(comp.estimated_cost_usd)
      const costPad = comp.estimated_cost_usd === 0 ? "Grátis" : `~${costStr}`
      report.push("│")
      report.push(`│  [${comp.tier.toUpperCase()}] ${comp.label}`)
      report.push(`│  ${comp.description}`)
      report.push(`│  Custo: ${costPad.padEnd(12)} Qualidade: ${comp.quality_label}`)
      report.push(`│  ${qualityBar(comp.quality_range[0])} ~ ${qualityBar(comp.quality_range[1])}`)
      report.push(`│  Modelos: ${comp.models_used.slice(0, 4).join(", ")}`)
      if (comp.models_used.length > 4) {
        report.push(`│           +${comp.models_used.length - 4} outros`)
      }
    }

    report.push("│")
    report.push("│  Qualidade: 🟢 Bom | 🟡 Razoável | 🔴 Baixo")
    report.push("└─────────────────────────────────────────────────┘")
    report.push("")

    report.push("┌─────────────────────────────────────────────────┐")
    report.push("│  SALDO DISPONÍVEL (PLANO GO)                    │")
    report.push("├─────────────────────────────────────────────────┤")
    report.push(`│  5 horas:  ${formatCost(windowRemaining).padEnd(8)} restante`)
    report.push(`│  Semanal:  ${formatCost(weekRemaining).padEnd(8)} restante`)
    report.push(`│  Mensal:   ${formatCost(monthRemaining).padEnd(8)} restante`)
    report.push("└─────────────────────────────────────────────────┘")
    report.push("")

    const best = comparisons[0]
    const worst = comparisons[comparisons.length - 1]
    if (best && worst && best.tier !== worst.tier) {
      const savings = worst.estimated_cost_usd - best.estimated_cost_usd
      const qualityDiff = worst.quality_range[1] - best.quality_range[1]
      report.push("┌─────────────────────────────────────────────────┐")
      report.push("│  ANÁLISE CUSTO-BENEFÍCIO                        │")
      report.push("├─────────────────────────────────────────────────┤")
      report.push(`│  Economia vs Premium: ${formatCost(savings)}/tarefa`)
      report.push(`│  Perda de qualidade: ${qualityDiff}/10 pontos`)
      report.push(`│  Recomendação:`)

      if (savings < 0.05 || taskType === "quick_edit") {
        report.push(`│    ✅ Use o tier mais barato para esta tarefa.`)
        report.push(`│    Custo extra do premium nao compensa.`)
      } else if (qualityDiff <= 2) {
        report.push(`│    ⚡ Tier balanced oferece melhor custo-beneficio.`)
        report.push(`│    Pequena perda de qualidade por grande economia.`)
      } else {
        report.push(`│    ⚠️ Premium oferece qualidade muito superior.`)
        report.push(`│    Avalie se a diferenca de qualidade justifica o custo.`)
      }
      report.push("└─────────────────────────────────────────────────┘")
    }

    report.push("")
    report.push("╔══════════════════════════════════════════════════╗")
    report.push("║  Deseja continuar com um destes tiers?           ║")
    report.push(`║  Responda: economy, balanced ou premium          ║`)
    report.push("╚══════════════════════════════════════════════════╝")

    const output = report.join("\n")

    return JSON.stringify({
      task_type: taskType,
      calls_estimate: estimate.calls,
      comparisons,
      budget: {
        window_5h: { remaining: windowRemaining, limit: GO_LIMITS.per_5h },
        week: { remaining: weekRemaining, limit: GO_LIMITS.per_week },
        month: { remaining: monthRemaining, limit: GO_LIMITS.per_month },
      },
      recommendation: best && worst && best.tier !== worst.tier
        ? {
            savings_vs_premium: worst.estimated_cost_usd - best.estimated_cost_usd,
            quality_diff: worst.quality_range[1] - best.quality_range[1],
          }
        : null,
      report: output,
    })
  },
})
