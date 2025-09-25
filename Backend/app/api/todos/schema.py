# Todo API Schemas
from pydantic import BaseModel, Field

class TodoCreate(BaseModel):
    """Schema for creating a new todo"""
    text: str = Field(..., min_length=1, max_length=500, description="Todo text content")

class TodoUpdate(BaseModel):
    """Schema for updating a todo"""
    text: str = Field(..., min_length=1, max_length=500, description="Updated todo text")

class Todo(BaseModel):
    """Schema for todo response"""
    id: int = Field(..., description="Todo ID")
    text: str = Field(..., description="Todo text content")
    
    class Config:
        from_attributes = True

class TodosResponse(BaseModel):
    """Schema for todos list response"""
    todos: list[Todo]
    total: int
