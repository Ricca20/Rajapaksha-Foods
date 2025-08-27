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

  return (
    <section className="relative w-full py-24 bg-gradient-to-r from-orange-50 via-white to-yellow-50 overflow-hidden">
      {/* Decorative floating shapes */}
      <motion.div
        className="absolute -top-16 -left-16 w-32 h-32 bg-orange-200 rounded-full blur-3xl opacity-30"
        animate={{ y: [0, 15, 0] }}
        transition={{ repeat: Infinity, duration: 6 }}
      />
      <motion.div
        className="absolute -bottom-16 -right-16 w-32 h-32 bg-yellow-200 rounded-full blur-3xl opacity-30"
        animate={{ y: [0, -15, 0] }}
        transition={{ repeat: Infinity, duration: 5 }}
      />

      <div className="relative max-w-7xl mx-auto px-6 z-10">
        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900">
            Serving <span className="text-orange-500">Malabe Area, Colombo</span>
          </h2>
          <p className="text-gray-700 mt-4 text-lg max-w-3xl mx-auto">
            Delivering fresh and delicious meals within a 5 km radius around Malabe, tailored for campus students, local workers, families, and residents in apartments or dorms.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Left: Info cards */}
          <div className="space-y-6">
            {[
              {
                icon: MapPin,
                title: "Location Focused",
                desc: "Operating from Malabe, ensuring quick delivery to nearby areas.",
                color: "text-orange-500",
              },
              {
                icon: Clock,
                title: "Fast Delivery",
                desc: "Food delivered within 5 km radius around Malabe area.",
                color: "text-green-500",
              },
              {
                icon: Users,
                title: "Target Audience",
                desc: "Campus students, local workers, families, and residents.",
                color: "text-blue-500",
              },
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ x: -50, opacity: 0 }}
                whileInView={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.7, delay: index * 0.1 }}
                className="flex items-center p-6 bg-white rounded-2xl shadow-lg hover:shadow-xl transition"
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
            initial={{ x: 50, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.7 }}
            className="relative rounded-3xl overflow-hidden shadow-2xl hover:shadow-3xl transition"
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
              {/* 10 km service radius */}
              <Circle
                center={malabeCoords}
                radius={3000}
                pathOptions={{ fillColor: "orange", color: "orange", fillOpacity: 0.2 }}
              />
              {/* Marker */}
              <Marker position={malabeCoords}>
                <Popup>
                  Malabe Base - Service Area within 10 km radius.
                </Popup>
              </Marker>
            </MapContainer>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
