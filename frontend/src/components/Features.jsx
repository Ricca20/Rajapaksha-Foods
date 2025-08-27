import { Utensils, Truck, Smartphone } from "lucide-react";
import { motion } from "framer-motion";

const features = [
  {
    icon: <Utensils className="w-12 h-12 text-orange-500" />,
    title: "Delicious Food",
    desc: "Authentic Sri Lankan dishes prepared fresh with love and hygiene."
  },
  {
    icon: <Truck className="w-12 h-12 text-orange-500" />,
    title: "Fast Delivery",
    desc: "Hot and fresh meals delivered within 30–45 minutes around Malabe."
  },
  {
    icon: <Smartphone className="w-12 h-12 text-orange-500" />,
    title: "Easy Ordering",
    desc: "Seamless ordering from our modern web app with just a few clicks."
  },
];

export default function Features() {
  return (
    <section className="relative bg-white via-white to-gray-100 py-24 px-6">
      <div className="max-w-7xl mx-auto text-center">
        {/* Heading */}
        <motion.h2
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-4xl md:text-5xl font-extrabold text-gray-900"
        >
          Why Choose{" "}
          <span className="text-orange-500">Rajapaksha Foods?</span>
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2 }}
          viewport={{ once: true }}
          className="mt-6 text-lg text-gray-600 max-w-2xl mx-auto"
        >
          We make your meal simple, fast, and enjoyable — with taste and trust in every bite.
        </motion.p>

        {/* Features Grid */}
        <div className="mt-16 grid md:grid-cols-3 gap-10">
          {features.map((f, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: i * 0.2 }}
              viewport={{ once: true }}
              className="group relative bg-white rounded-3xl p-10 shadow-lg border border-gray-100
                         hover:scale-105 hover:shadow-2xl hover:border-orange-300 transition-all duration-300"
            >
              {/* Glow effect */}
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-tr from-orange-100 to-transparent opacity-0 
                              group-hover:opacity-100 blur-2xl transition duration-500"></div>

              {/* Content */}
              <div className="relative z-10 flex flex-col items-center">
                <div className="mb-6 flex items-center justify-center w-20 h-20 rounded-full bg-gray-100 group-hover:bg-orange-50 transition">
                  {f.icon}
                </div>
                <h3 className="text-2xl font-semibold text-gray-900 group-hover:text-orange-500 transition">
                  {f.title}
                </h3>
                <p className="mt-3 text-gray-600 leading-relaxed text-center">{f.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Stats Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
          className="mt-24 grid md:grid-cols-3 gap-8 bg-white rounded-2xl p-10 shadow-2xl border border-gray-100"
        >
          <div className="text-center">
            <div className="text-3xl md:text-4xl font-bold text-orange-500 mb-2">95%</div>
            <p className="text-gray-600">Customer Satisfaction</p>
          </div>
          <div className="text-center">
            <div className="text-3xl md:text-4xl font-bold text-orange-500 mb-2">30-45min</div>
            <p className="text-gray-600">Average Delivery Time</p>
          </div>
          <div className="text-center">
            <div className="text-3xl md:text-4xl font-bold text-orange-500 mb-2">100+</div>
            <p className="text-gray-600">Happy Customers Daily</p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
