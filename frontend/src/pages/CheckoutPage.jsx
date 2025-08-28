import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { CheckCircle, MapPin, ShoppingBag, Clock, CreditCard } from "lucide-react";
import Navbar from "../components/Navbar";
import { useCreateOrderMutation, useGetUserByClerkIdQuery, useUpdateUserAddressMutation } from '../lib/api';
import { useUser, useClerk } from '@clerk/clerk-react';

const CheckoutPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useUser();
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
     
 
  const { menuItems, selectedPrice, selectedPortion, selectedAddOn, total, quantity } = orderDetails;
  // Fetch user profile (including address) from backend using Clerk user id
  const clerkId = user?.id;
  const { data: userResp, isFetching: isUserLoading, refetch: refetchUser } = useGetUserByClerkIdQuery(clerkId, { skip: !clerkId });
  const userDoc = userResp?.data;
  const deliveryAddressObj = userDoc?.address;
  const [createOrder] = useCreateOrderMutation();
  const [updateUserAddress, { isLoading: isUpdatingAddress }] = useUpdateUserAddressMutation();
  const [success, setSuccess] = useState(false);
  const clerk = useClerk();
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [addrForm, setAddrForm] = useState({
    street: '',
    city: '',
    postalCode: '',
    phone: '',
  });

  useEffect(() => {
    if (deliveryAddressObj) {
      setAddrForm({
        street: deliveryAddressObj?.street || '',
        city: deliveryAddressObj?.city || '',
        postalCode: deliveryAddressObj?.postalCode || '',
        phone: deliveryAddressObj?.phone || '',
      });
    }
  }, [deliveryAddressObj?.street, deliveryAddressObj?.city, deliveryAddressObj?.postalCode, deliveryAddressObj?.phone]);

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
                Quantity:{" "}
                <span className="font-semibold text-orange-500">
                  {quantity || 1}
                </span>
              </div>
              <div>
                Price per Pack:{" "}
                <span className="font-semibold text-orange-500">
                  Rs. {(total / (quantity || 1)).toFixed(2)}
                </span>
              </div>
              <div>
                Total Price:{" "}
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
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
              <MapPin className="text-orange-500" />
              <h2 className="text-2xl font-bold text-gray-900">
                Delivery Address
              </h2>
              </div>
              {user && (
                <button
                  className="text-sm font-medium text-orange-600 hover:text-orange-700 underline"
                  onClick={() => setShowAddressModal(true)}
                >
                  Change
                </button>
              )}
            </div>
            <div className="bg-gray-100 rounded-xl p-5 shadow-inner text-gray-800">
              {isUserLoading ? (
                <div className="text-gray-600">Loading address…</div>
              ) : user ? (
                deliveryAddressObj ? (
                  <div className="space-y-2">
                    <div>
                      <span className="font-semibold">Name:</span>{' '}
                      {userDoc?.name || user?.fullName || '—'}
                    </div>
                    <div>
                      <span className="font-semibold">Street:</span>{' '}
                      {deliveryAddressObj?.street || '—'}
                    </div>
                    <div>
                      <span className="font-semibold">City:</span>{' '}
                      {deliveryAddressObj?.city || '—'}
                    </div>
                    <div>
                      <span className="font-semibold">Postal Code:</span>{' '}
                      {deliveryAddressObj?.postalCode || '—'}
                    </div>
                    <div>
                      <span className="font-semibold">Phone:</span>{' '}
                      {deliveryAddressObj?.phone || user?.primaryPhoneNumber?.phoneNumber || '—'}
                    </div>
                  </div>
                ) : (
                  <div className="text-gray-600">
                    No address on file. Please update your profile address.
                  </div>
                )
              ) : (
                <div className="text-gray-600">
                  Sign in to see your saved delivery address.
                </div>
              )}
            </div>
          </div>
          {showAddressModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center">
              <div className="absolute inset-0 bg-black/40" onClick={() => setShowAddressModal(false)} />
              <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-md p-6 z-10">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Edit Delivery Address</h3>
                <form
                  className="space-y-4"
                  onSubmit={async (e) => {
                    e.preventDefault();
                    if (!user) return;
                    try {
                      await updateUserAddress({
                        clerkId: user.id,
                        address: addrForm,
                      }).unwrap();
                      await refetchUser();
                      setShowAddressModal(false);
                    } catch (err) {
                      console.error('Failed to update address', err);
                    }
                  }}
                >
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Street</label>
                    <input
                      type="text"
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
                      value={addrForm.street}
                      onChange={(e) => setAddrForm({ ...addrForm, street: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                    <input
                      type="text"
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
                      value={addrForm.city}
                      onChange={(e) => setAddrForm({ ...addrForm, city: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Postal Code</label>
                    <input
                      type="text"
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
                      value={addrForm.postalCode}
                      onChange={(e) => setAddrForm({ ...addrForm, postalCode: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                    <input
                      type="tel"
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
                      value={addrForm.phone}
                      onChange={(e) => setAddrForm({ ...addrForm, phone: e.target.value })}
                    />
                  </div>
                  <div className="flex items-center justify-end gap-3 pt-2">
                    <button
                      type="button"
                      className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50"
                      onClick={() => setShowAddressModal(false)}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isUpdatingAddress}
                      className="px-4 py-2 rounded-lg bg-orange-600 text-white hover:bg-orange-700 disabled:opacity-60"
                    >
                      {isUpdatingAddress ? 'Saving…' : 'Save'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
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
              <span className="text-orange-500">Free</span>
            </div>
            <div className="border-t border-gray-300 my-3"></div>
            <div className="flex justify-between text-lg font-bold text-gray-900">
              <span>Total</span>
              <span className="text-orange-500">
                Rs. {parseInt(total || 0) + 0}.00
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
                  localStorage.setItem('orderDetails', JSON.stringify({ menuItems, selectedPrice, selectedPortion, selectedAddOn, total, quantity }));
                  clerk.openSignIn();
                  return;
                }
                const res = await createOrder({
                  userId: user.id,
                  menuItems,
                  selectedPortion,
                  selectedAddOn,
                  quantity,
                  total,
                  deliveryAddress: {
                    name: userDoc?.name || user?.fullName || '',
                    street: deliveryAddressObj?.street || '',
                    city: deliveryAddressObj?.city || '',
                    // Order schema expects 'postal'
                    postal: deliveryAddressObj?.postalCode || '',
                    phone: deliveryAddressObj?.phone || user?.primaryPhoneNumber?.phoneNumber || '',
                  },
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
