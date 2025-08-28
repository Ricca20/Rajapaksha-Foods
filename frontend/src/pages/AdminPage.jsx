import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShoppingBag, Package, ClipboardList, Users } from 'lucide-react';

const AdminPage = () => {
  const navigate = useNavigate();

  return (
    <>
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Admin Dashboard</h1>
        
        {/* Dashboard Tiles */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Today's Orders Tile */}
          <motion.button
            onClick={() => navigate('/admin/orders/today')}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            transition={{ duration: 0.3 }}
            className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all w-full text-left"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                <ShoppingBag className="w-6 h-6 text-orange-500" />
              </div>
              <span className="text-sm font-medium text-gray-400">Today</span>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-1">12</h3>
            <p className="text-sm text-gray-600">Today's Orders</p>
          </motion.button>

          {/* Total Orders Tile */}
          <motion.button
            onClick={() => navigate('/admin/orders')}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            transition={{ duration: 0.3, delay: 0.1 }}
            className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all w-full text-left"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <Package className="w-6 h-6 text-blue-500" />
              </div>
              <span className="text-sm font-medium text-gray-400">Total</span>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-1">1,234</h3>
            <p className="text-sm text-gray-600">Total Orders</p>
          </motion.button>

          {/* Inventory Tile */}
          <motion.button
            onClick={() => navigate('/admin/inventory')}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            transition={{ duration: 0.3, delay: 0.2 }}
            className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all w-full text-left"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <ClipboardList className="w-6 h-6 text-green-500" />
              </div>
              <span className="text-sm font-medium text-gray-400">Stock</span>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-1">15</h3>
            <p className="text-sm text-gray-600">Items in Stock</p>
          </motion.button>

          {/* Employees Tile */}
          <motion.button
            onClick={() => navigate('/admin/employees')}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            transition={{ duration: 0.3, delay: 0.3 }}
            className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all w-full text-left"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                <Users className="w-6 h-6 text-purple-500" />
              </div>
              <span className="text-sm font-medium text-gray-400">Team</span>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-1">8</h3>
            <p className="text-sm text-gray-600">Team Members</p>
          </motion.button>
        </div>
    </>
  );
};

export default AdminPage;
