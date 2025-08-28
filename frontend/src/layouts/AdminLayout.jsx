import React from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { useAuth } from '@clerk/clerk-react';
import AdminNavbar from '../components/AdminNavbar';

const AdminLayout = () => {
  const { isLoaded, isSignedIn, sessionClaims } = useAuth();
  const isAdmin = sessionClaims?.metadata?.role === 'admin';

  // Handle loading state
  if (!isLoaded) {
    return <div>Loading...</div>;
  }

  // Handle unauthorized access
  if (!isSignedIn || !isAdmin) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <AdminNavbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-24">
        <Outlet />
      </div>
    </div>
  );
};

export default AdminLayout;
