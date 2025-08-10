import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { applyTheme, loadFonts } from './config/theme'

// Apply theme and load fonts before rendering
applyTheme();
loadFonts();

createRoot(document.getElementById("root")!).render(<App />);
