#app/db.py
from sqlmodel import SQLModel, create_engine, Session
from typing import Generator
import os


sqlite_file_name = "database.db"
sqlite_url = f"sqlite:///{sqlite_file_name}"

DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///database.db")

connect_args = {}

if DATABASE_URL.startswith("sqlite"):
    connect_args["check_same_thread"] = False
    

# connect_args for SQLITE in multithreading
engine = create_engine(sqlite_url, echo=False, connect_args=connect_args)

def init_db() -> None:
    SQLModel.metadata.create_all(engine)
    
def get_session() -> Generator[Session, None, None]:
    with Session(engine) as session:
        yield session