import HeroSection from "../components/HeroSection"
import TopCategories from "../components/TopCategories"
import OrderSection from "../components/OrderSection"
import FoodProcess from "../components/FoodProcess"
import Footer from "../components/Footer"
import Features from "../components/Features"
import NutritionProgram from "../components/NutritionProgram"
import ServiceArea from "../components/ServiceArea"
import CustomerReviews from "../components/CustomerReviews"

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      <HeroSection />
      <ServiceArea/>
      <NutritionProgram/>
      <OrderSection />
      <Features />
      <FoodProcess />
      <CustomerReviews/>
      
      <Footer />
    </div>
  )
}


