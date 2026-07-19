---
name: sentry
description: Use para monitoramento e rastreamento de erros. Integra Sentry para rastreamento de erros em tempo real e alertas.
---

# Skill de Sentry Integration

## Configuração

### Instalação
```bash
# JavaScript/TypeScript
npm install @sentry/node

# React
npm install @sentry/react

# Python
pip install sentry-sdk
```

### Configuração
```javascript
// Node.js
Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV,
  tracesSampleRate: 1.0,
});

// React
Sentry.init({
  dsn: process.env.SENTRY_DSN,
  integrations: [new Sentry.BrowserTracing()],
  tracesSampleRate: 1.0,
});
```

## Rastreamento de Erros

### Captura Automática
- Exceções não tratadas
- Rejeições de Promise
- Erros de rede
- Erros de console

### Captura Manual
```javascript
try {
  // operação arriscada
} catch (error) {
  Sentry.captureException(error);
}

// Com contexto
Sentry.withScope((scope) => {
  scope.setTag('feature', 'checkout');
  scope.setUser({ id: '123' });
  Sentry.captureException(error);
});
```

## Melhores Práticas

### 1. Source Maps
- Enviar source maps para Sentry
- Manter source maps seguros
- Usar Sentry CLI para uploads

### 2. Rastreamento de Release
```javascript
Sentry.init({
  release: 'meu-app@1.0.0',
  environment: 'production',
});
```

### 3. Contexto do Usuário
```javascript
Sentry.setUser({
  id: '123',
  email: 'usuario@exemplo.com',
});
```

### 4. Breadcrumbs
```javascript
Sentry.addBreadcrumb({
  category: 'auth',
  message: 'Usuário fez login',
  level: 'info',
});
```

## Regras de Alerta
- Erros críticos: Notificação imediata
- Erros de aviso: Resumo diário
- Novos problemas: Relatório semanal

## Anti-padrões
- Não usar source maps
- Ignorar contexto de erro
- Super-alertar (fadiga de alerta)
- Não monitorar em produção
- Expor dados sensíveis em erros
