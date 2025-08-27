import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useState, useEffect } from "react";
import school1 from "../assets/school1.jpeg";
import school2 from "../assets/school2.jpg";
import school3 from "../assets/school3.jpg";

const slides = [
  {
    src: school1,
    alt: "Students receiving meals in school 1",
    caption: "Happy students enjoying nutritious meals",
    badge: "Healthy Meals",
  },
  {
    src: school2,
    alt: "Students receiving meals in school 2",
    caption: "Supporting primary school nutrition programs",
    badge: "Nutrition Support",
  },
  {
    src: school3,
    alt: "Students receiving meals in school 3",
    caption: "In collaboration with Ministry of Health, Sri Lanka",
    badge: "Ministry Approved",
  },
];

export default function NutritionProgram() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // Auto-slide every 5 seconds
  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [isPaused]);

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % slides.length);
  const prevSlide = () =>
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);

  return (
    <section className="relative w-full py-28 bg-white overflow-hidden">
      {/* Floating accents for visual depth */}
      <motion.div
        className="absolute top-10 left-10 w-28 h-28 bg-orange-200 rounded-full blur-3xl opacity-30"
        animate={{ y: [0, 20, 0] }}
        transition={{ repeat: Infinity, duration: 6 }}
      />
      <motion.div
        className="absolute bottom-10 right-10 w-32 h-32 bg-gray-200 rounded-full blur-3xl opacity-30"
        animate={{ y: [0, -20, 0] }}
        transition={{ repeat: Infinity, duration: 5 }}
      />

      <div
        className="relative max-w-7xl mx-auto px-6 z-10"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900">
            Our Collaboration With{" "}
            <span className="text-orange-500">MOE</span>
          </h2>
          <p className="text-gray-600 mt-4 text-lg max-w-2xl mx-auto">
            Witness our journey in supporting primary school nutrition programs,
            providing healthy meals to children across Malabe area.
          </p>
        </motion.div>

        {/* Slider */}
        <div className="relative flex items-center justify-center">
          {/* Previous button */}
          <button
            onClick={prevSlide}
            className="absolute left-0 md:left-6 z-20 p-3 bg-white rounded-full shadow-lg hover:shadow-xl transition transform hover:scale-105"
          >
            <ArrowLeft className="w-6 h-6 text-gray-700" />
          </button>

          {/* Slide */}
          <div className="w-full md:w-3/4">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentSlide}
                initial={{ opacity: 0, x: 100, scale: 0.95 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: -100, scale: 0.95 }}
                transition={{ duration: 0.7, ease: "easeInOut" }}
                className="relative bg-white rounded-3xl overflow-hidden shadow-2xl hover:shadow-3xl"
              >
                <motion.img
                  src={slides[currentSlide].src}
                  alt={slides[currentSlide].alt}
                  className="w-full h-80 md:h-96 object-cover transform transition duration-500 hover:scale-105"
                  initial={{ scale: 1.05 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 1 }}
                />

                {/* Caption overlay */}
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                  className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-gray-900/70 to-transparent p-6"
                >
                  <motion.span
                    className="inline-block bg-orange-500 text-white px-3 py-1 rounded-full text-xs font-semibold mb-2 shadow-md"
                    whileHover={{ scale: 1.1 }}
                  >
                    {slides[currentSlide].badge}
                  </motion.span>
                  <p className="text-white font-semibold text-lg md:text-xl drop-shadow-md">
                    {slides[currentSlide].caption}
                  </p>
                </motion.div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Next button */}
          <button
            onClick={nextSlide}
            className="absolute right-0 md:right-6 z-20 p-3 bg-white rounded-full shadow-lg hover:shadow-xl transition transform hover:scale-105"
          >
            <ArrowRight className="w-6 h-6 text-gray-700" />
          </button>
        </div>

        {/* Dots */}
        <div className="flex justify-center mt-8 space-x-3">
          {slides.map((_, index) => (
            <motion.div
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-3 h-3 rounded-full cursor-pointer transition ${
                currentSlide === index
                  ? "bg-orange-500 shadow-md shadow-orange-300 scale-110"
                  : "bg-gray-300"
              }`}
              whileHover={{ scale: 1.3 }}
              transition={{ duration: 0.3 }}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
