# 🎉 EventFlow

**A Modern, Full-Stack Event Discovery & Ticketing Platform**

![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react)
![FastAPI](https://img.shields.io/badge/FastAPI-0.111.0-009688?style=for-the-badge&logo=fastapi)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-336791?style=for-the-badge&logo=postgresql)
![Redis](https://img.shields.io/badge/Redis-7-DC382D?style=for-the-badge&logo=redis)
![Celery](https://img.shields.io/badge/Celery-5.4-37814A?style=for-the-badge&logo=celery)

EventFlow is a dynamic, fully responsive event booking platform. It features a stunning glassmorphism UI built with pure React, and a highly scalable asynchronous Python backend capable of handling background tasks like RSVP email confirmations and SMS reminders.

---

## 🚀 Features

- **Dynamic Interactive UI**: A beautiful, modern React frontend featuring glassmorphism design, real-time search, and category shortcut filtering.
- **Asynchronous Backend**: Powered by FastAPI and `asyncpg` for lightning-fast non-blocking database queries.
- **Background Task Processing**: Utilizes Celery and Redis to handle asynchronous background jobs, such as sending RSVP confirmation emails without delaying the user's API response.
- **Relational Data Integrity**: Built with PostgreSQL and SQLAlchemy, ensuring robust transactional support for user RSVPs and ticket bookings.
- **Combined Docker Deployment**: Optimized multi-stage Dockerfile that cleanly fuses the React frontend and FastAPI backend into a single deployable web service.

## 🏗 Architecture

- **Frontend**: React, Vite, Vanilla CSS (Custom Design System)
- **Backend Core**: Python 3.11, FastAPI, Pydantic, SQLModel (SQLAlchemy)
- **Database**: PostgreSQL (via asyncpg), Alembic (Migrations)
- **Task Queue**: Celery + Redis
- **Deployment**: Docker, Railway.app

## ⚡ Quick Start

1. **Clone the repository:**
   ```bash
   git clone https://github.com/yashwanth-me2/EventFlow.git
   cd EventFlow
   ```

2. **Docker Compose (Local Development):**
   This spins up the database, redis, backend, celery worker, and frontend.
   ```bash
   docker-compose -f docker-compose.local.yml up -d --build
   ```

3. **Access the Application:**
   Open your browser and navigate to `http://localhost:5173`.
