import { Play } from "lucide-react";
import logo from "../assets/logo.jpeg"; 

export default function HeroSection() {
  return (
    <section className="relative bg-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-12 py-20 grid lg:grid-cols-2 gap-12 items-center">
        
        {/* Left content */}
        <div className="space-y-8 text-center lg:text-left">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight">
            <span className="text-orange-500">Authentic</span>{" "}
            <span className="text-gray-900">Lankan Dishes, Delivered Fresh!</span>
          </h1>

          <p className="text-gray-600 text-lg max-w-md mx-auto lg:mx-0">
            Authentic flavors of Sri Lankan rice and curry, crafted with love and delivered fresh to your door. 
            Quick, delicious, and always true to tradition!
          </p>

          {/* Buttons */}
          <div className="flex flex-wrap justify-center lg:justify-start gap-4 pt-4">
            <button className="px-6 py-3 rounded-xl bg-orange-500 text-white font-semibold shadow-md hover:bg-orange-600 transition-all">
              ORDER NOW →
            </button>
            <button className="px-6 py-3 rounded-xl bg-white text-orange-500 border border-orange-500 font-semibold hover:bg-orange-500 hover:text-white transition-all flex items-center shadow-sm">
              WATCH DEMO <Play className="w-4 h-4 ml-2 fill-current" />
            </button>
          </div>
        </div>

        {/* Right image / decoration */}
        <div className="relative flex justify-center lg:justify-end">
          <div className="w-80 h-80 lg:w-[420px] lg:h-[420px] bg-gray-100 rounded-full shadow-xl overflow-hidden flex items-center justify-center relative">
            <img
              src={logo}
              alt="Sri Lankan Food"
              className="w-full h-full object-cover rounded-full"
            />

            {/* Decorative gradient ring */}
            <div className="absolute -z-10 inset-0 rounded-full bg-gradient-to-tr from-orange-200 via-white to-gray-100 blur-2xl"></div>
          </div>
        </div>
      </div>

      {/* Decorative background shapes */}
      <div className="absolute top-20 left-10 w-32 h-32 bg-orange-100 rounded-full blur-2xl opacity-40 animate-pulse"></div>
      <div className="absolute bottom-10 right-10 w-40 h-40 bg-gray-200 rounded-full blur-3xl opacity-30 animate-pulse"></div>
    </section>
  );
}
