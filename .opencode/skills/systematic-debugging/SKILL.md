---
name: systematic-debugging
description: Use ao encontrar bugs, erros ou comportamento inesperado. Segue processo de 4 fases de análise de causa raiz.
---

# Skill de Systematic Debugging

## Fase 1: Reproduzir
- Crie um caso de reprodução mínimo
- Documente os passos exatos para acionar o bug
- Observe o ambiente e as entradas
- Salve a reprodução em `docs/bugs/<nome-do-bug>.md`

## Fase 2: Isolar
- Adicione logging/print estratégicos
- Use busca binária para reduzir o espaço do problema
- Verifique mudanças recentes (git log)
- Identifique o componente exato que falha

## Fase 3: Análise de Causa Raiz
Pergunte:
- **O que** é o comportamento real vs esperado?
- **Onde** o problema ocorre?
- **Por que** acontece? (Técnica dos 5 Porquês)
- **Quando** começou? (git bisect se necessário)

### Categorias de Causa Raiz
1. **Erro de lógica** — Algoritmo ou condição errada
2. **Erro de dados** — Entrada ou estado inválido
3. **Erro de integração** — Contrato de API incompatível
4. **Erro de ambiente** — Problema específico de plataforma
5. **Erro de concorrência** — Race condition ou deadlock

## Fase 4: Corrigir e Verificar
1. Escreva teste que reproduz o bug (RED)
2. Implemente a correção mínima (GREEN)
3. Refatore se necessário (REFACTOR)
4. Verifique se a correção não quebra outros testes
5. Documente a correção no relatório do bug

## Defesa em Profundidade
Após corrigir, considere:
- Pode acontecer de novo? Adicione um teste.
- Devemos adicionar validação?
- A mensagem de erro é útil?
- Precisamos de monitoramento/alertas?

## Anti-padrões
- Corrigir sem entender a causa raiz
- "Debugging de espingarda" (mudanças aleatórias)
- Não escrever teste de regressão
- Corrigir sintomas em vez de causas
