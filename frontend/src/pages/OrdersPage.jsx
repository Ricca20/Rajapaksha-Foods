import React from 'react';
import Navbar from "../components/Navbar";
import { useUser } from '@clerk/clerk-react';
import { useGetOrdersByUserQuery } from '../lib/api';
import { motion } from 'framer-motion';
import { ShoppingBag, MapPin, Clock } from 'lucide-react';

const OrdersPage = () => {
  const { user } = useUser();
  const userId = user?.id;
  const { data, isFetching, isError } = useGetOrdersByUserQuery(userId, { skip: !userId });
  const orders = data?.data || [];

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />

      <section className="pt-28 pb-16 px-6 max-w-7xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">My Orders</h1>
          <p className="text-gray-600">Review your recent orders and their details.</p>
        </div>

        {(!userId) && (
          <div className="bg-white rounded-2xl shadow border border-gray-200 p-6">
            <p className="text-gray-700">Please sign in to view your orders.</p>
          </div>
        )}

        {userId && (
          <div className="space-y-4">
            {isFetching && (
              <div className="bg-white rounded-2xl shadow border border-gray-200 p-6">Loading orders…</div>
            )}
            {isError && (
              <div className="bg-white rounded-2xl shadow border border-gray-200 p-6 text-red-600">Failed to load orders.</div>
            )}
            {!isFetching && !isError && orders.length === 0 && (
              <div className="bg-white rounded-2xl shadow border border-gray-200 p-6">No orders yet.</div>
            )}

            {orders.map((order) => (
              <motion.div
                key={order._id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <ShoppingBag className="text-orange-500" />
                    <h2 className="text-xl font-semibold text-gray-900">Order #{order._id.slice(-6)}</h2>
                  </div>
                  <div className="text-sm text-gray-600">
                    <Clock className="inline-block w-4 h-4 mr-1 text-orange-500" />
                    {new Date(order.createdAt).toLocaleString()}
                  </div>
                </div>

                <div className="mt-4 grid gap-4 md:grid-cols-3">
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Items</h3>
                    <ul className="list-disc list-inside text-gray-800">
                      {(order.menuItems || []).map((it, idx) => (
                        <li key={idx}>{it}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Details</h3>
                    <div className="text-gray-800 space-y-1">
                      <div>Portion: <span className="font-medium text-orange-600">{order.selectedPortion || '—'}</span></div>
                      <div>Add-On: <span className="font-medium text-orange-600">{order.selectedAddOn || 'None'}</span></div>
                      <div>Total: <span className="font-bold text-orange-600">Rs. {order.total}.00</span></div>
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2 flex items-center gap-2"><MapPin className="text-orange-500" /> Delivery</h3>
                    <div className="text-gray-800 text-sm space-y-1">
                      <div>{order.deliveryAddress?.name}</div>
                      <div>{order.deliveryAddress?.street}</div>
                      <div>{order.deliveryAddress?.city}</div>
                      <div>{order.deliveryAddress?.postal}</div>
                      <div>{order.deliveryAddress?.phone}</div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default OrdersPage;
