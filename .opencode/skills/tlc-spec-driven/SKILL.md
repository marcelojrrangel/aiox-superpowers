---
name: tlc-spec-driven
description: Use para desenvolvimento orientado a spec em 4 fases. Cria especificações detalhadas antes da implementação.
---

# Skill de TLC Spec-Driven Development

## Processo de 4 Fases

### Fase 1: Especificação
- Coletar requisitos de stakeholders
- Definir user stories com critérios de aceitação
- Documentar restrições e suposições
- Criar documento de especificação da feature

### Fase 2: Design
- Criar documento de design técnico
- Definir contratos de API
- Projetar modelos de dados
- Planejar pontos de integração
- Documentar considerações de segurança

### Fase 3: Divisão em Tarefas
- Dividir design em tarefas de implementação
- Estimar esforço por tarefa
- Identificar dependências
- Criar plano de implementação
- Definir critérios de verificação

### Fase 4: Implementação
- Executar tarefas seguindo o plano
- Escrever testes para cada tarefa
- Revisar contra especificação
- Documentar quaisquer desvios
- Atualizar especificação se necessário

## Modelos de Documento

### Documento de Especificação
```markdown
# Especificação da Feature

## Visão Geral
[O que esta feature faz]

## User Stories
- Como [usuário], eu quero [objetivo] para que [benefício]

## Critérios de Aceitação
- [ ] Critério 1
- [ ] Critério 2

## Restrições
- Técnicas: [limitações]
- Negócio: [requisitos]
- Tempo: [prazo]
```

### Documento de Design
```markdown
# Design Técnico

## Arquitetura
[Design de alto nível]

## Contratos de API
[Definições de endpoints]

## Modelos de Dados
[Definições de schema]

## Segurança
[Considerações de segurança]
```

## Anti-padrões
- Pular fase de especificação
- Critérios de aceitação vagos
- Não documentar restrições
- Mudar spec durante implementação
- Ignorar considerações de segurança
