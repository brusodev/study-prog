@echo off
echo ========================================
echo   SISTEMA DE PROGRAMACAO DE ESTUDOS
echo ========================================
echo.

REM Verificar se Python está instalado
python --version >nul 2>&1
if errorlevel 1 (
    echo ERRO: Python nao encontrado. Instale o Python 3.8+ primeiro.
    pause
    exit /b 1
)

REM Verificar se estamos no diretório correto
if not exist "requirements.txt" (
    echo ERRO: Arquivo requirements.txt nao encontrado. Execute este script no diretorio raiz do projeto.
    pause
    exit /b 1
)

echo [1/4] Instalando dependencias...
pip install -r requirements.txt

if errorlevel 1 (
    echo ERRO: Falha ao instalar dependencias.
    pause
    exit /b 1
)

echo.
echo [2/4] Verificando estrutura do projeto...
if not exist "app" (
    echo ERRO: Pasta 'app' nao encontrada.
    pause
    exit /b 1
)

if not exist "frontend\static" (
    echo ERRO: Pasta 'frontend\static' nao encontrada.
    pause
    exit /b 1
)

echo.
echo [3/4] Inicializando banco de dados...
python -c "from app.db import init_db; init_db(); print('Banco de dados inicializado com sucesso!')"

if errorlevel 1 (
    echo ERRO: Falha ao inicializar banco de dados.
    pause
    exit /b 1
)

echo.
echo [4/4] Iniciando servidor...
echo.
echo ========================================
echo   SERVIDOR INICIADO COM SUCESSO!
echo ========================================
echo.
echo Acesse no navegador:
echo http://localhost:8000/static/index.html
echo.
echo Para parar o servidor: Ctrl+C
echo.

python -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000