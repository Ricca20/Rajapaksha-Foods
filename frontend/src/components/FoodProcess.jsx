import { motion } from "framer-motion";

export default function FoodProcess() {
  return (
    <section className="relative w-full min-h-screen overflow-hidden">
      <div className="relative z-10 max-w-7xl mx-auto px-6 py-24">
        {/* Stats */}
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.4 }} viewport={{ once: true }} className="mt-20 grid md:grid-cols-3 gap-8 bg-white rounded-2xl p-8 shadow-2xl border border-gray-100">
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
