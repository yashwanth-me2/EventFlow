from fastapi import APIRouter, Depends, HTTPException
from sqlmodel.ext.asyncio.session import AsyncSession
from sqlmodel import select
from typing import List

from app.db.session import get_session
from app.models import Event, EventCreate, User, RSVP
from app.api.auth import get_current_user
from app.worker.tasks import send_rsvp_email_confirmation

router = APIRouter()

@router.post("/", response_model=Event)
async def create_event(
    event_in: EventCreate, 
    current_user: User = Depends(get_current_user),
    session: AsyncSession = Depends(get_session)
):
    event = Event(**event_in.model_dump(), organizer_id=current_user.id)
    session.add(event)
    await session.commit()
    await session.refresh(event)
    return event

@router.get("/", response_model=List[Event])
async def list_events(session: AsyncSession = Depends(get_session)):
    statement = select(Event)
    result = await session.exec(statement)
    return result.all()

@router.post("/{event_id}/rsvp")
async def rsvp_for_event(
    event_id: int, 
    current_user: User = Depends(get_current_user),
    session: AsyncSession = Depends(get_session)
):
    # Check if event exists
    event = await session.get(Event, event_id)
    if not event:
        raise HTTPException(status_code=404, detail="Event not found")
        
    # Check if already RSVP'd
    statement = select(RSVP).where(RSVP.user_id == current_user.id).where(RSVP.event_id == event_id)
    result = await session.exec(statement)
    if result.first():
        raise HTTPException(status_code=400, detail="Already RSVP'd to this event")
        
    # Create RSVP
    rsvp = RSVP(user_id=current_user.id, event_id=event_id)
    session.add(rsvp)
    await session.commit()
    
    # Trigger Background Task
    send_rsvp_email_confirmation.delay(email=current_user.email, event_title=event.title)
    
    return {"message": "RSVP successful. Confirmation email sent."}
