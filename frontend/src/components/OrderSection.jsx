import { ArrowRight, Star, Clock } from "lucide-react";
import { motion } from "framer-motion";

export default function OrderSection() {
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3
      }
    }
  };

  const itemVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  const titleVariants = {
    hidden: { y: 50, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.8,
        ease: "easeOut"
      }
    }
  };

  const imageVariants = {
    hidden: { scale: 0.8, opacity: 0, rotate: -5 },
    visible: {
      scale: 1,
      opacity: 1,
      rotate: 0,
      transition: {
        duration: 0.8,
        ease: "easeOut"
      }
    },
    hover: {
      scale: 1.05,
      rotate: 2,
      transition: {
        duration: 0.3,
        ease: "easeInOut"
      }
    }
  };

  const floatingCardVariants = {
    animate: {
      y: [0, -10, 0],
      transition: {
        duration: 3,
        repeat: Infinity,
        ease: "easeInOut"
      }
    },
    hover: {
      scale: 1.1,
      y: -15,
      transition: {
        duration: 0.3,
        ease: "easeOut"
      }
    }
  };

  const gradientBackgroundVariants = {
    animate: {
      backgroundPosition: ["0% 0%", "100% 100%", "0% 0%"],
      transition: {
        duration: 15,
        repeat: Infinity,
        ease: "linear"
      }
    }
  };

  const blobVariants = {
    animate: {
      scale: [1, 1.2, 1],
      opacity: [0.2, 0.3, 0.2],
      transition: {
        duration: 8,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  return (
    <section className="relative overflow-hidden py-24 px-6">
      {/* Animated Background gradients & blobs */}
      <motion.div 
        className="absolute inset-0 bg-gradient-to-br from-orange-50 via-white to-orange-100 bg-[length:200%_200%]"
        variants={gradientBackgroundVariants}
        animate="animate"
      />
      
      <motion.div 
        className="absolute -top-40 -left-40 w-[30rem] h-[30rem] bg-orange-300 rounded-full blur-3xl opacity-20"
        variants={blobVariants}
        animate="animate"
      />
      
      <motion.div 
        className="absolute -bottom-40 -right-40 w-[30rem] h-[30rem] bg-red-300 rounded-full blur-3xl opacity-20"
        variants={blobVariants}
        animate="animate"
        transition={{ delay: 2 }}
      />

      <motion.div 
        className="relative max-w-7xl mx-auto grid lg:grid-cols-2 gap-20 items-center z-10"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
      >
        {/* Left Content */}
        <div className="space-y-8 text-center lg:text-left">
          <motion.h2 
            className="text-4xl lg:text-6xl font-extrabold tracking-tight text-gray-900 leading-tight"
            variants={titleVariants}
          >
            Satisfy Your Cravings <br />
            <motion.span 
              className="bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent"
              initial={{ backgroundPosition: "0% 50%" }}
              animate={{ backgroundPosition: "100% 50%" }}
              transition={{ duration: 3, repeat: Infinity, repeatType: "reverse" }}
              style={{ backgroundSize: "200% 200%" }}
            >
              Anytime, Anywhere
            </motion.span>
          </motion.h2>
          
          <motion.p 
            className="text-gray-600 text-lg max-w-md mx-auto lg:mx-0"
            variants={itemVariants}
          >
            Crave authentic Sri Lankan flavors? Order now and enjoy fresh, 
            delicious meals delivered anytime!
          </motion.p>

          <motion.div 
            className="flex justify-center lg:justify-start"
            variants={itemVariants}
          >
            <motion.button 
              className="group flex items-center bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-semibold px-8 py-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              ORDER NOW
              <motion.div
                animate={{ x: 0 }}
                whileHover={{ x: 5 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                <ArrowRight className="w-5 h-5 ml-2" />
              </motion.div>
            </motion.button>
          </motion.div>
        </div>

        {/* Right Content */}
        <div className="relative flex justify-center lg:justify-end">
          {/* Image wrapper with outer glow ring */}
          <motion.div 
            className="relative w-80 h-80 rounded-full flex items-center justify-center"
            variants={imageVariants}
            whileHover="hover"
          >
            <motion.div 
              className="absolute inset-0 rounded-full bg-gradient-to-tr from-orange-400 to-red-400 opacity-20 blur-2xl"
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            />
            
            <motion.div 
              className="relative w-80 h-80 rounded-full bg-white shadow-2xl flex items-center justify-center overflow-hidden"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.3 }}
            >
              {/* Food Image */}
              <div className="w-72 h-72 bg-gradient-to-br from-orange-100 to-red-100 rounded-full flex items-center justify-center">
                <span className="text-orange-500 text-sm font-medium">Food Image</span>
              </div>
              
              {/* Gradient overlay */}
              <motion.div 
                className="absolute inset-0 bg-gradient-to-tr from-orange-500/20 to-transparent"
                animate={{ opacity: [0.2, 0.4, 0.2] }}
                transition={{ duration: 4, repeat: Infinity }}
              />
            </motion.div>
          </motion.div>

          {/* Floating stat cards with continuous motion */}
          <motion.div 
            className="absolute -bottom-8 left-4 bg-white px-5 py-3 rounded-2xl shadow-lg border border-gray-100 z-20"
            variants={floatingCardVariants}
            animate="animate"
            whileHover="hover"
          >
            <p className="text-sm font-semibold text-gray-800 flex items-center gap-2">
              <Clock className="w-4 h-4 text-orange-500" /> 
              <motion.span
                animate={{ opacity: [0.8, 1, 0.8] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                30min Delivery
              </motion.span>
            </p>
          </motion.div>

          <motion.div 
            className="absolute -top-6 -left-10 bg-white px-5 py-3 rounded-2xl shadow-lg border border-gray-100 z-20"
            variants={floatingCardVariants}
            animate="animate"
            whileHover="hover"
            transition={{ delay: 0.5 }}
          >
            <p className="text-sm font-semibold text-gray-800 flex items-center gap-2">
              <Star className="w-4 h-4 text-yellow-500" /> 
              <motion.span
                animate={{ opacity: [0.8, 1, 0.8] }}
                transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
              >
                4.9/5 Reviews
              </motion.span>
            </p>
          </motion.div>

          <motion.div 
            className="absolute bottom-10 -right-10 bg-gradient-to-r from-orange-500 to-red-500 text-white px-6 py-4 rounded-2xl shadow-xl z-20"
            variants={floatingCardVariants}
            animate="animate"
            whileHover="hover"
            transition={{ delay: 1 }}
          >
            <motion.p 
              className="text-lg font-bold"
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              100+ Orders Daily
            </motion.p>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}