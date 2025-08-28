import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGetMenuQuery } from '../lib/api';
import { motion, AnimatePresence } from 'framer-motion';
import { GiSausage,GiChickenLeg } from "react-icons/gi";
import { IoFishSharp } from "react-icons/io5";
import { MdEggAlt } from "react-icons/md";
import { 
  ChefHat, 
  Utensils, 
  Plus, 
  ArrowRight, 
  Shield, 
  Clock,
  Star,
  Heart
} from "lucide-react";
import Lottie from 'lottie-react';
import spinnerAnimation from '../assets/animate.json';
import Navbar from "../components/Navbar";

const MenuPage = () => {
  const { data: menu, error, isLoading } = useGetMenuQuery();
  const [selectedAddOn, setSelectedAddOn] = useState(null);
  const [selectedPrice, setSelectedPrice] = useState(null);

  console.log("Menu data:", menu);
  console.log("Error:", error);
  console.log("Is loading:", isLoading);
  console.log("Backend URL:", import.meta.env.VITE_BACKEND_URL);

  const navigate = useNavigate();

  const addOnNames = [
    { key: 'isChicken', label: 'Chicken', price: 150, icon:<GiChickenLeg className="w-6 h-6 text-orange-500"/> },
    { key: 'isEgg', label: 'Egg', price: 50, icon: <MdEggAlt className="w-6 h-6 text-orange-500" />},
    { key: 'isFish', label: 'Fish', price: 200, icon: <IoFishSharp className="w-6 h-6 text-orange-500" />},
    { key: 'isSausage', label: 'Sausage', price: 100, icon: <GiSausage className="w-6 h-6 text-orange-500" />}
  ];

  const enabledAddOns = menu?.data?.addOns
    ? addOnNames.filter(a => menu.data.addOns[a.key])
    : [];

  const calculateTotal = () => {
    let total = 0;
    if (selectedPrice === 'full') total += menu?.data?.priceFull || 0;
    if (selectedPrice === 'half') total += menu?.data?.priceHalf || 0;
    if (selectedAddOn) total += addOnNames.find(a => a.key === selectedAddOn)?.price || 0;
    return total;
  };

  const grandTotal = calculateTotal();

  // Loading State
  if (isLoading) return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="flex items-center justify-center min-h-screen pt-20">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center">
          
            <div className="w-70 h-50">
              <Lottie animationData={spinnerAnimation} loop={true} />
            </div>
          
          <p className="animate-pulse text-gray-900 mt-1 text-xl">Loading <spin className="text-orange-500">today's menu...</spin></p>
        </motion.div>
      </div>
    </div>
  );

  // Error State
  if (error) return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="flex items-center justify-center min-h-screen pt-20">
        <div className="text-center p-8 bg-white rounded-2xl shadow-lg">
          <div className="w-16 h-16 bg-red-100 rounded-full mx-auto mb-4 flex items-center justify-center">
            <Shield className="w-8 h-8 text-red-500" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Something went wrong</h2>
          <p className="text-red-500 mb-4">{JSON.stringify(error)}</p>
          <button 
            onClick={() => window.location.reload()}
            className="px-6 py-2 bg-orange-500 text-white rounded-full hover:bg-orange-600 transition"
          >
            Try Again
          </button>
        </div>
      </div>
    </div>
  );

  if (!menu || !menu.data) return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="flex items-center justify-center min-h-screen pt-20">
        <div className="text-center p-8 bg-white rounded-2xl shadow-lg">
          <div className="w-16 h-16 bg-gray-200 rounded-full mx-auto mb-4 flex items-center justify-center">
            <Utensils className="w-8 h-8 text-gray-500" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">No Menu Available</h2>
          <p className="text-gray-600">Please check back later</p>
        </div>
      </div>
    </div>
  );


  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      
      {/* Main Content with proper padding to avoid navbar overlap */}
      <section className="relative py-8 px-6 max-w-6xl mx-auto pt-18">
        
        {/* Header - Fixed to avoid navbar overlap */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold text-gray-900 mt-8">
            Today's <span className="text-orange-500">Special Menu</span>
          </h1>
        </motion.div>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left - Creative Menu Items Display */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-white rounded-2xl shadow-lg p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                <Utensils className="w-6 h-6 text-orange-500" />
                Today's Selection
              </h3>
            </div>

            {/* 4 Sub-Containers Layout */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6">
              {menu.data.menuItems.map((item, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="bg-gradient-to-r from-orange-50 to-amber-50 rounded-2xl p-6 border border-orange-200 hover:border-orange-300 shadow-sm hover:shadow-md transition-all group relative flex flex-col items-start justify-between"
                >
                  {/* Item Number */}
                  <div className="absolute top-4 right-4 w-10 h-10 bg-orange-500 text-white rounded-full flex items-center justify-center font-bold text-lg">
                    {idx + 1}
                  </div>

                  {/* Menu Item Text */}
                  <h4 className="font-bold text-gray-900 text-lg mb-3">{item}</h4>

                  {/* Decorative Dots */}
                  <div className="flex gap-1 mt-auto">
                    <span className="w-2 h-2 bg-orange-400 rounded-full opacity-50 group-hover:opacity-100 transition-opacity"></span>
                    <span className="w-2 h-2 bg-orange-400 rounded-full opacity-50 group-hover:opacity-100 transition-opacity"></span>
                    <span className="w-2 h-2 bg-orange-400 rounded-full opacity-50 group-hover:opacity-100 transition-opacity"></span>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Right - Portion + Add Ons */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-white rounded-2xl shadow-lg p-6 flex flex-col justify-between"
          >
            <div>
              {/* Portion Size */}
              <h3 className="text-xl font-semibold text-gray-900 mb-1 flex items-center gap-2">
                <Plus className="w-6 h-6 text-orange-500" />
                Select Portion Size
              </h3>
              <div className="grid grid-cols-2 gap-4 mb-4">
                {[
                  { value: 'full', label: 'Full Portion', price: menu.data.priceFull },
                  { value: 'half', label: 'Normal Portion', price: menu.data.priceHalf }
                ].map(option => (
                  <motion.label
                    key={option.value}
                    whileHover={{ scale: 1.02 }}
                    className={`p-3 rounded-xl border-2 cursor-pointer transition-all ${
                      selectedPrice === option.value 
                        ? 'border-orange-500 bg-orange-50 shadow-md' 
                        : 'border-gray-200 hover:border-orange-300 hover:shadow-sm'
                    }`}
                  >
                    <input
                      type="radio"
                      name="price"
                      value={option.value}
                      checked={selectedPrice === option.value}
                      onChange={() => setSelectedPrice(option.value)}
                      className="hidden"
                    />
                    <div className="text-center">
                      <div className="font-bold text-gray-900 text-lg mb-0">{option.label}</div>
                      <div className="text-orange-500 font-bold text-xl mb-0">Rs. {option.price}.00</div>
                      <div className="text-gray-600 text-xs">{option.desc}</div>
                    </div>
                  </motion.label>
                ))}
              </div>

              {/* Add Ons */}
              {enabledAddOns.length > 0 && (
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
                    <Plus className="w-6 h-6 text-orange-500" />
                    Add Extra Goodness
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    {enabledAddOns.map((addOn) => {
                      const addOnData = addOnNames.find(a => a.key === addOn.key);
                      return (
                        <motion.label
                          key={addOn.key}
                          whileHover={{ scale: 1.02 }}
                          className={`flex flex-col items-center p-4 rounded-xl border-2 cursor-pointer transition-all ${
                            selectedAddOn === addOn.key 
                              ? 'border-orange-500 bg-orange-50 shadow-md' 
                              : 'border-gray-200 hover:border-orange-300 hover:shadow-sm'
                          }`}
                        >
                          <input
                            type="radio"
                            name="addOn"
                            value={addOn.key}
                            checked={selectedAddOn === addOn.key}
                            onChange={() => setSelectedAddOn(addOn.key)}
                            className="hidden"
                          />
                          {addOnData?.icon}
                          <div className="font-semibold text-gray-900 text-sm mt-2">{addOn.label}</div>
                          <div className="text-orange-500 font-bold text-sm">
                            +Rs. {addOnData?.price}
                          </div>
                        </motion.label>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Checkout Section */}
            <div className="mt-8 pt-6 border-t border-gray-200">
              <AnimatePresence>
                {(selectedPrice || selectedAddOn) && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mb-6 p-4 bg-gradient-to-r from-orange-50 to-amber-50 rounded-xl"
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <div className="text-gray-900 font-semibold">Order Total</div>
                        <div className="text-gray-600 text-sm">Including all selections</div>
                      </div>
                      <div className="text-2xl font-bold text-orange-500">Rs. {grandTotal}.00</div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                disabled={!selectedPrice}
                className={`w-full py-4 text-white rounded-xl font-semibold transition-all ${
                  selectedPrice 
                    ? 'bg-orange-500 hover:bg-orange-600 shadow-lg hover:shadow-xl' 
                    : 'bg-gray-400 cursor-not-allowed'
                }`}
                onClick={() => {
                  const selectedAddOnLabel = addOnNames.find(a => a.key === selectedAddOn)?.label || null;
                  navigate('/checkout', {
                    state: {
                      menuItems: menu.data.menuItems,
                      selectedPrice: selectedPrice === 'full' ? menu.data.priceFull : menu.data.priceHalf,
                      selectedPortion: selectedPrice === 'full' ? 'Full' : 'Normal',
                      selectedAddOn: selectedAddOnLabel,
                      addOnPrice: addOnNames.find(a => a.key === selectedAddOn)?.price || 0,
                      total: grandTotal
                    }
                  });
                }}
              >
                <span className="flex items-center justify-center gap-3">
                  Continue to Checkout 
                  <ArrowRight className="w-5 h-5" />
                </span>
              </motion.button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}

export default MenuPage;