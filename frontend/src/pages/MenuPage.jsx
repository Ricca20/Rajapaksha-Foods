import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Navbar from "../components/Navbar"

const MenuPage = () => {
  const [menu, setMenu] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedAddOn, setSelectedAddOn] = useState(null);
  const [selectedPrice, setSelectedPrice] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    axios.get('http://localhost:5001/api/menu')
      .then((res) => {
        setMenu(res.data.data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="text-center py-24 text-gray-600">Loading menu...</div>;
  if (error) return <div className="text-center py-24 text-red-500">Error: {error}</div>;
  if (!menu) return <div className="text-center py-24 text-gray-600">No menu found.</div>;

  const addOnNames = [
    { key: 'isChicken', label: 'Chicken' },
    { key: 'isEgg', label: 'Egg' },
    { key: 'isFish', label: 'Fish' },
    { key: 'isSausage', label: 'Sausage' }
  ];

  const enabledAddOns = menu.addOns
    ? addOnNames.filter(a => menu.addOns[a.key])
    : [];

  return (
    <section className="relative py-24 px-6 bg-gray-100 min-h-screen">
      <Navbar/>
      <motion.div 
        className="max-w-3xl mx-auto p-8 bg-white rounded-3xl shadow-2xl"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1 className="text-4xl font-extrabold text-gray-900 text-center mb-8">
          Today's Menu
        </h1>

        {/* Menu Items */}
        <ul className="space-y-4 mb-8">
          {menu.menuItems && menu.menuItems.map((item, idx) => (
            <motion.li 
              key={idx}
              className="p-4 bg-gray-100 rounded-xl text-gray-900 font-semibold text-center hover:bg-orange-50 transition"
              whileHover={{ scale: 1.03 }}
            >
              {item}
            </motion.li>
          ))}
        </ul>

        {/* Portion Selection */}
        <div className="mb-6">
          <h3 className="text-2xl font-semibold mb-4 text-gray-900">Choose your portion</h3>
          <form className="flex gap-6 justify-center">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="price"
                value="full"
                checked={selectedPrice === 'full'}
                onChange={() => setSelectedPrice('full')}
                className="accent-orange-500"
              />
              <span className="text-gray-900 font-medium">Full (Rs. {menu.priceFull}.00)</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="price"
                value="half"
                checked={selectedPrice === 'half'}
                onChange={() => setSelectedPrice('half')}
                className="accent-orange-500"
              />
              <span className="text-gray-900 font-medium">Normal (Rs. {menu.priceHalf}.00)</span>
            </label>
          </form>
          {selectedPrice && (
            <div className="text-orange-500 font-semibold mt-4 text-center">
              Selected Portion: <span>{selectedPrice === 'full' ? "Full" : "Normal"}</span>
            </div>
          )}
        </div>

        {/* Add-Ons */}
        {enabledAddOns.length > 0 && (
          <div className="mb-6">
            <h3 className="text-2xl font-semibold mb-4 text-gray-900">Add Ons</h3>
            <form className="flex flex-wrap gap-4 justify-center">
              {enabledAddOns.map((addOn, idx) => (
                <label key={idx} className="flex items-center gap-2 cursor-pointer bg-gray-100 rounded-xl px-4 py-2 hover:bg-orange-50 transition">
                  <input
                    type="radio"
                    name="addOn"
                    value={addOn.key}
                    checked={selectedAddOn === addOn.key}
                    onChange={() => setSelectedAddOn(addOn.key)}
                    className="accent-orange-500"
                  />
                  <span className="text-gray-900 font-medium">{addOn.label}</span>
                </label>
              ))}
            </form>
            {selectedAddOn && (
              <div className="mt-4 text-orange-500 font-semibold text-center">
                Selected Add-On: <span>{enabledAddOns.find(a => a.key === selectedAddOn)?.label}</span>
              </div>
            )}
          </div>
        )}

        {/* Next Button */}
        <div className="mt-8 text-center">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-8 py-4 text-lg font-semibold bg-orange-500 text-white rounded-full shadow-lg hover:shadow-xl transition"
            onClick={() => {
              const selectedAddOnLabel = addOnNames.find(a => a.key === selectedAddOn)?.label || null;
              navigate('/checkout', {
                state: {
                  menuItems: menu.menuItems,
                  selectedPrice: selectedPrice === 'full' ? menu.priceFull : menu.priceHalf,
                  selectedPortion: selectedPrice === 'full' ? 'Full' : 'Normal',
                  selectedAddOn: selectedAddOnLabel
                }
              });
            }}
          >
            Next
          </motion.button>
        </div>
      </motion.div>
    </section>
  );
};

export default MenuPage;
