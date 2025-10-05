# 📚 Sistema de Planejamento de Estudos

> **Sistema completo para organização e acompanhamento de estudos com calendário interativo, cronograma semanal e estatísticas detalhadas.**

[![Status](https://img.shields.io/badge/status-ready-brightgreen)]()
[![Version](https://img.shields.io/badge/version-2.0-blue)]()
[![Tech](https://img.shields.io/badge/tech-FastAPI%20%2B%20Pure%20JS-orange)]()

---

## 🎯 Funcionalidades

### ✅ Gestão de Matérias
- Cadastro de matérias com nome, cor personalizada e descrição
- Edição e exclusão de matérias
- Visualização em cards coloridos

### ✅ Cronograma Semanal
- Configuração de horários fixos por dia da semana
- Associação de matérias a horários específicos
- Ativação/desativação de horários
- Geração automática de eventos recorrentes

### ✅ Calendário Interativo
- Visualização mensal completa
- Criação rápida de eventos clicando em datas
- Edição de eventos existentes
- Cores personalizadas por matéria
- Integração em tempo real com o backend

### ✅ Dashboard de Estatísticas
- Total de horas estudadas (últimos 7 dias)
- Média diária de estudo
- Gráfico de pizza: distribuição de tempo por matéria
- Gráfico de barras: horas por matéria (últimos 30 dias)
- Gráfico de linha: evolução diária (últimos 14 dias)

---

## 🚀 Como Usar

### 1. Instalação

```bash
# Instale as dependências
pip install -r requirements.txt
```

### 2. Iniciar o Servidor

```bash
python -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

### 3. Acessar o Sistema

Abra seu navegador em:
```
http://localhost:8000/static/index.html
```

---

## 📖 Guia Rápido de Uso

### Passo 1: Cadastre suas Matérias
1. Vá em **Matérias**
2. Clique em **"+ Nova Matéria"**
3. Preencha nome, escolha uma cor e adicione descrição (opcional)
4. Salve

### Passo 2: Configure seu Cronograma
1. Vá em **Cronograma**
2. Clique em **"+ Adicionar Horário"**
3. Selecione a matéria, dia da semana e horários
4. Salve

### Passo 3: Gere os Eventos
1. Ainda em **Cronograma**
2. Clique em **"Gerar Eventos (4 semanas)"**
3. Confirme

### Passo 4: Acompanhe seu Progresso
1. Vá em **Calendário** para ver todos os eventos
2. Vá em **Estatísticas** para ver gráficos e métricas

---

## 🏗️ Tecnologias

### Backend
- **FastAPI** - Framework web moderno e rápido
- **SQLModel** - ORM com type hints
- **SQLite** - Banco de dados leve
- **Uvicorn** - Servidor ASGI

### Frontend
- **Pure JavaScript (ES6+)** - Sem frameworks complexos
- **HTML5 & CSS3** - Interface semântica e responsiva
- **TailwindCSS** - Estilização utility-first
- **FullCalendar v6** - Calendário interativo
- **Chart.js** - Visualização de dados
- **Axios** - Cliente HTTP

---

## 📁 Estrutura do Projeto

```
study-prog/
├── app/
│   ├── main.py          # Servidor FastAPI
│   ├── db.py            # Configuração do banco
│   ├── models.py        # Modelos de dados
│   └── routers/
│       ├── events.py    # Endpoints de eventos
│       ├── subjects.py  # Endpoints de matérias
│       └── schedules.py # Endpoints de cronograma
│
├── frontend/static/
│   ├── index.html       # Interface do usuário
│   └── app.js           # Lógica JavaScript
│
├── database.db          # Banco de dados SQLite
├── requirements.txt     # Dependências Python
│
└── Documentação/
    ├── GUIA_DE_USO.md       # Manual completo
    ├── REFATORACAO.md       # Detalhes técnicos
    ├── RESUMO_FINAL.md      # Overview executivo
    └── CHECKLIST_TESTES.md  # Guia de testes
```

---

## 📚 Documentação Completa

- **[GUIA_DE_USO.md](GUIA_DE_USO.md)** - Manual completo do usuário
- **[REFATORACAO.md](REFATORACAO.md)** - Detalhes da migração Alpine.js → Pure JS
- **[RESUMO_FINAL.md](RESUMO_FINAL.md)** - Overview executivo do projeto
- **[CHECKLIST_TESTES.md](CHECKLIST_TESTES.md)** - Guia de validação e testes

---

## 🏆 Status do Projeto

✅ **VERSÃO 2.0 - PRONTA PARA USO**

- [x] Backend completo
- [x] Frontend totalmente funcional
- [x] CRUD de todas as entidades
- [x] Calendário interativo
- [x] Estatísticas detalhadas
- [x] Documentação completa
- [x] Testes validados

---

**Desenvolvido com ❤️ para estudantes organizados**

**Bons estudos! 📚✨**
