---
name: web-quality-audit
description: Use ao realizar auditorias abrangentes de qualidade web. Verifica performance, acessibilidade, SEO e melhores práticas.
---

# Skill de Web Quality Audit

## Categorias de Auditoria

### 1. Performance
- [ ] First Contentful Paint < 1.8s
- [ ] Largest Contentful Paint < 2.5s
- [ ] Cumulative Layout Shift < 0.1
- [ ] Time to Interactive < 3.8s
- [ ] Peso total da página < 3MB
- [ ] Imagens otimizadas (WebP, lazy loading)
- [ ] Code splitting implementado
- [ ] Headers de cache configurados

### 2. Acessibilidade (WCAG 2.1)
- [ ] Contraste de cores >= 4.5:1
- [ ] Todas as imagens têm texto alternativo
- [ ] Entradas de formulário têm labels
- [ ] Navegação por teclado funciona
- [ ] Compatível com leitor de tela
- [ ] Estados de focus visíveis
- [ ] Atributos ARIA corretos
- [ ] Link de pular navegação

### 3. SEO
- [ ] Title tag única e descritiva
- [ ] Meta description presente
- [ ] Hierarquia de headings correta (h1-h6)
- [ ] Dados estruturados implementados
- [ ] Sitemap.xml existe
- [ ] Robots.txt configurado
- [ ] URL canônica definida
- [ ] Tags Open Graph

### 4. Melhores Práticas
- [ ] HTTPS habilitado
- [ ] Sem conteúdo misto
- [ ] Página 404 apropriada
- [ ] Favicon presente
- [ ] Viewport meta tag
- [ ] Codificação de caracteres declarada
- [ ] Sem erros no console
- [ ] Headers de segurança

## Ferramentas
- Lighthouse (Chrome DevTools)
- WebPageTest
- axe DevTools
- WAVE
- GTmetrix

## Formato do Relatório
```markdown
## Relatório de Auditoria de Qualidade Web

### Pontuação de Performance: X/100
- [Problemas encontrados]
- [Recomendações]

### Pontuação de Acessibilidade: X/100
- [Problemas encontrados]
- [Recomendações]

### Pontuação de SEO: X/100
- [Problemas encontrados]
- [Recomendações]

### Pontuação de Melhores Práticas: X/100
- [Problemas encontrados]
- [Recomendações]
```
