import random
from typing import List, Tuple, Optional, Dict
from collections import defaultdict

class SudokuGame:
    def __init__(self):
        self.size = 9
        self.box_size = 3
        self.empty = 0

    def generate_puzzle(self) -> List[List[int]]:
        """Generate a new Sudoku puzzle with a unique solution."""
        # Initialize empty board
        board = [[self.empty for _ in range(self.size)] for _ in range(self.size)]
        
        # Fill diagonal boxes first (these can be filled independently)
        for i in range(0, self.size, self.box_size):
            self._fill_box(board, i, i)
            
        # Solve the rest of the board
        self._solve_board(board)
        
        # Remove numbers to create puzzle and ensure unique solution
        self._remove_numbers_with_unique_solution(board)
        
        return board

    def _fill_box(self, board: List[List[int]], row: int, col: int) -> None:
        """Fill a 3x3 box with numbers 1-9."""
        numbers = list(range(1, self.size + 1))
        random.shuffle(numbers)
        index = 0
        for i in range(self.box_size):
            for j in range(self.box_size):
                board[row + i][col + j] = numbers[index]
                index += 1

    def _find_all_solutions(self, board: List[List[int]], limit: int = 5) -> List[List[List[int]]]:
        """Find solutions for the current board state up to 5 solutions.
        Finding more solutions helps us better identify positions where solutions differ most."""
        solutions = []
        
        def solve_recursive(board: List[List[int]]) -> None:
            if len(solutions) >= limit:  # Stop after finding 5 solutions
                return
                
            empty = self._find_empty(board)
            if not empty:
                # Found a solution, make a deep copy and add it
                solutions.append([row[:] for row in board])
                return
                
            row, col = empty
            for num in range(1, self.size + 1):
                if self.is_valid_move(board, row, col, num):
                    board[row][col] = num
                    solve_recursive(board)
                    board[row][col] = self.empty

        # Create a copy of the board to avoid modifying the original
        board_copy = [row[:] for row in board]
        solve_recursive(board_copy)
        return solutions

    def _find_most_different_position(self, solutions: List[List[List[int]]]) -> Tuple[int, int, int]:
        """Find the position where solutions differ the most and the most common value."""
        differences = defaultdict(lambda: defaultdict(int))
        
        # Count occurrences of each number at each position
        for solution in solutions:
            for i in range(self.size):
                for j in range(self.size):
                    differences[(i, j)][solution[i][j]] += 1
        
        # Find position with most different values
        max_diff_pos = None
        max_diff_count = 0
        most_common_value = 0
        
        for pos, values in differences.items():
            if len(values) > max_diff_count:
                max_diff_count = len(values)
                max_diff_pos = pos
                # Get the most common value at this position
                most_common_value = max(values.items(), key=lambda x: x[1])[0]
        
        assert max_diff_pos is not None
        return max_diff_pos[0], max_diff_pos[1], most_common_value

    def _remove_numbers_with_unique_solution(self, board: List[List[int]]) -> None:
        """Remove numbers while ensuring the puzzle has a unique solution and a balanced distribution of filled cells."""
        max_filled_cells = 40  # Maximum number of filled cells for hard difficulty
        min_filled_per_unit = 3  # Minimum filled cells per row/column
        max_filled_per_unit = 6  # Maximum filled cells per row/column
        
        # Create list of all positions
        positions = [(i, j) for i in range(self.size) for j in range(self.size)]
        random.shuffle(positions)
        
        # Keep track of filled cells in each row and column
        filled_rows = [sum(1 for j in range(self.size) if board[i][j] != self.empty) for i in range(self.size)]
        filled_cols = [sum(1 for i in range(self.size) if board[i][j] != self.empty) for j in range(self.size)]
        
        # First pass: Remove numbers while maintaining balance
        for row, col in positions[:]:
            if board[row][col] == self.empty:
                continue
                
            # Check if removing this number would violate minimum constraints
            if (filled_rows[row] <= min_filled_per_unit or 
                filled_cols[col] <= min_filled_per_unit):
                continue
                
            # Try removing the number
            temp = board[row][col]
            board[row][col] = self.empty
            
            # Find solutions
            solutions = self._find_all_solutions(board)
            
            if len(solutions) == 1:
                # Successfully removed
                filled_rows[row] -= 1
                filled_cols[col] -= 1
            else:
                # Put it back if multiple solutions would be created
                board[row][col] = temp
                
        # Second pass: Force remove numbers from overfilled rows/columns
        positions = [(i, j) for i in range(self.size) for j in range(self.size)]
        random.shuffle(positions)
        
        for row, col in positions:
            if board[row][col] == self.empty:
                continue
                
            # Check if this row or column has too many filled cells
            if filled_rows[row] > max_filled_per_unit or filled_cols[col] > max_filled_per_unit:
                temp = board[row][col]
                board[row][col] = self.empty
                
                solutions = self._find_all_solutions(board)
                
                if len(solutions) == 1:
                    # Successfully removed
                    filled_rows[row] -= 1
                    filled_cols[col] -= 1
                else:
                    # Try to fix multiple solutions by adding a number elsewhere
                    diff_row, diff_col, common_value = self._find_most_different_position(solutions)
                    if (diff_row, diff_col) != (row, col):
                        board[diff_row][diff_col] = common_value
                        filled_rows[diff_row] += 1
                        filled_cols[diff_col] += 1
                    else:
                        board[row][col] = temp
                        
        # Final pass: Ensure we don't have more than max_filled_cells total
        total_filled = sum(filled_rows)
        if total_filled > max_filled_cells:
            remaining_positions = [(i, j) for i, j in positions if board[i][j] != self.empty]
            random.shuffle(remaining_positions)
            
            for row, col in remaining_positions:
                if sum(filled_rows) <= max_filled_cells:
                    break
                    
                if filled_rows[row] > min_filled_per_unit and filled_cols[col] > min_filled_per_unit:
                    temp = board[row][col]
                    board[row][col] = self.empty
                    
                    solutions = self._find_all_solutions(board)
                    
                    if len(solutions) == 1:
                        filled_rows[row] -= 1
                        filled_cols[col] -= 1
                    else:
                        board[row][col] = temp

    def _solve_board(self, board: List[List[int]]) -> bool:
        """Solve the Sudoku board using backtracking."""
        empty = self._find_empty(board)
        if not empty:
            return True
            
        row, col = empty
        for num in range(1, self.size + 1):
            if self.is_valid_move(board, row, col, num):
                board[row][col] = num
                if self._solve_board(board):
                    return True
                board[row][col] = self.empty
                
        return False

    def _find_empty(self, board: List[List[int]]) -> Optional[Tuple[int, int]]:
        """Find an empty cell in the board."""
        for i in range(self.size):
            for j in range(self.size):
                if board[i][j] == self.empty:
                    return (i, j)
        return None

    def is_valid_move(self, board: List[List[int]], row: int, col: int, num: int) -> bool:
        """Check if a move is valid."""
        # Check row
        for x in range(self.size):
            if board[row][x] == num and x != col:
                return False
                
        # Check column
        for x in range(self.size):
            if board[x][col] == num and x != row:
                return False
                
        # Check box
        box_x = row - row % self.box_size
        box_y = col - col % self.box_size
        for i in range(self.box_size):
            for j in range(self.box_size):
                if (board[box_x + i][box_y + j] == num and
                    (box_x + i != row or box_y + j != col)):
                    return False
                    
        return True

    def is_solved(self, board: List[List[int]]) -> bool:
        """Check if the board is solved."""
        # Check if board is full
        if self._find_empty(board):
            return False
            
        # Check if all rows, columns and boxes are valid
        for i in range(self.size):
            for j in range(self.size):
                num = board[i][j]
                board[i][j] = self.empty
                if not self.is_valid_move(board, i, j, num):
                    board[i][j] = num
                    return False
                board[i][j] = num
                
        return True 