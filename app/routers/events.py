#app/routers/events.py
from fastapi import APIRouter, Depends, HTTPException
from typing import List, Dict
from sqlmodel import select
from sqlalchemy import func
from sqlmodel import Session
from datetime import datetime, timedelta

from app.db import get_session
from app.models import Event, EventCreate

router = APIRouter(prefix="/api")

@router.get("/events", response_model=List[Event])
def list_events(start: str = None, end: str = None, session: Session = Depends(get_session)):
    # Para MVP, retornamos todos os eventos - FullCallendar pede /api/events (voce pode filtrar por start e end se desejar)
    return session.exec(select(Event)).all()

@router.post("/events", response_model=Event)
def create_event(event: EventCreate, session: Session = Depends(get_session)):
    db_event = Event.from_orm(event)
    session.add(db_event)
    session.commit()
    session.refresh(db_event)
    return db_event

@router.put("/events/{event_id}", response_model=Event)
def update_event(event_id: int, event: EventCreate, session: Session = Depends(get_session)):
    db_event = session.get(Event, event_id)
    if not db_event:
        raise HTTPException(status_code=404, detail="Event not found")
    event_data = event.dict(exclude_unset=True)
    for key, value in event_data.items():
        setattr(db_event, key, value)
    session.add(db_event)
    session.commit()
    session.refresh(db_event)
    return db_event

@router.delete("/events/{event_id}")
def delete_event(event_id: int, session: Session = Depends(get_session)):
    db_event = session.get(Event, event_id)
    if not db_event:
        raise HTTPException(status_code=404, detail="Event not found")
    session.delete(db_event)
    session.commit()
    return {"message": "Event deleted"}

@router.get("/stats/subjects")
def stats_subjects(session: Session = Depends(get_session)) -> Dict[str, int]:
    events = session.exec(select(Event)).all()
    counts = {}
    for e in events:
        key = e.subject or "Sem matéria"
        counts[key] = counts.get(key, 0) + 1
    return counts

@router.get("/stats/daily-hours")
def stats_daily_hours(
    start_date: str = None,  # formato: "YYYY-MM-DD"
    days: int = 7,
    session: Session = Depends(get_session)
) -> Dict[str, float]:
    """Retorna horas de estudo por dia"""
    
    if start_date:
        start = datetime.strptime(start_date, "%Y-%m-%d")
    else:
        # Últimos 7 dias por padrão
        start = datetime.now() - timedelta(days=days-1)
    
    end = start + timedelta(days=days)
    
    events = session.exec(
        select(Event).where(Event.start >= start, Event.start < end)
    ).all()
    
    daily_hours = {}
    for i in range(days):
        day = start + timedelta(days=i)
        day_str = day.strftime("%Y-%m-%d")
        daily_hours[day_str] = 0.0
    
    for event in events:
        if event.end and event.start:
            day_str = event.start.strftime("%Y-%m-%d")
            duration = (event.end - event.start).total_seconds() / 3600  # horas
            if day_str in daily_hours:
                daily_hours[day_str] += duration
    
    return daily_hours

@router.get("/stats/subject-hours")
def stats_subject_hours(
    start_date: str = None,
    days: int = 30,
    session: Session = Depends(get_session)
) -> Dict[str, float]:
    """Retorna total de horas por matéria"""
    
    if start_date:
        start = datetime.strptime(start_date, "%Y-%m-%d")
    else:
        start = datetime.now() - timedelta(days=days-1)
    
    end = start + timedelta(days=days)
    
    events = session.exec(
        select(Event).where(Event.start >= start, Event.start < end)
    ).all()
    
    subject_hours = {}
    for event in events:
        if event.end and event.start:
            subject = event.subject or "Sem matéria"
            duration = (event.end - event.start).total_seconds() / 3600
            subject_hours[subject] = subject_hours.get(subject, 0.0) + duration
    
    return subject_hours
    