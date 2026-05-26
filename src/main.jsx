import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.jsx';

import '../assets/css/variables.css';
import '../assets/css/base.css';
import '../assets/css/nav.css';
import '../assets/css/footer.css';
import '../assets/css/components.css';
import './styles/react-shell.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);
