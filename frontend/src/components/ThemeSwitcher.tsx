import React from 'react';
import { Theme, themes } from '../themes';

interface ThemeSwitcherProps {
  currentTheme: string;
  onThemeChange: (themeKey: string) => void;
}

const ThemeSwitcher: React.FC<ThemeSwitcherProps> = ({ currentTheme, onThemeChange }) => {
  return (
    <div className="absolute top-4 right-4 flex flex-col items-center">
      <span className="text-xs mb-1 opacity-60" style={{ color: themes[currentTheme].text }}>
        Switch Theme
      </span>
      <div className="flex gap-2">
        {Object.entries(themes)
          .filter(([key]) => key !== currentTheme)
          .map(([key, theme]) => (
            <button
              key={key}
              onClick={() => onThemeChange(key)}
              className="w-8 h-8 rounded-full transition-transform scale-100 hover:scale-105 shadow-md"
              style={{
                background: `linear-gradient(135deg, ${theme.background}, ${theme.button})`,
                border: `2px solid ${theme.gridBorder}`
              }}
              title={theme.name}
            />
          ))}
      </div>
    </div>
  );
};

export default ThemeSwitcher; 