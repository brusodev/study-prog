# app/main.py

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse

from app.db import init_db
from app.routers import events, subjects, schedules

app = FastAPI(title="Study-prog")

#CORS (opcional, se frontend estiver em outro domínio/porta)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Permitir todas as origens (ajuste conforme necessário)
    allow_methods=["*"],
    allow_headers=["*"],
)

#Include routers

app.include_router(events.router)
app.include_router(subjects.router)
app.include_router(schedules.router)

# Cria DB ao iniciar

@app.on_event("startup")
def on_startup():
    init_db()
    
#Servir frontend (arquivos estáticos)
app.mount("/static", StaticFiles(directory="frontend/static"), name="static")

@app.get("/")
def read_index():
    return FileResponse("frontend/static/index.html")

