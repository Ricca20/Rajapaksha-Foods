import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Provider } from 'react-redux';
import store from './lib/store.js';
import { ClerkProvider } from '@clerk/clerk-react';
//pages
import Home from './pages/Home.jsx';
import MenuPage from './pages/MenuPage.jsx';
import CheckoutPage from './pages/CheckoutPage.jsx';
import AdminPage from './pages/AdminPage.jsx';
import OrdersToday from './pages/OrdersToday.jsx';
import MealTimeOrders from './pages/MealTimeOrders.jsx';
import AdminLayout from './layouts/AdminLayout.jsx';


const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY

if (!PUBLISHABLE_KEY) {
  throw new Error('Missing Publishable Key')
}
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <ClerkProvider publishableKey={PUBLISHABLE_KEY}>
          <Routes>
            <Route path="/" element={<Home/>}/>
            <Route path="/menu" element={<MenuPage/>}/>
            <Route path="/checkout" element={<CheckoutPage/>}/>
            
            {/* Admin Routes */}
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<AdminPage/>}/>
              <Route path="orders/today" element={<OrdersToday/>}/>
              <Route path="orders/:mealType" element={<MealTimeOrders/>}/>
              {/* Add these routes when you create the components */}
              {/* <Route path="inventory" element={<Inventory/>}/> */}
              {/* <Route path="employees" element={<Employees/>}/> */}
            </Route>
          </Routes>
        </ClerkProvider>
      </BrowserRouter>
    </Provider>
  </StrictMode>,
)
