# Todos API
from fastapi import APIRouter, HTTPException, Depends, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from typing import Dict, List
from app.api.todos.schema import Todo, TodoCreate, TodoUpdate, TodosResponse
from app.api.auth.auth import get_current_user
from app.api.auth.schema import User

# Router for todos endpoints
router = APIRouter(prefix="/todos", tags=["todos"])

# Security scheme for JWT
security = HTTPBearer()

# In-memory storage for todos
todos_db: Dict[int, Dict] = {}
next_todo_id = 1

def get_next_id() -> int:
    """Generate next todo ID"""
    global next_todo_id
    current_id = next_todo_id
    next_todo_id += 1
    return current_id

@router.get("", response_model=TodosResponse)
async def get_todos(current_user: User = Depends(get_current_user)):
    """
    Get all todos (JWT authentication required)
    """
    todos_list = [
        Todo(id=todo_id, text=todo_data["text"])
        for todo_id, todo_data in todos_db.items()
    ]
    
    return TodosResponse(
        todos=todos_list,
        total=len(todos_list)
    )

@router.post("", response_model=Todo, status_code=status.HTTP_201_CREATED)
async def create_todo(
    todo_data: TodoCreate,
    current_user: User = Depends(get_current_user)
):
    """
    Create a new todo (JWT authentication required)
    
    Input:
    {
        "text": "Belajar ReactJS"
    }
    """
    todo_id = get_next_id()
    
    new_todo = {
        "text": todo_data.text
    }
    
    todos_db[todo_id] = new_todo
    
    return Todo(
        id=todo_id,
        text=new_todo["text"]
    )

@router.put("/{todo_id}", response_model=Todo)
async def update_todo(
    todo_id: int,
    todo_update: TodoUpdate,
    current_user: User = Depends(get_current_user)
):
    """
    Update a specific todo (change text)
    JWT authentication required
    """
    if todo_id not in todos_db:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Todo with id {todo_id} not found"
        )
    
    existing_todo = todos_db[todo_id]
    existing_todo["text"] = todo_update.text
    
    return Todo(
        id=todo_id,
        text=existing_todo["text"]
    )

@router.delete("/{todo_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_todo(
    todo_id: int,
    current_user: User = Depends(get_current_user)
):
    """
    Delete a specific todo (JWT authentication required)
    """
    if todo_id not in todos_db:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Todo with id {todo_id} not found"
        )
    
    del todos_db[todo_id]
    return None
