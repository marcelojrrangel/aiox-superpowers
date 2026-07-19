---
name: security-best-practices
description: Use durante code review ou ao implementar features com sensibilidade de segurança. Fornece checklist de segurança OWASP/CWE por linguagem.
---

# Skill de Security Best Practices

## Checklist OWASP Top 10

### A01: Controle de Acesso Quebrado
- [ ] Negar por padrão
- [ ] Implementar verificações de autorização apropriadas
- [ ] Validar acesso em cada requisição
- [ ] Registrar falhas de controle de acesso

### A02: Falhas Criptográficas
- [ ] Usar algoritmos fortes (AES-256, RSA-2048+)
- [ ] Nunca armazenar senhas em texto plano
- [ ] Usar bcrypt/scrypt/argon2 para senhas
- [ ] Criptografar dados sensíveis em repouso e trânsito

### A03: Injeção
- [ ] Usar queries parametrizadas
- [ ] Validar e sanitizar todas as entradas
- [ ] Usar ORM para queries de banco
- [ ] Escapar saída para prevenir XSS

### A04: Design Inseguro
- [ ] Modelo de ameaça antes da implementação
- [ ] Separar inquilinos adequadamente
- [ ] Implementar rate limiting
- [ ] Usar defesa em profundidade

### A05: Configuração Incorreta
- [ ] Remover contas padrão
- [ ] Desabilitar features desnecessárias
- [ ] Manter dependências atualizadas
- [ ] Usar headers de segurança

### A06: Componentes Vulneráveis
- [ ] Verificar dependências regularmente
- [ ] Usar ferramentas automatizadas (npm audit, Snyk)
- [ ] Atualizar pacotes vulneráveis
- [ ] Monitorar CVEs

### A07: Falhas de Autenticação
- [ ] Implementar MFA quando possível
- [ ] Limitar tentativas de login
- [ ] Usar gerenciamento seguro de sessões
- [ ] Política de força de senha

### A08: Falhas de Integridade de Dados
- [ ] Verificar assinaturas digitais
- [ ] Usar CI/CD seguro
- [ ] Validar dados serializados
- [ ] Verificações de integridade em dados críticos

### A09: Falhas de Logging
- [ ] Registrar todos os eventos de autenticação
- [ ] Registrar falhas de controle de acesso
- [ ] Proteger integridade dos logs
- [ ] Alertar sobre atividade suspeita

### A10: SSRF
- [ ] Validar todas as URLs
- [ ] Usar allowlists para requisições externas
- [ ] Segmentar acesso de rede
- [ ] Desabilitar métodos HTTP desnecessários

## Dicas por Linguagem

### JavaScript/TypeScript
- Usar helmet.js para segurança Express
- Validar com zod/joi
- Usar headers CSP
- Sanitizar com DOMPurify

### Python
- Usar bandit para linting de segurança
- Validar com pydantic
- Usar django-security middleware
- Habilitar proteção CSRF

### Go
- Usar gosec para scan de segurança
- Validar entradas manualmente
- Usar pacotes crypto adequadamente
- Prevenir injeção SQL com sqlx
