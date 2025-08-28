import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserButton } from '@clerk/clerk-react';

const AdminNavbar = () => {
  const navigate = useNavigate();

  return (
    <nav className="fixed top-0 left-0 right-0 bg-white shadow-md z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link to="/admin" className="text-xl font-bold text-orange-500">
              Admin Dashboard
            </Link>
          </div>

          <div className="flex space-x-6">
            <Link
              to="/admin/orders/today"
              className="text-gray-600 hover:text-orange-500 px-3 py-2 rounded-md text-sm font-medium"
            >
              Today's Orders
            </Link>
            <Link
              to="/admin/orders"
              className="text-gray-600 hover:text-orange-500 px-3 py-2 rounded-md text-sm font-medium"
            >
              All Orders
            </Link>
            <Link
              to="/admin/inventory"
              className="text-gray-600 hover:text-orange-500 px-3 py-2 rounded-md text-sm font-medium"
            >
              Inventory
            </Link>
            <Link
              to="/admin/employees"
              className="text-gray-600 hover:text-orange-500 px-3 py-2 rounded-md text-sm font-medium"
            >
              Employees
            </Link>
            <Link
              to="/"
              className="text-gray-600 hover:text-orange-500 px-3 py-2 rounded-md text-sm font-medium"
            >
              View Site
            </Link>
          </div>

          <div className="flex items-center">
            <UserButton afterSignOutUrl="/" />
          </div>
        </div>
      </div>
    </nav>
  );
};

export default AdminNavbar;
