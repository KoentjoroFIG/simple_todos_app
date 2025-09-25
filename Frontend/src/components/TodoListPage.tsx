import React, { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Select } from "./ui/select";

interface Todo {
  id: number;
  text: string;
}

interface TodosResponse {
  todos: Todo[];
  total: number;
}

const TodoListPage: React.FC = () => {
  const { token, logout, user } = useAuth();
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [newTodoText, setNewTodoText] = useState("");
  const [editingTodo, setEditingTodo] = useState<number | null>(null);
  const [editText, setEditText] = useState("");
  const [filter, setFilter] = useState("all");
  const [submitLoading, setSubmitLoading] = useState(false);

  const fetchTodos = async () => {
    try {
      setLoading(true);
      const response = await fetch("http://localhost:8000/todos", {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        if (response.status === 401) {
          logout();
          return;
        }
        throw new Error(`Failed to fetch todos: ${response.status}`);
      }

      const data: TodosResponse = await response.json();
      setTodos(data.todos);
      setError("");
    } catch (err: any) {
      setError(err.message || "Failed to fetch todos");
    } finally {
      setLoading(false);
    }
  };

  const addTodo = async (text: string) => {
    if (!text.trim()) return;

    try {
      setSubmitLoading(true);
      const response = await fetch("http://localhost:8000/todos", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text: text.trim() }),
      });

      if (!response.ok) {
        if (response.status === 401) {
          logout();
          return;
        }
        throw new Error(`Failed to add todo: ${response.status}`);
      }

      const newTodo: Todo = await response.json();
      setTodos([...todos, newTodo]);
      setNewTodoText("");
      setError("");
    } catch (err: any) {
      setError(err.message || "Failed to add todo");
    } finally {
      setSubmitLoading(false);
    }
  };

  const updateTodo = async (id: number, text: string) => {
    if (!text.trim()) return;

    try {
      setSubmitLoading(true);
      const response = await fetch(`http://localhost:8000/todos/${id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text: text.trim() }),
      });

      if (!response.ok) {
        if (response.status === 401) {
          logout();
          return;
        }
        throw new Error(`Failed to update todo: ${response.status}`);
      }

      const updatedTodo: Todo = await response.json();
      setTodos(todos.map((todo) => (todo.id === id ? updatedTodo : todo)));
      setEditingTodo(null);
      setEditText("");
      setError("");
    } catch (err: any) {
      setError(err.message || "Failed to update todo");
    } finally {
      setSubmitLoading(false);
    }
  };

  const deleteTodo = async (id: number) => {
    if (!confirm("Are you sure you want to delete this todo?")) return;

    try {
      const response = await fetch(`http://localhost:8000/todos/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        if (response.status === 401) {
          logout();
          return;
        }
        throw new Error(`Failed to delete todo: ${response.status}`);
      }

      setTodos(todos.filter((todo) => todo.id !== id));
      setError("");
    } catch (err: any) {
      setError(err.message || "Failed to delete todo");
    }
  };

  const startEdit = (todo: Todo) => {
    setEditingTodo(todo.id);
    setEditText(todo.text);
  };

  const cancelEdit = () => {
    setEditingTodo(null);
    setEditText("");
  };

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addTodo(newTodoText);
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingTodo) {
      updateTodo(editingTodo, editText);
    }
  };

  // For future implementation when backend supports completed status
  // const filteredTodos = todos.filter(todo => {
  //   if (filter === "completed") return todo.completed;
  //   if (filter === "not-completed") return !todo.completed;
  //   return true;
  // });

  const filteredTodos = todos; // Currently showing all todos since backend doesn't support completed status

  useEffect(() => {
    fetchTodos();
  }, [token]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading todos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Todo List</h1>
            <p className="text-sm text-gray-600">Welcome, {user?.email}</p>
          </div>
          <Button
            onClick={logout}
            variant="outline"
            className="text-gray-600 hover:text-gray-800"
          >
            Logout
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Add Todo Form */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4">Add New Todo</h2>
          <form onSubmit={handleAddSubmit} className="flex gap-3">
            <Input
              type="text"
              value={newTodoText}
              onChange={(e) => setNewTodoText(e.target.value)}
              placeholder="Enter todo text..."
              className="flex-1"
              disabled={submitLoading}
            />
            <Button
              type="submit"
              disabled={submitLoading || !newTodoText.trim()}
            >
              {submitLoading ? "Adding..." : "Add Todo"}
            </Button>
          </form>
        </div>

        {/* Filter */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex items-center gap-4">
            <label
              htmlFor="filter"
              className="text-sm font-medium text-gray-700"
            >
              Filter:
            </label>
            <Select
              id="filter"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              options={[
                { value: "all", label: "All todos" },
                { value: "completed", label: "Completed" },
                { value: "not-completed", label: "Not Completed" },
              ]}
              className="w-48"
            />
            <span className="text-sm text-gray-500">
              Showing {filteredTodos.length} of {todos.length} todos
            </span>
          </div>
          {filter !== "all" && (
            <p className="text-sm text-amber-600 mt-2">
              Note: Filter functionality will be available when backend supports
              todo completion status
            </p>
          )}
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-red-800">{error}</p>
            <Button
              onClick={fetchTodos}
              variant="outline"
              size="sm"
              className="mt-2"
            >
              Retry
            </Button>
          </div>
        )}

        {/* Todos List */}
        <div className="bg-white rounded-lg shadow-sm">
          {filteredTodos.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              <p>No todos found. Add your first todo above!</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {filteredTodos.map((todo) => (
                <div key={todo.id} className="p-4 hover:bg-gray-50">
                  {editingTodo === todo.id ? (
                    <form
                      onSubmit={handleEditSubmit}
                      className="flex gap-3 items-center"
                    >
                      <Input
                        type="text"
                        value={editText}
                        onChange={(e) => setEditText(e.target.value)}
                        className="flex-1"
                        disabled={submitLoading}
                        autoFocus
                      />
                      <Button
                        type="submit"
                        size="sm"
                        disabled={submitLoading || !editText.trim()}
                      >
                        {submitLoading ? "Saving..." : "Save"}
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={cancelEdit}
                        disabled={submitLoading}
                      >
                        Cancel
                      </Button>
                    </form>
                  ) : (
                    <div className="flex justify-between items-center">
                      <div className="flex-1">
                        <p className="text-gray-900">{todo.text}</p>
                        <p className="text-xs text-gray-500">ID: {todo.id}</p>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => startEdit(todo)}
                        >
                          Edit
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => deleteTodo(todo.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          Delete
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TodoListPage;
