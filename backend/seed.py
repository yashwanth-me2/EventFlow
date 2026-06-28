import asyncio
from datetime import datetime, timedelta
from app.db.session import engine
from app.models import Event
from sqlmodel.ext.asyncio.session import AsyncSession
import random

async def seed_events():
    events_data = [
        {
            "title": "Neon Nights Synthwave Concert",
            "description": "Experience the ultimate retro-futuristic music festival with top synthwave artists, neon installations, and an unforgettable cyberpunk atmosphere.",
            "location": "Downtown Arena, Main Stage",
            "date": datetime.utcnow() + timedelta(days=2),
            "organizer_id": 1
        },
        {
            "title": "Tech Innovators Summit 2026",
            "description": "Join industry leaders to discuss AI, Web3, and the future of cloud computing. Includes keynote speeches, networking sessions, and catered lunch.",
            "location": "Grand Convention Center",
            "date": datetime.utcnow() + timedelta(days=5),
            "organizer_id": 1
        },
        {
            "title": "Urban Marathon & Food Festival",
            "description": "Run for a cause! A 10k marathon followed by a huge food truck festival featuring the best local chefs and street food vendors.",
            "location": "City Park Plaza",
            "date": datetime.utcnow() + timedelta(days=7),
            "organizer_id": 1
        },
        {
            "title": "React.js Advanced Workshop",
            "description": "A deep dive into advanced React patterns, performance optimization, and server components. Bring your laptop for hands-on coding.",
            "location": "TechHub Co-working Space",
            "date": datetime.utcnow() + timedelta(days=1),
            "organizer_id": 1
        },
        {
            "title": "Midnight Comedy Special",
            "description": "Get ready for a night of non-stop laughs featuring touring comedians from Comedy Central and Netflix specials.",
            "location": "The Laughing Lounge",
            "date": datetime.utcnow() + timedelta(hours=48),
            "organizer_id": 1
        },
        {
            "title": "Sunset Rooftop Yoga",
            "description": "Relax and unwind with a guided Vinyasa flow class on the highest rooftop in the city. Watch the sunset while finding your zen.",
            "location": "Skyline Hotel Rooftop",
            "date": datetime.utcnow() + timedelta(days=3),
            "organizer_id": 1
        }
    ]

    async with AsyncSession(engine) as session:
        for data in events_data:
            event = Event(**data)
            session.add(event)
        
        await session.commit()
        print("Database seeded with fake events successfully!")

if __name__ == "__main__":
    asyncio.run(seed_events())
