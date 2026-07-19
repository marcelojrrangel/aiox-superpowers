---
name: test-driven-development
description: Use durante a implementação de código. Enforça ciclo estrito RED-GREEN-REFACTOR. Deve ativar antes de escrever qualquer código de produção.
---

# Skill de Test-Driven Development

## O Ciclo (Inegociável)

### RED: Escreva um Teste que Falha
1. Escreva o menor teste possível para o próximo comportamento
2. Execute o teste — ele DEVE falhar
3. Confirme que a mensagem de falha é significativa

### GREEN: Faça Passar
1. Escreva o MÍNIMO de código para fazer o teste passar
2. Sem features extras, sem otimização
3. Execute o teste — ele DEVE passar

### REFACTOR: Limpe
1. Melhore a estrutura do código sem mudar o comportamento
2. Execute os testes novamente — DEVEM continuar passando
3. Remova qualquer duplicação

## Regras
1. **Nunca escreva código de produção sem um teste que falhe primeiro**
2. **Um teste por vez** — complete o ciclo completo antes do próximo teste
3. **Se um teste passar na primeira tentativa, delete-o** — não estava testando nada novo
4. **Sem código de produção além do necessário para passar no teste**
5. **Refatore apenas quando todos os testes estiverem verdes**

## Convenção de Nomes de Testes
```
test_<unidade>_<cenário>_<resultado_esperado>
```
Exemplo: `test_calculadora_entrada_negativa_retorna_erro`

## Anti-padrões a Evitar
- Escrever testes após código de produção
- Testar detalhes de implementação em vez de comportamento
- Suítes de teste grandes que testam muita coisa de uma vez
- Pular a etapa de refactor
- Escrever testes "sempre passam"

## Verificação
Após cada ciclo:
- Todos os testes passam
- Cobertura de testes aumentou
- Nenhuma duplicação foi introduzida
- Nomes descrevem claramente o comportamento
