import { motion, AnimatePresence } from "framer-motion";
import { Star } from "lucide-react";
import { useState, useEffect } from "react";

// Example reviews (replace with dynamic data if needed)
const reviews = [
  {
    name: "Dilsara Kumarasinghe",
    rating: 3,
    comment: "Ko meke chicken nane"
  },
  {
    name: "Pasan thedasra",
    rating: 2,
    comment: "uncle dan nm aula,kama set wenne na"
  },
  {
    name: "Bobi Vimukthi",
    rating: 1,
    comment: "Luck eka thama hodama"
  },
  {
    name: "Ricky perera",
    rating: 5,
    comment: "Uncle mage ekah bn.Adarei!!!"
  },
  {
    name: "Nethal fernando",
    rating: 3,
    comment: "Ko uncle meke cutlets "
  },
];

export default function CustomerReviews() {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Auto-slide every 6 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % reviews.length);
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  const nextReview = () => {
    setCurrentIndex((prev) => (prev + 1) % reviews.length);
  };

  const prevReview = () => {
    setCurrentIndex((prev) => (prev - 1 + reviews.length) % reviews.length);
  };

  return (
    <section className="relative py-24 px-6 bg-gradient-to-r from-orange-50 via-white to-pink-50 overflow-hidden">
      {/* Decorative blobs */}
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-purple-200 rounded-full blur-3xl opacity-30 animate-pulse"></div>
      <div className="absolute bottom-20 -right-32 w-96 h-96 bg-pink-200 rounded-full blur-3xl opacity-30 animate-pulse"></div>

      <div className="relative max-w-7xl mx-auto z-10 text-center">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900">
            What Our <span className="text-orange-500">Customers Say</span>
          </h2>
          <p className="text-gray-700 mt-4 text-lg max-w-2xl mx-auto">
            Real feedback from students, families, and local customers around Malabe area.
          </p>
        </motion.div>

        <div className="relative flex items-center justify-center">
          {/* Previous Button */}
          <button
            onClick={prevReview}
            className="absolute left-0 md:left-4 z-20 p-3 bg-white rounded-full shadow-lg hover:shadow-xl transition"
          >
            &#8592;
          </button>

          {/* Review Card */}
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ duration: 0.6 }}
              className="w-full md:w-3/4 bg-white rounded-2xl shadow-2xl p-8 relative"
            >
              {/* Rating stars */}
              <div className="flex justify-center mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-6 h-6 ${
                      i < reviews[currentIndex].rating
                        ? "text-yellow-400"
                        : "text-gray-300"
                    }`}
                  />
                ))}
              </div>

              {/* Comment */}
              <p className="text-gray-700 text-lg italic mb-6">
                "{reviews[currentIndex].comment}"
              </p>

              {/* User name */}
              <h3 className="text-gray-900 font-bold text-xl">
                - {reviews[currentIndex].name}
              </h3>
            </motion.div>
          </AnimatePresence>

          {/* Next Button */}
          <button
            onClick={nextReview}
            className="absolute right-0 md:right-4 z-20 p-3 bg-white rounded-full shadow-lg hover:shadow-xl transition"
          >
            &#8594;
          </button>
        </div>

        {/* Dots */}
        <div className="flex justify-center mt-6 space-x-3">
          {reviews.map((_, index) => (
            <motion.div
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-3 h-3 rounded-full cursor-pointer ${
                currentIndex === index ? "bg-orange-500" : "bg-gray-300"
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
