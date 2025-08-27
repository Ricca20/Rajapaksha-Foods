import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGetMenuQuery } from '../lib/api';

const MenuPage = () => {
  const { data: menu, error, isLoading } = useGetMenuQuery();
  const [selectedAddOn, setSelectedAddOn] = useState(null);
  const [selectedPrice, setSelectedPrice] = useState(null);



  const navigate = useNavigate();



  if (loading) return <div>Loading menu...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!menu) return <div>No menu found.</div>;


  return (

    <div className="max-w-xl mx-auto mt-18 p-6 border border-gray-200 rounded-lg bg-white shadow-xl justify-center">
      <h1 className="text-3xl font-bold text-center mb-6">Today's Menu</h1>
      <ul className="mb-6">
        {menu.menuItems && menu.menuItems.map((item, idx) => (
          <li key={idx} className="mb-4 pb-2 border-b border-gray-300 text-lg font-medium text-center">
            {item}
          </li>
        ))}
      </ul>
      <div className="mb-6">
        <h3 className="text-xl font-semibold mb-2">Choose your portion</h3>
        <form className="mb-2 flex gap-6">
          <label className="flex items-center gap-2">
            <input
              type="radio"
              name="price"
              value="full"
              checked={selectedPrice === 'full'}
              onChange={() => setSelectedPrice('full')}
              className="accent-blue-600"
            />
            <span>Full (Rs. {menu.priceFull}.00)</span>
          </label>
          <label className="flex items-center gap-2">
            <input
              type="radio"
              name="price"
              value="half"
              checked={selectedPrice === 'half'}
              onChange={() => setSelectedPrice('half')}
              className="accent-blue-600"
            />
            <span>Normal (Rs. {menu.priceHalf}.00)</span>
          </label>
        </form>
        {selectedPrice && (
          <div className="text-blue-600 font-semibold mt-4">
            Selected Portion: <span>{selectedPrice === 'full' ? "Full" : "Normal"}</span>
          </div>
        )}
      </div>
      {menu.addOns && (() => {
        const addOnNames = [
          { key: 'isChicken', label: 'Chicken' },
          { key: 'isEgg', label: 'Egg' },
          { key: 'isFish', label: 'Fish' },
          { key: 'isSausage', label: 'Sausage' }
        ];
        const enabledAddOns = addOnNames.filter(a => menu.addOns[a.key]);
        if (enabledAddOns.length === 0) return null;
        return (
          <div className="mt-6">
            <h3 className="text-xl font-semibold mb-2">Add Ons</h3>
            <form className="flex flex-col gap-2">
              {enabledAddOns.map((addOn, idx) => (
                <label key={idx} className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="addOn"
                    value={addOn.key}
                    checked={selectedAddOn === addOn.key}
                    onChange={() => setSelectedAddOn(addOn.key)}
                    className="accent-blue-600"
                  />
                  <span>{addOn.label}</span>
                </label>
              ))}
            </form>
            {selectedAddOn && (
              <div className="mt-2 text-blue-600 font-semibold">
                Selected Add-On: <span>{enabledAddOns.find(a => a.key === selectedAddOn)?.label}</span>
              </div>
            )}
          </div>
        );
      })()}
      <div className="mt-8 text-center">
        <button
          className="px-4 py-2 text-lg bg-blue-600 text-white rounded hover:bg-blue-700 transition"
          onClick={() => {
            const addOnNames = [
              { key: 'isChicken', label: 'Chicken' },
              { key: 'isEgg', label: 'Egg' },
              { key: 'isFish', label: 'Fish' },
              { key: 'isSausage', label: 'Sausage' }
            ];
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
        </button>
      </div>
    </div>
  );
};

export default MenuPage;