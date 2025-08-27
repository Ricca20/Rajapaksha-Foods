import { ChefHat, Package, Truck, CheckCircle, Clock, Leaf } from "lucide-react";
import { motion } from "framer-motion";

export default function FoodProcess() {
  const processSteps = [
    {
      icon: ChefHat,
      title: "Prepare",
      description: "Our expert chefs use fresh, locally-sourced ingredients to create authentic Sri Lankan flavors with meticulous care",
      time: "15-20 mins",
      features: ["Fresh ingredients", "Expert chefs", "Traditional recipes"],
      color: "from-orange-500 to-amber-500"
    },
    {
      icon: Package,
      title: "Packing",
      description: "We use eco-friendly, insulated packaging to maintain perfect temperature and ensure your food arrives fresh and hot",
      time: "5 mins",
      features: ["Eco-friendly materials", "Heat insulation", "Secure sealing"],
      color: "from-emerald-500 to-green-500"
    },
    {
      icon: Truck,
      title: "Deliver",
      description: "Our dedicated delivery team ensures quick and reliable service, bringing delicious meals to your doorstep promptly",
      time: "25-30 mins",
      features: ["Fast delivery", "Live tracking", "Contactless service"],
      color: "from-blue-500 to-cyan-500"
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2 }
    }
  };

  const itemVariants = {
    hidden: { y: 50, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.6, ease: "easeOut" } }
  };

  const iconVariants = {
    hidden: { scale: 0, rotate: -180 },
    visible: { scale: 1, rotate: 0, transition: { type: "spring", stiffness: 200, damping: 15, duration: 0.8 } },
    hover: { scale: 1.1, rotate: 5, transition: { duration: 0.3 } }
  };

  return (
    <section className="relative w-full min-h-screen overflow-hidden">
      {/* Full page attractive background */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50"></div>
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-purple-200 rounded-full blur-3xl opacity-30 animate-pulse"></div>
      <div className="absolute top-40 -right-32 w-96 h-96 bg-pink-200 rounded-full blur-3xl opacity-30 animate-pulse"></div>
      <div className="absolute -bottom-32 left-1/3 w-96 h-96 bg-yellow-200 rounded-full blur-3xl opacity-30 animate-pulse"></div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-24">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -30 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} viewport={{ once: true }} className="text-center mb-20">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Our Seamless{" "}
            <span className="bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">
              Food Process
            </span>
          </h2>
          <p className="text-gray-700 text-lg max-w-2xl mx-auto">
            From our kitchen to your doorstep — experience the journey of your meal with quality and care at every step
          </p>
        </motion.div>

        {/* Process steps */}
        <motion.div className="grid md:grid-cols-3 gap-12 lg:gap-16 relative" variants={containerVariants} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }}>
          {/* Connecting line */}
          <div className="hidden md:block absolute top-20 left-1/6 right-1/6 h-0.5 bg-gradient-to-r from-purple-400 via-pink-400 to-orange-400 opacity-30"></div>

          {processSteps.map((step, index) => (
            <motion.div key={index} className="relative group" variants={itemVariants}>
              {/* Step number */}
              <div className="absolute -top-4 -left-4 w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full flex items-center justify-center text-sm font-bold shadow-lg">
                {index + 1}
              </div>

              {/* Card */}
              <div className="bg-white rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 border border-gray-100 group-hover:border-purple-200 h-full">
                <motion.div className={`w-24 h-24 bg-gradient-to-r ${step.color} rounded-2xl mx-auto mb-6 flex items-center justify-center text-white shadow-lg`} variants={iconVariants} whileHover="hover">
                  <step.icon className="w-10 h-10" />
                </motion.div>

                <h3 className="text-2xl font-bold text-gray-900 mb-4">{step.title}</h3>
                <p className="text-gray-700 mb-6 leading-relaxed">{step.description}</p>

                <div className="flex items-center justify-center mb-6">
                  <Clock className="w-5 h-5 text-gray-400 mr-2" />
                  <span className="text-sm font-medium text-gray-500">{step.time}</span>
                </div>

                <div className="space-y-3">
                  {step.features.map((feature, featureIndex) => (
                    <div key={featureIndex} className="flex items-center">
                      <CheckCircle className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                      <span className="text-gray-700 text-sm font-medium">{feature}</span>
                    </div>
                  ))}
                </div>

                {index === 1 && (
                  <div className="mt-6 flex items-center justify-center bg-green-50 rounded-lg py-2 px-4">
                    <Leaf className="w-5 h-5 text-green-600 mr-2" />
                    <span className="text-green-700 text-sm font-medium">Environment Friendly</span>
                  </div>
                )}
              </div>

              <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-purple-500 to-transparent opacity-0 group-hover:opacity-5 transition-opacity duration-300 -z-10"></div>
            </motion.div>
          ))}
        </motion.div>

        {/* Stats */}
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.4 }} viewport={{ once: true }} className="mt-20 grid md:grid-cols-3 gap-8 bg-white rounded-2xl p-8 shadow-2xl border border-gray-100">
          <div className="text-center">
            <div className="text-3xl md:text-4xl font-bold text-purple-500 mb-2">95%</div>
            <p className="text-gray-600">Customer Satisfaction</p>
          </div>
          <div className="text-center">
            <div className="text-3xl md:text-4xl font-bold text-pink-500 mb-2">30-45min</div>
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
