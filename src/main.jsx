import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import { EmailProvider } from './context/EmailContext.jsx'
import { DialogProvider } from './context/DialogContext.jsx'
import { SocketProvider } from './context/SocketContext.jsx'

createRoot(document.getElementById('root')).render(
    
  
  <BrowserRouter>
  <SocketProvider>
 <DialogProvider>
<EmailProvider>
  
    <App />
</EmailProvider>

  </DialogProvider>
  </SocketProvider>
 
  
  </BrowserRouter>,
)
