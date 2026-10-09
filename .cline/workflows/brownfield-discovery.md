# Workflow: brownfield-discovery

Descobrir e entender codebase existente antes de mudar.
Convertido de `.aiox-core/workflows/brownfield-discovery.yaml`.

## Como executar

"execute o brownfield-discovery em <pasta>".

1. **explore** — skill `codenavi`: mapeie estrutura e componentes.
   Saida: `docs/discovery/mapa-da-codebase.md`.
2. **analyze** (papel: arquiteto) — skills `tactical-ddd` + `codenavi`:
   modelo de dominio e arquitetura.
3. **document** — documente descobertas e plano de melhoria.
4. **plan** (papel: arquiteto) — skill `writing-plans`: plano de refatoracao/feature.
