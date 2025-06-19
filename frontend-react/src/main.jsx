// src/main.jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import { AppProvider } from './context/AppContext'; // <-- Impor Provider kita

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {/* Bungkus seluruh aplikasi dengan AppProvider */}
    <AppProvider>
      <App />
    </AppProvider>
  </React.StrictMode>,
);