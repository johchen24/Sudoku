import React from 'react';
import { Theme } from '../themes';

interface NumberSelectorProps {
  onSelect: (number: number) => void;
  onDelete: () => void;
  onClose: () => void;
  position: { x: number; y: number } | null;
  theme: Theme;
}

const NumberSelector: React.FC<NumberSelectorProps> = ({ onSelect, onDelete, onClose, position, theme }) => {
  const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9];
  const isActive = position !== null;

  return (
    <div 
      className="fixed bottom-6 left-1/2 transform -translate-x-1/2 flex gap-2 p-4 rounded-xl shadow-lg mx-auto"
      style={{
        backgroundColor: `${theme.modalBackground}`,
        border: `2px solid ${theme.modalBorder}`,
        boxShadow: `0 -4px 6px -1px ${theme.modalOverlay}20, 0 -2px 4px -1px ${theme.modalOverlay}10`,
        opacity: isActive ? 1 : 0.7,
        zIndex: 40
      }}
    >
      {numbers.map(num => (
        <button
          key={num}
          onClick={() => {
            if (isActive) {
              onSelect(num);
              onClose();
            }
          }}
          disabled={!isActive}
          className={`w-10 h-10 rounded-xl transition-all flex items-center justify-center text-lg font-semibold
            ${isActive ? 'hover:scale-110 cursor-pointer' : 'cursor-not-allowed'}`}
          style={{
            backgroundColor: theme.emptyCell,
            color: isActive ? theme.text : `${theme.text}80`,
            border: `2px solid ${isActive ? theme.gridBorder : theme.gridBorder + '80'}`,
            '--hover-bg': theme.emptyCellHover,
            transform: 'scale(1)',
            transition: 'all 0.15s ease'
          } as React.CSSProperties}
        >
          {num}
        </button>
      ))}
      <button
        onClick={() => {
          if (isActive) {
            onDelete();
            onClose();
          }
        }}
        disabled={!isActive}
        className={`w-10 h-10 rounded-xl transition-all flex items-center justify-center text-lg font-semibold
          ${isActive ? 'hover:scale-110 cursor-pointer' : 'cursor-not-allowed'}`}
        style={{
          backgroundColor: theme.button,
          color: isActive ? theme.emptyCell : `${theme.emptyCell}80`,
          border: `2px solid ${isActive ? theme.gridBorder : theme.gridBorder + '80'}`,
          '--hover-bg': theme.buttonHover,
          transform: 'scale(1)',
          transition: 'all 0.15s ease'
        } as React.CSSProperties}
      >
        <i className="pi pi-eraser text-xl"></i>
      </button>
    </div>
  );
};

export default NumberSelector; 