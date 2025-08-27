import { MapPin, Clock, Users, Home } from "lucide-react";
import { motion } from "framer-motion";
import { MapContainer, TileLayer, Circle, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Fix marker icon issues with Leaflet + React
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.3/dist/images/marker-shadow.png",
});

export default function ServiceArea() {
  const malabeCoords = [6.906, 79.956]; // Malabe, Colombo coordinates

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2, delayChildren: 0.3 },
    },
  };

  const itemVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.6, ease: "easeOut" } },
  };

  const titleVariants = {
    hidden: { y: 50, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.8, ease: "easeOut" } },
  };

  const gradientBackgroundVariants = {
    animate: {
      backgroundPosition: ["0% 0%", "100% 100%", "0% 0%"],
      transition: { duration: 15, repeat: Infinity, ease: "linear" },
    },
  };

  const blobVariants = {
    animate: {
      scale: [1, 1.2, 1],
      opacity: [0.15, 0.25, 0.15],
      transition: { duration: 8, repeat: Infinity, ease: "easeInOut" },
    },
  };

  return (
    <section className="relative overflow-hidden py-24 px-6">
      {/* Animated background gradients & blobs */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-br from-orange-50 via-white to-gray-100 bg-[length:200%_200%]"
        variants={gradientBackgroundVariants}
        animate="animate"
      />

      <motion.div
        className="absolute -top-40 -left-40 w-[28rem] h-[28rem] bg-orange-300 rounded-full blur-3xl opacity-20"
        variants={blobVariants}
        animate="animate"
      />

      <motion.div
        className="absolute -bottom-40 -right-40 w-[28rem] h-[28rem] bg-gray-300 rounded-full blur-3xl opacity-20"
        variants={blobVariants}
        animate="animate"
        transition={{ delay: 2 }}
      />

      <div className="relative max-w-7xl mx-auto z-10">
        {/* Heading */}
        <motion.div
          variants={titleVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold">
            Serving around{" "}
            <span className="text-orange-500">Malabe</span>{" "}
            <span className="text-gray-900">area</span>
          </h2>
          <motion.p 
            variants={itemVariants}
            className="text-gray-600 mt-4 text-lg max-w-3xl mx-auto"
          >
            We proudly deliver within <span className="font-semibold text-gray-900">5 km radius </span> 
            of Malabe. Perfect for campus students, local workers, apartment & dorm residents, 
            and families who love fresh, home-style Sri Lankan meals.
          </motion.p>
        </motion.div>

        <motion.div
          className="grid md:grid-cols-2 gap-12 items-center"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
        >
          {/* Left: Info cards */}
          <div className="space-y-6">
            {[
              {
                icon: MapPin,
                title: "Location Focused",
                desc: "Operating from Malabe for quick & reliable delivery.",
                color: "text-orange-500",
              },
              {
                icon: Clock,
                title: "Fast Delivery",
                desc: "Fresh meals at your doorstep within 30-45 minutes.",
                color: "text-green-500",
              },
              {
                icon: Users,
                title: "Who We Serve",
                desc: "Campus students (SLIIT, CINEC, Horizon), workers, families, and residents.",
                color: "text-blue-500",
              },
              {
                icon: Home,
                title: "Community Driven",
                desc: "Supporting locals with affordable, nutritious, home-style food.",
                color: "text-purple-500",
              },
            ].map((item, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                className="flex items-center p-6 bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-100"
              >
                <item.icon className={`w-10 h-10 ${item.color} mr-4`} />
                <div>
                  <h3 className="font-bold text-gray-900 text-lg">{item.title}</h3>
                  <p className="text-gray-600 text-sm">{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Right: Map */}
          <motion.div
            variants={itemVariants}
            className="relative rounded-3xl overflow-hidden shadow-2xl hover:shadow-3xl transition-all duration-300"
          >
            <MapContainer
              center={malabeCoords}
              zoom={13}
              scrollWheelZoom={false}
              className="w-full h-96 rounded-3xl"
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              {/* 5 km service radius */}
              <Circle
                center={malabeCoords}
                radius={5000}
                pathOptions={{ fillColor: "#F97316", color: "#F97316", fillOpacity: 0.2 }}
              />
              {/* Marker */}
              <Marker position={malabeCoords}>
                <Popup>
                  <b>Malabe Base</b> <br />
                  Delivering within 5 km radius 
                </Popup>
              </Marker>
            </MapContainer>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}