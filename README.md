# Sudoku Game

A full-stack Sudoku game application built with FastAPI and React.

## Prerequisites

- Python 3.8 or higher
- Node.js 14 or higher
- pip (Python package manager)

## Backend Setup

1. Create and activate a virtual environment (optional but recommended):
```bash
python -m venv venv
source venv/bin/activate  # On Windows, use: venv\Scripts\activate
```

2. Install dependencies:
```bash
pip install -r requirements.txt
```

3. Run the FastAPI application:
```bash
uvicorn backend.main:app --reload
```
The backend will start on http://localhost:8000

## Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```
The frontend will start on http://localhost:3000

## Features

- Generate new Sudoku puzzles
- Validate moves in real-time
- Check for puzzle completion
- Responsive design
- Modern UI with styled-components

## Technologies Used

- Backend:
  - FastAPI (Python)
  - Pydantic for data validation
  - Uvicorn ASGI server

- Frontend:
  - React
  - TypeScript
  - Styled Components
  - Axios 