# Workflow: qa-loop

Ciclo sistematico de debugging, correcao e resiliencia.
Convertido de `.aiox-core/workflows/qa-loop.yaml`.

## Como executar

"execute o qa-loop para o bug <descricao>".

1. **reproduce** (papel: QA) — skill `systematic-debugging`: crie caso minimo de
   reproducao. Saida: `docs/bugs/<bug>.md`.
2. **fix** (papel: dev) — skills `test-driven-development` + `systematic-debugging`:
   teste de regressao + correcao.
3. **chaos-test** (papel: QA, OPCIONAL) — skill `verification-before-completion`.
   Ativar APENAS se o codigo envolver: transacoes SAGA, mensageria, chamadas
   sincronas externas ou compensating-transaction. Cenarios: network-drop,
   timeout-retry, duplicate-message, partial-failure, rollback-manual.
   Saida: `docs/bugs/chaos-test-<bug>.md`.
4. **verify** (papel: QA) — `verification-before-completion`: correcao,
   regressoes, resiliencia.
5. **review** (papel: QA) — `requesting-code-review`: revisar e documentar
   licoes aprendidas.
