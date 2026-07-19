import { tool } from "@opencode-ai/plugin"
import path from "path"
import fs from "fs"
import {
  calculateWindowSpend,
  calculateWeekSpend,
  calculateMonthSpend,
  GO_LIMITS,
  GO_COST_PER_REQUEST,
  FREE_MODELS,
  formatCost,
} from "./usage-report"

interface FeasibilityEntry {
  timestamp: string
  category: string
  selected_model: string | null
  tier: string
  latency_ms: number
}

const LOG_FILE = "model-usage.jsonl"
const LOG_DIR = ".opencode/logs"

const TASK_ESTIMATES: Record<string, { cost_low: number; cost_high: number; calls: number }> = {
  quick_edit: { cost_low: 0.005, cost_high: 0.02, calls: 3 },
  feature: { cost_low: 0.15, cost_high: 0.85, calls: 12 },
  refactor: { cost_low: 0.30, cost_high: 1.50, calls: 15 },
  brownfield: { cost_low: 0.50, cost_high: 3.0, calls: 25 },
  greenfield: { cost_low: 2.0, cost_high: 8.0, calls: 80 },
  full_stack: { cost_low: 3.0, cost_high: 12.0, calls: 100 },
}

function readLog(worktree: string): FeasibilityEntry[] {
  const logPath = path.join(worktree, LOG_DIR, LOG_FILE)
  if (!fs.existsSync(logPath)) return []

  const content = fs.readFileSync(logPath, "utf-8")
  return content
    .split("\n")
    .filter((line) => line.trim())
    .map((line) => {
      try {
        return JSON.parse(line)
      } catch {
        return null
      }
    })
    .filter(Boolean) as FeasibilityEntry[]
}

function bar(current: number, max: number, width: number = 20): string {
  const ratio = Math.min(current / max, 1)
  const filled = Math.round(ratio * width)
  const empty = width - filled
  return `[${"█".repeat(filled)}${"░".repeat(empty)}]`
}

function formatCost(usd: number): string {
  if (usd < 0.01) return `$${usd.toFixed(4)}`
  if (usd < 1) return `$${usd.toFixed(3)}`
  return `$${usd.toFixed(2)}`
}

function viabilityColor(pct: number): string {
  if (pct <= 60) return "VERDE"
  if (pct <= 85) return "AMARELO"
  return "VERMELHO"
}

