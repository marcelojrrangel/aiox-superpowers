import { tool } from "@opencode-ai/plugin"
import path from "path"
import fs from "fs"

interface UsageEntry {
  timestamp: string
  category: string
  selected_model: string | null
  tier: string
  tier_label?: string
  fallbacks_tried: Array<{ model: string; error: string }>
  latency_ms: number
  from_cache: boolean
}

interface PlanUsage {
  go: {
    total_calls: number
    total_cost_usd: number
    by_model: Record<string, { calls: number; cost: number }>
    by_category: Record<string, number>
    top_models: Array<{ model: string; calls: number; cost: number }>
  }
  free: {
    total_calls: number
    by_model: Record<string, number>
    top_models: Array<{ model: string; calls: number }>
  }
}

const GO_LIMITS = {
  per_5h: 12,
  per_week: 30,
  per_month: 60,
}

const GO_COST_PER_REQUEST: Record<string, number> = {
  "deepseek-v4-flash": 0.00038,
  "mimo-v2.5": 0.0000047,
  "qwen3.7-plus": 0.000093,
  "qwen3.7-max": 0.00052,
  "deepseek-v4-pro": 0.000043,
  "glm-5.2": 0.0000136,
  "glm-5.1": 0.0000136,
  "kimi-k2.7-code": 0.000074,
  "kimi-k2.6": 0.000074,
  "kimi-k3": 0.000455,
  "grok-4.5": 0.000417,
  "minimax-m3": 0.0000375,
  "minimax-m2.7": 0.0000375,
  "mimo-v2.5-pro": 0.000134,
}

const FREE_MODELS = [
  "deepseek-v4-flash-free",
  "mimo-v2.5-free",
  "north-mini-code-free",
  "nemotron-3-ultra-free",
  "big-pickle",
]

const LOG_FILE = "model-usage.jsonl"
const LOG_DIR = ".opencode/logs"

function readLog(worktree: string): UsageEntry[] {
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
    .filter(Boolean) as UsageEntry[]
}

function buildPlanUsage(entries: UsageEntry[]): PlanUsage {
  const go: PlanUsage["go"] = {
    total_calls: 0,
    total_cost_usd: 0,
    by_model: {},
    by_category: {},
    top_models: [],
  }

  const free: PlanUsage["free"] = {
    total_calls: 0,
    by_model: {},
    top_models: [],
  }

  for (const entry of entries) {
    if (!entry.selected_model) continue

    const modelName = entry.selected_model.split("/").pop() || entry.selected_model
    const isFree = FREE_MODELS.some((fm) => modelName.includes(fm)) || entry.tier === "free_zen"
    const isGo = entry.tier === "go_free" || entry.tier === "go_pago"

    if (isFree) {
      free.total_calls++
      free.by_model[modelName] = (free.by_model[modelName] || 0) + 1
    } else if (isGo) {
      go.total_calls++
      const costPerCall = GO_COST_PER_REQUEST[modelName] || 0.0001
      const callCost = costPerCall
      go.total_cost_usd += callCost

      if (!go.by_model[modelName]) {
        go.by_model[modelName] = { calls: 0, cost: 0 }
      }
      go.by_model[modelName].calls++
      go.by_model[modelName].cost += callCost

      go.by_category[entry.category] = (go.by_category[entry.category] || 0) + 1
    }
  }

  go.top_models = Object.entries(go.by_model)
    .sort((a, b) => b[1].calls - a[1].calls)
    .slice(0, 5)
    .map(([model, data]) => ({ model, calls: data.calls, cost: data.cost }))

  free.top_models = Object.entries(free.by_model)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([model, calls]) => ({ model, calls }))

  return { go, free }
}

function calculateWindowReset(entries: UsageEntry[]): { resetIn: string; windowStart: Date; windowEnd: Date } {
  const now = Date.now()
  const FIVE_HOURS = 5 * 60 * 60 * 1000

  const goEntries = entries
    .filter((e) => (e.tier === "go_free" || e.tier === "go_pago") && e.selected_model)
    .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime())

  if (goEntries.length === 0) {
    return { resetIn: "N/A", windowStart: new Date(), windowEnd: new Date() }
  }

  let windowStart = new Date(goEntries[0].timestamp).getTime()
  for (const entry of goEntries) {
    const entryTime = new Date(entry.timestamp).getTime()
    if (now - entryTime < FIVE_HOURS) {
      windowStart = entryTime
      break
    }
  }

  const windowEnd = windowStart + FIVE_HOURS
  const resetMs = Math.max(0, windowEnd - now)
  const resetHours = Math.floor(resetMs / (60 * 60 * 1000))
  const resetMinutes = Math.floor((resetMs % (60 * 60 * 1000)) / 60000)

  let resetIn: string
  if (resetMs <= 0) {
    resetIn: "Janela atual expirada (novo ciclo)"
  } else if (resetHours > 0) {
    resetIn: `${resetHours}h ${resetMinutes}min`
  } else {
    resetIn: `${resetMinutes}min`
  }

  return { resetIn, windowStart: new Date(windowStart), windowEnd: new Date(windowEnd) }
}

