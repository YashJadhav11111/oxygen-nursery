import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import AuthProvider from './context/AuthContext';

import './styles/tokens.css';
import './styles/base.css';
import './styles/motion.css';
import './styles/utilities.css';
import './styles/components.css';
import './styles/components2.css';
import './styles/sections.css';
import './styles/editorial.css';
import './styles/admin.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <App />
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>,
);
