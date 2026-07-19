---
name: brainstorming
description: Use ANTES de escrever qualquer código. Ativa quando o usuário descreve uma feature, ideia ou problema. Refina ideias vagas através de questões, explora alternativas, apresenta design em partes digestíveis para validação.
---

# Skill de Brainstorming

## Quando Ativar
- O usuário descreve uma nova feature ou ideia
- O usuário pede para construir algo sem spec clara
- Antes de qualquer decisão arquitetural
- Quando os requisitos são ambíguos

## Processo

### Fase 1: Entender o Problema Real
Faça perguntas esclarecedoras:
- Que problema isso resolve?
- Quem é o usuário/cliente?
- O que é sucesso?
- Quais são as restrições (tempo, tecnologia, orçamento)?

### Fase 2: Explorar Alternativas
Apresente 2-3 abordagens com trade-offs:
- Opção A: [descrição] — prós/contras
- Opção B: [descrição] — prós/contras
- Opção C: [descrição] — prós/contras

### Fase 3: Refinar o Design
Mostre a abordagem escolhida em partes pequenas e digestíveis:
1. Arquitetura de alto nível
2. Fluxo de dados
3. Componentes principais
4. Pontos de integração

### Fase 4: Validar
- Apresente cada seção para aprovação do usuário
- Salve o design aprovado em `docs/designs/<nome>.md`
- Só prossiga para planejamento após aprovação total

## Anti-padrões a Evitar
- Pular direto para o código sem entender o problema
- Apresentar uma única opção sem alternativas
- Superprojetar para necessidades futuras hipotéticas
- Ignorar padrões existentes na codebase

## Saída
Salve documento de design com:
- Declaração do problema
- Abordagem escolhida e justificativa
- Alternativas consideradas
- Diagrama de componentes principais
- Critérios de sucesso
