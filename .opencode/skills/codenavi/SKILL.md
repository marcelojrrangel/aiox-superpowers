---
name: codenavi
description: Use para navegação inteligente em codebase. Ajuda a entender estrutura de código, encontrar código relevante e rastrear dependências. Otimiza consumo de tokens com indexação em 3 camadas.
---

# Skill de CodeNavi — Navegação com Otimização de Tokens

## Estratégia em 3 Camadas

**REGRA FUNDAMENTAL:** Nunca pule direto para o conteúdo bruto. Siga a hierarquia: Camada 1 → Camada 2 → Camada 3. Cada camada só é executada se a anterior não respondeu à pergunta.

### Camada 1 — Estrutura (Custo: Mapeamento de árvore)
Objetivo: Mapear a forma do projeto sem ler código.

```bash
# 1. Listar raiz do projeto
ls

# 2. Mapear diretórios principais (2 níveis)
find . -maxdepth 2 -type d | head -50

# 3. Encontrar pontos de entrada
glob **/index.{ts,js,go,py}
glob **/main.{ts,js,go,py}
glob **/app.{ts,js,go,py}

# 4. Encontrar arquivos de config
glob **/package.json
glob **/go.mod
glob **/pyproject.toml
glob **/tsconfig.json
```

**Output esperado:** Árvore de diretórios + lista de entry points + stack tecnológica.

### Camada 2 — Assinaturas (Custo: Resumo de API)
Objetivo: Extrair "esqueleto" do código — nomes de funções, tipos, exports — sem o corpo.

```bash
# 1. Assinaturas de funções (corpo omitido)
grep -rn "^func \|^def \|^export.*function \|^export.*const.*=.*(" --include="*.ts" --include="*.go" --include="*.py" | head -80

# 2. Definições de tipos/interfaces
grep -rn "^type \|^interface \|^class \|^struct " --include="*.ts" --include="*.go" --include="*.py" | head -80

# 3. Rotas/endpoints
grep -rn "router\.\|app\.\(get\|post\|put\|delete\)\|@\(Get\|Post\|Put\|Delete\)Mapping\|http\.Handle" --include="*.ts" --include="*.go" --include="*.py" | head -40

# 4. Exports do módulo principal
grep -rn "^export " index.ts main.ts app.ts 2>/dev/null | head -40
```

**Output esperado:** Catálogo de funções, tipos e endpoints. O suficiente para decidir onde mergulhar.

### Camada 3 — Detalhe (Custo: Leitura seletiva)
Objetivo: Ler corpo de funções/arquivos específicos SOMENTE quando a Camada 2 identificou o alvo.

```bash
# 1. Ler arquivo específico (nunca mais de 200 linhas por chamada)
read <caminho-do-arquivo> offset=<linha-inicio> limit=150

# 2. Rastrear imports de um módulo específico
grep "from '<modulo>'" --include="*.ts" --include="*.py"

# 3. Encontrar chamadores de uma função
grep -rn "nomeDaFuncao(" --include="*.ts" --include="*.go" --include="*.py"
```

**REGRAS para Camada 3:**
- Ler no máximo 3 arquivos por iteração
- Se o arquivo tiver >200 linhas, ler em chunks de 150 linhas
- Nunca ler testes junto com código de produção na mesma iteração

## Fluxo de Decisão

```
Pergunta do usuário
        │
        ▼
┌─── Camada 1: Estrutura ───┐
│  A resposta está na       │── SIM → Responder
│  árvore de diretórios?    │
└───────────────────────────┘
        │ NÃO
        ▼
┌─── Camada 2: Assinaturas ─┐
│  A resposta está nas      │── SIM → Responder
│  assinaturas de API?      │
└───────────────────────────┘
        │ NÃO
        ▼
┌─── Camada 3: Detalhe ─────┐
│  Ler arquivos específicos │── SIM → Responder
│  (máx 3 arquivos)        │
└───────────────────────────┘
        │ NÃO
        ▼
  Informar que não encontrou
```

## Modo Brownfield-Discovery

Quando o workflow `brownfield-discovery.yaml` estiver ativo, siga este protocolo:

1. **Phase explore** — Execute Camada 1 + Camada 2. Gere `docs/discovery/mapa-da-codebase.md` com:
   - Árvore de diretórios (top 3 níveis)
   - Stack tecnológica identificada
   - Lista de módulos/pacotes principais
   - Entry points encontrados
   - Quantidade estimada de arquivos por tipo

2. **Phase analyze** — Para cada módulo identificado, execute Camada 2 (assinaturas). Gere resumo por módulo:
   - Funções públicas (exports)
   - Tipos/interfaces expostas
   - Dependências externas (imports de terceiros)
   - Padrões arquiteturais detectados (MVC, Clean, Hexagonal, etc.)

3. **Phase document** — Consolide descobertas. Apenas então, para módulos críticos, execute Camada 3.

4. **Phase plan** — Use o mapa consolidado para criar plano de refatoração/feature.

## Economia de Tokens

| Abordagem | Tokens Estimados (codebase 500 arquivos) |
|-----------|------------------------------------------|
| ❌ Ler tudo (antigo) | ~200k-500k tokens |
| ✅ Camada 1+2+3 (novo) | ~20k-50k tokens |
| **Economia** | **~70-80%** |

## Ferramentas de Navegação

### Por Estrutura de Arquivos
```bash
# Encontrar arquivos por padrão
glob **/*.ts
glob **/api/**/*.py
glob **/src/**/*.{ts,tsx}

# Encontrar diretórios
ls src/
```

### Por Conteúdo (Camada 2)
```bash
# Assinaturas de função
grep -rn "^func \|^def \|^export.*function" --include="*.ts" --include="*.go"

# Definições de tipo
grep -rn "^type \|^interface \|^class" --include="*.ts" --include="*.go"

# Imports de módulo
grep -rn "from 'lodash'" --include="*.ts"
```

### Por Dependências
```bash
# package.json
cat package.json | grep -A2 dependencies

# go.mod
cat go.mod | grep "^require"

# Imports de terceiros (não relativos)
grep -rn "from '[^\.]" --include="*.ts" | head -20
```

## Compreensão de Código

### Antes de Fazer Mudanças
1. Executar Camada 1 para mapear estrutura
2. Executar Camada 2 no módulo alvo
3. Encontrar todos os importadores
4. Verificar se há testes
5. Entender impacto da mudança

### Ordem de Leitura (quando precisar de Camada 3)
1. Ponto de entrada
2. Configuração
3. Lógica principal
4. Modelos de dados
5. Endpoints de API
6. Testes (último)

## Anti-padrões
- ❌ Pular Camada 1 e ir direto para `read` de arquivos
- ❌ Ler arquivos inteiros sem antes ver assinaturas
- ❌ Ler >3 arquivos na mesma iteração
- ❌ Enviar conteúdo bruto sem resumir estrutura
- ❌ Mudar código sem entendê-lo
- ❌ Não verificar dependentes
- ❌ Ignorar arquivos de teste
- ❌ Não ler configuração
- ❌ Pular documentação
