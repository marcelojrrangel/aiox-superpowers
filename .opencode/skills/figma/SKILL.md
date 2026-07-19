---
name: figma
description: Use ao converter designs do Figma para código. Extrai tokens de design, componentes e layouts de arquivos Figma.
---

# Skill de Figma Design-to-Code

## Processo

### 1. Extrair Informações do Design
Do arquivo Figma:
- Estrutura de layout (flexbox/grid)
- Valores de espaçamento (margem, padding)
- Cores (primária, secundária, acentos)
- Tipografia (fontes, tamanhos, pesos)
- Componentes (botões, cards, inputs)

### 2. Gerar Tokens de Design
```json
{
  "cores": {
    "primaria": "#007AFF",
    "secundaria": "#5856D6",
    "fundo": "#FFFFFF",
    "texto": "#000000"
  },
  "espacamento": {
    "xs": "4px",
    "sm": "8px",
    "md": "16px",
    "lg": "24px",
    "xl": "32px"
  },
  "tipografia": {
    "heading1": {
      "fontFamily": "Inter",
      "fontSize": "32px",
      "fontWeight": "700"
    }
  }
}
```

### 3. Criar Componentes
- Identificar padrões reutilizáveis
- Criar hierarquia de componentes
- Definir props para variações
- Usar composição em vez de herança

### 4. Implementar Layout
- Converter frames para CSS Grid/Flexbox
- Lidar com breakpoints responsivos
- Manter consistência de espaçamento
- Usar tokens de design para valores

## Integração com API do Figma
```bash
# Obter dados do arquivo
curl -H "X-Figma-Token: <token>" \
  "https://api.figma.com/v1/files/<file-key>"

# Obter imagens
curl -H "X-Figma-Token: <token>" \
  "https://api.figma.com/v1/images/<file-key>?ids=<node-ids>"
```

## Melhores Práticas
- Usar tokens de design, não valores hardcoded
- Criar biblioteca de componentes
- Documentar variações de componentes
- Testar com diferentes comprimentos de conteúdo
- Garantir acessibilidade (contraste, focus states)

## Anti-padrões
- Hardcoding de cores/tamanhos
- Ignorar design responsivo
- Não usar tokens de design
- Criar componentes avulsos
- Esquecer da acessibilidade
