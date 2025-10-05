# 📚 Sistema de Planejamento de Estudos - Guia de Uso

## 🚀 Como Iniciar

### 1. Inicie o servidor
```bash
python -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

### 2. Abra no navegador
```
http://localhost:8000/static/index.html
```

---

## 📖 Fluxo de Uso Recomendado

### Passo 1: Cadastre suas Matérias
1. Clique na aba **"Matérias"**
2. Clique em **"+ Nova Matéria"**
3. Preencha:
   - Nome (ex: "Matemática", "Programação Python")
   - Cor (escolha uma cor para identificação visual)
   - Descrição (opcional)
4. Clique em **"Criar"**
5. Repita para todas as matérias que você estuda

**Dica:** Use cores diferentes para cada matéria facilitar a visualização no calendário!

---

### Passo 2: Configure seu Cronograma Semanal
1. Clique na aba **"Cronograma"**
2. Clique em **"+ Adicionar Horário"**
3. Preencha:
   - Matéria (selecione uma das matérias cadastradas)
   - Dia da Semana
   - Horário de Início (ex: 14:00)
   - Horário de Fim (ex: 16:00)
   - Marque "Ativo" (só gera eventos se estiver ativo)
4. Clique em **"Criar"**
5. Repita para todos os horários de estudo da semana

**Exemplo de Cronograma:**
- Segunda, 14:00-16:00 → Matemática
- Terça, 14:00-16:00 → Programação Python
- Quinta, 19:00-21:00 → Inglês
- Sábado, 09:00-12:00 → Matemática

---

### Passo 3: Gere os Eventos Automaticamente
1. Ainda na aba **"Cronograma"**
2. Clique em **"Gerar Eventos (4 semanas)"**
3. Confirme no pop-up
4. ✅ O sistema criará automaticamente eventos no calendário para as próximas 4 semanas baseado no seu cronograma!

---

### Passo 4: Visualize e Gerencie no Calendário
1. Clique na aba **"Calendário"**
2. Veja todos os eventos gerados
3. **Para editar um evento:** Clique nele
4. **Para criar evento avulso:** Clique em uma data vazia

**Funcionalidades:**
- Editar título, matéria, horário, cor
- Excluir eventos específicos
- Criar eventos que não fazem parte do cronograma regular

---

### Passo 5: Acompanhe suas Estatísticas
1. Clique na aba **"Estatísticas"**
2. Veja:
   - **Total de horas estudadas** (últimos 7 dias)
   - **Média diária de estudo**
   - **Gráfico de pizza:** Distribuição de tempo por matéria
   - **Gráfico de barras:** Horas de estudo por matéria (últimos 30 dias)
   - **Gráfico de linha:** Evolução diária das últimas 2 semanas

---

## 🎯 Casos de Uso Comuns

### Quero estudar mais de uma matéria no mesmo horário
Crie múltiplos horários para o mesmo dia:
- Segunda, 14:00-15:30 → Matemática
- Segunda, 15:30-17:00 → Física

### Meu cronograma mudou temporariamente
1. Vá em "Cronograma"
2. Clique em "Editar" no horário que mudou
3. Desmarque "Ativo"
4. Salve

Quando voltar ao normal, edite novamente e marque "Ativo".

### Quero adicionar um evento único (não recorrente)
1. Vá em "Calendário"
2. Clique na data desejada
3. Preencha o formulário
4. Salve

Este evento não faz parte do cronograma semanal.

### Preciso excluir todos os eventos de uma matéria
Opção 1 (manual):
- Vá em "Calendário"
- Clique em cada evento da matéria
- Clique em "Excluir"

Opção 2 (recriar tudo):
- Delete o arquivo `database.db`
- Reinicie o servidor
- Recadastre tudo (limpa completamente)

### Quero mudar a cor de uma matéria
1. Vá em "Matérias"
2. Clique em "Editar" na matéria desejada
3. Escolha a nova cor
4. Salve

**Atenção:** Eventos já criados manterão a cor antiga. Para atualizar:
- Delete os eventos antigos
- Gere novos eventos com "Gerar Eventos (4 semanas)"

---

## ⚙️ Funcionalidades por Aba

### 📅 Calendário
- ✅ Visualização mensal/semanal/diária
- ✅ Criar evento clicando em data
- ✅ Editar evento clicando nele
- ✅ Excluir eventos
- ✅ Cores diferentes por matéria

### 📚 Matérias
- ✅ Cadastrar matérias com cores personalizadas
- ✅ Editar nome, cor e descrição
- ✅ Excluir matérias (cuidado: não exclui eventos já criados)

### 🗓️ Cronograma
- ✅ Configurar horários fixos semanais
- ✅ Ativar/desativar horários
- ✅ Editar e excluir horários
- ✅ Gerar eventos automaticamente para 4 semanas

### 📊 Estatísticas
- ✅ Total de horas (últimos 7 dias)
- ✅ Média diária
- ✅ Distribuição por matéria
- ✅ Gráficos de acompanhamento

---

## 🐛 Resolução de Problemas

### O calendário não aparece
- Certifique-se de que está na aba "Calendário"
- Recarregue a página (F5)

### Modais não abrem
- Verifique o console (F12) por erros
- Recarregue a página

### Eventos não aparecem após "Gerar Eventos"
- Verifique se existem cronogramas **ativos**
- Verifique se as datas de início/fim estão corretas
- Olhe no console por mensagens de erro

### Gráficos não carregam
- Aguarde alguns segundos (carregam após o calendário)
- Certifique-se de que existem eventos cadastrados
- Recarregue a página

---

## 💡 Dicas Pro

1. **Use cores consistentes:** Defina uma paleta de cores e use sempre as mesmas para cada tipo de matéria (exatas, humanas, idiomas, etc)

2. **Gere eventos semanalmente:** Em vez de gerar 4 semanas de uma vez, gere 1-2 semanas para ter mais flexibilidade

3. **Revise semanalmente:** Todo domingo, revise seu cronograma da próxima semana e ajuste o que for necessário

4. **Acompanhe estatísticas:** Use a aba "Estatísticas" para identificar quais matérias estão recebendo menos atenção

5. **Backup regular:** Faça backup do arquivo `database.db` regularmente

---

## 📋 Atalhos e Navegação

- **Tab Calendário:** Clique em data → cria evento
- **Tab Matérias:** Botão azul → nova matéria
- **Tab Cronograma:** Botão azul → novo horário, botão verde → gerar eventos
- **Tab Estatísticas:** Automático, sem interação necessária

---

## 🎓 Exemplo de Setup Completo

### 1. Matérias
- Matemática (Azul #3b82f6)
- Programação Python (Verde #10b981)
- Inglês (Amarelo #f59e0b)
- Física (Roxo #8b5cf6)

### 2. Cronograma
- Segunda, 14:00-16:00 → Matemática
- Segunda, 19:00-20:30 → Inglês
- Terça, 14:00-16:00 → Programação Python
- Quarta, 14:00-16:00 → Física
- Quinta, 19:00-20:30 → Inglês
- Sexta, 14:00-16:00 → Matemática
- Sábado, 09:00-12:00 → Programação Python

### 3. Gerar Eventos
Clique em "Gerar Eventos (4 semanas)" → 28 eventos criados automaticamente!

### 4. Resultado
- ✅ 28 eventos no calendário
- ✅ ~18 horas de estudo por semana
- ✅ Estatísticas mostrando distribuição equilibrada
- ✅ Acompanhamento visual do progresso

---

**Pronto para começar a estudar de forma organizada! 🚀**
