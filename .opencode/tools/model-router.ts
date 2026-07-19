import { tool } from "@opencode-ai/plugin"
import path from "path"
import fs from "fs"

interface ModelTier {
  model: string
  tier: string
  tierLabel: string
}

interface CascadeResult {
  selected_model: string
  tier: string
  fallbacks_tried: Array<{ model: string; error: string }>
  latency_ms: number
  from_cache: boolean
  recommendation: string
}

interface PingCacheEntry {
  available: boolean
  latency_ms: number
  error?: string
  timestamp: number
}

const pingCache = new Map<string, PingCacheEntry>()
const CACHE_TTL_SUCCESS = 5 * 60 * 1000
const CACHE_TTL_FAILURE = 1 * 60 * 1000
const PROBE_TIMEOUT = 5000
const LOG_DIR = ".opencode/logs"
const LOG_FILE = "model-usage.jsonl"

const CATEGORY_MODELS: Record<string, ModelTier[]> = {
  orchestration: [
    { model: "opencode/claude-haiku-4.5", tier: "free_zen", tierLabel: "Free Zen" },
    { model: "opencode-go/deepseek-v4-flash", tier: "go_free", tierLabel: "Go Free" },
    { model: "opencode-go/deepseek-v4-pro", tier: "go_pago", tierLabel: "Go Pago" },
    { model: "opencode/claude-sonnet-5", tier: "zen_pago", tierLabel: "Zen Pago" },
  ],
  brainstorming: [
    { model: "opencode/claude-haiku-4.5", tier: "free_zen", tierLabel: "Free Zen" },
    { model: "opencode-go/deepseek-v4-flash", tier: "go_free", tierLabel: "Go Free" },
    { model: "opencode-go/glm-5.2", tier: "go_pago", tierLabel: "Go Pago" },
    { model: "opencode/claude-sonnet-5", tier: "zen_pago", tierLabel: "Zen Pago" },
  ],
  planning: [
    { model: "opencode/claude-haiku-4.5", tier: "free_zen", tierLabel: "Free Zen" },
    { model: "opencode-go/deepseek-v4-flash", tier: "go_free", tierLabel: "Go Free" },
    { model: "opencode-go/glm-5.2", tier: "go_pago", tierLabel: "Go Pago" },
    { model: "opencode/claude-sonnet-5", tier: "zen_pago", tierLabel: "Zen Pago" },
  ],
  implementation: [
    { model: "opencode/claude-haiku-4.5", tier: "free_zen", tierLabel: "Free Zen" },
    { model: "opencode-go/mimo-v2.5", tier: "go_free", tierLabel: "Go Free" },
    { model: "opencode-go/kimi-k2.7-code", tier: "go_pago", tierLabel: "Go Pago" },
    { model: "opencode/claude-sonnet-5", tier: "zen_pago", tierLabel: "Zen Pago" },
  ],
  review: [
    { model: "opencode/claude-haiku-4.5", tier: "free_zen", tierLabel: "Free Zen" },
    { model: "opencode-go/deepseek-v4-flash", tier: "go_free", tierLabel: "Go Free" },
    { model: "opencode-go/glm-5.2", tier: "go_pago", tierLabel: "Go Pago" },
    { model: "opencode/claude-opus-4-8", tier: "zen_pago", tierLabel: "Zen Pago" },
  ],
  testing: [
    { model: "opencode/claude-haiku-4.5", tier: "free_zen", tierLabel: "Free Zen" },
    { model: "opencode-go/mimo-v2.5", tier: "go_free", tierLabel: "Go Free" },
    { model: "opencode-go/qwen3.7-plus", tier: "go_pago", tierLabel: "Go Pago" },
    { model: "opencode/claude-sonnet-5", tier: "zen_pago", tierLabel: "Zen Pago" },
  ],
  documentation: [
    { model: "opencode/claude-haiku-4.5", tier: "free_zen", tierLabel: "Free Zen" },
    { model: "opencode-go/deepseek-v4-flash", tier: "go_free", tierLabel: "Go Free" },
    { model: "opencode-go/qwen3.7-plus", tier: "go_pago", tierLabel: "Go Pago" },
    { model: "opencode/claude-haiku-4.5", tier: "zen_pago", tierLabel: "Zen Pago" },
  ],
  devops: [
    { model: "opencode/claude-haiku-4.5", tier: "free_zen", tierLabel: "Free Zen" },
    { model: "opencode-go/deepseek-v4-flash", tier: "go_free", tierLabel: "Go Free" },
    { model: "opencode-go/qwen3.7-plus", tier: "go_pago", tierLabel: "Go Pago" },
    { model: "opencode/claude-haiku-4.5", tier: "zen_pago", tierLabel: "Zen Pago" },
  ],
}

