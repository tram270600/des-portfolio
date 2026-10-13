import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import Hotjar from '@hotjar/browser';

const siteId = Number(import.meta.env.VITE_HOTJAR_SITE_ID);

if (siteId && typeof window !== 'undefined') {
  Hotjar.init(siteId, 6);
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
