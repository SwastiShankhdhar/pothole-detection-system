from fastapi import FastAPI
from routes.citizen import citizen_router
from routes.authority import authority_router

app = FastAPI(title="Pothole Detection System")

app.include_router(citizen_router, prefix="/citizen")
app.include_router(authority_router, prefix="/authority")

@app.get("/")
def root():
    return {"message": "Pothole Detection Backend Running"}
