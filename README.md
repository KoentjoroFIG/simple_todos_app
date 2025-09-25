# Simple Todo Application

A full-stack todo application with user authentication built with FastAPI (backend) and React + TypeScript (frontend).

## 🚀 Tech Stack

### Backend

- **Framework**: FastAPI
- **Language**: Python 3.12+
- **Authentication**: JWT (JSON Web Tokens)
- **Password Hashing**: bcrypt via passlib
- **Validation**: Pydantic
- **CORS**: FastAPI CORS middleware

### Frontend

- **Framework**: React 18
- **Language**: TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **Routing**: React Router DOM
- **State Management**: React Context API

## 📋 Features

- **Authentication System**

  - User registration and login with email/password
  - JWT token-based authentication
  - Protected routes
  - Automatic token validation and refresh

- **Todo Management**
  - Create new todos
  - View all todos
  - Edit existing todos
  - Delete todos
  - Filter todos (All/Completed/Not Completed)\*

\*Note: Filtering by completion status is prepared in the frontend but requires backend implementation.

## 🛠️ Installation & Setup

### Prerequisites

- Python 3.12 or higher
- Node.js 18 or higher
- npm or pnpm

### Backend Setup

1. **Navigate to the backend directory:**

   ```bash
   cd Backend
   ```

2. **Create a virtual environment (recommended):**

   ```bash
   python -m venv venv

   # Windows
   venv\Scripts\activate

   # macOS/Linux
   source venv/bin/activate
   ```

3. **Install dependencies:**

   ```bash
   pip install -r requirement.txt
   ```

4. **Run the backend server:**

   ```bash
   python main.py
   ```

   The backend will be available at: `http://localhost:8000`

   API documentation will be available at: `http://localhost:8000/docs`

### Frontend Setup

1. **Navigate to the frontend directory:**

   ```bash
   cd Frontend
   ```

2. **Install dependencies:**

   ```bash
   npm install
   # or
   pnpm install
   ```

3. **Start the development server:**

   ```bash
   npm run dev
   # or
   pnpm dev
   ```

   The frontend will be available at: `http://localhost:5173`

## 🔐 Default Test User

For testing purposes, a default user is pre-configured:

- **Email**: `test@test.com`
- **Password**: `123456`

## 📝 API Endpoints

### Authentication

- `POST /auth/register` - Register a new user
- `POST /auth/login` - Login user (returns JWT token)
- `GET /auth/me` - Get current user info (protected)
- `GET /auth/users` - Get all users (protected, for testing)

### Todos

- `GET /todos` - Get all todos for authenticated user
- `POST /todos` - Create a new todo
- `PUT /todos/{id}` - Update a todo
- `DELETE /todos/{id}` - Delete a todo

## 🗂️ Project Structure

```
├── Backend/
│   ├── main.py                 # FastAPI application entry point
│   ├── requirement.txt         # Python dependencies
│   └── app/
│       ├── api/
│       │   ├── auth/
│       │   │   ├── auth.py     # Authentication endpoints
│       │   │   └── schema.py   # Authentication schemas
│       │   └── todos/
│       │       ├── todos.py    # Todo endpoints
│       │       └── schema.py   # Todo schemas
│       └── utils/
│           └── jwt_utils.py    # JWT utility functions
│
├── Frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── LoginPage.tsx   # Login form component
│   │   │   ├── TodoListPage.tsx # Main todo list component
│   │   │   ├── ProtectedRoute.tsx # Route protection
│   │   │   └── ui/             # Reusable UI components
│   │   ├── contexts/
│   │   │   └── AuthContext.tsx # Authentication context
│   │   └── App.tsx            # Main application component
│   ├── package.json
│   └── vite.config.ts
└── README.md
```

## 🚦 Running the Application

1. **Start the backend server** (in the Backend directory):

   ```bash
   python main.py
   ```

2. **Start the frontend development server** (in the Frontend directory):

   ```bash
   npm install
   npm run dev
   ```

3. **Open your browser** and navigate to `http://localhost:5173`

4. **Login** with the test credentials or register a new account

## 🔧 Configuration

### Backend Configuration

The backend uses the following default configurations:

- **Port**: 8000
- **JWT Secret**: `your-secret-key-change-this-in-production` (⚠️ Change in production!)
- **JWT Expiration**: 30 minutes
- **CORS**: Allows requests from `http://localhost:5173`

### Frontend Configuration

The frontend is configured to:

- **API Base URL**: `http://localhost:8000`
- **Development Port**: 5173
- **Build Output**: `dist/`

## 🔒 Security Notes

- The current implementation uses an in-memory dictionary for user storage
- JWT secret key should be changed in production
- HTTPS should be used in production
- Consider implementing refresh tokens for better security
- Add rate limiting for authentication endpoints

## 🚀 Production Deployment

For production deployment, consider:

- Using a proper database (PostgreSQL, MongoDB, etc.)
- Setting up environment variables for configuration
- Implementing proper logging
- Adding error monitoring
- Setting up CI/CD pipelines
- Using a reverse proxy (nginx)
- Implementing rate limiting and security headers

## 📄 License

This project is for educational/interview purposes.
