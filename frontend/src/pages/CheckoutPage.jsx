import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { CheckCircle, MapPin, ShoppingBag, Clock, CreditCard } from "lucide-react";
import Navbar from "../components/Navbar";
import { useCreateOrderMutation } from '../lib/api';
import { useUser, useClerk } from '@clerk/clerk-react';

const CheckoutPage = () => {
  const location = useLocation();
  const [orderDetails, setOrderDetails] = useState(() => {
    // Try to get from router state first
    if (location.state && Object.keys(location.state).length > 0) {
      localStorage.setItem('orderDetails', JSON.stringify(location.state));
      return location.state;
    }
    // Otherwise, get from localStorage
    const saved = localStorage.getItem('orderDetails');
    return saved ? JSON.parse(saved) : {};
  });
  const { menuItems, selectedPrice, selectedPortion, selectedAddOn, total } = orderDetails;
  const deliveryAddress = {
    name: "John Doe",
    street: "123 Main Street",
    city: "Colombo",
    postal: "10000",
    phone: "+94 77 123 4567",
  };
  const [createOrder] = useCreateOrderMutation();
  const [success, setSuccess] = useState(false);
  const { user } = useUser();
  const clerk = useClerk();

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Navbar */}
      <Navbar />

      {/* Main Container */}
      <section className="pt-28 pb-16 px-6 max-w-7xl mx-auto grid lg:grid-cols-3 gap-8">
        {/* Left Column (Order + Address) */}
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="lg:col-span-2 space-y-8"
        >
          {/* Order Details */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
            <div className="flex items-center gap-2 mb-4">
              <ShoppingBag className="text-orange-500" />
              <h2 className="text-2xl font-bold text-gray-900">Order Details</h2>
            </div>
            <ul className="space-y-2 mb-4">
              {menuItems &&
                menuItems.map((item, idx) => (
                  <li
                    key={idx}
                    className="p-3 bg-gray-100 rounded-lg text-gray-900 font-medium shadow-sm"
                  >
                    {item}
                  </li>
                ))}
            </ul>
            <div className="space-y-1 text-gray-800">
              <div>
                Portion:{" "}
                <span className="font-semibold text-orange-500">
                  {selectedPortion}
                </span>
              </div>
              <div>
                Price:{" "}
                <span className="font-semibold text-orange-500">
                  Rs. {total}.00
                </span>
              </div>
              <div>
                Add-On:{" "}
                <span className="font-semibold text-orange-500">
                  {selectedAddOn || "None"}
                </span>
              </div>
            </div>
          </div>

          {/* Delivery Address */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
            <div className="flex items-center gap-2 mb-4">
              <MapPin className="text-orange-500" />
              <h2 className="text-2xl font-bold text-gray-900">
                Delivery Address
              </h2>
            </div>
            <div className="bg-gray-100 rounded-xl p-5 shadow-inner space-y-2 text-gray-800">
              <div>
                <span className="font-semibold">Name:</span>{" "}
                {deliveryAddress.name}
              </div>
              <div>
                <span className="font-semibold">Street:</span>{" "}
                {deliveryAddress.street}
              </div>
              <div>
                <span className="font-semibold">City:</span>{" "}
                {deliveryAddress.city}
              </div>
              <div>
                <span className="font-semibold">Postal Code:</span>{" "}
                {deliveryAddress.postal}
              </div>
              <div>
                <span className="font-semibold">Phone:</span>{" "}
                {deliveryAddress.phone}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Right Column (Summary) */}
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="space-y-6"
        >
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              Order Summary
            </h2>
            <div className="flex justify-between text-gray-700 mb-2">
              <span>Subtotal</span>
              <span>Rs. {total}.00</span>
            </div>
            <div className="flex justify-between text-gray-700 mb-2">
              <span>Delivery Fee</span>
              <span>Rs. 150.00</span>
            </div>
            <div className="border-t border-gray-300 my-3"></div>
            <div className="flex justify-between text-lg font-bold text-gray-900">
              <span>Total</span>
              <span className="text-orange-500">
                Rs. {parseInt(total || 0) + 150}.00
              </span>
            </div>
          </div>

          {/* Delivery Time */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 flex items-center gap-3">
            <Clock className="text-orange-500" />
            <div>
              <h3 className="font-semibold text-gray-900">Estimated Delivery</h3>
              <p className="text-gray-600">30 - 40 mins</p>
            </div>
          </div>

          {/* Payment */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
            <div className="flex items-center gap-2 mb-3">
              <CreditCard className="text-orange-500" />
              <h3 className="font-semibold text-gray-900">Payment Method</h3>
            </div>
            <p className="text-gray-700">Cash on Delivery</p>
          </div>

          {/* Confirm Button */}
          {success ? (
            <div className="w-full py-4 bg-green-100 text-green-700 rounded-full font-semibold text-lg shadow-lg flex items-center justify-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-500" />
              Order placed successfully!
            </div>
          ) : (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="w-full py-4 bg-orange-500 text-white rounded-full font-semibold text-lg shadow-lg hover:bg-orange-600 transition flex items-center justify-center gap-2"
              onClick={async () => {
                if (!user) {
                  localStorage.setItem('orderDetails', JSON.stringify({ menuItems, selectedPrice, selectedPortion, selectedAddOn, total }));
                  clerk.openSignIn();
                  return;
                }
                const res = await createOrder({
                  userId: user.id,
                  menuItems,
                  selectedPortion,
                  selectedAddOn,
                  total,
                  deliveryAddress,
                });
                if (res?.data?.success) {
                  setSuccess(true);
                  localStorage.removeItem('orderDetails');
                  // Optionally, redirect after a delay:
                  // setTimeout(() => navigate('/'), 2000);
                }
              }}
            >
              <CheckCircle className="w-5 h-5" />
              Confirm Order
            </motion.button>
          )}
        </motion.div>
      </section>
    </div>
  );
};

export default CheckoutPage;
