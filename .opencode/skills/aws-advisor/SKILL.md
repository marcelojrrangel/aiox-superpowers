---
name: aws-advisor
description: Use ao projetar arquitetura AWS ou otimizar custos em nuvem. Fornece melhores práticas AWS para custo, segurança e performance.
---

# Skill de AWS Advisor

## Framework Well-Architected

### 1. Segurança
- Habilitar MFA na conta root
- Usar papéis IAM, não chaves de acesso
- Criptografar dados em repouso e trânsito
- Habilitar CloudTrail para auditoria
- Usar Secrets Manager para credenciais

### 2. Confiabilidade
- Projetar para falha (multi-AZ)
- Usar grupos Auto Scaling
- Implementar health checks
- Usar SQS para desacoplamento
- Planejar recuperação de desastres

### 3. Eficiência de Performance
- Usar CloudFront para cache
- Escolher tipos de instância corretos
- Usar S3 para assets estáticos
- Implementar ElastiCache
- Usar CloudWatch para monitoramento

### 4. Otimização de Custo
- Usar Reserved Instances para cargas previsíveis
- Usar Instâncias Spot para trabalhos em lote
- Ajustar tamanho das instâncias
- Deletar recursos não utilizados
- Usar políticas de ciclo de vida do S3

### 5. Excelência Operacional
- Usar Infraestrutura como Código (CDK/CloudFormation)
- Implementar pipelines CI/CD
- Usar Systems Manager para gerenciamento
- Habilitar AWS Config para compliance
- Documentar runbooks

## Padrões Comuns

### Aplicação Web
```
CloudFront → ALB → EC2/ECS → RDS
                ↓
              S3 (estático)
```

### Serverless
```
API Gateway → Lambda → DynamoDB
                ↓
              S3 (assets)
```

### Microsserviços
```
ALB → ECS/EKS → Serviço A → RDS-A
              → Serviço B → RDS-B
              → Serviço C → ElastiCache
```

## Dicas de Economia
1. Use AWS Calculator para estimativas
2. Configure alertas de faturamento
3. Recomendações do Trusted Advisor
4. Use Cost Explorer para análise
5. Implementar estratégia de tagging
