import React from 'react';
import Navbar from "../components/Navbar";
import { useUser } from '@clerk/clerk-react';
import { useGetOrdersByUserQuery, useCancelOrderMutation } from '../lib/api';
import { motion } from 'framer-motion';
import { ShoppingBag, MapPin, Clock } from 'lucide-react';

const OrdersPage = () => {
  const { user } = useUser();
  const userId = user?.id;
  const { data, isFetching, isError, refetch } = useGetOrdersByUserQuery(userId, { skip: !userId });
  const [cancelOrder, { isLoading: isCancelling }] = useCancelOrderMutation();
  const orders = data?.data || [];
  const latestOrder = orders?.[0];
  const previousOrders = orders?.slice(1) || [];

  // Format date/time without seconds
  const fmtDateTime = (dateLike) =>
    new Date(dateLike).toLocaleString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    });

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

            {/* Latest Order Highlight */}
            {!isFetching && !isError && orders.length > 0 && (
              <motion.div
                key={latestOrder._id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-2xl shadow-lg border border-orange-200 p-6"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <ShoppingBag className="text-orange-500" />
                    <h2 className="text-xl font-semibold text-gray-900">Latest Order #{latestOrder._id.slice(-6)}</h2>
                  </div>
                  <div className="text-sm text-gray-700">
                    <Clock className="inline-block w-4 h-4 mr-1 text-orange-500" />
                    {fmtDateTime(latestOrder.createdAt)}
                  </div>
                </div>

                <div className="mt-4 grid gap-4 md:grid-cols-3">
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Items</h3>
                    <ul className="list-disc list-inside text-gray-800">
                      {(latestOrder.menuItems || []).map((it, idx) => (
                        <li key={idx}>{it}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Details</h3>
                    <div className="text-gray-800 space-y-1">
                      <div>Quantity: <span className="font-medium text-orange-600">{latestOrder.quantity || 1}</span></div>
                      <div>Portion: <span className="font-medium text-orange-600">{latestOrder.selectedPortion || '—'}</span></div>
                      <div>Add-On: <span className="font-medium text-orange-600">{latestOrder.selectedAddOn || 'None'}</span></div>
                      <div>Total: <span className="font-bold text-orange-600">Rs. {latestOrder.total}.00</span></div>
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2 flex items-center gap-2"><MapPin className="text-orange-500" /> Delivery</h3>
                    <div className="text-gray-800 text-sm space-y-1">
                      <div>{latestOrder.deliveryAddress?.name}</div>
                      <div>{latestOrder.deliveryAddress?.street}</div>
                      <div>{latestOrder.deliveryAddress?.city}</div>
                      <div>{latestOrder.deliveryAddress?.postal}</div>
                      <div>{latestOrder.deliveryAddress?.phone}</div>
                    </div>
                  </div>
                </div>
                {/* Cancel button for latest order */}
                <div className="mt-4 flex justify-end">
                  {(() => {
                    const created = new Date(latestOrder.createdAt).getTime();
                    const now = Date.now();
                    const tenMin = 10 * 60 * 1000;
                    const canCancel = now - created < tenMin;
                    return (
                      <button
                        disabled={!canCancel || isCancelling}
                        onClick={async () => {
                          try {
                            await cancelOrder({ orderId: latestOrder._id, userId }).unwrap();
                            await refetch();
                          } catch (e) {
                            console.error('Cancel failed', e);
                          }
                        }}
                        className={`px-4 py-2 rounded-lg border text-sm font-medium transition ${
                          canCancel && !isCancelling
                            ? 'border-red-500 text-red-600 hover:bg-red-50 hover:cursor-pointer'
                            : 'border-gray-300 text-gray-400 cursor-not-allowed'
                        }`}
                      >
                        {isCancelling ? 'Cancelling…' : canCancel ? 'Cancel Order' : 'Cancel Disabled(10min passed)'}
                      </button>
                    );
                  })()}
                </div>
              </motion.div>
            )}

            {/* Previous Orders */}
            {!isFetching && !isError && previousOrders.length > 0 && (
              <div className="mt-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Previous Orders</h3>
                <div className="space-y-3">
                  {previousOrders.map((order) => {
                    const items = order.menuItems || [];
                    const firstItem = items[0];
                    const restCount = Math.max(items.length - 1, 0);
                    return (
                      <motion.div
                        key={order._id}
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white rounded-xl shadow border border-gray-200 p-4"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <ShoppingBag className="w-4 h-4 text-orange-500" />
                            <h2 className="text-base font-semibold text-gray-900">Order #{order._id.slice(-6)}</h2>
                          </div>
                          <div className="text-xs text-gray-600">
                            <Clock className="inline-block w-3.5 h-3.5 mr-1 text-orange-500" />
                            {fmtDateTime(order.createdAt)}
                          </div>
                        </div>
                        <div className="mt-2 flex items-center justify-between text-sm">
                          <div className="text-gray-700 truncate">
                            {firstItem || '—'}{restCount > 0 ? ` +${restCount} more` : ''}
                          </div>
                          <div className="text-orange-600 font-semibold">Rs. {order.total}.00</div>
                        </div>
                        <div className="mt-1 text-xs text-gray-600 flex gap-4">
                          <div>
                            Portion: <span className="text-gray-800 font-medium">{order.selectedPortion || '—'}</span>
                          </div>
                          <div>
                            Add-on: <span className="text-gray-800 font-medium">{order.selectedAddOn || 'None'}</span>
                          </div>
                        </div>
                        <div className="mt-2 flex justify-end">
                          {(() => {
                            const created = new Date(order.createdAt).getTime();
                            const now = Date.now();
                            const tenMin = 10 * 60 * 1000;
                            const canCancel = now - created < tenMin;
                            return (
                              <button
                                disabled={!canCancel || isCancelling}
                                onClick={async () => {
                                  try {
                                    await cancelOrder({ orderId: order._id, userId }).unwrap();
                                    await refetch();
                                  } catch (e) {
                                    console.error('Cancel failed', e);
                                  }
                                }}
                                className={`px-3 py-1.5 rounded-md border text-xs font-medium transition ${
                                  canCancel && !isCancelling
                                    ? 'border-red-500 text-red-600 hover:bg-red-50'
                                    : 'border-gray-300 text-gray-400 cursor-not-allowed'
                                }`}
                              >
                                {isCancelling ? 'Cancelling…' : canCancel ? 'Cancel' : 'Cancel disabled'}
                              </button>
                            );
                          })()}
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}
      </section>
    </div>
  );
};

export default OrdersPage;
