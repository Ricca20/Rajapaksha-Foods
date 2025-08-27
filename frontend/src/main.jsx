import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { BrowserRouter,Routes,Route } from "react-router";
import { ClerkProvider } from '@clerk/clerk-react';
//pages
import Home from './pages/Home.jsx';
import MenuPage from './pages/MenuPage.jsx';
import CheckoutPage from './pages/CheckoutPage.jsx';


const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY

if (!PUBLISHABLE_KEY) {
  throw new Error('Missing Publishable Key')
}
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <ClerkProvider publishableKey={PUBLISHABLE_KEY}>
        <Routes>
          <Route path="/" element={<Home/>}/>
          <Route path="/menu" element={<MenuPage/>}/>
          <Route path="/checkout" element={<CheckoutPage/>}/>
        </Routes>
      </ClerkProvider>
    </BrowserRouter>
  </StrictMode>,
)
