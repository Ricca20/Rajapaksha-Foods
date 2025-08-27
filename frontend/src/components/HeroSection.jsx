import { Play, ArrowRight } from "lucide-react"

export default function HeroSection() {
    return (
        <section className="relative bg-white">
          <div className="max-w-7xl mx-auto px-6 lg:px-12 py-16 grid lg:grid-cols-2 gap-12 items-center">
            {/* Left content */}
            <div className="space-y-6 text-center lg:text-left">
    
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight text-gray-900">
              Authentic{" "}
                <span className="text-[#F97316]"> Lankan Dishes, Delivered Fresh!</span>
              </h1>
    
              <p className="text-gray-600 text-lg max-w-md mx-auto lg:mx-0">
                Authentic flavors of Sri Lankan rice and curry, crafted with love and delivered fresh to your door. Quick, delicious, and always true to tradition!
              </p>
    
              {/* Buttons */}
              <div className="flex flex-wrap justify-center lg:justify-start gap-4 pt-4">
                <button className="px-6 py-3 rounded-lg bg-[#F97316] text-white font-medium hover:bg-[#e5670d] transition-colors shadow-md">
                  ORDER NOW →
                </button>
                <button className="px-6 py-3 rounded-lg bg-white text-[#F97316] border border-[#F97316] font-medium hover:bg-[#F97316] hover:text-white transition-colors flex items-center">
                  WATCH DEMO <Play className="w-4 h-4 ml-2 fill-current" />
                </button>
              </div>
            </div>
    
            {/* Right image / decoration */}
            <div className="relative flex justify-center lg:justify-end">
              <div className="w-72 h-72 lg:w-96 lg:h-96 bg-[#E5E7EB] rounded-full flex items-center justify-center shadow-lg overflow-hidden">
                {/* Image placeholder - replace with actual image */}
                <div className="w-full h-full bg-gradient-to-br from-[#F97316]/20 to-[#F97316]/10 flex items-center justify-center">
                  <span className="text-5xl"></span>
                </div>
              </div>
            </div>
          </div>
        </section>
      );
  }
