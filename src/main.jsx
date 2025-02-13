import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css'; // Asegúrate de que el archivo CSS se importe aquí
import { SimadApp } from './SimadApp';



ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <SimadApp />
  </React.StrictMode>
);
