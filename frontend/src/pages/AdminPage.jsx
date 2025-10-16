import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ShoppingBag, Package, ClipboardList, Star, Users, Menu, X, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import OrdersToday from './OrdersToday';
import AllOrders from './AllOrders';
import InventoryPage from './InventoryPage';
import AdminReviewsPage from './AdminReviewsPage';
import EmployeesPage from './EmployeesPage';

const AdminPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('today-orders');
  const [hoveredSection, setHoveredSection] = useState(null);
  const [isHovered, setIsHovered] = useState(false);

  const menuItems = [
    {
      id: 'today-orders',
      title: "Today's Orders",
      icon: ShoppingBag,
      bgColor: 'bg-orange-100',
      iconColor: 'text-orange-500',
      hoverColor: 'hover:bg-orange-50',
      activeColor: 'bg-orange-50 border-l-4 border-orange-500',
      component: OrdersToday
    },
    {
      id: 'all-orders',
      title: 'All Orders',
      icon: Package,
      bgColor: 'bg-blue-100',
      iconColor: 'text-blue-500',
      hoverColor: 'hover:bg-blue-50',
      activeColor: 'bg-blue-50 border-l-4 border-blue-500',
      component: AllOrders
    },
    {
      id: 'inventory',
      title: 'Inventory',
      icon: ClipboardList,
      bgColor: 'bg-green-100',
      iconColor: 'text-green-500',
      hoverColor: 'hover:bg-green-50',
      activeColor: 'bg-green-50 border-l-4 border-green-500',
      component: InventoryPage
    },
    {
      id: 'reviews',
      title: 'Reviews',
      icon: Star,
      bgColor: 'bg-yellow-100',
      iconColor: 'text-yellow-500',
      hoverColor: 'hover:bg-yellow-50',
      activeColor: 'bg-yellow-50 border-l-4 border-yellow-500',
      component: AdminReviewsPage
    },
    {
      id: 'employees',
      title: 'Employees',
      icon: Users,
      bgColor: 'bg-purple-100',
      iconColor: 'text-purple-500',
      hoverColor: 'hover:bg-purple-50',
      activeColor: 'bg-purple-50 border-l-4 border-purple-500',
      component: EmployeesPage
    }
  ];

  const activeItem = menuItems.find(item => item.id === activeSection);
  const displaySection = hoveredSection || activeSection;
  const displayItem = menuItems.find(item => item.id === displaySection);
  const ActiveComponent = displayItem?.component;

  return (
    <div >
      {/* Mobile Menu Button */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="lg:hidden fixed top-20 left-4 z-50 p-2 bg-white rounded-lg shadow-lg hover:bg-gray-50 transition-colors"
      >
        {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      {/* Sidebar */}
      <aside
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className={`fixed top-0 left-0 h-screen bg-white transition-all duration-300 ease-in-out z-40 overflow-visible ${
          sidebarOpen ? 'translate-x-0 w-64' : '-translate-x-full lg:translate-x-0'
        } ${isHovered ? 'lg:w-64 lg:shadow-lg lg:border-r lg:border-gray-200' : 'lg:w-auto'}`}
        style={{ top: '64px' }}
      >
        <div className="p-2 pt-6 h-full overflow-y-auto">
          {/* Header - Only shown when hovered */}
          {isHovered && (
            <div className="mb-6 px-2 animate-fadeIn">
              <h2 className="text-xl font-bold text-gray-900 mb-1 whitespace-nowrap">
                Admin Panel
              </h2>
              <p className="text-sm text-gray-500 whitespace-nowrap">
                Manage your dashboard
              </p>
            </div>
          )}
          
          {/* Navigation */}
          <nav className="space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeSection === item.id;
              
              return (
                <div key={item.id} className="relative">
                  <button
                    onMouseEnter={() => setHoveredSection(item.id)}
                    onMouseLeave={() => setHoveredSection(null)}
                    onClick={() => {
                      setActiveSection(item.id);
                      setSidebarOpen(false);
                    }}
                    className={`flex items-center gap-3 p-3 rounded-lg transition-all duration-200 ${
                      isHovered ? 'w-full' : 'lg:w-auto'
                    } ${
                      isActive
                        ? 'bg-gray-100 font-semibold shadow-sm'
                        : 'text-gray-700 hover:bg-gray-50 hover:shadow-sm'
                    }`}
                    title={!isHovered ? item.title : ''}
                  >
                    <div className={`w-10 h-10 ${isActive ? item.bgColor : 'bg-gray-100'} rounded-lg flex items-center justify-center flex-shrink-0 transition-all duration-200`}>
                      <Icon className={`w-5 h-5 ${isActive ? item.iconColor : 'text-gray-500'} transition-colors`} />
                    </div>
                    {isHovered && (
                      <>
                        <span className="flex-1 text-left text-sm whitespace-nowrap animate-fadeIn">
                          {item.title}
                        </span>
                        {isActive && (
                          <ChevronRight className="w-4 h-4 text-gray-400 animate-fadeIn" />
                        )}
                      </>
                    )}
                  </button>
                </div>
              );
            })}
          </nav>
        </div>
      </aside>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-30"
        />
      )}

      {/* Main Content */}
      <div 
        className={`flex-1 min-w-0 transition-all duration-300 ease-in-out ${
          isHovered ? 'lg:ml-64' : 'lg:ml-16'
        }`}
        style={{ marginTop: '64px' }}
      >
        <div className="h-full p-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={displaySection}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="h-full"
            >
              {ActiveComponent && <ActiveComponent />}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default AdminPage;