function calculateWindowSpend(entries: UsageEntry[], windowStart: Date): number {
  let totalCost = 0
  for (const entry of entries) {
    if (entry.tier !== "go_free" && entry.tier !== "go_pago") continue
    if (!entry.selected_model) continue
    const entryTime = new Date(entry.timestamp).getTime()
    if (entryTime >= windowStart.getTime()) {
      const modelName = entry.selected_model.split("/").pop() || entry.selected_model
      totalCost += GO_COST_PER_REQUEST[modelName] || 0.0001
    }
  }
  return totalCost
}

function calculateWeekSpend(entries: UsageEntry[]): number {
  const now = Date.now()
  const ONE_WEEK = 7 * 24 * 60 * 60 * 1000
  let totalCost = 0
  for (const entry of entries) {
    if (entry.tier !== "go_free" && entry.tier !== "go_pago") continue
    if (!entry.selected_model) continue
    const entryTime = new Date(entry.timestamp).getTime()
    if (now - entryTime < ONE_WEEK) {
      const modelName = entry.selected_model.split("/").pop() || entry.selected_model
      totalCost += GO_COST_PER_REQUEST[modelName] || 0.0001
    }
  }
  return totalCost
}

function calculateMonthSpend(entries: UsageEntry[]): number {
  const now = Date.now()
  const ONE_MONTH = 30 * 24 * 60 * 60 * 1000
  let totalCost = 0
  for (const entry of entries) {
    if (entry.tier !== "go_free" && entry.tier !== "go_pago") continue
    if (!entry.selected_model) continue
    const entryTime = new Date(entry.timestamp).getTime()
    if (now - entryTime < ONE_MONTH) {
      const modelName = entry.selected_model.split("/").pop() || entry.selected_model
      totalCost += GO_COST_PER_REQUEST[modelName] || 0.0001
    }
  }
  return totalCost
}

function bar(current: number, max: number, width: number = 20): string {
  const ratio = Math.min(current / max, 1)
  const filled = Math.round(ratio * width)
  const empty = width - filled
  return `[${"█".repeat(filled)}${"░".repeat(empty)}]`
}

function dollarBar(spent: number, limit: number, width: number = 20): string {
  const remaining = Math.max(0, limit - spent)
  const ratio = Math.min(spent / limit, 1)
  const filled = Math.round(ratio * width)
  const empty = width - filled
  return `[${"█".repeat(filled)}${"░".repeat(empty)}]`
}

function formatCost(usd: number): string {
  if (usd < 0.01) return `$${usd.toFixed(4)}`
  if (usd < 1) return `$${usd.toFixed(3)}`
  return `$${usd.toFixed(2)}`
}

function formatDate(dateStr: string): string {
  try {
    return new Date(dateStr).toLocaleString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    })
  } catch {
    return dateStr
  }
}

export { calculateWindowSpend, calculateWeekSpend, calculateMonthSpend, GO_LIMITS, GO_COST_PER_REQUEST, FREE_MODELS, formatCost }

