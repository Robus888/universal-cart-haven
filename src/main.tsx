
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { ShopProvider } from '@/contexts/ShopContext'
import { ThemeProvider } from 'next-themes'
import { Toaster } from '@/components/ui/toaster'
import App from './App.tsx'
import './index.css'

createRoot(document.getElementById("root")!).render(
  <BrowserRouter>
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <ShopProvider>
        <App />
        <Toaster />
      </ShopProvider>
    </ThemeProvider>
  </BrowserRouter>
);
