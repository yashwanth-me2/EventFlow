from sqlmodel import SQLModel, Field, Relationship
from typing import List, Optional
from datetime import datetime

class RSVP(SQLModel, table=True):
    user_id: int = Field(foreign_key="user.id", primary_key=True)
    event_id: int = Field(foreign_key="event.id", primary_key=True)
    created_at: datetime = Field(default_factory=datetime.utcnow)

class UserBase(SQLModel):
    email: str = Field(unique=True, index=True)
    full_name: str

class UserCreate(UserBase):
    password: str

class User(UserBase, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    hashed_password: str
    is_active: bool = Field(default=True)
    
    events: List["Event"] = Relationship(back_populates="organizer")
    rsvps: List["Event"] = Relationship(back_populates="attendees", link_model=RSVP)

class EventBase(SQLModel):
    title: str
    description: str
    date: datetime
    location: str

class EventCreate(EventBase):
    pass

class Event(EventBase, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    organizer_id: int = Field(foreign_key="user.id")
    
    organizer: User = Relationship(back_populates="events")
    attendees: List[User] = Relationship(back_populates="rsvps", link_model=RSVP)
