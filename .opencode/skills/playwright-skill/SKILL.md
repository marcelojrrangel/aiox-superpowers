---
name: playwright-skill
description: Use ao escrever testes E2E com Playwright. Fornece padrões para testes end-to-end confiáveis e manuteníveis.
---

# Skill de Playwright E2E Testing

## Configuração
```bash
npm init playwright@latest
# ou
npx playwright install
```

## Estrutura do Teste
```typescript
import { test, expect } from '@playwright/test';

test.describe('Nome da Feature', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/feature');
  });

  test('deve fazer algo', async ({ page }) => {
    // Arrange
    const button = page.getByRole('button', { name: 'Enviar' });
    
    // Act
    await button.click();
    
    // Assert
    await expect(page.getByText('Sucesso')).toBeVisible();
  });
});
```

## Estratégias de Localizador (Ordem de Prioridade)
1. `getByRole` — Acessível, estável
2. `getByLabel` — Elementos de formulário
3. `getByPlaceholder` — Campos de entrada
4. `getByText` — Baseado em conteúdo
5. `getByTestId` — Último recurso

## Melhores Práticas

### Evitar Flakiness
- Usar auto-wait (não adicionar waits manuais)
- Preferir localizadores visíveis pelo usuário
- Evitar seletores CSS frágeis
- Usar `expect` com retry integrado

### Isolamento de Testes
- Cada teste deve ser independente
- Usar `beforeEach` para setup
- Limpar após testes
- Usar dados de teste únicos

### Asserções
```typescript
// Visibilidade
await expect(element).toBeVisible();
await expect(element).toBeHidden();

// Conteúdo
await expect(element).toHaveText('texto');
await expect(element).toContainText('texto');

// Estado
await expect(input).toHaveValue('valor');
await expect(checkbox).toBeChecked();

// Contagem
await expect(elements).toHaveCount(3);
```

## Debugging
```bash
# Executar com navegador visível
npx playwright test --headed

# Modo debug
npx playwright test --debug

# Mostrar relatório
npx playwright show-report
```

## Anti-padrões
- Usar `page.waitForTimeout()`
- Testar detalhes de implementação
- Não limpar dados de teste
- Depender de ordem de teste
- Ignorar acessibilidade
