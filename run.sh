#!/bin/bash

# Script para executar o projeto Study-prog
# Este script instala as dependências e inicia o servidor FastAPI

echo "🚀 Iniciando o projeto Study-prog..."

# Verificar se Python está instalado
if ! command -v python &> /dev/null; then
    echo "❌ Python não encontrado. Instale o Python 3.8+ primeiro."
    exit 1
fi

# Verificar se pip está instalado
if ! command -v pip &> /dev/null; then
    echo "❌ pip não encontrado. Instale o pip primeiro."
    exit 1
fi

# Instalar dependências
echo "📦 Instalando dependências..."
pip install -r requirements.txt

if [ $? -ne 0 ]; then
    echo "❌ Falha ao instalar dependências."
    exit 1
fi

echo "✅ Dependências instaladas com sucesso!"

# Iniciar o servidor
echo "🌐 Iniciando servidor FastAPI..."
echo "📱 Frontend disponível em: http://localhost:8100"
echo "📚 API docs disponível em: http://localhost:8100/docs"
echo ""
echo "Pressione Ctrl+C para parar o servidor"
echo ""

uvicorn app.main:app --reload --host 0.0.0.0 --port 8100