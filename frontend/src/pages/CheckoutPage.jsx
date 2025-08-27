import React from 'react';
import { useLocation } from 'react-router-dom';

const CheckoutPage = () => {
  const location = useLocation();
  const { menuItems, selectedPrice, selectedPortion, selectedAddOn } = location.state || {};

  // Hardcoded delivery address for now
  const deliveryAddress = {
    name: "John Doe",
    street: "123 Main Street",
    city: "Colombo",
    postal: "10000",
    phone: "+94 77 123 4567"
  };

  return (
  <div className="max-w-xl mx-auto mt-20 p-4 border border-gray-200 rounded-xl bg-gradient-to-br from-white via-blue-50 to-blue-100 shadow-md">
  <h1 className="text-2xl font-bold text-center mb-4 text-blue-700">Place Your Order</h1>
      {/* Order Details Section */}
      <div className="mb-4 pb-4 border-b border-gray-300">
        <h2 className="text-lg font-semibold mb-2 text-blue-600">Order Details</h2>
        <ul className="mb-2">
          {menuItems && menuItems.map((item, idx) => (
            <li key={idx} className="mb-1 text-base font-medium text-gray-800">{item}</li>
          ))}
        </ul>
        <div className="mb-1">Selected Portion: <span className="font-semibold text-blue-600">{selectedPortion}</span></div>
        <div className="mb-1">Price: <span className="font-semibold text-blue-600">Rs. {selectedPrice}.00</span></div>
        <div className="mb-1">Add-On: <span className="font-semibold text-blue-600">{selectedAddOn || 'None'}</span></div>
      </div>
      {/* Delivery Address Section */}
      <div className="pt-4">
        <h2 className="text-lg font-semibold mb-2 text-blue-600">Delivery Address</h2>
        <div className="bg-white rounded shadow p-3">
          <div className="mb-1"><span className="font-semibold">Name:</span> {deliveryAddress.name}</div>
          <div className="mb-1"><span className="font-semibold">Street:</span> {deliveryAddress.street}</div>
          <div className="mb-1"><span className="font-semibold">City:</span> {deliveryAddress.city}</div>
          <div className="mb-1"><span className="font-semibold">Postal Code:</span> {deliveryAddress.postal}</div>
          <div className="mb-1"><span className="font-semibold">Phone:</span> {deliveryAddress.phone}</div>
        </div>
      </div>
      <div className="mt-4 text-center">
        <button className="px-4 py-2 text-base bg-blue-600 text-white rounded-lg shadow hover:scale-105 hover:bg-blue-700 transition-all duration-200 font-bold">Confirm Order</button>
      </div>
    </div>
  );
}

export default CheckoutPage;