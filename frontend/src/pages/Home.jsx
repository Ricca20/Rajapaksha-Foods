<<<<<<< HEAD
import HeroSection from "../components/HeroSection"
import TopCategories from "../components/TopCategories"
import OrderSection from "../components/OrderSection"
import FoodProcess from "../components/FoodProcess"
import Footer from "../components/Footer"
import Features from "../components/Features"
import NutritionProgram from "../components/NutritionProgram"
import ServiceArea from "../components/ServiceArea"
import CustomerReviews from "../components/CustomerReviews"
import Navbar from "../components/Navbar"

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar/>
      <HeroSection />
      <ServiceArea/>
      <NutritionProgram/>
      <OrderSection />
      <Features />
      <FoodProcess />
      <CustomerReviews/>
=======
import React from 'react'
import Navbar from '../components/Navbar'
import Footer from '../components/footer'

const Home = () => {
  return (
    <div>
      <Navbar />
      <h1>Welcome to Rajapaksha Foods</h1>
      <p>Your one-stop solution for all your food needs.</p>







>>>>>>> RAJ-63-as-a-customer-i-want-a-navigation-bar-so-that-i-can-easily-move-between-menu-orders-and-profile-pages
      
      <Footer />
    </div>
  )
}


