import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import 'primereact/resources/primereact.min.css';
import App from './App';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
); 