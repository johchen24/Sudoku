from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
from .sudoku import SudokuGame

app = FastAPI()

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class MoveRequest(BaseModel):
    board: List[List[int]]
    row: int
    col: int
    number: int

@app.get("/api/sudoku/new")
async def generate_new_puzzle():
    """Generate a new Sudoku puzzle."""
    game = SudokuGame()
    return game.generate_puzzle()

@app.post("/api/sudoku/validate")
async def validate_move(request: MoveRequest):
    """Validate a move in the Sudoku puzzle."""
    game = SudokuGame()
    return game.is_valid_move(request.board, request.row, request.col, request.number)

@app.get("/api/sudoku/restart")
async def restart_game():
    """Restart the Sudoku game by generating a new puzzle."""
    game = SudokuGame()
    return game.generate_puzzle()

@app.post("/api/sudoku/check")
async def check_solution(board: List[List[int]]):
    """Check if the Sudoku puzzle is solved."""
    game = SudokuGame()
    return game.is_solved(board) 