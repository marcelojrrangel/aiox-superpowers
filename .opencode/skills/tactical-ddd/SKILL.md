---
name: tactical-ddd
description: Use durante design arquitetural ou ao modelar domínios complexos. Implementa padrões táticos de DDD.
---

# Skill de Tactical DDD

## Blocos Construtores

### Entidades
- Objetos com identidade (ID)
- Identidade persiste através do ciclo de vida
- Comparar por identidade, não atributos
- Exemplo: `Usuario(id, nome, email)`

### Objetos de Valor
- Objetos sem identidade
- Imutáveis
- Comparar por atributos
- Exemplo: `Endereco(rua, cidade, cep)`

### Agregados
- Cluster de entidades/objetos de valor
- Única entidade raiz (Raiz do Agregado)
- Fronteira de transação
- Referenciar apenas por ID

### Repositórios
- Abstração de acesso a dados
- Um repositório por agregado
- Interface tipo coleção
- Esconder detalhes de persistência

### Eventos de Domínio
- Registrar algo que aconteceu
- Imutáveis
- Nomeados no passado
- Exemplo: `UsuarioRegistrado`, `PedidoCriado`

### Serviços
- Operações sem estado
- Sem lógica de domínio nas entidades
- Coordenar entre agregados
- Exemplo: `ServicoTransferencia`

## Guia de Seleção de Padrão

| Situação | Padrão |
|----------|--------|
| Precisa de rastreamento de identidade | Entidade |
| Precisa de imutabilidade | Objeto de Valor |
| Precisa de fronteira de transação | Agregado |
| Precisa de abstração de persistência | Repositório |
| Precisa registrar mudanças | Evento de Domínio |
| Precisa de lógica entre agregados | Serviço |

## Passos de Implementação

1. **Identificar entidades** — O que precisa de identidade única?
2. **Definir objetos de valor** — O que é imutável e comparável?
3. **Desenhar fronteiras de agregados** — O que pertence junto?
4. **Criar repositórios** — Como persistir agregados?
5. **Definir eventos** — O que acontece no domínio?
6. **Implementar serviços** — Que lógica entre agregados existe?

## Anti-padrões
- Modelo de domínio anêmico (toda lógica em serviços)
- Agregados Deus (muitas entidades)
- Vazar persistência no domínio
- Não usar objetos de valor para primitivas
