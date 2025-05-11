import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './index.css';
import ConfirmationModal from './components/ConfirmationModal';
import ThemeSwitcher from './components/ThemeSwitcher';
import NumberSelector from './components/NumberSelector';
import { themes } from './themes';
import 'primeicons/primeicons.css';

const API_URL = 'http://localhost:8000/api/sudoku';

function App() {
  const [board, setBoard] = useState<number[][]>([]);
  const [initialBoard, setInitialBoard] = useState<number[][]>([]);
  const [message, setMessage] = useState<string>('');
  const [isConfirmationOpen, setIsConfirmationOpen] = useState(false);
  const [currentTheme, setCurrentTheme] = useState(() => {
    // Initialize theme from localStorage or default to 'beige'
    return localStorage.getItem('sudoku-theme') || 'beige';
  });
  const [selectedCell, setSelectedCell] = useState<{ row: number; col: number } | null>(null);

  const theme = themes[currentTheme];

  useEffect(() => {
    generateNewPuzzle();
  }, []);

  // Save theme to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('sudoku-theme', currentTheme);
  }, [currentTheme]);

  const generateNewPuzzle = async () => {
    try {
      const response = await axios.get(API_URL + '/new');
      setBoard(response.data);
      setInitialBoard(response.data.map((row: number[]) => [...row]));
      setMessage('');
    } catch (error) {
      setMessage('Error generating new puzzle');
    }
  };

  const handleNewGameClick = () => {
    setIsConfirmationOpen(true);
  };

  const handleConfirmNewGame = () => {
    setIsConfirmationOpen(false);
    generateNewPuzzle();
  };

  const handleCancelNewGame = () => {
    setIsConfirmationOpen(false);
  };

  const handleRestart = async () => {
    try {
      const response = await axios.get(API_URL + '/restart');
      setBoard(response.data);
      setInitialBoard(response.data.map((row: number[]) => [...row]));
      setMessage('');
      setSelectedCell(null);
    } catch (error) {
      setMessage('Error restarting game');
    }
  };

  const handleCellChange = async (row: number, col: number, value: string) => {
    if (initialBoard[row][col] !== 0) return;

    const newValue = value === '' ? 0 : parseInt(value);
    if (isNaN(newValue) || newValue < 0 || newValue > 9) return;

    const newBoard = board.map(r => [...r]);
    newBoard[row][col] = newValue;
    setBoard(newBoard);

    if (newValue !== 0) {
      try {
        const isValid = await axios.post(API_URL + '/validate', {
          board: newBoard,
          row,
          col,
          number: newValue
        });

        if (isValid.data) {
          checkSolution(newBoard);
        }
      } catch (error) {
        setMessage('Error validating move');
      }
    }
  };

  const checkSolution = async (currentBoard: number[][]) => {
    try {
      const isSolved = await axios.post(API_URL + '/check', currentBoard);
      if (isSolved.data) {
        setMessage('Congratulations! You solved the puzzle!');
      }
    } catch (error) {
      setMessage('Error checking solution');
    }
  };

  const handleCellClick = (row: number, col: number, e: React.MouseEvent) => {
    if (initialBoard[row][col] !== 0) return;
    setSelectedCell({ row, col });
  };

  const handleNumberSelect = async (number: number) => {
    if (!selectedCell) return;
    const { row, col } = selectedCell;
    await handleCellChange(row, col, number.toString());
  };

  return (
    <div className="flex flex-col items-center min-h-screen p-5 relative pb-40" style={{ backgroundColor: theme.background }}>
      <ThemeSwitcher currentTheme={currentTheme} onThemeChange={setCurrentTheme} />
      
      <div className="relative mb-8">
        <h1 
          className="text-6xl font-great-vibes mb-5 relative z-10"
          style={{ 
            color: theme.text,
            textShadow: `2px 2px 4px ${theme.modalOverlay}40`
          }}
        >
          Sudoku
        </h1>
        <div 
          className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-3/4 h-1 rounded-full"
          style={{ 
            background: `linear-gradient(90deg, 
              transparent 0%, 
              ${theme.button}80 30%, 
              ${theme.button}80 70%, 
              transparent 100%
            )`
          }}
        />
      </div>
      
      <div className="grid grid-cols-sudoku gap-px p-0.5 border-2 mb-6" style={{ 
        backgroundColor: theme.gridBorder,
        borderColor: theme.gridBorder
      }}>
        {board.map((row, rowIndex) =>
          row.map((cell, colIndex) => (
            <input
              key={`${rowIndex}-${colIndex}`}
              type="number"
              min="1"
              max="9"
              value={cell === 0 ? '' : cell}
              onChange={(e) => handleCellChange(rowIndex, colIndex, e.target.value)}
              onClick={(e) => handleCellClick(rowIndex, colIndex, e)}
              onKeyDown={(e) => {
                // Prevent 'e' key as it's used for scientific notation
                if (e.key.toLowerCase() === 'e') {
                  e.preventDefault();
                }
              }}
              disabled={initialBoard[rowIndex][colIndex] !== 0}
              className="sudoku-cell"
              style={{
                backgroundColor: initialBoard[rowIndex][colIndex] !== 0 ? theme.initialCell : theme.emptyCell,
                color: theme.text,
                '--hover-bg': theme.emptyCellHover
              } as React.CSSProperties}
            />
          ))
        )}
      </div>

      <div className="flex gap-4 mb-20">
        <button
          onClick={handleNewGameClick}
          className="px-6 py-2 text-lg rounded-xl transition-colors flex items-center"
          style={{
            backgroundColor: theme.button,
            color: theme.emptyCell,
            '--hover-bg': theme.buttonHover
          } as React.CSSProperties}
        >
          New Game
        </button>

        <button
          onClick={handleRestart}
          className="p-2 text-lg rounded-xl transition-colors flex items-center justify-center w-10 h-10"
          style={{
            backgroundColor: theme.button,
            color: theme.emptyCell,
            '--hover-bg': theme.buttonHover
          } as React.CSSProperties}
          title="Restart Game"
        >
          <i className="pi pi-refresh" style={{ fontSize: '1.2rem' }}></i>
        </button>
      </div>

      {message && (
        <div className="mt-5 text-lg" style={{ color: theme.text }}>
          {message}
        </div>
      )}

      <ConfirmationModal
        isOpen={isConfirmationOpen}
        onConfirm={handleConfirmNewGame}
        onCancel={handleCancelNewGame}
        theme={theme}
      >
        <h2 className="text-xl font-semibold mb-4" style={{ color: theme.text }}>
          Start New Game?
        </h2>
        <p className="mb-6" style={{ color: theme.text }}>
          Are you sure you want to start a new game? Current progress will be lost.
        </p>
      </ConfirmationModal>

      <NumberSelector
        position={selectedCell ? { x: 0, y: 0 } : null}
        onSelect={handleNumberSelect}
        onDelete={() => {
          if (selectedCell) {
            handleCellChange(selectedCell.row, selectedCell.col, '');
          }
        }}
        onClose={() => setSelectedCell(null)}
        theme={theme}
      />
    </div>
  );
}

export default App; 