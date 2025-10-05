# app/routers/schedules.py
from fastapi import APIRouter, Depends, HTTPException
from typing import List, Dict
from sqlmodel import select, Session
from datetime import datetime, timedelta

from app.db import get_session
from app.models import (
    WeeklySchedule, WeeklyScheduleCreate, WeeklyScheduleWithSubject,
    Subject, Event, EventCreate
)

router = APIRouter(prefix="/api/schedules")

@router.get("", response_model=List[WeeklyScheduleWithSubject])
def list_schedules(session: Session = Depends(get_session)):
    """Lista todos os horários da semana com informações da matéria"""
    schedules = session.exec(select(WeeklySchedule)).all()
    result = []
    for schedule in schedules:
        subject = session.get(Subject, schedule.subject_id)
        if subject:
            result.append(WeeklyScheduleWithSubject(
                id=schedule.id,
                subject_id=schedule.subject_id,
                day_of_week=schedule.day_of_week,
                start_time=schedule.start_time,
                end_time=schedule.end_time,
                active=schedule.active,
                subject_name=subject.name,
                subject_color=subject.color
            ))
    return result

@router.post("", response_model=WeeklySchedule)
def create_schedule(schedule: WeeklyScheduleCreate, session: Session = Depends(get_session)):
    # Verifica se a matéria existe
    subject = session.get(Subject, schedule.subject_id)
    if not subject:
        raise HTTPException(status_code=404, detail="Subject not found")
    
    db_schedule = WeeklySchedule.from_orm(schedule)
    session.add(db_schedule)
    session.commit()
    session.refresh(db_schedule)
    return db_schedule

@router.put("/{schedule_id}", response_model=WeeklySchedule)
def update_schedule(schedule_id: int, schedule: WeeklyScheduleCreate, session: Session = Depends(get_session)):
    db_schedule = session.get(WeeklySchedule, schedule_id)
    if not db_schedule:
        raise HTTPException(status_code=404, detail="Schedule not found")
    
    for key, value in schedule.dict(exclude_unset=True).items():
        setattr(db_schedule, key, value)
    
    session.add(db_schedule)
    session.commit()
    session.refresh(db_schedule)
    return db_schedule

@router.delete("/{schedule_id}")
def delete_schedule(schedule_id: int, session: Session = Depends(get_session)):
    db_schedule = session.get(WeeklySchedule, schedule_id)
    if not db_schedule:
        raise HTTPException(status_code=404, detail="Schedule not found")
    
    session.delete(db_schedule)
    session.commit()
    return {"message": "Schedule deleted"}

@router.post("/generate-events")
def generate_events_from_schedule(
    start_date: str,  # formato: "YYYY-MM-DD"
    weeks: int = 4,   # quantas semanas gerar
    session: Session = Depends(get_session)
):
    """Gera eventos no calendário baseado na programação semanal"""
    
    start = datetime.strptime(start_date, "%Y-%m-%d")
    schedules = session.exec(select(WeeklySchedule).where(WeeklySchedule.active == True)).all()
    
    events_created = 0
    
    for week in range(weeks):
        for schedule in schedules:
            subject = session.get(Subject, schedule.subject_id)
            if not subject:
                continue
            
            # Calcula o dia da semana correto
            days_ahead = schedule.day_of_week - start.weekday()
            if days_ahead < 0:
                days_ahead += 7
            
            event_date = start + timedelta(days=days_ahead, weeks=week)
            
            # Cria datetime com horários
            start_time_parts = schedule.start_time.split(":")
            end_time_parts = schedule.end_time.split(":")
            
            event_start = event_date.replace(
                hour=int(start_time_parts[0]),
                minute=int(start_time_parts[1])
            )
            event_end = event_date.replace(
                hour=int(end_time_parts[0]),
                minute=int(end_time_parts[1])
            )
            
            # Verifica se já existe evento nesse horário
            existing = session.exec(
                select(Event).where(
                    Event.start == event_start,
                    Event.subject == subject.name
                )
            ).first()
            
            if not existing:
                event = Event(
                    title=subject.name,
                    subject=subject.name,
                    start=event_start,
                    end=event_end,
                    color=subject.color,
                    description=f"Estudo programado de {subject.name}"
                )
                session.add(event)
                events_created += 1
    
    session.commit()
    return {"message": f"{events_created} eventos criados com sucesso"}