function isCacheValid(entry: PingCacheEntry): boolean {
  const ttl = entry.available ? CACHE_TTL_SUCCESS : CACHE_TTL_FAILURE
  return Date.now() - entry.timestamp < ttl
}

async function probeModel(model: string): Promise<PingCacheEntry> {
  const cached = pingCache.get(model)
  if (cached && isCacheValid(cached)) {
    return cached
  }

  const start = Date.now()
  try {
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), PROBE_TIMEOUT)

    const response = await fetch("https://api.opencode.ai/v1/chat/completions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: model.split("/").slice(1).join("/"),
        messages: [{ role: "user", content: "ping" }],
        max_tokens: 1,
      }),
      signal: controller.signal,
    })

    clearTimeout(timeout)
    const latency_ms = Date.now() - start

    const entry: PingCacheEntry = response.ok
      ? { available: true, latency_ms, timestamp: Date.now() }
      : {
          available: false,
          latency_ms,
          error: response.status === 401
            ? "auth_error"
            : response.status === 402
              ? "quota_exceeded"
              : response.status === 429
                ? "rate_limited"
                : `http_${response.status}`,
          timestamp: Date.now(),
        }

    pingCache.set(model, entry)
    return entry
  } catch (err: any) {
    const latency_ms = Date.now() - start
    const entry: PingCacheEntry = {
      available: false,
      latency_ms,
      error: err.name === "AbortError" ? "timeout" : "network_error",
      timestamp: Date.now(),
    }
    pingCache.set(model, entry)
    return entry
  }
}

function ensureLogDir(worktree: string): void {
  const logDir = path.join(worktree, LOG_DIR)
  if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir, { recursive: true })
  }
}

function appendLog(worktree: string, entry: object): void {
  try {
    ensureLogDir(worktree)
    const logPath = path.join(worktree, LOG_DIR, LOG_FILE)
    fs.appendFileSync(logPath, JSON.stringify(entry) + "\n", "utf-8")
  } catch {
    // logging is best-effort, never block routing
  }
}

export default tool({
  description:
    "Roteador automático de modelos com cascata inteligente. Tenta 4 tiers na ordem: Free Zen → Go Free → Go Pago → Zen Pago. Se todos falharem, retorna opções para o usuário. Faz cache de resultados e loga uso para análise de custos. Use ANTES de dispatchar qualquer subagente.",
  args: {
    category: tool.schema
      .enum([
        "orchestration",
        "brainstorming",
        "planning",
        "implementation",
        "review",
        "testing",
        "documentation",
        "devops",
      ])
      .describe("Categoria da tarefa para selecionar o melhor modelo"),
    preferZen: tool.schema
      .boolean()
      .optional()
      .describe("Se true, tenta Free Zen primeiro (padrão: true)"),
  },
  async execute(args, context) {
    const preferZen = args.preferZen !== false
    const worktree = context.worktree || context.directory || "."
    const startTime = Date.now()
    const fallbacks: Array<{ model: string; error: string }> = []

    const candidates = CATEGORY_MODELS[args.category]
    if (!candidates) {
      return JSON.stringify({
        error: `Categoria desconhecida: ${args.category}`,
        available_categories: Object.keys(CATEGORY_MODELS),
      })
    }

    const ordered = preferZen ? candidates : candidates.slice(1)

    for (const candidate of ordered) {
      const result = await probeModel(candidate.model)

      if (result.available) {
        const totalLatency = Date.now() - startTime
        const output: CascadeResult = {
          selected_model: candidate.model,
          tier: candidate.tier,
          fallbacks_tried: fallbacks,
          latency_ms: totalLatency,
          from_cache: false,
          recommendation: `Modelo ${candidate.model} selecionado (${candidate.tierLabel}) para ${args.category}`,
        }

        appendLog(worktree, {
          timestamp: new Date().toISOString(),
          category: args.category,
          selected_model: candidate.model,
          tier: candidate.tier,
          tier_label: candidate.tierLabel,
          fallbacks_tried: fallbacks,
          latency_ms: totalLatency,
          from_cache: false,
        })

        return JSON.stringify(output)
      }

      fallbacks.push({ model: candidate.model, error: result.error || "unknown" })
    }

    const totalLatency = Date.now() - startTime
    const userOutput: CascadeResult = {
      selected_model: "",
      tier: "user_required",
      fallbacks_tried: fallbacks,
      latency_ms: totalLatency,
      from_cache: false,
      recommendation: `Nenhum modelo automático disponível para ${args.category}. Modelos restantes: ${candidates.map((c) => c.model).join(", ")}. Use /models ou peça ao usuário para escolher.`,
    }

    appendLog(worktree, {
      timestamp: new Date().toISOString(),
      category: args.category,
      selected_model: null,
      tier: "user_required",
      tier_label: "Usuário",
      fallbacks_tried: fallbacks,
      latency_ms: totalLatency,
      from_cache: false,
    })

    return JSON.stringify(userOutput)
  },
})
