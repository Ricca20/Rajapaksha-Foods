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
import AllOrders from './pages/AllOrders.jsx';
import InventoryPage from './pages/InventoryPage.jsx';
import AdminReviewsPage from './pages/AdminReviewsPage.jsx';
import EmployeesPage from './pages/EmployeesPage.jsx';
import AdminLayout from './layouts/AdminLayout.jsx';
import OrdersPage from './pages/OrdersPage.jsx';
import AboutPage from './pages/AboutPage.jsx';
import ContactPage from './pages/ContactPage.jsx';


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
            <Route path="/about" element={<AboutPage/>}/>
            <Route path="/contact" element={<ContactPage/>}/>
            
            {/* Admin Routes */}
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<AdminPage/>}/>
              <Route path="orders" element={<AllOrders/>}/>
              <Route path="orders/today" element={<OrdersToday/>}/>
              <Route path="orders/:mealType" element={<MealTimeOrders/>}/>
              <Route path="inventory" element={<InventoryPage/>}/>
              <Route path="reviews" element={<AdminReviewsPage/>}/>
              <Route path="employees" element={<EmployeesPage/>}/>
            </Route>
            <Route path="/orders" element={<OrdersPage/>}/>
          </Routes>
        </ClerkProvider>
      </BrowserRouter>
    </Provider>
  </StrictMode>,
)
