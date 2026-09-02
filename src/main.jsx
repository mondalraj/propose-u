import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './styles/index.css'

// No StrictMode: its dev-only double-invoking can jam AnimatePresence-style
// transitions and doesn't exist in production — we test exactly what we ship.
ReactDOM.createRoot(document.getElementById('root')).render(<App />)
