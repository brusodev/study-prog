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
def create_event(event: dict, session: Session = Depends(get_session)):
    print(f"[INFO] Received raw event data: {event}")

    # Convert string dates to datetime objects
    from datetime import datetime
    event_data = event.copy()

    if 'start' in event_data and isinstance(event_data['start'], str):
        try:
            original_start = event_data['start']
            # Tratar strings do input datetime-local que podem não ter segundos
            start_str = event_data['start']
            if 'T' in start_str and start_str.count(':') == 1:
                start_str += ':00'  # Adicionar segundos se não houver
            parsed_start = datetime.fromisoformat(start_str)
            event_data['start'] = parsed_start
            print(f"[INFO] Start conversion: '{original_start}' -> {parsed_start} (ISO: {parsed_start.isoformat()})")
        except ValueError as e:
            print(f"[ERROR] Error parsing start date: {e}")
            raise HTTPException(status_code=400, detail=f"Invalid start date format: {event_data['start']}")

    if 'end' in event_data and event_data['end'] and isinstance(event_data['end'], str):
        try:
            original_end = event_data['end']
            end_str = event_data['end']
            if 'T' in end_str and end_str.count(':') == 1:
                end_str += ':00'
            parsed_end = datetime.fromisoformat(end_str)
            event_data['end'] = parsed_end
            print(f"[INFO] End conversion: '{original_end}' -> {parsed_end} (ISO: {parsed_end.isoformat()})")
        except ValueError as e:
            print(f"[ERROR] Error parsing end date: {e}")
            raise HTTPException(status_code=400, detail=f"Invalid end date format: {event_data['end']}")

    # Create EventCreate object
    try:
        event_create = EventCreate(**event_data)
        print(f"[SUCCESS] Created EventCreate: {event_create}")
        print(f"   Start: {event_create.start} (ISO: {event_create.start.isoformat() if event_create.start else None})")
    except Exception as e:
        print(f"[ERROR] Error creating EventCreate: {e}")
        raise HTTPException(status_code=400, detail=f"Invalid event data: {str(e)}")

    db_event = Event.from_orm(event_create)
    print(f"[INFO] Created db_event: {db_event}")
    print(f"   DB Start: {db_event.start} (ISO: {db_event.start.isoformat() if db_event.start else None})")
    session.add(db_event)
    session.commit()
    session.refresh(db_event)
    print(f"[SUCCESS] Saved event: {db_event}")
    print(f"   Final Start: {db_event.start} (ISO: {db_event.start.isoformat() if db_event.start else None})")
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
    