export default tool({
  description:
    "Analisa viabilidade de uma tarefa no orçamento atual. Compara custo estimado com saldo 5h/semanal/mensal. Retorna verde/amarelo/vermelho com recomendações.",
  args: {
    task_type: tool.schema
      .enum(["quick_edit", "feature", "refactor", "brownfield", "greenfield", "full_stack"])
      .describe("Tipo da tarefa para análise"),
  },
  async execute(args, context) {
    const worktree = context.worktree || context.directory || "."
    const taskType = args.task_type
    const estimate = TASK_ESTIMATES[taskType]

    if (!estimate) {
      return JSON.stringify({ error: `Tipo desconhecido: ${taskType}` })
    }

    const allEntries = readLog(worktree)

    let windowSpend = 0
    let weekSpend = 0
    let monthSpend = 0
    let windowRemaining = GO_LIMITS.per_5h
    let weekRemaining = GO_LIMITS.per_week
    let monthRemaining = GO_LIMITS.per_month

    if (allEntries.length > 0) {
      windowSpend = calculateWindowSpend(allEntries, new Date(Date.now() - 5 * 60 * 60 * 1000))
      weekSpend = calculateWeekSpend(allEntries)
      monthSpend = calculateMonthSpend(allEntries)
      windowRemaining = Math.max(0, GO_LIMITS.per_5h - windowSpend)
      weekRemaining = Math.max(0, GO_LIMITS.per_week - weekSpend)
      monthRemaining = Math.max(0, GO_LIMITS.per_month - monthSpend)
    }

    const midCost = (estimate.cost_low + estimate.cost_high) / 2

    const windowPct = (midCost / windowRemaining) * 100
    const weekPct = (midCost / weekRemaining) * 100
    const monthPct = (midCost / monthRemaining) * 100
    const worstPct = Math.max(windowPct, weekPct, monthPct)

    const viability = viabilityColor(worstPct)

    const report: string[] = []

    report.push("╔══════════════════════════════════════════════════╗")
    report.push("║         ANÁLISE DE VIABILIDADE DO PROJETO       ║")
    report.push("╚══════════════════════════════════════════════════╝")
    report.push("")
    report.push(`Tarefa: ${taskType.toUpperCase()}`)
    report.push(`Custo estimado: ${formatCost(estimate.cost_low)} ~ ${formatCost(estimate.cost_high)}`)
    report.push(`Média estimada: ${formatCost(midCost)}`)
    report.push(`Chamadas estimadas: ~${estimate.calls}`)
    report.push("")

    report.push("┌─────────────────────────────────────────────────┐")
    report.push("│  SALDO DISPONÍVEL                               │")
    report.push("├─────────────────────────────────────────────────┤")
    report.push(`│  5 horas:  ${formatCost(windowRemaining).padEnd(8)} restante  ${bar(windowRemaining, GO_LIMITS.per_5h)} ${Math.round((1 - windowSpend / GO_LIMITS.per_5h) * 100)}%`)
    report.push(`│  Semanal:  ${formatCost(weekRemaining).padEnd(8)} restante  ${bar(weekRemaining, GO_LIMITS.per_week)} ${Math.round((1 - weekSpend / GO_LIMITS.per_week) * 100)}%`)
    report.push(`│  Mensal:   ${formatCost(monthRemaining).padEnd(8)} restante  ${bar(monthRemaining, GO_LIMITS.per_month)} ${Math.round((1 - monthSpend / GO_LIMITS.per_month) * 100)}%`)
    report.push("└─────────────────────────────────────────────────┘")
    report.push("")

    report.push("┌─────────────────────────────────────────────────┐")
    report.push(`│  VIABILIDADE: ${viability}                             `)
    report.push("├─────────────────────────────────────────────────┤")
    report.push(`│  Custo médio: ${formatCost(midCost)}`)
    report.push(`│`)
    report.push(`│  5 horas:  ${formatCost(midCost).padEnd(8)} / ${formatCost(windowRemaining).padEnd(8)} restante  ${Math.round(windowPct)}%`)

    if (windowPct > 100) {
      report.push(`│  ⚠️  Excede saldo 5h em ${formatCost(midCost - windowRemaining)}`)
    }

    report.push(`│  Semanal:  ${formatCost(midCost).padEnd(8)} / ${formatCost(weekRemaining).padEnd(8)} restante  ${Math.round(weekPct)}%`)

    if (weekPct > 100) {
      report.push(`│  ⚠️  Excede saldo semanal em ${formatCost(midCost - weekRemaining)}`)
    }

    report.push(`│  Mensal:   ${formatCost(midCost).padEnd(8)} / ${formatCost(monthRemaining).padEnd(8)} restante  ${Math.round(monthPct)}%`)

    if (monthPct > 100) {
      report.push(`│  ⚠️  Excede saldo mensal em ${formatCost(midCost - monthRemaining)}`)
    }

    report.push("│")
    report.push("│  RECOMENDAÇÕES:")

    if (viability === "VERDE") {
      report.push("│  ✅ Saldo suficiente em todas as janelas.")
      report.push("│  Prossiga normalmente com a tarefa.")
      report.push("│  Considere usar modelos free para etapas simples.")
    } else if (viability === "AMARELO") {
      report.push("│  ⚡ Saldo apertado em alguma janela.")
      report.push("│  1. Priorize modelos free (deepseek-v4-flash-free)")
      report.push("│  2. Quebre a tarefa em partes menores")
      report.push("│  3. Execute quick_edit primeiro para validar")
      report.push("│  4. Verifique saldo antes de cada etapa")
    } else {
      report.push("│  🔴 Saldo insuficiente em pelo menos uma janela.")
      report.push("│  1. NÃO comece a tarefa agora")
      report.push("│  2. Aguarde reset da janela 5h")
      report.push("│  3. Quebre em quick_edits de $0.005-$0.02")
      report.push("│  4. Execute /aiox-status para monitorar")
      report.push("│  ⚠️  Não bloquear — decida com o dev")
    }

    report.push("└─────────────────────────────────────────────────┘")

    const output = report.join("\n")

    return JSON.stringify({
      task_type: taskType,
      estimate: {
        cost_low: estimate.cost_low,
        cost_high: estimate.cost_high,
        cost_mid: midCost,
        calls: estimate.calls,
      },
      budget: {
        window_5h: { remaining: windowRemaining, limit: GO_LIMITS.per_5h },
        week: { remaining: weekRemaining, limit: GO_LIMITS.per_week },
        month: { remaining: monthRemaining, limit: GO_LIMITS.per_month },
      },
      impact: {
        window_5h_pct: Math.round(windowPct),
        week_pct: Math.round(weekPct),
        month_pct: Math.round(monthPct),
        worst_pct: Math.round(worstPct),
      },
      viability,
      report: output,
    })
  },
})