export default tool({
  description:
    "Relatório de consumo do plano Go ($5/mês) e modelos Free. Mostra barras de progresso em $, reset da janela 5h, top modelos, custo por categoria. Use /aiox-status para ver status.",
  args: {
    period: tool.schema
      .enum(["session", "today", "all"])
      .optional()
      .describe("Período: session (2h), today (hoje), all (tudo). Padrão: all"),
  },
  async execute(args, context) {
    const worktree = context.worktree || context.directory || "."
    const period = args.period || "all"
    const allEntries = readLog(worktree)

    if (allEntries.length === 0) {
      return JSON.stringify({
        message: "Nenhum registro de uso encontrado.",
        hint: "Execute /aiox-brainstorm ou /aiox-story para gerar dados.",
      })
    }

    const now = new Date()
    let entries = allEntries

    if (period === "today") {
      const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate())
      entries = allEntries.filter((e) => new Date(e.timestamp) >= todayStart)
    } else if (period === "session") {
      const sessionStart = new Date(now.getTime() - 2 * 60 * 60 * 1000)
      entries = allEntries.filter((e) => new Date(e.timestamp) >= sessionStart)
    }

    if (entries.length === 0) {
      return JSON.stringify({
        message: `Nenhum registro no período "${period}".`,
        total_all_time: allEntries.length,
      })
    }

    const usage = buildPlanUsage(entries)
    const totalCalls = usage.go.total_calls + usage.free.total_calls

    const windowReset = calculateWindowReset(allEntries)
    const windowSpend = calculateWindowSpend(allEntries, windowReset.windowStart)
    const weekSpend = calculateWeekSpend(allEntries)
    const monthSpend = calculateMonthSpend(allEntries)

    const windowRemaining = Math.max(0, GO_LIMITS.per_5h - windowSpend)
    const weekRemaining = Math.max(0, GO_LIMITS.per_week - weekSpend)
    const monthRemaining = Math.max(0, GO_LIMITS.per_month - monthSpend)

    const firstEntry = entries[0]
    const lastEntry = entries[entries.length - 1]
    const sessionDuration =
      new Date(lastEntry.timestamp).getTime() -
      new Date(firstEntry.timestamp).getTime()
    const sessionMinutes = Math.round(sessionDuration / 60000)

    const report: string[] = []

    report.push("╔══════════════════════════════════════════════════╗")
    report.push("║          RELATÓRIO DE CONSUMO AIOX              ║")
    report.push("╚══════════════════════════════════════════════════╝")
    report.push("")
    report.push(`Período: ${formatDate(firstEntry.timestamp)} → ${formatDate(lastEntry.timestamp)}`)
    report.push(`Duração: ${sessionMinutes} min | Total: ${totalCalls} chamadas`)
    report.push("")

    report.push("┌─────────────────────────────────────────────────┐")
    report.push("│  SEU PLANO GO ($5/mês → $10/mês)                │")
    report.push("├─────────────────────────────────────────────────┤")
    report.push("│")
    report.push(`│  5 horas:   ${formatCost(windowSpend).padEnd(8)} / $12.00  ${dollarBar(windowSpend, GO_LIMITS.per_5h)} ${Math.round((windowSpend / GO_LIMITS.per_5h) * 100)}%`)
    report.push(`│  Semanal:   ${formatCost(weekSpend).padEnd(8)} / $30.00  ${dollarBar(weekSpend, GO_LIMITS.per_week)} ${Math.round((weekSpend / GO_LIMITS.per_week) * 100)}%`)
    report.push(`│  Mensal:    ${formatCost(monthSpend).padEnd(8)} / $60.00  ${dollarBar(monthSpend, GO_LIMITS.per_month)} ${Math.round((monthSpend / GO_LIMITS.per_month) * 100)}%`)
    report.push("│")
    report.push(`│  Restante:  5h: ${formatCost(windowRemaining)} | Sem: ${formatCost(weekRemaining)} | Mens: ${formatCost(monthRemaining)}`)
    report.push(`│  Reset 5h em: ${windowReset.resetIn}`)
    report.push("│")

    if (usage.go.top_models.length > 0) {
      report.push("│  Top modelos Go (custo):")
      const maxCost = Math.max(...usage.go.top_models.map((m) => m.cost))
      for (const m of usage.go.top_models) {
        report.push(`│    ${m.model.padEnd(22)} ${dollarBar(m.cost, maxCost, 12)} ${formatCost(m.cost)} (${m.calls}x)`)
      }
    }

    if (Object.keys(usage.go.by_category).length > 0) {
      report.push("│")
      report.push("│  Por categoria:")
      const maxCat = Math.max(...Object.values(usage.go.by_category))
      for (const [cat, count] of Object.entries(usage.go.by_category).sort(
        (a, b) => b[1] - a[1]
      )) {
        report.push(`│    ${cat.padEnd(18)} ${bar(count, maxCat, 12)} ${count} chamadas`)
      }
    }

    report.push("└─────────────────────────────────────────────────┘")
    report.push("")

    report.push("┌─────────────────────────────────────────────────┐")
    report.push("│  MODELOS FREE (sem custo)                       │")
    report.push("├─────────────────────────────────────────────────┤")

    if (usage.free.total_calls > 0) {
      report.push(`│  Total: ${usage.free.total_calls} chamadas`)
      report.push("│")
      for (const m of usage.free.top_models) {
        report.push(`│    ${m.model.padEnd(30)} ${m.calls} usos`)
      }
      report.push("│")
      report.push("│  Sem limite documentado (período promocional)")
    } else {
      report.push("│  Nenhum uso registrado neste período.")
      report.push("│  Modelos disponíveis: deepseek-v4-flash-free,")
      report.push("│  mimo-v2.5-free, north-mini-code-free, etc.")
    }

    report.push("└─────────────────────────────────────────────────┘")
    report.push("")

    report.push("┌─────────────────────────────────────────────────┐")
    report.push("│  MÉTRICAS                                       │")
    report.push("├─────────────────────────────────────────────────┤")
    report.push(`│  Custo total Go: ${formatCost(usage.go.total_cost_usd)}`)
    report.push(`│  Chamadas Go: ${usage.go.total_calls} | Free: ${usage.free.total_calls}`)
    report.push(`│  Total: ${totalCalls} chamadas`)
    report.push("└─────────────────────────────────────────────────┘")

    const output = report.join("\n")

    return JSON.stringify({
      summary: {
        period,
        total_calls: totalCalls,
        go_calls: usage.go.total_calls,
        free_calls: usage.free.total_calls,
        go_cost_usd: usage.go.total_cost_usd,
        window_5h: { spent: windowSpend, limit: GO_LIMITS.per_5h, remaining: windowRemaining },
        week: { spent: weekSpend, limit: GO_LIMITS.per_week, remaining: weekRemaining },
        month: { spent: monthSpend, limit: GO_LIMITS.per_month, remaining: monthRemaining },
        reset_in: windowReset.resetIn,
      },
      go: usage.go,
      free: usage.free,
      report: output,
    })
  },
})
