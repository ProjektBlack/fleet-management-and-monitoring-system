import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import "./style/App.css";
import { SnackbarProvider, enqueueSnackbar } from 'notistack';
import { BrowserRouter } from 'react-router-dom'
import { StrictMode } from 'react'
import { AuthProvider } from './context/authProvider.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <SnackbarProvider maxSnack={3}>
          <App />
        </SnackbarProvider>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>
)
