---
name: skill-architect
description: Use ao criar novas skills para o framework. Segue melhores práticas de design e documentação de skills.
---

# Skill de Skill Architect

## Estrutura de Skill
```
nome-skill/
  SKILL.md          # Arquivo principal da skill com frontmatter
  examples/         # Opcional: exemplos de uso
  templates/        # Opcional: templates
```

## Formato do SKILL.md
```markdown
---
name: nome-skill
description: Use quando [condição] - [o que faz]
---

# Nome da Skill

## Quando Ativar
- [Condição de ativação 1]
- [Condição de ativação 2]

## Processo
### Passo 1: [Ação]
[Descrição]

### Passo 2: [Ação]
[Descrição]

## Anti-padrões
- [O que NÃO fazer]

## Saída
[O que a skill produz]
```

## Princípios de Design

### 1. Responsabilidade Única
- Uma skill, um propósito
- Condições de ativação claras
- Saída focada

### 2. Composabilidade
- Skills podem ser combinadas
- Sem dependências de outras skills
- Entrada/saída claras

### 3. Auto-documentável
- Descrição clara no frontmatter
- Documentação abrangente do processo
- Exemplos quando útil

### 4. Testável
- Critérios de sucesso claros
- Saídas verificáveis
- Casos extremos documentados

## Convenções de Nomes
- Usar kebab-case: `minha-nome-skill`
- Ser descritivo: `test-driven-development`
- Evitar abreviações: `verification-before-completion`

## Requisitos do Frontmatter
```yaml
---
name: nome-skill          # Obrigatório
description: Use quando...  # Obrigatório
---
```

## Anti-padrões
- Skills que fazem muita coisa
- Condições de ativação pouco claras
- Documentação faltando
- Sem seção de anti-padrões
- Nomes inconsistentes
