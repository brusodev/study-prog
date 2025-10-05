from typing import Optional
from sqlmodel import SQLModel, Field
from datetime import datetime, time

class EventBase(SQLModel):
    title: str
    start: datetime
    end: Optional[datetime] = None
    allDay: Optional[bool] = False
    description: Optional[str] = None
    color: Optional[str] = None
    subject: Optional[str] = None
    
class Event(EventBase, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    
# Model usado para criação/atualização (sem id)
class EventCreate(EventBase):
    pass

# Modelos para Matérias (Subjects)
class SubjectBase(SQLModel):
    name: str
    color: Optional[str] = "#3b82f6"
    description: Optional[str] = None
    
class Subject(SubjectBase, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    
class SubjectCreate(SubjectBase):
    pass

# Modelos para Configuração Semanal de Estudos
class WeeklyScheduleBase(SQLModel):
    subject_id: int = Field(foreign_key="subject.id")
    day_of_week: int  # 0=Segunda, 1=Terça, ..., 6=Domingo
    start_time: str  # formato "HH:MM"
    end_time: str    # formato "HH:MM"
    active: bool = True
    
class WeeklySchedule(WeeklyScheduleBase, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    
class WeeklyScheduleCreate(WeeklyScheduleBase):
    pass

# Response models para incluir dados relacionados
class WeeklyScheduleWithSubject(WeeklyScheduleBase):
    id: int
    subject_name: str
    subject_color: str