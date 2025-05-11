export type Theme = {
  name: string;
  background: string;
  text: string;
  gridBorder: string;
  initialCell: string;
  emptyCell: string;
  emptyCellHover: string;
  button: string;
  buttonHover: string;
  modalOverlay: string;
  modalBackground: string;
  modalBorder: string;
};

export const themes: { [key: string]: Theme } = {
  beige: {
    name: 'Beige',
    background: '#f5f0e1',
    text: '#5c4f3d',
    gridBorder: '#d4c5a9',
    initialCell: '#e8dcc4',
    emptyCell: '#ffffff',
    emptyCellHover: '#faf6ed',
    button: '#8b7355',
    buttonHover: '#6d5a43',
    modalOverlay: '#5c4f3d',
    modalBackground: '#f5f0e1',
    modalBorder: '#d4c5a9'
  },
  dark: {
    name: 'Dark',
    background: '#1a1a1a',
    text: '#ffffff',
    gridBorder: '#333333',
    initialCell: '#2d2d2d',
    emptyCell: '#404040',
    emptyCellHover: '#4a4a4a',
    button: '#8c8c8c',
    buttonHover: '#a6a6a6',
    modalOverlay: '#000000',
    modalBackground: '#262626',
    modalBorder: '#404040'
  },
  lightBlue: {
    name: 'Light Blue',
    background: '#f0f7ff',
    text: '#2c5282',
    gridBorder: '#bee3f8',
    initialCell: '#ebf8ff',
    emptyCell: '#ffffff',
    emptyCellHover: '#f7fafc',
    button: '#4299e1',
    buttonHover: '#3182ce',
    modalOverlay: '#2c5282',
    modalBackground: '#f0f7ff',
    modalBorder: '#bee3f8'
  }
}; 