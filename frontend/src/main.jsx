import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'

import { BrowserRouter,Routes,Route } from "react-router";

import Home from './pages/Home.jsx';
import MenuPage from './pages/MenuPage.jsx';
import CheckoutPage from './pages/CheckoutPage.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home/>}/>
        <Route path="/menu" element={<MenuPage/>}/>
        <Route path="/checkout" element={<CheckoutPage/>}/>
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)
