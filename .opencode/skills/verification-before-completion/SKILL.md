---
name: verification-before-completion
description: Use antes de declarar qualquer tarefa pronta. Garante que o trabalho está realmente feito e verificado, não apenas "parece pronto".
---

# Skill de Verification Before Completion

## Checklist

### Verificação Funcional
- [ ] Todos os critérios de aceitação atendidos
- [ ] Teste manual concluído
- [ ] Casos extremos tratados
- [ ] Cenários de erro testados

### Verificação Técnica
- [ ] Todos os testes passam
- [ ] Sem erros de lint
- [ ] Sem erros de tipo
- [ ] Código compila/builda

### Verificação de Qualidade
- [ ] Código segue convenções do projeto
- [ ] Sem vulnerabilidades de segurança introduzidas
- [ ] Performance é aceitável
- [ ] Documentação atualizada se necessário

### Verificação de Integração
- [ ] Sem conflitos com código existente
- [ ] Contratos de API mantidos
- [ ] Migrações de banco funcionam
- [ ] Deploy funcionaria

## Definição de "Pronto"
Uma tarefa está PRONTA APENAS quando:
1. Código está escrito e funciona
2. Testes estão escritos e passam
3. Código foi revisado (self ou peer)
4. Documentação foi atualizada
5. Nenhum problema conhecido permanece

## Comandos de Verificação
Execute em ordem:
```bash
# 1. Testes
npm test

# 2. Linting
npm run lint

# 3. Verificação de tipos
npm run typecheck

# 4. Build
npm run build

# 5. Scan de segurança (se disponível)
npm audit
```

## Sinais de Alerta
- "Deveria funcionar" — verifique se realmente funciona
- "Testes passam localmente" — teste em ambiente limpo
- "Vou corrigir depois" — corrija agora
- "É só uma mudança pequena" — mudanças pequenas também quebram coisas

### Verificação de Resiliência (SAGA / Mensageria)
> ATIVA quando o código usa transações distribuídas, filas de mensagens, ou padrões SAGA/compensação.

- [ ] Transações compensatórias implementadas para cada passo do SAGA
- [ ] Timeout configurado em cada chamada síncrona entre serviços
- [ ] Retry com backoff exponencial em chamadas de rede
- [ ] Fallback definido quando serviço downstream está indisponível
- [ ] Idempotência garantida em operações de retry
- [ ] Dead letter queue (DLQ) configurada para mensagens não processáveis
- [ ] Cenários de falha testados:
  - [ ] Queda do serviço上游 durante processamento
  - [ ] Timeout na fila de mensagens
  - [ ] Mensagem duplicada recebida
  - [ ] Resposta malformada do serviço下游
  - [ ] Rollback manual acionado e verificado

### Padrões de Verificação por Tipo de Falha

| Falha | Verificação |
|-------|-------------|
| Queda de rede | Circuito aberto? Fallback ativado? Dados consistentes? |
| Timeout | Retry configurado? Limite de tentativas definido? |
| Mensagem perdida | DLQ recebeu? Alerta disparou? Dados recuperáveis? |
| Consistência eventual | Janela de consistência aceitável? Leituras stale permitidas? |

## Anti-padrões
- Declarar pronto sem rodar testes
- Pular verificação porque "é óbvio"
- Não testar casos extremos
- Esquecer de atualizar documentação
- Ignorar cenários de falha em transações distribuídas
- Assumir que "rede nunca cai" em testes de integração
