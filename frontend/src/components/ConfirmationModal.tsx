import React from 'react';
import { Theme } from '../themes';

interface ConfirmationModalProps {
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  theme: Theme;
  children: React.ReactNode;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({ isOpen, onConfirm, onCancel, theme, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50" style={{
      backgroundColor: `${theme.modalOverlay}80`
    }}>
      <div className="rounded-lg p-6 max-w-sm w-full mx-4 shadow-lg border" style={{
        backgroundColor: theme.modalBackground,
        borderColor: theme.modalBorder
      }}>
        {children}
        <div className="flex justify-end space-x-3">
          <button
            onClick={onCancel}
            className="px-4 py-2 rounded-xl transition-colors"
            style={{ color: theme.button }}
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 rounded-xl transition-colors"
            style={{
              backgroundColor: theme.button,
              color: theme.emptyCell,
              '--hover-bg': theme.buttonHover
            } as React.CSSProperties}
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal; 