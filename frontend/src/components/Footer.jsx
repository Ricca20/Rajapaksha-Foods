export default function Footer() {
    return (
      <footer className="bg-[#E5E7EB] px-6 py-12 mt-16 w-full">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            {/* Brand Section */}
            <div className="md:col-span-1">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-[#F97316] rounded flex items-center justify-center">
                  <span className="text-white font-bold text-sm">R</span>
                </div>
                <span className="font-bold text-gray-900">Rajapaksha Foods</span>
              </div>
              <p className="text-gray-600 text-sm max-w-xs">
                Delivering delicious meals to SLIIT students with love and care since 2023.
              </p>
            </div>
  
            {/* Menu Links */}
            <div className="md:col-span-1">
              <h4 className="font-semibold text-gray-900 mb-4">Menu</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li><a href="#" className="hover:text-[#F97316] transition-colors">About</a></li>
                <li><a href="#" className="hover:text-[#F97316] transition-colors">Menu</a></li>
                <li><a href="#" className="hover:text-[#F97316] transition-colors">Event</a></li>
                <li><a href="#" className="hover:text-[#F97316] transition-colors">Offer</a></li>
              </ul>
            </div>
  
            {/* Information Links */}
            <div className="md:col-span-1">
              <h4 className="font-semibold text-gray-900 mb-4">Information</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li><a href="#" className="hover:text-[#F97316] transition-colors">Contact</a></li>
                <li><a href="#" className="hover:text-[#F97316] transition-colors">Order & Returns</a></li>
                <li><a href="#" className="hover:text-[#F97316] transition-colors">Videos</a></li>
                <li><a href="#" className="hover:text-[#F97316] transition-colors">Reservation</a></li>
              </ul>
            </div>
  
            {/* Address Section */}
            <div className="md:col-span-1">
              <h4 className="font-semibold text-gray-900 mb-4">Address</h4>
              <div className="text-sm text-gray-600 space-y-2">
                <p>SLIIT Malabe Campus,<br />New Kandy Rd, Malabe</p>
                <p>9:00 AM - 10:00 PM</p>
              </div>
            </div>
          </div>
  
          {/* Social Icons */}
          <div className="flex justify-center gap-4 mb-6">
            {['', '', '', ''].map((icon, index) => (
              <div key={index} className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm hover:shadow-md transition-shadow cursor-pointer hover:bg-[#F97316] hover:text-white">
                {icon}
              </div>
            ))}
          </div>
  
          {/* Copyright */}
          <div className="text-center text-sm text-gray-600 border-t border-gray-300 pt-6">
            Copyright © 2024 Rajapaksha Foods | All rights reserved
          </div>
        </div>
      </footer>
    );
  }