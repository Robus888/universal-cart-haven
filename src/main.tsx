
import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.tsx'
import './index.css'
import { ShopProvider } from './contexts/ShopContext'
import { ThemeProvider } from './hooks/useTheme' // Change to use our custom ThemeProvider
import { ThemeProvider as NextThemeProvider } from 'next-themes'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ThemeProvider>
      <NextThemeProvider attribute="class" defaultTheme="dark">
        <BrowserRouter>
          <ShopProvider>
            <App />
          </ShopProvider>
        </BrowserRouter>
      </NextThemeProvider>
    </ThemeProvider>
  </React.StrictMode>,
)
