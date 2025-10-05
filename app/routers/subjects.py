# app/routers/subjects.py
from fastapi import APIRouter, Depends, HTTPException
from typing import List
from sqlmodel import select, Session

from app.db import get_session
from app.models import Subject, SubjectCreate

router = APIRouter(prefix="/api/subjects")

@router.get("", response_model=List[Subject])
def list_subjects(session: Session = Depends(get_session)):
    return session.exec(select(Subject)).all()

@router.post("", response_model=Subject)
def create_subject(subject: SubjectCreate, session: Session = Depends(get_session)):
    db_subject = Subject.from_orm(subject)
    session.add(db_subject)
    session.commit()
    session.refresh(db_subject)
    return db_subject

@router.put("/{subject_id}", response_model=Subject)
def update_subject(subject_id: int, subject: SubjectCreate, session: Session = Depends(get_session)):
    db_subject = session.get(Subject, subject_id)
    if not db_subject:
        raise HTTPException(status_code=404, detail="Subject not found")
    
    for key, value in subject.dict(exclude_unset=True).items():
        setattr(db_subject, key, value)
    
    session.add(db_subject)
    session.commit()
    session.refresh(db_subject)
    return db_subject

@router.delete("/{subject_id}")
def delete_subject(subject_id: int, session: Session = Depends(get_session)):
    db_subject = session.get(Subject, subject_id)
    if not db_subject:
        raise HTTPException(status_code=404, detail="Subject not found")
    
    session.delete(db_subject)
    session.commit()
    return {"message": "Subject deleted"}
