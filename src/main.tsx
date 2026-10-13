import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import Hotjar from '@hotjar/browser';

const siteId = 6795357;
const hotjarVersion = 6;

Hotjar.init(siteId, hotjarVersion);
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
