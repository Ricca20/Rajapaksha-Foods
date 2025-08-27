import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";

export default function TopCategories() {
  const [isPaused, setIsPaused] = useState(false);
  const [position, setPosition] = useState(0);
  const containerRef = useRef(null);

  const categories = [
    { id: 1, name: "Fast Food" },
    { id: 2, name: "Salad" },
    { id: 3, name: "Beverages" },
    { id: 4, name: "Asian" },
    { id: 5, name: "Desserts" },
    { id: 6, name: "Breakfast" },
    { id: 7, name: "Seafood" },
    { id: 8, name: "Vegetarian" },
  ];

  // Auto-scroll animation
  useEffect(() => {
    if (isPaused) return;

    const scrollStep = 1; // px per tick
    const interval = setInterval(() => {
      setPosition((prev) => {
        if (!containerRef.current) return prev;
        const containerWidth = containerRef.current.scrollWidth / 2; // one half (since we duplicate twice)
        return prev >= containerWidth ? 0 : prev + scrollStep;
      });
    }, 20);

    return () => clearInterval(interval);
  }, [isPaused]);

  // Hover & animation variants
  const cardVariants = {
    rest: {
      y: 0,
      scale: 1,
      background: "rgba(255,255,255,0.1)",
      backdropFilter: "blur(12px)",
      border: "1px solid rgba(255,255,255,0.15)",
      transition: { duration: 0.4, ease: "easeOut" },
    },
    hover: {
      y: -10,
      scale: 1.05,
      background: "linear-gradient(135deg, #F97316, #fb923c)",
      border: "1px solid rgba(249,115,22,0.4)",
      boxShadow: "0 12px 30px rgba(249,115,22,0.3)",
      transition: { duration: 0.3, ease: "easeOut" },
    },
  };

  const circleVariants = {
    rest: { scale: 1, backgroundColor: "rgba(255,255,255,0.15)" },
    hover: { scale: 1.2, backgroundColor: "#fff" },
  };

  const textVariants = {
    rest: { color: "#111827" },
    hover: { color: "#fff" },
  };

  return (
    <section className="px-6 py-20 max-w-7xl mx-auto overflow-hidden relative">
      {/* Header */}
      <motion.h2
        className="text-5xl font-extrabold text-center text-gray-900 mb-14 tracking-tight"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        Explore Top Categories
      </motion.h2>

      {/* Gradient Background Glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/3 w-[500px] h-[500px] bg-orange-200 rounded-full blur-[120px] opacity-40"></div>
        <div className="absolute bottom-1/4 right-1/3 w-[400px] h-[400px] bg-pink-200 rounded-full blur-[120px] opacity-30"></div>
      </div>

      {/* Scrolling Track */}
      <div
        className="relative"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        <motion.div
          ref={containerRef}
          className="flex space-x-8 py-6"
          style={{
            transform: `translateX(-${position}px)`,
            transition: isPaused ? "none" : "transform 0.05s linear",
          }}
        >
          {[...categories, ...categories].map((category, index) => (
            <motion.div
              key={`${category.id}-${index}`}
              className="flex-shrink-0 w-64 h-80 rounded-3xl p-8 text-center backdrop-blur-lg bg-white/5 border shadow-lg"
              variants={cardVariants}
              initial="rest"
              whileHover="hover"
              animate="rest"
            >
              <motion.div
                className="relative w-24 h-24 rounded-full mx-auto mb-6 flex items-center justify-center shadow-inner"
                variants={circleVariants}
              >
                {/* IMAGE SLOT */}
                <span className="text-xs text-gray-500">{category.name} Img</span>
              </motion.div>

              <motion.h3
                className="font-semibold text-2xl"
                variants={textVariants}
              >
                {category.name}
              </motion.h3>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
