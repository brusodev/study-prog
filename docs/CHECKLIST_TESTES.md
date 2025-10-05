# ✅ CHECKLIST DE TESTES - Sistema de Planejamento de Estudos

## 📋 Como Usar Este Checklist

Marque cada item com ✅ conforme você testa. Se encontrar algum problema, anote nos comentários.

---

## 🚀 ETAPA 1: Inicialização

### 1.1 Servidor
- [ ] Servidor inicia sem erros
- [ ] Console mostra "Uvicorn running on http://0.0.0.0:8000"
- [ ] Console mostra "Application startup complete"
- [ ] **Comentários:**

### 1.2 Página Principal
- [ ] Página carrega em http://localhost:8000/static/index.html
- [ ] Título "Sistema de Planejamento de Estudos" aparece
- [ ] 4 abas visíveis: Calendário, Matérias, Cronograma, Estatísticas
- [ ] Aba "Calendário" está ativa (azul)
- [ ] Console do navegador (F12) não mostra erros vermelhos
- [ ] **Comentários:**

---

## 📚 ETAPA 2: Matérias

### 2.1 Criar Matéria
- [ ] Clicar em aba "Matérias"
- [ ] Mensagem "Nenhuma matéria cadastrada" aparece
- [ ] Clicar em botão "+ Nova Matéria"
- [ ] Modal abre com título "Nova Matéria"
- [ ] Campos estão vazios
- [ ] Cor padrão é azul (#3b82f6)
- [ ] **Comentários:**

### 2.2 Salvar Matéria
- [ ] Preencher Nome: "Matemática"
- [ ] Escolher Cor: Azul (ou qualquer outra)
- [ ] Preencher Descrição: "Cálculo e álgebra" (opcional)
- [ ] Clicar em "Criar"
- [ ] Modal fecha
- [ ] Matéria aparece na lista com cor escolhida
- [ ] **Comentários:**

### 2.3 Criar Mais Matérias
- [ ] Repetir 2.1 e 2.2 para criar:
  - [ ] Programação Python (Verde)
  - [ ] Inglês (Amarelo)
  - [ ] Física (Roxo)
- [ ] Todas aparecem na lista
- [ ] **Comentários:**

### 2.4 Editar Matéria
- [ ] Clicar em "Editar" em uma matéria
- [ ] Modal abre com título "Editar Matéria"
- [ ] Campos preenchidos com dados da matéria
- [ ] Botão "Excluir" visível (vermelho)
- [ ] Mudar nome para "Matemática Avançada"
- [ ] Clicar em "Salvar"
- [ ] Modal fecha
- [ ] Nome atualizado na lista
- [ ] **Comentários:**

### 2.5 Excluir Matéria (OPCIONAL)
- [ ] Clicar em "Editar" em uma matéria
- [ ] Clicar em "Excluir"
- [ ] Aparecer confirmação
- [ ] Confirmar
- [ ] Modal fecha
- [ ] Matéria some da lista
- [ ] **Comentários:**

---

## 🗓️ ETAPA 3: Cronograma

### 3.1 Abrir Aba
- [ ] Clicar em aba "Cronograma"
- [ ] Mensagem "Nenhum horário configurado" aparece
- [ ] 2 botões visíveis: "+ Adicionar Horário" e "Gerar Eventos"
- [ ] **Comentários:**

### 3.2 Criar Primeiro Horário
- [ ] Clicar em "+ Adicionar Horário"
- [ ] Modal abre com título "Novo Horário"
- [ ] Select "Matéria" tem as matérias cadastradas
- [ ] Selecionar: Matemática
- [ ] Dia da Semana: Segunda-feira
- [ ] Início: 14:00
- [ ] Fim: 16:00
- [ ] Checkbox "Ativo" marcado
- [ ] Clicar em "Criar"
- [ ] Modal fecha
- [ ] Horário aparece na tabela
- [ ] **Comentários:**

### 3.3 Criar Mais Horários
- [ ] Repetir 3.2 para criar:
  - [ ] Terça, 14:00-16:00, Programação Python
  - [ ] Quinta, 19:00-21:00, Inglês
  - [ ] Sábado, 09:00-12:00, Matemática
- [ ] Todos aparecem na tabela
- [ ] Cores corretas para cada matéria
- [ ] **Comentários:**

### 3.4 Editar Horário
- [ ] Clicar em "Editar" em um horário
- [ ] Modal abre com título "Editar Horário"
- [ ] Campos preenchidos corretamente
- [ ] Botão "Excluir" visível
- [ ] Mudar horário de 14:00-16:00 para 15:00-17:00
- [ ] Clicar em "Salvar"
- [ ] Modal fecha
- [ ] Horário atualizado na tabela
- [ ] **Comentários:**

### 3.5 Desativar Horário
- [ ] Clicar em "Editar" em um horário
- [ ] Desmarcar "Ativo"
- [ ] Salvar
- [ ] Tabela mostra ❌ em vez de ✅
- [ ] **Comentários:**

### 3.6 Reativar Horário
- [ ] Editar o horário desativado
- [ ] Marcar "Ativo"
- [ ] Salvar
- [ ] Tabela mostra ✅
- [ ] **Comentários:**

---

## 📅 ETAPA 4: Geração de Eventos

### 4.1 Gerar Eventos
- [ ] Na aba "Cronograma"
- [ ] Clicar em "Gerar Eventos (4 semanas)"
- [ ] Aparecer confirmação
- [ ] Confirmar
- [ ] Aparecer mensagem de sucesso (ex: "12 eventos criados")
- [ ] **Comentários:**

### 4.2 Verificar no Calendário
- [ ] Clicar em aba "Calendário"
- [ ] Calendário mostra eventos gerados
- [ ] Eventos com cores das respectivas matérias
- [ ] Eventos nos dias/horários corretos
- [ ] **Comentários:**

---

## 📆 ETAPA 5: Calendário

### 5.1 Visualização
- [ ] Calendário renderizado corretamente
- [ ] Eventos visíveis
- [ ] Cores diferentes por matéria
- [ ] Horários corretos
- [ ] **Comentários:**

### 5.2 Criar Evento Manual
- [ ] Clicar em uma data vazia (ex: amanhã)
- [ ] Modal abre com título "Novo Evento"
- [ ] Data/hora preenchida automaticamente
- [ ] Preencher Título: "Revisão Extra"
- [ ] Preencher Matéria: "Matemática"
- [ ] Ajustar horário se necessário
- [ ] Escolher cor
- [ ] Clicar em "Criar"
- [ ] Modal fecha
- [ ] Evento aparece no calendário
- [ ] **Comentários:**

### 5.3 Editar Evento
- [ ] Clicar em um evento existente
- [ ] Modal abre com título "Editar Evento"
- [ ] Campos preenchidos com dados do evento
- [ ] Botão "Excluir" visível
- [ ] Mudar título para "Estudo de Álgebra"
- [ ] Clicar em "Salvar"
- [ ] Modal fecha
- [ ] Título atualizado no calendário
- [ ] **Comentários:**

### 5.4 Excluir Evento
- [ ] Clicar em um evento
- [ ] Clicar em "Excluir"
- [ ] Aparecer confirmação
- [ ] Confirmar
- [ ] Modal fecha
- [ ] Evento some do calendário
- [ ] **Comentários:**

---

## 📊 ETAPA 6: Estatísticas

### 6.1 Visualização Geral
- [ ] Clicar em aba "Estatísticas"
- [ ] Card "Total de Horas (últimos 7 dias)" mostra número
- [ ] Card "Média Diária" mostra número
- [ ] 3 gráficos visíveis
- [ ] **Comentários:**

### 6.2 Gráfico de Pizza
- [ ] Gráfico "Distribuição de Tempo por Matéria" renderizado
- [ ] Cores corretas para cada matéria
- [ ] Legenda visível
- [ ] Sem erros no console
- [ ] **Comentários:**

### 6.3 Gráfico de Barras
- [ ] Gráfico "Horas por Matéria (Últimos 30 dias)" renderizado
- [ ] Barras coloridas
- [ ] Nomes das matérias no eixo X
- [ ] Horas no eixo Y
- [ ] **Comentários:**

### 6.4 Gráfico de Linha
- [ ] Gráfico "Horas de Estudo (Últimos 14 dias)" renderizado
- [ ] Linha azul visível
- [ ] Datas no eixo X
- [ ] Horas no eixo Y
- [ ] **Comentários:**

---

## 🔄 ETAPA 7: Integração e Fluxo Completo

### 7.1 Adicionar Matéria → Cronograma → Eventos
- [ ] Criar nova matéria "Química" (laranja)
- [ ] Ir em Cronograma
- [ ] Adicionar horário: Sexta, 16:00-18:00, Química
- [ ] Gerar eventos (4 semanas)
- [ ] Verificar que novos eventos de Química aparecem no calendário
- [ ] Verificar que Química aparece nas estatísticas
- [ ] **Comentários:**

### 7.2 Editar Evento → Estatísticas Atualizam
- [ ] Ir em Calendário
- [ ] Editar um evento: mudar horário de fim
- [ ] Ir em Estatísticas
- [ ] Verificar que totais foram atualizados
- [ ] **Comentários:**

### 7.3 Excluir Evento → Estatísticas Atualizam
- [ ] Excluir um evento do calendário
- [ ] Ir em Estatísticas
- [ ] Verificar que totais diminuíram
- [ ] **Comentários:**

---

## 🐛 ETAPA 8: Testes de Erro

### 8.1 Validação de Formulários
- [ ] Tentar criar matéria com nome vazio → Deve mostrar alert
- [ ] Tentar criar evento com título vazio → Deve mostrar alert
- [ ] Tentar criar cronograma sem selecionar matéria → Deve mostrar alert
- [ ] **Comentários:**

### 8.2 Confirmações
- [ ] Excluir matéria pede confirmação → Cancelar → Não exclui
- [ ] Excluir evento pede confirmação → Cancelar → Não exclui
- [ ] Excluir cronograma pede confirmação → Cancelar → Não exclui
- [ ] **Comentários:**

### 8.3 Cancelar Modais
- [ ] Abrir modal de matéria → Preencher → Cancelar → Não salva
- [ ] Abrir modal de evento → Preencher → Cancelar → Não salva
- [ ] Abrir modal de cronograma → Preencher → Cancelar → Não salva
- [ ] **Comentários:**

---

## 🎯 ETAPA 9: Performance e UX

### 9.1 Performance
- [ ] Modais abrem instantaneamente (< 1 segundo)
- [ ] Calendário renderiza rapidamente
- [ ] Gráficos carregam sem atrasos
- [ ] Navegação entre abas é fluida
- [ ] **Comentários:**

### 9.2 Console do Navegador
- [ ] Abrir Console (F12)
- [ ] Nenhum erro vermelho
- [ ] Apenas mensagens informativas (se houver)
- [ ] **Comentários:**

### 9.3 Responsividade (OPCIONAL)
- [ ] Redimensionar janela → Layout se ajusta
- [ ] Testar em tela menor → Calendário se adapta
- [ ] **Comentários:**

---

## 📱 ETAPA 10: Testes Avançados (OPCIONAL)

### 10.1 Gerar Muitos Eventos
- [ ] Criar 5+ matérias
- [ ] Criar 10+ horários no cronograma
- [ ] Gerar eventos para 4 semanas
- [ ] Verificar que calendário não fica lento
- [ ] Verificar que estatísticas calculam corretamente
- [ ] **Comentários:**

### 10.2 Edição em Lote
- [ ] Editar múltiplas matérias seguidas
- [ ] Editar múltiplos eventos seguidas
- [ ] Verificar que tudo atualiza corretamente
- [ ] **Comentários:**

### 10.3 Stress Test
- [ ] Criar/editar/excluir repetidamente
- [ ] Navegar entre abas rapidamente
- [ ] Abrir/fechar modais múltiplas vezes
- [ ] Verificar que não há vazamento de memória
- [ ] Verificar que não há erros acumulados no console
- [ ] **Comentários:**

---

## ✅ RESULTADO FINAL

### Resumo de Testes
- **Total de Itens Testados:** _____ / 100+
- **Itens Passou:** _____ 
- **Itens Falhou:** _____
- **Taxa de Sucesso:** _____ %

### Bugs Encontrados
1. _______________________________________
2. _______________________________________
3. _______________________________________

### Melhorias Sugeridas
1. _______________________________________
2. _______________________________________
3. _______________________________________

### Aprovação
- [ ] ✅ **APROVADO** - Sistema pronto para uso
- [ ] ⚠️ **APROVADO COM RESSALVAS** - Pequenos ajustes necessários
- [ ] ❌ **REPROVADO** - Bugs críticos encontrados

### Comentários Finais
_________________________________________________________________
_________________________________________________________________
_________________________________________________________________

---

**Data do Teste:** _______________  
**Testador:** _______________  
**Assinatura:** _______________

---

## 🎓 Dicas de Teste

1. **Teste na ordem:** Siga a ordem das etapas para garantir dependências
2. **Anote tudo:** Qualquer comportamento estranho, anote
3. **Console sempre aberto:** F12 → Console → Monitore erros
4. **Teste extremos:** Campos vazios, textos muito longos, etc
5. **Recarregue entre testes:** F5 para garantir estado limpo

---

**Boa sorte nos testes! 🚀**
