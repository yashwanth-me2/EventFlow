from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.core.middleware import setup_exception_handlers, setup_middleware
from app.api.auth import router as auth_router
from app.api.events import router as events_router

app = FastAPI(
    title=settings.PROJECT_NAME,
    openapi_url="/api/v1/openapi.json",
    docs_url="/docs"
)

# Set up CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # In production, restrict this
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

setup_exception_handlers(app)
setup_middleware(app)

app.include_router(auth_router, prefix="/api/v1/auth", tags=["auth"])
app.include_router(events_router, prefix="/api/v1/events", tags=["events"])

@app.get("/")
async def root():
    return {"message": f"Welcome to {settings.PROJECT_NAME} API"}
