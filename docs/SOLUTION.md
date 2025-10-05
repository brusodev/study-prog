# Solução para o problema dos modais

## Problema identificado
O Alpine.js não está inicializando os componentes (x-data) mesmo depois de carregar. 
O `__x` property nunca é criado nos elementos.

## Causa raiz
Alpine com `defer` carrega após DOMContentLoaded, mas precisa processar elementos que já existem.
A inicialização não está acontecendo automaticamente.

## Solução proposta
Substituir Alpine.js por JavaScript puro para controle total dos modals.

### Vantagens:
1. ✅ Sem dependência de Alpine
2. ✅ Controle total do estado
3. ✅ Menos bugs de timing
4. ✅ Mais simples de debugar
5. ✅ Menor bundle size

### Mudanças necessárias:
1. Remover Alpine.js do HTML
2. Remover x-data, x-show, x-cloak, @click dos modals
3. Criar classes JavaScript para cada modal
4. Usar show/hide com classes CSS

Implementar?
