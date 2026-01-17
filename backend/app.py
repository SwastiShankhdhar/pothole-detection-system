from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes.citizen import citizen_router  # Note: citizen.py NOT citizens.py
from routes.authority import authority_router

app = FastAPI(
    title="Pothole Detection System",
    version="1.0.0",
    description="Real-time pothole detection and reporting system"
)

# Add CORS middleware - THIS IS CRITICAL
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",  # Vite dev server
        "http://localhost:3000",  # Alternative port
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(citizen_router, prefix="/citizen", tags=["Citizen"])
app.include_router(authority_router, prefix="/authority", tags=["Authority"])

@app.get("/")
def root():
    return {
        "message": "Pothole Detection Backend Running",
        "status": "healthy",
        "endpoints": {
            "citizen": "/citizen",
            "authority": "/authority"
        }
    }

@app.get("/health")
def health_check():
    return {"status": "healthy", "service": "pothole-backend"}

# Run with: uvicorn app:app --reload --host 0.0.0.0 --port 8000