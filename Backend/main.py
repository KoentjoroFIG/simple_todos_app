from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.auth.auth import router as auth_router
from app.api.todos.todos import router as todos_router

def init_app():
    app = FastAPI(
        title="TODOS APP",
        description="A simple TODO application with JWT authentication",
        version="1.0.0"
    )

    @app.get("/health")
    def health_check():
        return {"status": "ok"}
    
    # Include authentication routes
    app.include_router(auth_router)
    
    # Include todos routes
    app.include_router(todos_router)
    
    app.add_middleware(
        CORSMiddleware,
        allow_origins=["*"],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    return app

app = init_app()

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="localhost", port=8000, reload=True)