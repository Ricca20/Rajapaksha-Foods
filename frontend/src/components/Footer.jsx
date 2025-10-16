import { Facebook, Twitter, Instagram, Youtube } from 'lucide-react';

export default function Footer() {
    return (
      <footer className="bg-gray-100 px-6 py-12 mt-16 w-full">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
            {/* Brand Section */}
            <div className="md:col-span-1">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-base">R</span>
                </div>
                <span className="font-bold text-gray-900 text-lg">Rajapaksha Foods</span>
              </div>
              <p className="text-gray-600 text-sm leading-relaxed max-w-xs">
                Delivering delicious meals with love and care since 2023.
              </p>
            </div>
  
            {/* Menu Links */}
            <div className="md:col-span-1">
              <h4 className="font-bold text-gray-900 mb-4 text-base">Menu</h4>
              <ul className="space-y-3 text-sm text-gray-600">
                <li><a href="#" className="hover:text-orange-500 transition-colors">About</a></li>
                <li><a href="#" className="hover:text-orange-500 transition-colors">Menu</a></li>
                <li><a href="#" className="hover:text-orange-500 transition-colors">Event</a></li>
                <li><a href="#" className="hover:text-orange-500 transition-colors">Offer</a></li>
              </ul>
            </div>
  
            {/* Information Links */}
            <div className="md:col-span-1">
              <h4 className="font-bold text-gray-900 mb-4 text-base">Information</h4>
              <ul className="space-y-3 text-sm text-gray-600">
                <li><a href="#" className="hover:text-orange-500 transition-colors">Contact</a></li>
                <li><a href="#" className="hover:text-orange-500 transition-colors">Order & Returns</a></li>
                <li><a href="#" className="hover:text-orange-500 transition-colors">Videos</a></li>
                <li><a href="#" className="hover:text-orange-500 transition-colors">Reservation</a></li>
              </ul>
            </div>
  
            {/* Address Section */}
            <div className="md:col-span-1">
              <h4 className="font-bold text-gray-900 mb-4 text-base">Address</h4>
              <div className="text-sm text-gray-600 space-y-3 leading-relaxed">
                <p>SLIIT Malabe Campus,<br />New Kandy Rd, Malabe</p>
                <p className="font-medium">9:00 AM - 10:00 PM</p>
              </div>
            </div>
          </div>
  
          {/* Social Icons */}
          <div className="flex justify-center gap-4 mb-8">
            <a href="#" className="w-11 h-11 bg-white rounded-full flex items-center justify-center shadow-sm hover:shadow-lg transition-all cursor-pointer hover:bg-orange-500 hover:text-white hover:-translate-y-1 text-gray-700">
              <Facebook size={20} />
            </a>
            <a href="#" className="w-11 h-11 bg-white rounded-full flex items-center justify-center shadow-sm hover:shadow-lg transition-all cursor-pointer hover:bg-orange-500 hover:text-white hover:-translate-y-1 text-gray-700">
              <Twitter size={20} />
            </a>
            <a href="#" className="w-11 h-11 bg-white rounded-full flex items-center justify-center shadow-sm hover:shadow-lg transition-all cursor-pointer hover:bg-orange-500 hover:text-white hover:-translate-y-1 text-gray-700">
              <Instagram size={20} />
            </a>
            <a href="#" className="w-11 h-11 bg-white rounded-full flex items-center justify-center shadow-sm hover:shadow-lg transition-all cursor-pointer hover:bg-orange-500 hover:text-white hover:-translate-y-1 text-gray-700">
              <Youtube size={20} />
            </a>
          </div>
  
          {/* Copyright */}
          <div className="text-center text-sm text-gray-600 border-t border-gray-200 pt-8">
            <p className="font-medium">Copyright © 2024 Rajapaksha Foods | All rights reserved</p>
          </div>
        </div>
      </footer>
    );
  }