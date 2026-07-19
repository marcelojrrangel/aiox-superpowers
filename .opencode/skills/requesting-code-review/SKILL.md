---
name: requesting-code-review
description: Use antes de submeter código para review. Prepara código e documentação para review efetivo.
---

# Skill de Requesting Code Review

## Checklist Pré-Review

### 1. Self-Review
- [ ] Leia todas as mudanças
- [ ] Verifique erros óbvios
- [ ] Confirme cobertura de testes
- [ ] Garanta que documentação está clara

### 2. Preparar Descrição
Escreva descrição clara para PR/commit:
- **O que** mudou
- **Por que** mudou
- **Como** foi testado
- **Impacto** em outro código

### 3. Verificar Testes
```bash
npm test
npm run lint
npm run typecheck
```

## Modelo de Solicitação de Review

```markdown
## Mudanças Feitas
- [Listar mudanças principais]

## Motivação
- [Por que esta mudança é necessária]

## Testes
- [Como foi testado]
- [Cobertura de testes]

## Áreas de Preocupação
- [Quaisquer áreas específicas que precisam de atenção]

## Screenshots (se aplicável)
- [Mudanças de UI]
```

## O que Faz um Bom Pedido de Review
1. **Mudanças pequenas e focadas** — Mais fácil de revisar profundamente
2. **Descrição clara** — Revisor entende o contexto
3. **Testes incluídos** — Revisor pode verificar comportamento
4. **Documentação atualizada** — Sem precisar adivinhar

## Durante o Review
- Responda a feedback prontamente
- Faça perguntas de esclarecimento
- Não leve feedback pessoalmente
- Foque no código, não na pessoa

## Após o Review
- Resolva todos os problemas críticos
- Discuta sugestões não-críticas
- Atualize código baseado no feedback
- Peça re-review se necessário
