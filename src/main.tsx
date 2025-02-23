// import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
// import './App.css'
import App from './App.tsx'
// import { HelmetProvider } from "react-helmet-async" chưa hỗ trợ react 19

createRoot(document.getElementById('root')!).render(
  // <StrictMode>
  // <HelmetProvider> 
  // tắt StrictMode, HelmetProvider mới hoạt động 
  <>
    <App />
  </>
  // </HelmetProvider>
  // </StrictMode>,
)
