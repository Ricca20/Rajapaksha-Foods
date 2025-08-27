import { Utensils, Truck, Smartphone } from "lucide-react"

const features = [
  {
    icon: <Utensils className="w-12 h-12 text-red-500" />,
    title: "Delicious Food",
    desc: "Handpicked meals prepared with love and hygiene."
  },
  {
    icon: <Truck className="w-12 h-12 text-red-500" />,
    title: "Fast Delivery",
    desc: "Hot and fresh food delivered to your doorstep in minutes."
  },
  {
    icon: <Smartphone className="w-12 h-12 text-red-500" />,
    title: "Easy Ordering",
    desc: "Order from anywhere with our modern, simple web app."
  },
]

export default function Features() {
  return (
    <section className="relative bg-gradient-to-b from-red-50 via-white to-red-50 py-24 px-6">
      <div className="max-w-7xl mx-auto text-center">
        {/* Heading */}
        <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900">
          Why Choose <span className="text-red-500">Rajapaksha Foods?</span>
        </h2>
        <p className="mt-6 text-lg text-gray-600 max-w-2xl mx-auto">
          We make your meal simple, fast, and enjoyable — with taste and trust in every bite.
        </p>
        
        {/* Features Grid */}
        <div className="mt-16 grid md:grid-cols-3 gap-10">
          {features.map((f, i) => (
            <div
              key={i}
              className="group relative bg-white/70 backdrop-blur-lg rounded-3xl p-10 shadow-lg border border-gray-100 
                         hover:scale-105 hover:shadow-2xl hover:border-red-300 transition-all duration-300"
            >
              {/* Glow effect */}
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-tr from-red-100 to-transparent opacity-0 
                              group-hover:opacity-100 blur-2xl transition duration-500"></div>
              
              {/* Content */}
              <div className="relative z-10 flex flex-col items-center">
                <div className="mb-6 flex items-center justify-center w-20 h-20 rounded-full bg-red-50 group-hover:bg-red-100 transition">
                  {f.icon}
                </div>
                <h3 className="text-2xl font-semibold text-gray-800 group-hover:text-red-500 transition">
                  {f.title}
                </h3>
                <p className="mt-3 text-gray-600 leading-relaxed">{f.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
