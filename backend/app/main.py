from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
import os
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

# Serve Frontend
frontend_dist = os.path.join(os.path.dirname(__file__), "../frontend_dist")

# Only mount if the directory exists (it will during Docker build)
if os.path.isdir(frontend_dist):
    app.mount("/assets", StaticFiles(directory=os.path.join(frontend_dist, "assets")), name="assets")
    
    @app.get("/{full_path:path}")
    async def serve_frontend(full_path: str):
        # Allow API routes to 404 naturally instead of returning index.html
        if full_path.startswith("api/"):
            from fastapi import HTTPException
            raise HTTPException(status_code=404, detail="Not Found")
            
        file_path = os.path.join(frontend_dist, full_path)
        if os.path.isfile(file_path):
            return FileResponse(file_path)
            
        # React Router fallback
        return FileResponse(os.path.join(frontend_dist, "index.html"))
else:
    @app.get("/")
    async def root():
        return {"message": f"Welcome to {settings.PROJECT_NAME} API (Frontend not built)"}
