import { tool } from "@opencode-ai/plugin"

interface CacheEntry {
  available: boolean
  latency_ms: number
  error?: string
  timestamp: number
}

const cache = new Map<string, CacheEntry>()
const CACHE_TTL_SUCCESS = 5 * 60 * 1000
const CACHE_TTL_FAILURE = 1 * 60 * 1000
const PROBE_TIMEOUT = 5000

function getCacheTtl(available: number): number {
  return available ? CACHE_TTL_SUCCESS : CACHE_TTL_FAILURE
}

function isCacheValid(entry: CacheEntry): boolean {
  const ttl = getCacheTtl(entry.available ? 1 : 0)
  return Date.now() - entry.timestamp < ttl
}

function parseProviderFromModel(model: string): { provider: string; baseUrl: string } {
  const [provider] = model.split("/")
  switch (provider) {
    case "opencode-go":
      return { provider, baseUrl: "https://api.opencode.ai/v1" }
    case "opencode":
      return { provider, baseUrl: "https://api.opencode.ai/v1" }
    default:
      return { provider, baseUrl: "https://api.opencode.ai/v1" }
  }
}

async function probeModel(model: string): Promise<CacheEntry> {
  const { baseUrl } = parseProviderFromModel(model)
  const start = Date.now()

  try {
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), PROBE_TIMEOUT)

    const response = await fetch(`${baseUrl}/chat/completions`, {
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

    if (response.ok) {
      return { available: true, latency_ms, timestamp: Date.now() }
    }

    const errorMap: Record<number, string> = {
      401: "auth_error",
      402: "quota_exceeded",
      429: "rate_limited",
    }

    return {
      available: false,
      latency_ms,
      error: errorMap[response.status] || `http_${response.status}`,
      timestamp: Date.now(),
    }
  } catch (err: any) {
    const latency_ms = Date.now() - start
    if (err.name === "AbortError") {
      return { available: false, latency_ms, error: "timeout", timestamp: Date.now() }
    }
    return { available: false, latency_ms, error: "network_error", timestamp: Date.now() }
  }
}

export default tool({
  description:
    "Verifica se um modelo de IA está disponível e com saldo. Faz probe rápido (1 token, timeout 5s). Resultados são cacheados por 5min (sucesso) ou 1min (falha). Use ANTES de dispatchar subagentes para evitar parada por falta de saldo.",
  args: {
    model: tool.schema
      .string()
      .describe(
        "ID do modelo no formato provider/model (ex: opencode-go/qwen3.7-plus, opencode/claude-haiku-4.5)"
      ),
  },
  async execute(args) {
    const cached = cache.get(args.model)
    if (cached && isCacheValid(cached)) {
      return JSON.stringify({
        ...cached,
        cached: true,
        message: cached.available
          ? `Modelo ${args.model} disponível (cacheado)`
          : `Modelo ${args.model} indisisponível: ${cached.error} (cacheado)`,
      })
    }

    const result = await probeModel(args.model)
    cache.set(args.model, result)

    return JSON.stringify({
      ...result,
      cached: false,
      message: result.available
        ? `Modelo ${args.model} disponível (${result.latency_ms}ms)`
        : `Modelo ${args.model} indisponível: ${result.error} (${result.latency_ms}ms)`,
    })
  },
})
