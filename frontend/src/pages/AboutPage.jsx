import { motion } from "framer-motion";
import { Users, Heart, Award, Target, Clock, Shield } from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import logo from "../assets/logo2.png";

export default function AboutPage() {
  const values = [
    {
      icon: <Heart className="w-10 h-10 text-orange-500" />,
      title: "Passion for Food",
      desc: "Every dish is prepared with love and dedication to authentic Sri Lankan flavors."
    },
    {
      icon: <Award className="w-10 h-10 text-orange-500" />,
      title: "Quality First",
      desc: "We use only the finest ingredients to ensure every meal meets our high standards."
    },
    {
      icon: <Users className="w-10 h-10 text-orange-500" />,
      title: "Customer Focus",
      desc: "Your satisfaction is our priority. We listen, adapt, and deliver excellence."
    },
    {
      icon: <Clock className="w-10 h-10 text-orange-500" />,
      title: "Timely Delivery",
      desc: "Fresh food delivered hot to your doorstep within 30-45 minutes."
    },
    {
      icon: <Shield className="w-10 h-10 text-orange-500" />,
      title: "Hygiene & Safety",
      desc: "Prepared in a clean, certified kitchen following strict hygiene protocols."
    },
    {
      icon: <Target className="w-10 h-10 text-orange-500" />,
      title: "Authentic Recipes",
      desc: "Traditional Sri Lankan recipes passed down through generations."
    }
  ];

  const timeline = [
    {
      year: "2020",
      title: "The Beginning",
      desc: "Started with a passion to bring authentic Sri Lankan food to the community."
    },
    {
      year: "2021",
      title: "Growing Together",
      desc: "Expanded our menu and delivery network across Malabe area."
    },
    {
      year: "2023",
      title: "Digital Innovation",
      desc: "Launched our modern web platform for seamless ordering experience."
    },
    {
      year: "2025",
      title: "Today",
      desc: "Serving 100+ happy customers daily with love and dedication."
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative bg-gradient-to-b from-orange-50 to-white pt-28 pb-20">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold leading-tight">
              <span className="text-gray-900">About </span>
              <span className="text-orange-500">Rajapaksha Foods</span>
            </h1>
            <p className="mt-6 text-xl text-gray-600 max-w-3xl mx-auto">
              Bringing the authentic taste of Sri Lanka to your table with passion, quality, and tradition.
            </p>
          </motion.div>
        </div>
        
        {/* Decorative elements */}
        <div className="absolute top-20 left-10 w-32 h-32 bg-orange-100 rounded-full blur-2xl opacity-40 animate-pulse"></div>
        <div className="absolute bottom-10 right-10 w-40 h-40 bg-gray-200 rounded-full blur-3xl opacity-30 animate-pulse"></div>
      </section>

      {/* Our Story Section */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Image */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="w-full h-[500px] bg-gray-100 rounded-3xl shadow-2xl overflow-hidden">
                <img
                  src={logo}
                  alt="Rajapaksha Foods"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -bottom-6 -right-6 w-64 h-64 bg-orange-100 rounded-full blur-3xl opacity-30"></div>
            </motion.div>

            {/* Content */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="space-y-6"
            >
              <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900">
                Our <span className="text-orange-500">Story</span>
              </h2>
              <p className="text-lg text-gray-600 leading-relaxed">
                Rajapaksha Foods was born from a simple idea: to share the rich, authentic flavors of 
                Sri Lankan cuisine with food lovers everywhere. What started as a small kitchen has grown 
                into a trusted name for delicious, traditional rice and curry dishes.
              </p>
              <p className="text-lg text-gray-600 leading-relaxed">
                We believe that great food brings people together. Every meal we prepare is made with 
                the finest ingredients, time-honored recipes, and a whole lot of love. From our family 
                to yours, we're committed to delivering not just food, but an authentic culinary experience.
              </p>
              <p className="text-lg text-gray-600 leading-relaxed">
                Today, we're proud to serve the Malabe community and beyond, bringing fresh, hot meals 
                right to your doorstep. Thank you for being part of our journey!
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Our Values Section */}
      <section className="py-24 px-6 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900">
              Our <span className="text-orange-500">Values</span>
            </h2>
            <p className="mt-6 text-lg text-gray-600 max-w-2xl mx-auto">
              The principles that guide everything we do at Rajapaksha Foods.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {values.map((value, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: i * 0.1 }}
                viewport={{ once: true }}
                className="group bg-white rounded-2xl p-8 shadow-lg border border-gray-100
                           hover:scale-105 hover:shadow-2xl hover:border-orange-300 transition-all duration-300"
              >
                <div className="flex flex-col items-center text-center">
                  <div className="mb-4 flex items-center justify-center w-16 h-16 rounded-full 
                                  bg-orange-50 group-hover:bg-orange-100 transition">
                    {value.icon}
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-orange-500 transition">
                    {value.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {value.desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="py-24 px-6 bg-white">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900">
              Our <span className="text-orange-500">Journey</span>
            </h2>
            <p className="mt-6 text-lg text-gray-600 max-w-2xl mx-auto">
              From humble beginnings to serving hundreds of happy customers every day.
            </p>
          </motion.div>

          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-orange-200"></div>

            {timeline.map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: i % 2 === 0 ? -50 : 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.7, delay: i * 0.2 }}
                viewport={{ once: true }}
                className={`relative flex items-center mb-16 ${
                  i % 2 === 0 ? "flex-row-reverse" : ""
                }`}
              >
                {/* Content */}
                <div className={`w-5/12 ${i % 2 === 0 ? "text-right pr-12" : "pl-12"}`}>
                  <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 
                                  hover:shadow-xl hover:border-orange-300 transition-all">
                    <div className="text-3xl font-bold text-orange-500 mb-2">{item.year}</div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{item.title}</h3>
                    <p className="text-gray-600">{item.desc}</p>
                  </div>
                </div>

                {/* Circle marker */}
                <div className="absolute left-1/2 transform -translate-x-1/2 w-6 h-6 bg-orange-500 
                                rounded-full border-4 border-white shadow-lg z-10"></div>

                {/* Empty space for other side */}
                <div className="w-5/12"></div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 px-6 bg-gradient-to-b from-orange-50 to-white">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="grid md:grid-cols-4 gap-8"
          >
            <div className="text-center p-8 bg-white rounded-2xl shadow-lg">
              <div className="text-4xl md:text-5xl font-bold text-orange-500 mb-2">5+</div>
              <p className="text-gray-600 font-medium">Years of Excellence</p>
            </div>
            <div className="text-center p-8 bg-white rounded-2xl shadow-lg">
              <div className="text-4xl md:text-5xl font-bold text-orange-500 mb-2">100+</div>
              <p className="text-gray-600 font-medium">Daily Orders</p>
            </div>
            <div className="text-center p-8 bg-white rounded-2xl shadow-lg">
              <div className="text-4xl md:text-5xl font-bold text-orange-500 mb-2">95%</div>
              <p className="text-gray-600 font-medium">Customer Satisfaction</p>
            </div>
            <div className="text-center p-8 bg-white rounded-2xl shadow-lg">
              <div className="text-4xl md:text-5xl font-bold text-orange-500 mb-2">30-45</div>
              <p className="text-gray-600 font-medium">Minutes Delivery</p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6 bg-white">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto text-center"
        >
          <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-6">
            Ready to <span className="text-orange-500">Experience</span> the Taste?
          </h2>
          <p className="text-lg text-gray-600 mb-8">
            Join our growing family of food lovers and enjoy authentic Sri Lankan cuisine delivered fresh to your door.
          </p>
          <a href="/menu">
            <button className="px-10 py-4 rounded-xl bg-orange-500 text-white text-lg font-semibold 
                             shadow-lg hover:bg-orange-600 hover:scale-105 transition-all">
              Order Now →
            </button>
          </a>
        </motion.div>
      </section>

      <Footer />
    </div>
  );
}
