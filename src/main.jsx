import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { ThemeProvider } from "./components/theme-provider"
import { HabitProvider } from "./context/HabitContext"

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <HabitProvider>
        <App />
      </HabitProvider>
    </ThemeProvider>
  </React.StrictMode>,
)

