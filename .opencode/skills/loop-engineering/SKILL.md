---
name: loop-engineering
description: Use para ciclos auto-corretivos de desenvolvimento. Cria roadmap, executa ciclos código-teste-correção, e mantém lições aprendidas.
---

# Skill de Loop Engineering

## Configuração

### Inicializar Arquivos do Projeto
Crie se não existirem:
- `roadmap.md` — Lista ordenada de features/tarefas
- `lessons.md` — O que funcionou, o que não funcionou
- `state.json` — Progresso atual e estado

### Estrutura do State
```json
{
  "tarefaAtual": 0,
  "tarefas": [
    {
      "nome": "Nome da tarefa",
      "status": "pendente|em_progresso|completa|falhou",
      "tentativas": 0,
      "ultimoErro": null
    }
  ],
  "horaInicio": "timestamp ISO",
  "totalTentativas": 0
}
```

## O Ciclo

### 1. Analisar
- Leia roadmap.md para próxima tarefa
- Carregue skills relevantes
- Entenda requisitos
- Verifique dependências

### 2. Codar
- Escreva teste que falha (TDD)
- Implemente código mínimo
- Execute testes
- Se testes falharem, vá para passo 3

### 3. Auto-Corrigir
- Analise a causa da falha
- Tente abordagem diferente
- Se 2+ falhas consecutivas na mesma tarefa:
  - PARE o ciclo
  - Reporte ao usuário
  - Aguarde orientação

### 4. Atualizar Estado
- Marque tarefa como completa
- Registre o que foi aprendido
- Atualize lessons.md se houver novo insight
- Passe para próxima tarefa

## Tratamento de Falhas

### Falha Única
- Registre o erro
- Analise a causa raiz
- Tente abordagem diferente
- Incremente contador de tentativas

### Múltiplas Falhas (2+)
- Pare o ciclo
- Reporte ao usuário:
  - Qual tarefa falhou
  - O que foi tentado
  - Qual é o erro
  - Sugestões para próximos passos

## Formato de Lições Aprendidas
```markdown
## [Data] — [Nome da Tarefa]

### O que Funcionou
- [Técnica/abordagem que teve sucesso]

### O que Não Funcionou
- [O que foi tentado e falhou]

### Aprendizado Principal
- [Insight para futuras tarefas]
```

## Anti-padrões
- Continuar após múltiplas falhas sem input humano
- Não atualizar lições aprendidas
- Pular a etapa de análise
- Não rastrear estado adequadamente
